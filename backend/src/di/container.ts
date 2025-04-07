import { MiddlewareHandler } from "hono";
import { D1Database } from "@cloudflare/workers-types";
import { TaskRepository } from "@/domains/task/types";
import { createD1DBAdapter } from "@/repositories/task/D1DBAdapter";
import { createTaskRepository } from "@/repositories/task";

export interface Env {
  DB: D1Database;
  ENV: string;
}

export interface Variables {
  taskRepository: TaskRepository;
}

export const createDIMiddleware = (): MiddlewareHandler<{
  Bindings: Env;
  Variables: Variables;
}> => {
  return async (c, next) => {
    // Create repository
    const dbAdapter = createD1DBAdapter(c.env.DB);
    const taskRepository = createTaskRepository(dbAdapter);

    // Inject dependencies
    c.set('taskRepository', taskRepository);

    await next();
  };
};
