// schemas/admin/dto.ts
import { z } from "zod";
import { adminSchema } from "./schema";

export type AdminInput = z.infer<typeof adminSchema>;

export type CreateAdminDto = {
    username: string;
    email: string;
    role: "superadmin" | "moderator";
};
