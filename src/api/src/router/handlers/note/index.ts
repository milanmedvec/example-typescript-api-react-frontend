import { NoteController_renderIndex } from '@example/lib-intercom/routes/note/index';
import { createHandler, typedResponse } from '~/router/builder';

export const Handler_NoteController_renderIndex = createHandler({
    route: NoteController_renderIndex,
    handler: async ({ db, queryParams }) => {
        const { date } = queryParams;

        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return typedResponse.sendBadRequest('Invalid date');
        }

        const startOfDay = new Date(dateObj.setHours(0, 0, 0, 0));
        const endOfDay = new Date(dateObj.setHours(23, 59, 59, 999));

        const notes = await db.note.findMany({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                deletedAt: null,
            },
        });

        return typedResponse.sendJson(notes);
    },
});
