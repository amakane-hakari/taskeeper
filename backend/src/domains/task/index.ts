import { v4 as uuidv4 } from "uuid";
import { CreateTaskDTO, Task, TaskValidationError } from "./types";
import { Result } from "../../shared/Result";

export const validateTask = (data: CreateTaskDTO): Result<void, TaskValidationError> => {
  if (!data.title?.trim()) {
    return Result.err(new TaskValidationError("Title is required"));
  }
  if (data.dueDate && new Date(data.dueDate) < new Date()) {
    return Result.err(new TaskValidationError("Due date cannot be in the past"));
  }
  return Result.ok(undefined);
};

export const createTask = (dto: CreateTaskDTO): Result<Task, TaskValidationError> => {
  const validationResult = validateTask(dto);
  if (validationResult.isErr()) {
    return Result.err(validationResult.unwrapErr());
  }

  const now = new Date();
  const task: Task = {
    id: uuidv4(),
    title: dto.title,
    description: dto.description,
    dueDate: dto.dueDate,
    status: dto.status || "not_started",
    priority: dto.priority || "medium",
    createdAt: now,
    updatedAt: now,
  };

  return Result.ok(task);
};
