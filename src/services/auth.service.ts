import { ErrorResponseSchema, LogInFormData, LogInResponseSchema } from "../schemas";
import { ApiError } from "../utils";

const BASE_URL = typeof window === 'undefined'
    ? (process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api` : 'http://localhost:3001/api')
    : process.env.NEXT_PUBLIC_API_URL;

export const authService = {
    login: async (data: LogInFormData) => {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const json = await res.json();

        if (!res.ok) {
            const error = ErrorResponseSchema.parse(json);
            throw new ApiError(error.message);
        }

        return LogInResponseSchema.parse(json);
    }
}