// schemas/admin/schema.ts
import { z } from "zod";

export const adminSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    role: z.enum(["superadmin", "moderator"]),
});
