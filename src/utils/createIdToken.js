const axios = require('axios');

export const createIdTOken = (customToken) => {
  const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.FIREBASE_API_KEY}`, {
    token: customToken,
    returnSecureToken: true,
  });

  return response.data.idToken;
}