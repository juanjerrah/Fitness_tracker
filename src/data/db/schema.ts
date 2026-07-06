import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Temporary POC table for MO-002. Remove when MO-006 replaces schema with domain tables.
 */
export const pocHealthcheck = sqliteTable('_poc_healthcheck', {
  id: int().primaryKey({ autoIncrement: true }),
  message: text().notNull(),
  createdAt: text().notNull(),
});

export const schema = {
  pocHealthcheck,
};
