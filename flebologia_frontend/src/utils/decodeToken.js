// src/utils/decodeToken.js
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (e) {
    console.error('Error decodificando el token:', e);
    return null;
  }
};

export default decodeToken;