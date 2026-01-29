import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function formatRelativeTime(date: Date | string): string {
    const d = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return "just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays}d ago`;
    }

    return formatDate(date);
}

export function truncate(str: string, length: number): string {
    if (str.length <= length) return str;
    return str.slice(0, length) + "...";
}

export function countWords(text: string): number {
    return text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-")
        .trim();
}

export function getScoreColor(score: number): string {
    if (score >= 80) return "text-primary dark:text-primary";
    if (score >= 60) return "text-primary/80 dark:text-primary/80";
    return "text-primary/60 dark:text-primary/60";
}

export function getScoreBgColor(score: number): string {
    if (score >= 80) return "bg-primary/20 dark:bg-primary/30";
    if (score >= 60) return "bg-primary/10 dark:bg-primary/20";
    return "bg-primary/5 dark:bg-primary/10";
}

export function getScoreLabel(score: number): string {
    if (score >= 80) return "Strong";
    if (score >= 60) return "Needs Work";
    return "Critical Issues";
}

export function estimateReadingTime(text: string): string {
    const wordsPerMinute = 200;
    const words = countWords(text);
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
}
