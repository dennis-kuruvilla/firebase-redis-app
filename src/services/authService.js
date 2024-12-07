const axios = require('axios');
const { admin, db } = require('../config/firebaseConfig');

exports.signup = async (email, password) => {
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
};

exports.login = async (email, password) => {
    const firebaseAuthEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`;
    const response = await axios.post(firebaseAuthEndpoint, {
        email,
        password,
        returnSecureToken: true,
    });

    return response.data.idToken;
};

exports.logout = async (uid) => {
    await admin.auth().revokeRefreshTokens(uid);
};
