const redis = require('redis');
require('dotenv').config();

console.log('Connecting to Redis using host:', process.env.REDIS_HOST);
console.log('Redis port:', process.env.REDIS_PORT);

const redisHost = process.env.REDIS_HOST || 'redis';
const redisPort = process.env.REDIS_PORT || 6379;

const client = redis.createClient({
    url: `redis://${redisHost}:${redisPort}`,
});

client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (err) => {
    console.error('Redis error:', err);
});

(async () => {
    try {
        await client.connect();
        console.log('Redis client connected');
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
})();

module.exports = client;
