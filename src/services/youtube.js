import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import { config } from '../config/index.js';
import { logger } from '../logger/index.js';
import { cacheGet, cacheSet } from '../cache/index.js';

const execAsync = promisify(exec);

class CircuitBreaker {
  constructor(threshold = config.circuitBreakerThreshold, timeout = config.circuitBreakerTimeoutMs) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.failures = 0;
    this.state = 'CLOSED';
    this.lastFailureTime = null;
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}

const circuitBreaker = new CircuitBreaker();

export async function fetchVideoMetadata(url) {
  const cacheKey = `metadata:${url}`;
  const cached = await cacheGet(cacheKey);

  if (cached) {
    logger.debug({ url }, 'Metadata found in cache');
    return cached;
  }

  return circuitBreaker.execute(async () => {
    const command = `${config.youTubeDlPath} --dump-json --no-warnings "${url}"`;
    const { stdout } = await execAsync(command, { timeout: 30000 });
    const metadata = JSON.parse(stdout);

    const duration = metadata.duration || 0;
    if (duration > config.maxDurationSeconds) {
      throw new Error(`Video duration exceeds maximum allowed (${config.maxDurationSeconds}s)`);
    }

    const result = {
      title: metadata.title,
      duration: duration,
      videoId: metadata.id,
    };

    await cacheSet(cacheKey, result, config.cacheTtlSeconds);
    return result;
  });
}

export async function convertToMp3(url, outputPath) {
  return circuitBreaker.execute(async () => {
    const downloadCommand = `${config.youTubeDlPath} -x --audio-format mp3 --audio-quality 192 -o "${outputPath}/%(title)s.%(ext)s" "${url}"`;
    
    await execAsync(downloadCommand, {
      timeout: config.conversionTimeoutMs,
      maxBuffer: 10 * 1024 * 1024,
    });

    const files = await fs.readdir(outputPath);
    const mp3File = files.find(f => f.endsWith('.mp3'));

    if (!mp3File) {
      throw new Error('MP3 conversion failed');
    }

    return path.join(outputPath, mp3File);
  });
}

export function getCircuitBreakerStatus() {
  return {
    state: circuitBreaker.state,
    failures: circuitBreaker.failures,
    threshold: circuitBreaker.threshold,
  };
}
