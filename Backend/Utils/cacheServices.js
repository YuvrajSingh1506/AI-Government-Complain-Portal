const {redisClient} = require("../Config/redis");


const getCache = async(key)=>{
    try{
        return await redisClient.get(key);
    }catch(err){
        console.error("Redis GET Error:", err.message);
        return null;
    }
}

const setCache = async( key, value, ttl) =>{
    try{
        await redisClient.setEx(
            key,
            ttl,
            JSON.stringify(value),
        );
    }catch(err){
        console.log("Redis SET Error: ", err.message);
    }
}

const deleteCache = async(key)=>{
    try{
        await redisClient.del(key);
    }catch(err){
        console.error("Redis DELETE Error:", error.message);
    }
}

module.exports = {
    getCache,
    setCache,
    deleteCache,
}