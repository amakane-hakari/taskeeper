import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

type Bindings = {
  TASKS_STORE: KVNamespace;
  ENV: string;
};

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const app = new Hono<{ Bindings: Bindings }>();

// Middlewares
app.use('*', logger());
app.use('*', cors());

// Routes
app.get('/', (c) => {
  return c.json({
    message: 'Hello from Taskeeper API!',
    env: c.env.ENV,
  });
});

// Tasks API
app.post('/tasks', async (c) => {
  const { title } = await c.req.json<{ title: string }>();
  const id = crypto.randomUUID();
  const task: Task = { id, title, completed: false };

  await c.env.TASKS_STORE.put(id, JSON.stringify(task));
  return c.json(task, 201);
});

app.get('/tasks', async (c) => {
  const tasks: Task[] = [];
  const { keys } = await c.env.TASKS_STORE.list();

  for (const key of keys) {
    const taskJson = await c.env.TASKS_STORE.get(key.name);
    if (taskJson) {
      tasks.push(JSON.parse(taskJson));
    }
  }

  return c.json(tasks);
});

app.patch('/tasks/:id', async (c) => {
  const id = c.req.param('id');
  const taskJson = await c.env.TASKS_STORE.get(id);

  if (!taskJson) {
    return c.json({ message: 'Task not found' }, 404);
  }

  const task: Task = JSON.parse(taskJson);
  const update = await c.req.json<Partial<Task>>();
  const updatedTask = { ...task, ...update };

  await c.env.TASKS_STORE.put(id, JSON.stringify(updatedTask));
  return c.json(updatedTask);
});

app.delete('/tasks/:id', async (c) => {
  const id = c.req.param('id');
  const exists = await c.env.TASKS_STORE.get(id);

  if (!exists) {
    return c.json({ message: 'Task not found' }, 404);
  }

  await c.env.TASKS_STORE.delete(id);
  return c.json({ message: 'Task deleted' });
});

export default app;
