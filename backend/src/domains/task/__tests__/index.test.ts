import { describe, it, expect, vi } from "vitest";
import { createTask, validateTask } from "..";
import { TaskValidationError } from "../types";

// モックUUID
vi.mock("uuid", () => ({
  v4: () => "test-uuid"
}));

describe("validateTask", () => {
  it("タイトルが空の場合はエラーを返す", () => {
    const result = validateTask({
      title: "",
      dueDate: new Date("2025-12-31")
    });

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(TaskValidationError);
    expect(result.unwrapErr().message).toBe("Title is required");
  });

  it("タイトルが空白文字のみの場合はエラーを返す", () => {
    const result = validateTask({
      title: "   ",
      dueDate: new Date("2025-12-31")
    });

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(TaskValidationError);
    expect(result.unwrapErr().message).toBe("Title is required");
  });

  it("期限が過去の場合はエラーを返す", () => {
    const result = validateTask({
      title: "テストタスク",
      dueDate: new Date("2020-12-31")
    });

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(TaskValidationError);
    expect(result.unwrapErr().message).toBe("Due date cannot be in the past");
  });

  it("正常なデータの場合はOKを返す", () => {
    const result = validateTask({
      title: "テストタスク",
      dueDate: new Date("2025-12-31")
    });

    expect(result.isOk()).toBe(true);
  });
});

describe("createTask", () => {
  it("バリデーションエラーの場合はエラーを返す", () => {
    const result = createTask({
      title: "",
      dueDate: new Date("2025-12-31")
    });

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(TaskValidationError);
    expect(result.unwrapErr().message).toBe("Title is required");
  });

  it("デフォルト値が正しく設定される", () => {
    const result = createTask({
      title: "テストタスク",
      dueDate: new Date("2025-12-31")
    });

    expect(result.isOk()).toBe(true);
    const task = result.unwrap();
    expect(task).toEqual(expect.objectContaining({
      id: "test-uuid",
      title: "テストタスク",
      dueDate: new Date("2025-12-31"),
      status: "not_started",
      priority: "medium"
    }));
  });

  it("すべてのプロパティを指定して作成できる", () => {
    const taskData = {
      title: "テストタスク",
      description: "説明文",
      dueDate: new Date("2025-12-31"),
      status: "in_progress" as const,
      priority: "high" as const
    };

    const result = createTask(taskData);

    expect(result.isOk()).toBe(true);
    const task = result.unwrap();
    expect(task).toEqual(expect.objectContaining({
      id: "test-uuid",
      ...taskData
    }));
  });

  it("created_atとupdated_atが現在時刻で設定される", () => {
    const now = new Date();
    vi.setSystemTime(now);

    const result = createTask({
      title: "テストタスク",
      dueDate: new Date("2025-12-31")
    });

    expect(result.isOk()).toBe(true);
    const task = result.unwrap();
    expect(task.createdAt).toEqual(now);
    expect(task.updatedAt).toEqual(now);

    vi.useRealTimers();
  });
});
