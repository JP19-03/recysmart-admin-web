import { apiFetch } from "../lib/api";
import { CitizensResponseSchema, DashboardAPIResponseSchema, LevelsResponseSchema, PartnersDashboardResponseSchema, SmartBinsResponseSchema, SmartBinSchema, CreateSmartBinData } from "../schemas";

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
    },

    getLevels: async (token: string) => {
        const res = await apiFetch('/levels/stats', {
            method: 'GET'
        }, token);
        console.log(res)

        return LevelsResponseSchema.parse(res);
    },

    getPartnersDashboard: async (token: string) => {
        const res = await apiFetch('/admin/partners/dashboard', {
            method: 'GET'
        }, token);

        return PartnersDashboardResponseSchema.parse(res);
    },

    getBins: async (token: string) => {
        const res = await apiFetch('/admin/bins', {
            method: 'GET'
        }, token);

        return SmartBinsResponseSchema.parse(res);
    },

    registerBin: async (binData: CreateSmartBinData, token: string) => {
        const res = await apiFetch('/admin/bins/register', {
            method: 'POST',
            body: JSON.stringify(binData),
            headers: {
                'Content-Type': 'application/json'
            }
        }, token);

        return SmartBinSchema.parse(res);
    }
}