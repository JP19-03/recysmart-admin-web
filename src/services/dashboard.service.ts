import { apiFetch } from "../lib/api";
import { DashboardAPIResponseSchema } from "../schemas";

export const dashboardService = {
    getDashboardData: async (token: string) => {
        const res = await apiFetch('/admin/dashboard/summary', {
            method: 'GET'
        }, token);

        return DashboardAPIResponseSchema.parse(res);
    }
}