// inspired by https://medium.com/_hugoandregg/how-to-setup-an-api-with-nodejs-express-typescript-prisma-and-docker-cc5b2df2a5bb

import type * as winston from 'winston';
import { extendZodWithOpenApi, OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import type { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { Handler_NoteController_storeAdd } from './router/handlers/note/create';
import { Handler_NoteController_renderIndex } from './router/handlers/note/index';
import { Handler_NoteController_actionDelete } from './router/handlers/note/[id]/delete';
import { Handler_NoteController_storeEdit } from './router/handlers/note/[id]/edit';
import { Handler_NoteController_renderDetail } from './router/handlers/note/[id]/get';
import { createRouter } from './router/router';
import type { Config } from './env';

// ------------------------------------------------------------------------- //

extendZodWithOpenApi(z);

// ------------------------------------------------------------------------- //

export function spawnServer(config: Config, logger: winston.Logger, db: PrismaClient): void {
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());

    const openApiRegistry = new OpenAPIRegistry();
    const router = createRouter(config, logger, db, app, openApiRegistry);

    // ------------------------------------------------------------------------- //

    router.add(Handler_NoteController_renderIndex);
    router.add(Handler_NoteController_storeAdd);
    router.add(Handler_NoteController_renderDetail);
    router.add(Handler_NoteController_storeEdit);
    router.add(Handler_NoteController_actionDelete);

    router.app.get('/spec/json', (req, res) => {
        const generator = new OpenApiGeneratorV3(openApiRegistry.definitions);
        const response = generator.generateDocument({
            openapi: '3.0.0',
            info: {
                version: '1.0.0',
                title: 'API',
            },
        });

        res.send(response);
    });

    router.app.get('/spec/viewer', (req, res) => {
        const response = `
        <!DOCTYPE html>
        <html>
            <head>
            <title>API</title>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">

            <style>
                body {
                margin: 0;
                padding: 0;
                }
            </style>
            </head>
            <body>
            <redoc spec-url='/spec/json'></redoc>
            <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"> </script>
            </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.send(response);
    });

    // ------------------------------------------------------------------------- //

    const port = config.SERVER_PORT;

    app.listen(port, () => {
        logger.info(`Server running at http://localhost:${port}`);
    });
}
