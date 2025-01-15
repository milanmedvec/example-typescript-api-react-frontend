import { z } from 'zod';
import { IdSchema } from '..';

export const NoteSchema = z.object({
    id: IdSchema,
    note: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    deletedAt: z.coerce.date().nullable(),
});
export type Note = z.infer<typeof NoteSchema>;
