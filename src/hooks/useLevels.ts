import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { adminService } from "../services/admin.service";

export const LEVELS_KEY = "levels";

export function useLevels() {
    const { data: session } = useSession();
    const token = session?.accessToken;

    return useQuery({
        queryKey: [LEVELS_KEY, token],
        queryFn: () => adminService.getLevels(token!),
        enabled: !!token,
    });
}