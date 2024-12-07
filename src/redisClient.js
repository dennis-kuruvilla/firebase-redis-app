const redis = require('redis');

const client = redis.createClient({
    host: 'redis',
    port: 6379
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
