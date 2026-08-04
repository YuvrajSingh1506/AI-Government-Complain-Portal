const { createClient } = require("redis");

const redisClientCache = createClient({
    socket: {
        host: process.env.REDIS_CACHE_HOST,
        port: process.env.REDIS_CACHE_PORT,
        reconnectStrategy: false
    },
});

redisClientCache.on("connect", () => {
    console.log("Redis Cache Connected Successfully");
});

redisClientCache.on("error", (err) => {
    console.log("Redis Cache Error:", err.message);
});

const connectRedisCache = async () => {
    try {
        await redisClientCache.connect();
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    redisClientCache,
    connectRedisCache,
};