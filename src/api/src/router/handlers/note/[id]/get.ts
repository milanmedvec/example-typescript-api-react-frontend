import { NoteController_renderDetail } from '@example/lib-intercom/routes/note/[id]/get';
import { createHandler, typedResponse } from '~/router/builder';

export const Handler_NoteController_renderDetail = createHandler({
    route: NoteController_renderDetail,
    handler: async ({ urlParams, db }) => {
        const { noteId } = urlParams;

        const note = await db.note.findUnique({
            where: { id: noteId, deletedAt: null },
        });
        if (!note) {
            return typedResponse.sendNotFound('Note not found');
        }

        return typedResponse.sendJson(note);
    },
});
