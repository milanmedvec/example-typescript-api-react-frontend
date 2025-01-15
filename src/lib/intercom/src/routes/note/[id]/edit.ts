import { z } from 'zod';
import { IdSchema } from '@example/lib-models/index';
import { NoteSchema } from '@example/lib-models/Note/Note';
import { createRoute } from '../../builder';

export const NoteController_storeEdit = createRoute({
    method: 'PUT',
    url: '/api/admin/notes/:noteId/edit',
    urlParamsSchema: z.object({ noteId: IdSchema }),
    queryParamsSchema: undefined,
    requestBodySchema: NoteSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
    }).partial(),
    responseSchema: NoteSchema,
});
