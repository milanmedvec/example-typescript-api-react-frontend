import { NoteController_storeEdit } from '@example/lib-intercom/routes/note/[id]/edit';
import { createHandler, typedResponse } from '~/router/builder';

export const Handler_NoteController_storeEdit = createHandler({
    route: NoteController_storeEdit,
    handler: async ({ body, urlParams, db }) => {
        const { noteId } = urlParams;

        const note = await db.note.findUnique({
            where: { id: noteId, deletedAt: null },
        });
        if (!note) {
            return typedResponse.sendNotFound('Note not found');
        }

        const updatedNote = await db.note.update({
            where: { id: noteId },
            data: {
                note: body.note,
                updatedAt: new Date(),
            },
        });

        return typedResponse.sendJson(updatedNote);
    },
});
