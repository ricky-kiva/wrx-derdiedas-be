import { Logger, createLogger, format } from 'winston';
import LoggerService from '../../../applications/ports/logger/LoggerService';
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';

export default class WinstonLoggerService implements LoggerService {
  private readonly logger: Logger;
  
  constructor() {
    const formatStack = format((info) => {
      if (info.stack && typeof info.stack === 'string') {
        const lines = info.stack.split('\n').map(line => line.trim());

        const firstBlock: string[] = [];
        const rest: string[] = [];

        let inJsonBlock = true;

        for (const line of lines) {
          if (inJsonBlock && !line.startsWith('at ')) {
            firstBlock.push(line);
          } else {
            inJsonBlock = false;
            rest.push(line);
          }
        }

        let firstLine = firstBlock.join(' ');

        firstLine = firstLine.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        info.stack = [ firstLine, ...rest ];
      }

      return info;
    });


    const loggerFormat = format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      format.splat(),
      formatStack(),
      format.json()
    );

    const loggerDailyRotateFile = new DailyRotateFile({
      filename: path.join(process.cwd(), 'logs', 'app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d'
    });

    this.logger = createLogger({
      level: 'info',
      format: loggerFormat,
      transports: [ loggerDailyRotateFile ]
    });
  }

  info(message: string='INFO', meta?: Record<string, unknown>): void {
    this.logger.info(message, meta);
  }

  warn(message: string='WARN', meta?: Record<string, unknown>): void {
    this.logger.warn(message, meta);
  }

  error(message: string='ERROR', error: Error): void {
    this.logger.error(message, error);
  }
}
