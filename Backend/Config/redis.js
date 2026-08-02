const { createClient } = require("redis");

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        reconnectStrategy: false
    },
});

redisClient.on("connect", () => {
    console.log("Redis Connected Successfully");
});

redisClient.on("error", (err) => {
    console.log("Redis Error:", err.message);
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    redisClient,
    connectRedis,
};