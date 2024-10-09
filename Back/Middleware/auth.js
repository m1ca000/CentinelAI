import dotenv from 'dotenv';
dotenv.config();
import userServices from "../Service/userServices.js";
import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'No llego ningun token' });
  }

  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'El formato del Token es invalido' });
  }

  const token = tokenParts[1];
  const jwtSecret = process.env.SECRET_KEY;

  try {
    const decoded = jwt.verify(token, jwtSecret);

    console.log(decoded);
    
    if (!decoded.email) {
      return res.status(401).send({ error: 'Token invalido: Usuario sin email' });
    }
    req.userEmail = decoded.email;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).send({ error: 'Unauthorized' });
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    const userEmail = req.userEmail;

    if (!userEmail) {
        return res.status(403).json({ message: 'No llego ningun Email' });
    }

    const user = await userServices.getUsuarioByEmail(userEmail);

    if (!user || user.type == 'not admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    req.userEmail = user.email;

    next();
  } 
  catch (error) {
      return res.status(500).json({ message: 'error del servidor', error: error.message });
  }
};

export const verifyOwner = async (req, res, next) => {
  try {
    const userEmail = req.userEmail;

    if (!userEmail) {
        return res.status(403).json({ message: 'No llego ningun Email' });
    }

    const user = await userServices.getUsuarioByEmail(userEmail);

    if (!user || user.type == 'not admin' || user.type == 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    req.userEmail = user.email;

    next();
  } 
  catch (error) {
      return res.status(500).json({ message: 'error del servidor', error: error.message });
  }
};

const authMidd = {
  verifyToken,
  verifyAdmin,
  verifyOwner,
};

export default authMidd;
