import pino from 'pino';
import { config } from '../config/index.js';

const pinoConfig = config.env === 'development'
  ? {
      level: config.logLevel,
      transport: {
        target: 'pino-pretty',
        options: { colorize: true, ignore: 'pid,hostname' },
      },
    }
  : { level: config.logLevel };

export const logger = pino(pinoConfig);

export function createAuditLogger() {
  return logger.child({ component: 'audit' });
}

export function logApiRequest(requestId, method, path, apiKey, ipAddress) {
  const auditLogger = createAuditLogger();
  auditLogger.info({
    requestId,
    method,
    path,
    apiKey: apiKey ? apiKey.substring(0, 10) + '***' : 'none',
    ipAddress,
    timestamp: new Date().toISOString(),
  });
}

export function logApiError(requestId, error, apiKey, ipAddress) {
  const auditLogger = createAuditLogger();
  auditLogger.error({
    requestId,
    error: error.message,
    apiKey: apiKey ? apiKey.substring(0, 10) + '***' : 'none',
    ipAddress,
    timestamp: new Date().toISOString(),
  });
}
