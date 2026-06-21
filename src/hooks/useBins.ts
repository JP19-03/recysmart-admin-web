import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { adminService } from "../services/admin.service";
import { CreateSmartBinData } from "../schemas";

export const BINS_KEY = "bins";

export function useBins() {
    const { data: session } = useSession();
    const token = session?.accessToken;

    return useQuery({
        queryKey: [BINS_KEY, token],
        queryFn: () => adminService.getBins(token!),
        enabled: !!token,
    });
}

export function useRegisterBin() {
    const { data: session } = useSession();
    const token = session?.accessToken;
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (binData: CreateSmartBinData) => adminService.registerBin(binData, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [BINS_KEY] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        },
    });
}
