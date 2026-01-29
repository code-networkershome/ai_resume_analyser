import { SUPPORTED_ROLES, EXPERIENCE_LEVELS } from "@/lib/constants";

export async function getSupportedRoles(): Promise<string[]> {
    return [...SUPPORTED_ROLES];
}

export async function getExperienceLevels() {
    return [...EXPERIENCE_LEVELS];
}

export function isValidRole(role: string): boolean {
    return SUPPORTED_ROLES.includes(role as any);
}

export function isValidExperienceLevel(level: string): boolean {
    return EXPERIENCE_LEVELS.some((l) => l.value === level);
}
