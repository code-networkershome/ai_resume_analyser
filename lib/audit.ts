import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export type AuditAction =
    | "USER_LOGIN"
    | "USER_SIGNUP"
    | "RESUME_ANALYSIS"
    | "ADMIN_ACCESS"
    | "ADMIN_UPDATE"
    | "API_ERROR"
    | "EMAIL_SEND_FAILED"
    | "EMAIL_SEND_CRITICAL_FAILURE";

interface AuditLogParams {
    action: AuditAction;
    userId?: string;
    resource?: string;
    details?: Record<string, any>;
}

export async function logAudit(params: AuditLogParams) {
    try {
        const headerList = headers();
        // Best effort IP extraction
        const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "unknown";

        await prisma.auditLog.create({
            data: {
                action: params.action,
                userId: params.userId,
                resource: params.resource,
                details: params.details || {},
                ipAddress: ip,
            },
        });
    } catch (error) {
        // Fail silently - audit logging should not crash the app
        console.error("Failed to write audit log:", error);
    }
}
