import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { adminService } from "../services/admin.service";

export const DASHBOARD_KEY = "dashboard";

export function useDashboard() {
    const { data: session } = useSession();
    const token = session?.accessToken;

    return useQuery({
        queryKey: [DASHBOARD_KEY, token],
        queryFn: () => {
            return adminService.getDashboardData(token!);
        },
        enabled: !!token,
    });
};