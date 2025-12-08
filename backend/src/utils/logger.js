import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";

const logsDir = path.join(process.cwd(), "logs");

// Crée le dossier logs s'il n'existe pas
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logPath = path.join(process.cwd(), "logs", "backend.log");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf((info) => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: logPath })
  ],
});

export default logger;
