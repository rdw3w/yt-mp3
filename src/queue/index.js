import PQueue from 'p-queue';
import { config } from '../config/index.js';
import { logger } from '../logger/index.js';

let queue;

export async function initializeQueue() {
  queue = new PQueue({
    concurrency: 5,
    interval: 1000,
    intervalCap: 10,
  });

  logger.info('Job queue initialized with concurrency: 5');
}

export function getQueue() {
  if (!queue) {
    throw new Error('Queue not initialized');
  }
  return queue;
}

export async function addJob(task, priority = 0) {
  if (!queue) {
    throw new Error('Queue not initialized');
  }

  if (queue.size >= config.queueMaxSize) {
    throw new Error('Queue is full');
  }

  return queue.add(task, { priority });
}

export function getQueueStatus() {
  return {
    size: queue.size,
    pending: queue.pending,
    maxSize: config.queueMaxSize,
  };
}
