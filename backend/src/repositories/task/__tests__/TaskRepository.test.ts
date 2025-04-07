import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTaskRepository } from "../TaskRepository";
import { CreateTaskDTO, Task, TaskStorageError, TaskValidationError } from "@/domains/task/types";
import { IDBAdapter } from "../IDBAdapter";
import { createTask } from "@/domains/task";
import { Result } from "@/shared/Result";

vi.mock("@/domains/task", () => ({
  createTask: vi.fn(),
}));

const mockAdapter = {
  insertTask: vi.fn(),
  findTaskById: vi.fn(),
  updateTask: vi.fn(),
  removeTask: vi.fn(),
  listTasks: vi.fn(),
} satisfies IDBAdapter;

describe("TaskRepository", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("create", () => {
    it("新しいタスクを作成できること", async () => {
      const taskRepo = createTaskRepository(mockAdapter);
      const createDto: CreateTaskDTO = {
        title: "Test Task",
        description: "Test Description",
        dueDate: new Date("2025-12-31"),
      };

      const mockTask: Task = {
        id: "test-id",
        title: createDto.title,
        description: createDto.description,
        dueDate: createDto.dueDate,
        status: "not_started",
        priority: "medium",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(createTask).mockReturnValue(Result.ok(mockTask));

      const result = await taskRepo.create(createDto);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const createdTask = result.unwrap();
        expect(mockAdapter.insertTask).toHaveBeenCalledOnce();
        expect(createdTask).toMatchObject({
          title: createDto.title,
          description: createDto.description,
          dueDate: createDto.dueDate,
          status: "not_started",
          priority: "medium",
        });
      }
    });

    it("タスク作成時にバリデーションエラーが発生した場合はエラーを返すこと", async () => {
      const taskRepo = createTaskRepository(mockAdapter);
      const createDto: CreateTaskDTO = {
        title: "",  // 無効なタイトル
        description: "Test Description",
        dueDate: new Date("2025-12-31"),
      };

      const mockError = new TaskValidationError("Title is required");
      vi.mocked(createTask).mockReturnValue(Result.err(mockError));

      const result = await taskRepo.create(createDto);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        const error = result.unwrapErr();
        expect(error).toBe(mockError);
      }
      expect(mockAdapter.insertTask).not.toHaveBeenCalled();
    });

    it("アダプターがエラーを投げた場合はTaskStorageErrorを返すこと", async () => {
      const taskRepo = createTaskRepository(mockAdapter);
      const createDto: CreateTaskDTO = {
        title: "Test Task",
        description: "Test Description",
        dueDate: new Date("2025-12-31"),
      };

      const mockTask: Task = {
        id: "test-id",
        title: createDto.title,
        description: createDto.description,
        dueDate: createDto.dueDate,
        status: "not_started",
        priority: "medium",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(createTask).mockReturnValue(Result.ok(mockTask));
      mockAdapter.insertTask.mockRejectedValue(new Error("DB connection error"));

      const result = await taskRepo.create(createDto);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        const error = result.unwrapErr();
        expect(error).toBeInstanceOf(TaskStorageError);
        expect(error.message).toContain("Failed to create task");
      }
    });
  });

  describe("findById", () => {
    it("タスクが見つからない場合はエラーを返すこと", async () => {
      mockAdapter.findTaskById.mockResolvedValue(null);
      const taskRepo = createTaskRepository(mockAdapter);

      const result = await taskRepo.findById("non-existent-id");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        const error = result.unwrapErr();
        expect(error.message).toBe("Task with id non-existent-id not found");
      }
      expect(mockAdapter.findTaskById).toHaveBeenCalledWith("non-existent-id");
    });

    it("タスクが存在する場合はそのタスクを返すこと", async () => {
      const mockTask: Task = {
        id: "test-id",
        title: "Test Task",
        description: "Test Description",
        dueDate: new Date("2025-12-31"),
        status: "not_started",
        priority: "medium",
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
      };

      mockAdapter.findTaskById.mockResolvedValue(mockTask);
      const taskRepo = createTaskRepository(mockAdapter);

      const result = await taskRepo.findById("test-id");
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.unwrap()).toEqual(mockTask);
      }
      expect(mockAdapter.findTaskById).toHaveBeenCalledWith("test-id");
    });

    it("アダプターがエラーを投げた場合はTaskStorageErrorを返すこと", async () => {
      mockAdapter.findTaskById.mockRejectedValue(new Error("DB connection error"));
      const taskRepo = createTaskRepository(mockAdapter);

      const result = await taskRepo.findById("test-id");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        const error = result.unwrapErr();
        expect(error).toBeInstanceOf(TaskStorageError);
        expect(error.message).toContain("Failed to fetch task");
      }
    });
  });

  describe("list", () => {
    it("タスクの一覧を取得できること", async () => {
      const mockTasks: Task[] = [
        {
          id: "test-id-1",
          title: "Test Task 1",
          description: "Test Description 1",
          dueDate: new Date("2025-12-31"),
          status: "not_started",
          priority: "medium",
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-01"),
        },
        {
          id: "test-id-2",
          title: "Test Task 2",
          description: "Test Description 2",
          dueDate: new Date("2025-12-31"),
          status: "in_progress",
          priority: "high",
          createdAt: new Date("2025-01-02"),
          updatedAt: new Date("2025-01-02"),
        },
      ];

      mockAdapter.listTasks.mockResolvedValue(mockTasks);
      const taskRepo = createTaskRepository(mockAdapter);

      const result = await taskRepo.list();
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.unwrap()).toEqual(mockTasks);
      }
      expect(mockAdapter.listTasks).toHaveBeenCalledOnce();
    });

    it("アダプターがエラーを投げた場合はTaskStorageErrorを返すこと", async () => {
      mockAdapter.listTasks.mockRejectedValue(new Error("DB connection error"));
      const taskRepo = createTaskRepository(mockAdapter);

      const result = await taskRepo.list();
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        const error = result.unwrapErr();
        expect(error).toBeInstanceOf(TaskStorageError);
        expect(error.message).toContain("Failed to list tasks");
      }
    });
  });

  describe("update", () => {
    const existingTask: Task = {
      id: "test-id",
      title: "Original Title",
      description: "Original Description",
      dueDate: new Date("2025-12-31"),
      status: "not_started",
      priority: "medium",
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-01-01"),
    };

    it("既存のタスクを更新できること", async () => {
      const updatedTask = {
        ...existingTask,
        title: "Updated Title",
        status: "in_progress",
        updatedAt: new Date(),
      };

      mockAdapter.updateTask.mockResolvedValue(updatedTask);
      const taskRepo = createTaskRepository(mockAdapter);

      const result = await taskRepo.update("test-id", {
        title: "Updated Title",
        status: "in_progress",
      });
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.unwrap()).toEqual(updatedTask);
      }
      expect(mockAdapter.updateTask).toHaveBeenCalledOnce();
    });

    it("タスクが見つからない場合はエラーを返すこと", async () => {
      mockAdapter.updateTask.mockResolvedValue(null);
      const taskRepo = createTaskRepository(mockAdapter);

      const result = await taskRepo.update("non-existent-id", { title: "Updated Title" });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        const error = result.unwrapErr();
        expect(error.message).toBe("Task with id non-existent-id not found");
      }
    });

    it("アダプターがエラーを投げた場合はTaskStorageErrorを返すこと", async () => {
      mockAdapter.updateTask.mockRejectedValue(new Error("DB connection error"));
      const taskRepo = createTaskRepository(mockAdapter);

      const result = await taskRepo.update("test-id", { title: "Updated Title" });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        const error = result.unwrapErr();
        expect(error).toBeInstanceOf(TaskStorageError);
        expect(error.message).toContain("Failed to update task");
      }
    });
  });

  describe("remove", () => {
    it("既存のタスクを削除できること", async () => {
      const mockTask: Task = {
        id: "test-id",
        title: "Test Task",
        description: "Test Description",
        dueDate: new Date("2025-12-31"),
        status: "not_started",
        priority: "medium",
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
      };
      
      mockAdapter.findTaskById.mockResolvedValue(mockTask);
      const taskRepo = createTaskRepository(mockAdapter);
      
      const result = await taskRepo.remove("test-id");
      expect(result.isOk()).toBe(true);
      expect(mockAdapter.findTaskById).toHaveBeenCalledWith("test-id");
      expect(mockAdapter.removeTask).toHaveBeenCalledWith("test-id");
    });

    it("タスクが見つからない場合はエラーを返すこと", async () => {
      mockAdapter.findTaskById.mockResolvedValue(null);
      const taskRepo = createTaskRepository(mockAdapter);

      const result = await taskRepo.remove("non-existent-id");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        const error = result.unwrapErr();
        expect(error.message).toBe("Task with id non-existent-id not found");
      }
      
      expect(mockAdapter.findTaskById).toHaveBeenCalledWith("non-existent-id");
      expect(mockAdapter.removeTask).not.toHaveBeenCalled();
    });

    it("検索時にアダプターがエラーを投げた場合はTaskStorageErrorを返すこと", async () => {
      mockAdapter.findTaskById.mockRejectedValue(new Error("DB connection error"));
      const taskRepo = createTaskRepository(mockAdapter);

      const result = await taskRepo.remove("test-id");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        const error = result.unwrapErr();
        expect(error).toBeInstanceOf(TaskStorageError);
        expect(error.message).toContain("Failed to delete task");
      }
    });

    it("削除時にアダプターがエラーを投げた場合はTaskStorageErrorを返すこと", async () => {
      const mockTask: Task = {
        id: "test-id",
        title: "Test Task",
        description: "Test Description",
        dueDate: new Date("2025-12-31"),
        status: "not_started",
        priority: "medium",
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
      };
      
      mockAdapter.findTaskById.mockResolvedValue(mockTask);
      mockAdapter.removeTask.mockRejectedValue(new Error("DB connection error"));
      const taskRepo = createTaskRepository(mockAdapter);

      const result = await taskRepo.remove("test-id");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        const error = result.unwrapErr();
        expect(error).toBeInstanceOf(TaskStorageError);
        expect(error.message).toContain("Failed to delete task");
      }
    });
  });
});
