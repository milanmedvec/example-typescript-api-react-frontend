import type * as winston from 'winston';
import type { z } from 'zod';
import type { Request } from 'express';
import type { PrismaClient } from '@prisma/client';
import type { InferedType, Route } from '@example/lib-intercom/routes/builder';
import type { TypedResponse } from '@example/lib-intercom/handlers/response';
import type { Config } from '~/env';

export type HandlerArgs<
    UrlParamsSchema extends z.ZodObject<any, any, any> | undefined,
    QueryParamsSchema extends z.ZodObject<any, any, any> | undefined,
    RequestBodySchema extends z.ZodObject<any, any, any> | undefined,
> = {
    db: PrismaClient;
    config: Config;
    logger: winston.Logger;
    req: Request;
    urlParams: InferedType<UrlParamsSchema>;
    queryParams: InferedType<QueryParamsSchema>;
    body: InferedType<RequestBodySchema>;
};

function sendJson<T>(res: T): TypedResponse<T> {
    return {
        error: undefined,
        status: 200,
        body: res,
    };
}

function sendNotFound<T>(msg: string): TypedResponse<T> {
    return {
        error: { error: msg },
        status: 404,
        body: undefined,
    };
}

function sendBadRequest<T>(msg: string): TypedResponse<T> {
    return {
        error: { error: msg },
        status: 400,
        body: undefined,
    };
}

export const typedResponse = {
    sendJson,
    sendNotFound,
    sendBadRequest,
};

export type Handler<
    UrlParamsSchema extends z.ZodObject<any, any, any> | undefined,
    QueryParamsSchema extends z.ZodObject<any, any, any> | undefined,
    RequestBodySchema extends z.ZodObject<any, any, any> | undefined,
    ResponseSchema extends z.ZodType<any, any, any>,
> = {
    route: Route<UrlParamsSchema, QueryParamsSchema, RequestBodySchema, ResponseSchema>;
    handler: (
        args: HandlerArgs<UrlParamsSchema, QueryParamsSchema, RequestBodySchema>,
    ) => Promise<TypedResponse<InferedType<ResponseSchema>>>;
};

export function createHandler<
    UrlParamsSchema extends z.ZodObject<any, any, any> | undefined,
    QueryParamsSchema extends z.ZodObject<any, any, any> | undefined,
    RequestBodySchema extends z.ZodObject<any, any, any> | undefined,
    ResponseSchema extends z.ZodType<any, any, any>,
>(args: {
    route: Route<UrlParamsSchema, QueryParamsSchema, RequestBodySchema, ResponseSchema>;
    handler: (
        args: HandlerArgs<UrlParamsSchema, QueryParamsSchema, RequestBodySchema>,
    ) => Promise<TypedResponse<InferedType<ResponseSchema>>>;
}): Handler<UrlParamsSchema, QueryParamsSchema, RequestBodySchema, ResponseSchema> {
    return args;
}
