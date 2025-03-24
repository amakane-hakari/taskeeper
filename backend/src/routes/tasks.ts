import { Hono } from 'hono';
import {
  CreateTaskDTO,
  TaskValidationError,
  TaskNotFoundError,
  TaskStorageError 
} from '../domains/task/types';
import { Env, Variables } from '../di/container';

export const createTasksRouter = () => {
  const router = new Hono<{
    Bindings: Env;
    Variables: Variables;
  }>();

  router.get('/', async (c) => {
    const repository = c.var.taskRepository;
    const result = await repository.list();
    if (result.isErr()) {
      const error = result.unwrapErr();
      console.error('Error fetching tasks:', error);
      return c.json({ message: error instanceof TaskStorageError ? error.message : 'Internal Server Error' }, 500);
    }
    return c.json({ tasks: result.unwrap() });
  });

  router.post('/', async (c) => {
    const repository = c.var.taskRepository;
    const data = await c.req.json() as CreateTaskDTO;
    const result = await repository.create(data);
    
    if (result.isErr()) {
      const error = result.unwrapErr();
      console.error('Error creating task:', error);
      
      if (error instanceof TaskValidationError) {
        return c.json({ message: error.message }, 400);
      }
      
      return c.json({ message: error instanceof TaskStorageError ? error.message : 'Internal Server Error' }, 500);
    }
    
    return c.json({ task: result.unwrap() }, 201);
  });

  router.delete('/:id', async (c) => {
    const repository = c.var.taskRepository;
    const id = c.req.param('id');
    const result = await repository.remove(id);
    
    if (result.isErr()) {
      const error = result.unwrapErr();
      console.error('Error deleting task:', error);
      
      if (error instanceof TaskNotFoundError) {
        return c.json({ message: 'Task not found' }, 404);
      }
      
      return c.json({ message: error instanceof TaskStorageError ? error.message : 'Internal Server Error' }, 500);
    }
    
    return c.body(null, 204);
  });

  return router;
};
