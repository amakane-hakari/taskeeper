import { v4 as uuidv4 } from 'uuid';
import {
  CreateTaskDTO,
  Task,
  TaskRepository,
  UpdateTaskDTO,
  TaskNotFoundError,
  TaskValidationError
} from '../../domains/task/types';
import { Result } from '../../shared/Result';

export const createMockTaskRepository = (): TaskRepository => {
  const tasks: Task[] = [
    {
      id: '1',
      title: 'タスク1',
      description: 'テストタスク1の説明',
      dueDate: new Date('2025-12-31'),
      status: 'not_started',
      priority: 'medium',
      createdAt: new Date('2025-03-07T00:00:00.000Z'),
      updatedAt: new Date('2025-03-07T00:00:00.000Z'),
    },
    {
      id: '2',
      title: 'タスク2',
      description: 'テストタスク2の説明',
      dueDate: new Date('2025-12-31'),
      status: 'completed',
      priority: 'high',
      createdAt: new Date('2025-03-07T00:00:00.000Z'),
      updatedAt: new Date('2025-03-07T00:00:00.000Z'),
    },
  ];

  return {
    create: async (dto: CreateTaskDTO): Promise<Result<Task, Error>> => {
      if (!dto.title) {
        return Result.err(new TaskValidationError('Title is required'));
      }
      try {
        const now = new Date();
        const newTask: Task = {
          id: uuidv4(),
          title: dto.title,
          description: dto.description,
          dueDate: dto.dueDate,
          status: dto.status || 'not_started',
          priority: dto.priority || 'medium',
          createdAt: now,
          updatedAt: now,
        };
        tasks.push(newTask);
        return Result.ok(newTask);
      } catch (error) {
        return Result.err(error as Error);
      }
    },

    findById: async (id: string): Promise<Result<Task, Error>> => {
      const task = tasks.find(t => t.id === id);
      if (!task) {
        return Result.err(new TaskNotFoundError(id));
      }
      return Result.ok({ ...task });
    },

    update: async (id: string, dto: UpdateTaskDTO): Promise<Result<Task, Error>> => {
      const index = tasks.findIndex(t => t.id === id);
      if (index === -1) {
        return Result.err(new TaskNotFoundError(id));
      }

      try {
        const now = new Date();
        const updatedTask: Task = {
          ...tasks[index],
          ...(dto.title !== undefined && { title: dto.title }),
          ...(dto.description !== undefined && { description: dto.description }),
          ...(dto.dueDate !== undefined && { dueDate: dto.dueDate }),
          ...(dto.status !== undefined && { status: dto.status }),
          ...(dto.priority !== undefined && { priority: dto.priority }),
          updatedAt: now,
        };

        tasks[index] = updatedTask;
        return Result.ok({ ...updatedTask });
      } catch (error) {
        return Result.err(error as Error);
      }
    },

    remove: async (id: string): Promise<Result<void, Error>> => {
      const index = tasks.findIndex(t => t.id === id);
      if (index === -1) {
        return Result.err(new TaskNotFoundError(id));
      }
      tasks.splice(index, 1);
      return Result.ok(undefined);
    },

    list: async (): Promise<Result<Task[], Error>> => {
      try {
        const sortedTasks = [...tasks].sort((a, b) => 
          a.createdAt.getTime() - b.createdAt.getTime()
        );
        return Result.ok(sortedTasks);
      } catch (error) {
        return Result.err(error as Error);
      }
    },
  };
};
