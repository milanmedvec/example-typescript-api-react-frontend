import { z } from 'zod';

const ConfigSchema = z.object({
    DATABASE_URL: z.string(),
    SERVER_PORT: z.coerce.number(),
});
export type Config = z.infer<typeof ConfigSchema>;

export function loadConfig(seed: any): Config {
    const config = ConfigSchema.safeParse(seed);
    if (config.success) {
        return config.data;
    } else {
        throw new Error(`Invalid config: ${JSON.stringify(config.error.errors)}`);
    }
}
