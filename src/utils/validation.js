import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import { logger } from '../logger/index.js';

const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie|m\.youtube)\.(com|be)\//;

export const convertSchema = Joi.object({
  url: Joi.string()
    .required()
    .pattern(youtubeUrlRegex)
    .messages({
      'string.pattern.base': 'Invalid YouTube URL',
    }),
}).unknown(false);

export const validationErrorResponse = (error) => ({
  success: false,
  error: error.details[0].message,
  error_code: 'VALIDATION_ERROR',
  request_id: uuidv4(),
});

export function validateRequest(schema, data) {
  return schema.validate(data, { abortEarly: true });
}

export function sanitizeUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.toString();
  } catch {
    throw new Error('Invalid URL format');
  }
}

export function generateRequestId() {
  return uuidv4();
}

export function createErrorResponse(message, code, requestId) {
  return {
    success: false,
    error: message,
    error_code: code,
    request_id: requestId,
  };
}

export function createSuccessResponse(data, requestId) {
  return {
    success: true,
    ...data,
    request_id: requestId,
  };
}
