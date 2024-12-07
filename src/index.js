require('dotenv').config()
const express = require('express');
const { db, admin } = require('./config/firebaseConfig');
const app = express();
const client = require('./redisClient');
const authMiddleware = require('./middlewares/authMiddleware');
const bodyParser = require('body-parser');
const axios = require('axios');


app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.post('/api/v1/auth/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({
            error: "Email and password are required",
        });
    }

    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
        });

        const userRef = db.collection('users').doc(userRecord.uid);

        await userRef.set({
            email: userRecord.email,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            role: 'user',
        });

        res.status(201).json({
            message: "User created successfully! Use log in api to get token",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "An error occurred while registering the user",
        });
    }
});


app.post('/api/v1/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({
            error: "Email and password are required",
        });
    }

    try {
        const firebaseAuthEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`;
        const response = await axios.post(firebaseAuthEndpoint, {
            email,
            password,
            returnSecureToken: true,
        });

        res.status(200).json({
            message: "Login successful!",
            token: response.data.idToken,
        });
    } catch (error) {
        res.status(401).json({
            error: "Invalid email or password",
            details: error.response?.data || error.message,
        });
    }
});

app.post('/api/v1/auth/logout', authMiddleware, async (req, res) => {
    const uid = req.user.uid;

    if (!uid) {
        return res.status(422).json({
            error: "User ID (uid) is required to log out",
        });
    }

    try {
        await admin.auth().revokeRefreshTokens(uid);

        res.status(200).json({
            message: "User logged out successfully!",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "An error occurred while logging out",
        });
    }
});

app.get('/api/v1/users/me', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.uid;
        const userDocRef = db.collection('users').doc(userId);

        let userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: `Welcome, authenticated user!`,
            userId: req.user.uid,
            userData: userDoc.data(),
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

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

app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});