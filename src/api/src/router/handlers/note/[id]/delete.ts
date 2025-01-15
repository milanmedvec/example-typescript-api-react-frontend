import { NoteController_actionDelete } from '@example/lib-intercom/routes/note/[id]/delete';
import { createHandler, typedResponse } from '~/router/builder';

export const Handler_NoteController_actionDelete = createHandler({
    route: NoteController_actionDelete,
    handler: async ({ urlParams, db }) => {
        const { noteId } = urlParams;

        const note = await db.note.findUnique({
            where: { id: noteId, deletedAt: null },
        });
        if (!note) {
            return typedResponse.sendNotFound('Note not found');
        }

        await db.note.update({
            where: { id: noteId },
            data: { deletedAt: new Date() },
        });

        return typedResponse.sendJson({ success: true });
    },
});
