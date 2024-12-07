require('dotenv').config();
const express = require('express');
const { db, admin } = require('./config/firebaseConfig');
const app = express();
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const client = require('./redisClient');
const authMiddleware = require('./middlewares/authMiddleware');
const responseHandler = require('./utils/responseHandler');

app.use(bodyParser.json());

app.get('/cache', async (req, res) => {
    try {
        const key = 'message';
        let value = await client.get(key);

        if (!value) {
            value = 'Hello from Redis!';
            await client.set(key, value);
            res.send(`Stored value: ${value}`);
        } else {
            res.send(`Cached value: ${value}`);
        }
    } catch (error) {
        console.error('Error interacting with Redis:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', authMiddleware, userRoutes);
app.use('/api/v1/products', authMiddleware, productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});
