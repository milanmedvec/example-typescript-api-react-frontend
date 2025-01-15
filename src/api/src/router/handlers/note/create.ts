import { NoteController_storeAdd } from '@example/lib-intercom/routes/note/create';
import { createHandler, typedResponse } from '~/router/builder';

export const Handler_NoteController_storeAdd = createHandler({
    route: NoteController_storeAdd,
    handler: async ({ body, db }) => {
        const { date, time, note } = body;

        const createdAt = new Date(`${date}T${time}`);
        if (isNaN(createdAt.getTime())) {
            return typedResponse.sendBadRequest('Invalid date or time');
        }

        const noteObj = await db.note.create({
            data: {
                note,
                createdAt,
                updatedAt: new Date(),
                deletedAt: null,
            },
        });

        return typedResponse.sendJson(noteObj);
    },
});
