import { z } from 'zod';
import { IdSchema } from '@example/lib-models/index';
import { createRoute } from '../../builder';

export const NoteController_actionDelete = createRoute({
    method: 'DELETE',
    url: '/api/admin/notes/:noteId/delete',
    urlParamsSchema: z.object({ noteId: IdSchema }),
    queryParamsSchema: undefined,
    requestBodySchema: undefined,
    responseSchema: z.object({ success: z.boolean() }),
});
