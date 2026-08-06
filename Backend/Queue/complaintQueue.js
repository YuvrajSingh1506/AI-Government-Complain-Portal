const { Queue } = require("bullmq");
const { redisQueueOptions } = require("../Config/redisQueue");

const complaintQueue = new Queue("complaintQueue", {
    connection: redisQueueOptions,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: false,
    },
});

module.exports = {
    complaintQueue,
};