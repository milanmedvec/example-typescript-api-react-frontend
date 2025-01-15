import { z } from 'zod';
import { NoteSchema } from '@example/lib-models/Note/Note';
import { createRoute } from '../builder';

export const NoteController_storeAdd = createRoute({
    method: 'POST',
    url: '/api/admin/notes/add',
    urlParamsSchema: undefined,
    queryParamsSchema: undefined,
    requestBodySchema: z.object({
        note: z.string(),
        date: z.string(),
        time: z.string(),
    }),
    responseSchema: NoteSchema,
});
