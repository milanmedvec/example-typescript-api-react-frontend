import type { z } from 'zod';

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type Route<
    UrlParamsSchema extends z.ZodObject<any, any, any> | undefined,
    QueryParamsSchema extends z.ZodObject<any, any, any> | undefined,
    RequestBodySchema extends z.ZodObject<any, any, any> | undefined,
    ResponseSchema extends z.ZodType<any, any, any>,
> = {
    method: Method;
    url: string;
    urlParamsSchema: UrlParamsSchema;
    queryParamsSchema: QueryParamsSchema;
    requestBodySchema: RequestBodySchema;
    responseSchema: ResponseSchema;
};

export type InferedType<T extends z.ZodType<any, any, any> | undefined> =
    T extends z.ZodType<infer U, any, any> ? U : undefined;

export function createRoute<
    UrlParamsSchema extends z.ZodObject<any, any, any> | undefined,
    QueryParamsSchema extends z.ZodObject<any, any, any> | undefined,
    RequestBodySchema extends z.ZodObject<any, any, any> | undefined,
    ResponseSchema extends z.ZodType<any, any, any>,
>(args: {
    method: Method;
    url: string;
    urlParamsSchema: UrlParamsSchema;
    queryParamsSchema: QueryParamsSchema;
    requestBodySchema: RequestBodySchema;
    responseSchema: ResponseSchema;
}): Route<UrlParamsSchema, QueryParamsSchema, RequestBodySchema, ResponseSchema> {
    return args;
}
