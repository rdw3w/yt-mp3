import NodeCache from 'node-cache';
import { config } from '../config/index.js';
import { logger } from '../logger/index.js';

let cache;
let redisClient;

export async function initializeCache() {
  if (config.redisUrl) {
    try {
      const redis = await import('ioredis');
      redisClient = new redis.default(config.redisUrl);
      logger.info('Redis cache initialized');
    } catch (error) {
      logger.warn({ error }, 'Redis connection failed, using memory cache');
      cache = new NodeCache({ stdTTL: config.cacheTtlSeconds, checkperiod: 600 });
    }
  } else {
    cache = new NodeCache({ stdTTL: config.cacheTtlSeconds, checkperiod: 600 });
    logger.info('Memory cache initialized');
  }
}

export async function cacheGet(key) {
  try {
    if (redisClient) {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } else if (cache) {
      return cache.get(key);
    }
  } catch (error) {
    logger.warn({ error }, 'Cache get failed');
  }
  return null;
}

export async function cacheSet(key, value, ttl = config.cacheTtlSeconds) {
  try {
    if (redisClient) {
      await redisClient.setex(key, ttl, JSON.stringify(value));
    } else if (cache) {
      cache.set(key, value, ttl);
    }
  } catch (error) {
    logger.warn({ error }, 'Cache set failed');
  }
}

export async function cacheDel(key) {
  try {
    if (redisClient) {
      await redisClient.del(key);
    } else if (cache) {
      cache.del(key);
    }
  } catch (error) {
    logger.warn({ error }, 'Cache delete failed');
  }
}

export async function cacheClear() {
  try {
    if (redisClient) {
      await redisClient.flushdb();
    } else if (cache) {
      cache.flushAll();
    }
  } catch (error) {
    logger.warn({ error }, 'Cache clear failed');
  }
}
