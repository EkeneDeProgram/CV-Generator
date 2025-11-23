import fs from "fs";
import path from "path";

const logDir = path.join(__dirname, "..", "logs");

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Daily log rotation
const getLogFile = () => {
    const date = new Date().toISOString().split("T")[0]; 
    return path.join(logDir, `app-${date}.log`);
};

const writeLog = (level: string, message: string) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${level}] ${timestamp} - ${message}\n`;

    // Terminal output
    level === "ERROR" ? console.error(logMessage.trim()) : console.log(logMessage.trim());

    // Save to log file
    fs.appendFileSync(getLogFile(), logMessage);
};

export const logger = {
    info: (msg: string) => writeLog("INFO", msg),
    error: (msg: string) => writeLog("ERROR", msg),

    // -------- Request Logging --------
    request: (req: any) => {
        const ip =
            req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress ||
            "Unknown IP";

        writeLog(
            "REQUEST",
            `${req.method} ${req.originalUrl} | IP: ${ip} | Agent: ${req.headers["user-agent"]}`
        );
    }
};
