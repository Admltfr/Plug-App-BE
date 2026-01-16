import winston from "winston";
import chalk from "chalk";
import moment from "moment-timezone";

const customFormat = winston.format.printf(({ timestamp, level, message }) => {
  let msg = message;
  if (level === "warn") {
    msg = chalk.yellow(message);
  } else if (level === "error") {
    msg = chalk.red(message);
  } else if (level === "info") {
    msg = chalk.green(message);
  }

  const indoTime = moment(timestamp)
    .tz("Asia/Jakarta")
    .format("DD-MM-YYYY HH:mm:ss");
  return `[${indoTime}] ${level.toUpperCase()}: ${msg}`;
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), customFormat),
  transports: [new winston.transports.Console()],
});

export default logger;
