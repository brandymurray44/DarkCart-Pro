/**
 * Structured logging utility for DarkCart-Pro
 * Provides consistent logging across the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  userId?: string;
  shopId?: string;
  shopDomain?: string;
  requestId?: string;
  [key: string]: unknown;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext) {
    console.info(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: LogContext) {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: Error, context?: LogContext) {
    const errorContext = error ? { ...context, error: error.message, stack: error.stack } : context;
    console.error(this.formatMessage('error', message, errorContext));
  }

  // Specialized loggers for specific events
  auth( event: 'login' | 'logout' | 'oauth_start' | 'oauth_success' | 'oauth_failure', userId?: string, shopDomain?: string, metadata?: LogContext) {
    this.info(`Auth event: ${event}`, {
      userId,
      shopDomain,
      event,
      ...metadata
    });
  }

  billing(event: 'subscription_start' | 'subscription_success' | 'subscription_failure' | 'activation', userId?: string, shopDomain?: string, metadata?: LogContext) {
    this.info(`Billing event: ${event}`, {
      userId,
      shopDomain,
      event,
      ...metadata
    });
  }

  api(endpoint: string, method: string, status: number, duration: number, userId?: string, error?: string, metadata?: Record<string, unknown>) {
    this.info(`API call: ${method} ${endpoint}`, {
      endpoint,
      method,
      status,
      duration,
      userId,
      ...(error && { error }),
      ...metadata
    });
  }

  ai(provider: string, model: string, operation: string, duration: number, userId?: string, error?: string) {
    this.info(`AI operation: ${operation}`, {
      provider,
      model,
      operation,
      duration,
      userId,
      ...(error && { error })
    });
  }

  rateLimit(identifier: string, limit: number, window: number, allowed: boolean) {
    this.warn(`Rate limit ${allowed ? 'passed' : 'exceeded'}`, {
      identifier,
      limit,
      window,
      allowed
    });
  }

  security(event: string, severity: 'low' | 'medium' | 'high' | 'critical', metadata?: LogContext) {
    const level = severity === 'critical' || severity === 'high' ? 'error' : 'warn';
    console[level](`[SECURITY] ${event}`, {
      severity,
      timestamp: new Date().toISOString(),
      ...metadata
    });
  }
}

export const logger = new Logger();