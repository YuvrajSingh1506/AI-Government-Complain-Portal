const Redis = require("ioredis");

const redisClientQueue = new Redis({
    host: process.env.REDIS_QUEUE_HOST || "localhost",
    port: process.env.REDIS_QUEUE_PORT || 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});

redisClientQueue.on("connect", () => {
    console.log("Redis Queue Connected");
});

redisClientQueue.on("error", (err) => {
    console.log("Redis Queue Error:", err.message);
});

module.exports = {
    redisClientQueue,
};