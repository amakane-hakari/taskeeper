import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTaskRepository } from "../TaskRepository";
import { CreateTaskDTO, Task } from "@/domains/task/types";
import { IDBAdapter } from "../IDBAdapter";

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
    it("should create a new task", async () => {
      const taskRepo = createTaskRepository(mockAdapter);
      const createDto: CreateTaskDTO = {
        title: "Test Task",
        description: "Test Description",
        dueDate: new Date("2025-12-31"),
      };

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
  });

  describe("findById", () => {
    it("should throw error if task is not found", async () => {
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

    it("should return task if found", async () => {
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
  });

  describe("list", () => {
    it("should return an array of tasks", async () => {
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

    it("should update an existing task", async () => {
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

    it("should throw error if task not found", async () => {
      mockAdapter.updateTask.mockResolvedValue(null);
      const taskRepo = createTaskRepository(mockAdapter);

      const result = await taskRepo.update("non-existent-id", { title: "Updated Title" });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        const error = result.unwrapErr();
        expect(error.message).toBe("Task with id non-existent-id not found");
      }
    });
  });

  describe("remove", () => {
    it("should remove an existing task", async () => {
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

    it("should throw error if task not found", async () => {
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
  });
});
