import { z } from 'zod';

export const TypedErrorResponseSchema = z.object({
    error: z.string(),
});

export type TypedResponse<T> =
    | {
          error: undefined;
          status: number;
          body: T;
      }
    | {
          error: { error: string };
          status: number;
          body: undefined;
      };
