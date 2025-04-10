import { createClient } from "redis";

export const redis = createClient();

async function connectRedis() {
    redis.on('error', (err) => {
        console.error("Redis client error", err);
    });

    redis.on('ready', () => {
        console.log('Redis client connected');
    });

    await redis.connect();

    await redis.ping();
};


export {connectRedis}