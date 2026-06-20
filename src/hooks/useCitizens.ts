import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { adminService } from "../services/admin.service";

export const CITIZENS_KEY = "citizens";

export function useCitizens() {
    const { data: session } = useSession();
    const token = session?.accessToken;

    return useQuery({
        queryKey: [CITIZENS_KEY, token],
        queryFn: () => {
            return adminService.getCitizens(token!);
        },
        enabled: !!token,
    });
}