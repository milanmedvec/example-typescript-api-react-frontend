import type * as winston from 'winston';
import type { Request, Response } from 'express';
import type express from 'express';
import type { PrismaClient } from '@prisma/client';
import type { OpenAPIRegistry, RouteConfig, ZodRequestBody } from '@asteasolutions/zod-to-openapi';
import type { RouteParameter } from '@asteasolutions/zod-to-openapi/dist/openapi-registry';
import type { z } from 'zod';
import type { Route } from '@example/lib-intercom/routes/builder';
import type { Handler } from '~/router/builder';
import type { Config } from '~/env';

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

function generateOpenApiSpec(route: Route<any, any, any, any>): RouteConfig {
    const request: {
        body?: ZodRequestBody;
        params?: RouteParameter;
        query?: RouteParameter;
    } = {};

    if (route.requestBodySchema) {
        request['body'] = { content: { 'application/json': { schema: route.requestBodySchema } } };
    }
    if (route.urlParamsSchema) {
        request['params'] = route.urlParamsSchema;
    }
    if (route.queryParamsSchema) {
        request['query'] = route.queryParamsSchema;
    }

    const responseSchema = route.responseSchema;

    return {
        method: route.method.toLocaleLowerCase() as Method,
        path: generateOpenApiUrl(route.url),
        operationId: `${route.method}: ${route.url}`,
        request,
        responses: {
            200: {
                description: 'Success Response',
                content: {
                    'application/json': {
                        schema: responseSchema,
                    },
                },
            },
        },
    };
}

function generateOpenApiUrl(url: string): string {
    return url.replaceAll(/:([a-zA-Z_]\w*)/g, '{$1}');
}

export function createRouteHandler<
    UrlParamsSchema extends z.ZodObject<any, any, any> | undefined,
    QueryParamsSchema extends z.ZodObject<any, any, any> | undefined,
    RequestBodySchema extends z.ZodObject<any, any, any> | undefined,
    ResponseSchema extends z.ZodType<any, any, any>,
>(
    config: Config,
    logger: winston.Logger,
    db: PrismaClient,
    handler: Handler<UrlParamsSchema, QueryParamsSchema, RequestBodySchema, ResponseSchema>,
) {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            let urlParams = undefined;
            if (handler.route.urlParamsSchema) {
                const parsedUrlParams = handler.route.urlParamsSchema.safeParse(req.params);
                if (!parsedUrlParams.success) {
                    logger.error(parsedUrlParams.error.message);
                    res.status(400).send({ error: 'Bad Request' });
                    return;
                } else {
                    urlParams = parsedUrlParams.data;
                }
            }

            let queryParams = undefined;
            if (handler.route.queryParamsSchema) {
                const parsedQueryParams = handler.route.queryParamsSchema.safeParse(req.query);
                if (!parsedQueryParams.success) {
                    logger.error(parsedQueryParams.error.message);
                    res.status(400).send({ error: 'Bad Request' });
                    return;
                } else {
                    queryParams = parsedQueryParams.data;
                }
            }

            let body = undefined;
            if (handler.route.requestBodySchema) {
                const parsedBody = handler.route.requestBodySchema.safeParse(req.body);
                if (!parsedBody.success) {
                    logger.error(parsedBody.error.message);
                    res.status(400).send({ error: 'Bad Request' });
                    return;
                } else {
                    body = parsedBody.data;
                }
            }

            const response = await handler.handler({
                db,
                logger,
                config,
                req,
                urlParams: urlParams as any,
                queryParams: queryParams as any,
                body: body as any,
            });

            if (response.error) {
                res.status(response.status).send(response.error);
                return;
            }

            const parsedResponse = handler.route.responseSchema.safeParse(response.body);
            if (!parsedResponse.success) {
                res.status(500).send({ error: 'Internal Server Error' });
                return;
            }

            res.status(parsedResponse.data.status).send(parsedResponse.data);
        } catch (error) {
            logger.error(error);
            res.status(500).send({ error: 'Internal Server Error' });
        }
    };
}

export type Router = {
    app: ReturnType<typeof express>;
    openApiRegistry: OpenAPIRegistry;
    add: (handler: Handler<any, any, any, any>) => void;
};

export function createRouter(
    config: Config,
    logger: winston.Logger,
    db: PrismaClient,
    app: ReturnType<typeof express>,
    openApiRegistry: OpenAPIRegistry,
): Router {
    return {
        app,
        openApiRegistry,
        add: (handler: Handler<any, any, any, any>) => {
            switch (handler.route.method) {
                case 'GET':
                    app.get(handler.route.url, createRouteHandler(config, logger, db, handler));
                    openApiRegistry.registerPath(generateOpenApiSpec(handler.route));
                    break;
                case 'POST':
                    app.post(handler.route.url, createRouteHandler(config, logger, db, handler));
                    openApiRegistry.registerPath(generateOpenApiSpec(handler.route));
                    break;
                case 'PUT':
                    app.put(handler.route.url, createRouteHandler(config, logger, db, handler));
                    openApiRegistry.registerPath(generateOpenApiSpec(handler.route));
                    break;
                case 'PATCH':
                    app.patch(handler.route.url, createRouteHandler(config, logger, db, handler));
                    openApiRegistry.registerPath(generateOpenApiSpec(handler.route));
                    break;
                case 'DELETE':
                    app.delete(handler.route.url, createRouteHandler(config, logger, db, handler));
                    openApiRegistry.registerPath(generateOpenApiSpec(handler.route));
                    break;
            }
        },
    };
}
