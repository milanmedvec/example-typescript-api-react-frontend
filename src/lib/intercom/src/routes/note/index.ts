import { z } from 'zod';
import { NoteSchema } from '@example/lib-models/Note/Note';
import { createRoute } from '../builder';

export const NoteController_renderIndex = createRoute({
    method: 'GET',
    url: '/api/admin/notes/',
    urlParamsSchema: undefined,
    queryParamsSchema: z.object({ date: z.string().date() }),
    requestBodySchema: undefined,
    responseSchema: z.array(NoteSchema),
});
