import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  dueDate: text('due_date').notNull(), // ISO 8601 format
  status: text('status', { enum: ['not_started', 'in_progress', 'completed'] }).notNull().default('not_started'),
  priority: text('priority', { enum: ['low', 'medium', 'high'] }).notNull().default('medium'),
  createdAt: text('created_at').notNull(), // ISO 8601 format
  updatedAt: text('updated_at').notNull(), // ISO 8601 format
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
