const {redisClientCache} = require("../Config/redisCache");


const getCache = async(key)=>{
    try{
        return await redisClientCache.get(key);
    }catch(err){
        console.error("Redis GET Error:", err.message);
        return null;
    }
}

const setCache = async( key, value, ttl) =>{
    try{
        await redisClientCache.setEx(
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
        await redisClientCache.del(key);
    }catch(err){
        console.error("Redis DELETE Error:", err.message);
    }
}

module.exports = {
    getCache,
    setCache,
    deleteCache,
}