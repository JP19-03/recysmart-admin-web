import { ErrorResponseSchema } from "../schemas"
import { ApiError } from "../utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
): Promise<T> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    })

    let json;
    try {
        json = await res.json();
    } catch (err) {
        throw new ApiError(["Error de conexión con el servidor"]);
    }

    if (!res.ok) {
        const error = ErrorResponseSchema.safeParse(json);
        if (error.success) {
            throw new ApiError(error.data.message);
        } else {
            throw new ApiError([json.message || "Error desconocido"]);
        }
    }

    return json as T;
}