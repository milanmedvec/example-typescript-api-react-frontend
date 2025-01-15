import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const IdSchema = z.string().uuid();
export type Id = z.infer<typeof IdSchema>;
