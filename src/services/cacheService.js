const client = require('../redisClient');

exports.getFromCache = async (key) => {
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error fetching from cache for key ${key}:`, error);
    return null;
  }
};

exports.saveToCache = async (key, value, expiry = 3600) => {
  try {
    await client.set(key, JSON.stringify(value), { EX: expiry });
  } catch (error) {
    console.error(`Error saving to cache for key ${key}:`, error);
  }
};

exports.deleteFromCache = async (key) => {
  try {
    await client.del(key);
    console.log(`Cache cleared for key: ${key}`);
  } catch (error) {
    console.error(`Error deleting cache for key ${key}:`, error);
  }
};
