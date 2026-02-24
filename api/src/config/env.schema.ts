import * as z from "zod";

export const envSchema = z.object({
	PORT: z.coerce.number(),

	CACHE_VERSION: z.coerce.number(),

	TIMEZONE: z.string(),

	ADZUNA_BASE_URL: z.url(),
	ADZUNA_APP_ID: z.string().min(1),
	ADZUNA_APP_KEY: z.string().min(1),

	FINDWORK_BASE_URL: z.url(),
	FINDWORK_API_KEY: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;
