import { z } from "zod";

export const SuccessResponseSchema = z.object({
    message: z.string(),
});
export const ErrorResponseSchema = z.object({
    message: z.array(z.string()),
    statusCode: z.number(),
});

export const DraftLogInSchema = z.object({
    email: z.email('Email inválido'),
    password: z.string('Password inválido').min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export const UserAPIResponseSchema = z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    role: z.string(),
    isActive: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const LogInResponseSchema = z.object({
    user: UserAPIResponseSchema,
    token: z.string()
});

export const StatusSchema = z.enum(["ONLINE", "OFFLINE"]);
export const CapacityStatusSchema = z.enum(["NORMAL", "WARNING", "NEEDS_PICKUP"]);

export const DashboardBinMetricsSchema = z.object({
    active: z.number(),
    total: z.number()
});

export const DashboardKpisSchema = z.object({
    totalPlasticKg: z.number(),
    co2AvoidedKg: z.number(),
    couponsRedeemed: z.number(),
    bins: DashboardBinMetricsSchema,
    plasticGrowthPercentage: z.number(),
});

export const IoTNetworkDeviceSchema = z.object({
    id: z.string(),
    location: z.string(),
    status: StatusSchema,
    capacityPercentage: z.number(),
    capacityStatus: CapacityStatusSchema,
    lastAiScanAt: z.string(),
});

export const DashboardAPIResponseSchema = z.object({
    kpis: DashboardKpisSchema,
    iotNetwork: z.array(IoTNetworkDeviceSchema),
});

export type LogInFormData = z.infer<typeof DraftLogInSchema>;
export type User = z.infer<typeof UserAPIResponseSchema>;
export type DashboardResponse = z.infer<typeof DashboardAPIResponseSchema>;
export type IoTNetworkDevice = z.infer<typeof IoTNetworkDeviceSchema>;