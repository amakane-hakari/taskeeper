import { 
  Task, 
  TaskRepository, 
  UpdateTaskDTO, 
  CreateTaskDTO,
  TaskNotFoundError,
  TaskStorageError
} from "../../domains/task/types";
import { createTask } from "../../domains/task";
import { IDBAdapter } from "./IDBAdapter";
import { Result } from "../../shared/Result";

export const createTaskRepository = (adapter: IDBAdapter): TaskRepository => {
  const create = async (dto: CreateTaskDTO): Promise<Result<Task, Error>> => {
    try {
      const taskResult = createTask(dto);
      if (taskResult.isErr()) {
        return Result.err(taskResult.unwrapErr());
      }
      const task = taskResult.unwrap();
      await adapter.insertTask(task);
      return Result.ok(task);
    } catch (error) {
      return Result.err(new TaskStorageError(`Failed to create task: ${error}`));
    }
  };

  const findById = async (id: string): Promise<Result<Task, Error>> => {
    try {
      const task = await adapter.findTaskById(id);
      if (!task) {
        return Result.err(new TaskNotFoundError(id));
      }
      return Result.ok(task);
    } catch (error) {
      return Result.err(new TaskStorageError(`Failed to fetch task: ${error}`));
    }
  };

  const update = async (id: string, dto: UpdateTaskDTO): Promise<Result<Task, Error>> => {
    try {
      const updateData: Partial<Task> = {
        ...dto,
        updatedAt: new Date(),
      };

      const updated = await adapter.updateTask(id, updateData);
      if (!updated) {
        return Result.err(new TaskNotFoundError(id));
      }
      return Result.ok(updated);
    } catch (error) {
      return Result.err(new TaskStorageError(`Failed to update task: ${error}`));
    }
  };

  const remove = async (id: string): Promise<Result<void, Error>> => {
    try {
      const task = await adapter.findTaskById(id);
      if (!task) {
        return Result.err(new TaskNotFoundError(id));
      }
      await adapter.removeTask(id);
      return Result.ok(undefined);
    } catch (error) {
      return Result.err(new TaskStorageError(`Failed to delete task: ${error}`));
    }
  };

  const list = async (): Promise<Result<Task[], Error>> => {
    try {
      const tasks = await adapter.listTasks();
      return Result.ok(tasks);
    } catch (error) {
      return Result.err(new TaskStorageError(`Failed to list tasks: ${error}`));
    }
  };

  return {
    create,
    findById,
    update,
    remove,
    list,
  };
};
