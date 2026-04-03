import * as z from "zod";

const authCredentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

const refreshTokenSchema = z.object({ refreshToken: z.jwt() });

export { authCredentialsSchema, refreshTokenSchema };
