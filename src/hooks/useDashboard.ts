import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { dashboardService } from "../services/dashboard.service";

export const DASHBOARD_KEY = "dashboard";

export function useDashboard() {
    const { data: session } = useSession();
    const token = session?.accessToken;

    return useQuery({
        queryKey: [DASHBOARD_KEY, token],
        queryFn: () => {
            return dashboardService.getDashboardData(token!);
        },
        enabled: !!token,
    });
};