import { z } from 'zod';
import { IdSchema } from '@example/lib-models/index';
import { NoteSchema } from '@example/lib-models/Note/Note';
import { createRoute } from '../../builder';

export const NoteController_renderDetail = createRoute({
    method: 'GET',
    url: '/api/admin/notes/:noteId',
    urlParamsSchema: z.object({ noteId: IdSchema }),
    queryParamsSchema: undefined,
    requestBodySchema: undefined,
    responseSchema: NoteSchema,
});
