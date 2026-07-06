import { eq } from 'drizzle-orm';

import { getDatabase } from './client';
import { pocHealthcheck } from './schema';

const POC_MESSAGE = 'MO-002 drizzle poc';

/**
 * POC insert + select for MO-002 acceptance.
 * Idempotent: skips insert if the POC row already exists.
 * Remove this module when MO-006 replaces the test schema.
 */
export async function runPocHealthcheck(): Promise<{ id: number; message: string }> {
  const db = getDatabase();

  const existing = await db
    .select()
    .from(pocHealthcheck)
    .where(eq(pocHealthcheck.message, POC_MESSAGE))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(pocHealthcheck).values({
      message: POC_MESSAGE,
      createdAt: new Date().toISOString(),
    });
  }

  const [row] = await db
    .select()
    .from(pocHealthcheck)
    .where(eq(pocHealthcheck.message, POC_MESSAGE))
    .limit(1);

  if (!row) {
    throw new Error('POC healthcheck failed: row not found after insert');
  }

  return { id: row.id, message: row.message };
}
