import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { adminService } from "../services/admin.service";

export const PARTNERS_KEY = "partners";

export function usePartners() {
    const { data: session } = useSession();
    const token = session?.accessToken;

    return useQuery({
        queryKey: [PARTNERS_KEY, token],
        queryFn: () => adminService.getPartnersDashboard(token!),
        enabled: !!token,
    });
}
