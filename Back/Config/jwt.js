import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY;

const generateToken = (user) => {
  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email,
  };

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (err) {
    return null;
  }
};

export { generateToken, verifyToken };