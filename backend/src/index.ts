import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { createTasksRouter } from './routes/tasks';
import { createDIMiddleware, Env, Variables } from './di/container';

const app = new Hono<{
  Bindings: Env;
  Variables: Variables;
}>();

// Middlewares
app.use('*', logger());
app.use('*', cors());
app.use('*', createDIMiddleware());

// Health Check
app.get('/api/status-check', (c) => {
  return c.json({ status: 'OK' }, 200);
});

// Routes
app.get('/', (c) => {
  return c.json({
    message: 'Hello from Taskeeper API!',
    env: c.env.ENV,
  });
});

// Tasks API
app.route('/api/tasks', createTasksRouter());

export default app;
