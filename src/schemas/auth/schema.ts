

import { z } from "zod";

export const authCredentialSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
	type: z.enum(["user", "admin"]),
});