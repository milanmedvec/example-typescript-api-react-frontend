/* eslint-disable no-console */
import type { InferedType, Route } from '@example/lib-intercom/routes/builder';
import { TypedErrorResponseSchema } from '@example/lib-intercom/handlers/response';
import type { z } from 'zod';

export type ClientResponse<T> =
    | {
          success: true;
          status: number;
          data: T;
      }
    | {
          success: false;
          status: number;
          error: string;
      };

// eslint-disable-next-line sonarjs/cognitive-complexity
async function call<
    UrlParamsSchema extends z.ZodObject<any, any, any> | undefined,
    QueryParamsSchema extends z.ZodObject<any, any, any> | undefined,
    RequestBodySchema extends z.ZodObject<any, any, any> | undefined,
    ResponseSchema extends z.ZodType<any, any, any>,
>(
    route: Route<UrlParamsSchema, QueryParamsSchema, RequestBodySchema, ResponseSchema>,
    urlParams: InferedType<UrlParamsSchema>,
    queryParams: InferedType<QueryParamsSchema>,
    requestBodyParams: InferedType<RequestBodySchema>,
): Promise<ClientResponse<InferedType<ResponseSchema>>> {
    let url = route.url;
    let bodyData = undefined;
    let body: FormData | string | undefined = undefined;
    const headers = new Headers();

    if (route.urlParamsSchema) {
        const parsedUrlParams = route.urlParamsSchema.safeParse(urlParams);
        if (parsedUrlParams.success) {
            for (const key in parsedUrlParams.data) {
                url = url.replace(`:${key}`, parsedUrlParams.data[key]);
            }
        } else {
            console.error(parsedUrlParams.error.message);
            return { success: false, status: 400, error: 'Bad Request' };
        }
    }

    if (route.queryParamsSchema) {
        const parsedQueryParams = route.queryParamsSchema.safeParse(queryParams);
        if (parsedQueryParams.success) {
            const query = new URLSearchParams();
            for (const key in parsedQueryParams.data) {
                query.append(key, parsedQueryParams.data[key]);
            }
            url += `?${query.toString()}`;
        } else {
            console.error(parsedQueryParams.error.message);
            return { success: false, status: 400, error: 'Bad Request' };
        }
    }

    if (route.requestBodySchema) {
        const parsedQueryParams = route.requestBodySchema.safeParse(requestBodyParams);
        if (parsedQueryParams.success) {
            bodyData = parsedQueryParams.data;
        } else {
            console.error(parsedQueryParams.error.message);
            return { success: false, status: 400, error: 'Bad Request' };
        }
    }

    headers.append('Content-Type', 'application/json');

    if (bodyData) {
        body = JSON.stringify(bodyData);
    }

    try {
        const result = await fetch(process.env.REACT_APP_API_URL + url, {
            method: route.method,
            headers,
            body,
        });

        const response = await result.json();

        if (!result.ok) {
            const parsedResponse = TypedErrorResponseSchema.safeParse(response);
            if (!parsedResponse.success) {
                console.error(parsedResponse.error.message);
                return { success: false, status: 500, error: 'Server Error' };
            }

            return { success: false, status: response.status, error: parsedResponse.data.error };
        } else {
            const parsedTypedResponse = route.responseSchema.safeParse(response);
            if (!parsedTypedResponse.success) {
                console.error(parsedTypedResponse.error.message);
                return { success: false, status: 500, error: 'Server Error' };
            }

            return { success: true, status: response.status, data: parsedTypedResponse.data };
        }
    } catch (error) {
        console.error(error);
        return { success: false, status: 500, error: 'Server Error' };
    }
}

export const client = {
    call,
};
