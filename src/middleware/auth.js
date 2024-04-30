import jwt from 'jsonwebtoken'

export const authenticateToken = async (req, res, next) => {
    const token = req.header('Authorization');

    console.log("token: ", token)
    if (!token) {
        return res.status(403).json({ message: 'Acceso denegado' });
    }

    try {
        const user = jwt.verify(token, 'secreto');
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Token inválido' });
    }
};

