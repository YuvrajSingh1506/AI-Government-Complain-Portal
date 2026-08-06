const redisQueueOptions = {
    host: process.env.REDIS_QUEUE_HOST || "localhost",
    port: Number(process.env.REDIS_QUEUE_PORT) || 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
};

module.exports = {
    redisQueueOptions,
};