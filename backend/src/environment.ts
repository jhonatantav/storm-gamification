import 'dotenv/config';
import * as z from 'zod/v4';

const requiredProperties = [
  'POSTGRES_PORT',
  'POSTGRES_DB',
  'POSTGRES_USER',
  'POSTGRES_HOST',
  'POSTGRES_PASSWORD',
  'POSTGRES_DB',
] as const;

const baseEnvSchema = z.object({
  NODE_ENV: z.enum(['production', 'sandbox', 'development', 'migration']),

  DATABASE_CONNECTION_TIMEOUT: z.coerce.number().default(30000),
  POSTGRES_DB: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number(),
  DATABASE_SSL: z.string().optional(),
});

const envVariables = baseEnvSchema.refine(
  (schema) => {
    if (schema.NODE_ENV !== 'migration') {
      for (const prop of requiredProperties) {
        if (schema[prop] === undefined) {
          return false;
        }
      }
    }
    return true;
  },
  {
    message: 'Required environment variables are missing',
  },
);

const env = envVariables.parse(process.env);

type EnvType = z.infer<typeof envVariables>;

export { env, type EnvType };
