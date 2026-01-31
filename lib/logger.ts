import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'debug.log');
const isDevelopment = process.env.NODE_ENV === 'development';

export function logToDebug(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message} ${data ? JSON.stringify(data, null, 2) : ''}\n`;
    
    // Only write to file in development
    if (isDevelopment) {
        try {
            fs.appendFileSync(LOG_FILE, logEntry);
        } catch (error) {
            // Silently fail if file writing doesn't work
        }
    }
    
    // Always log to console
    console.log(message, data || "");
}
