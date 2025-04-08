import 'dotenv/config'
import z from 'zod'

const envSchama = z.object({
    NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
    JWT_SECRET: z.string(),
    PORT: z.coerce.number().default(3000)
})

const _env = envSchama.safeParse(process.env)

if (_env.success === false) {
    console.error('Invalid environment variables', _env.error.format())

    throw new Error('Invalid environment variables')
}

export const env = _env.data