import { apiFetch } from "../lib/api";
import { CitizensResponseSchema, DashboardAPIResponseSchema } from "../schemas";

export const adminService = {
    getDashboardData: async (token: string) => {
        const res = await apiFetch('/admin/dashboard/summary', {
            method: 'GET'
        }, token);

        return DashboardAPIResponseSchema.parse(res);
    },

    getCitizens: async (token: string) => {
        const res = await apiFetch('/admin/citizens', {
            method: 'GET'
        }, token);

        return CitizensResponseSchema.parse(res);
    }
}