import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const users = []; // Aquí simulamos una base de datos de usuarios

export const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existeUsuario = await User.findOne({ username })

        if (existeUsuario) {
            return res.status(400).json({ message: 'Ya existe un usuario con ese username' });
        }

        // hashing the password
        const passwordHash = await bcrypt.hash(password, 10);

        const newUsuario = new User({
            password: passwordHash,
            username
        });
        console.log("ingresa api", passwordHash)
        await newUsuario.save();

        // Enviar una respuesta al cliente
        // Crear un token JWT y enviarlo junto con el mensaje de éxito
        const token = generateJWTToken(newUsuario); // Función para generar un token JWT

        res.cookie("token", token, {
            httpOnly: process.env.NODE_ENV !== "development",
            secure: true,
            sameSite: "none",
        });
        res.status(201).json({ message: 'Se ha creado con exito el registro del usuario: ' + token });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    const user = users.find((user) => user.username === username);
    if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    try {
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ token });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};

export const getUserProfile = (req, res) => {
    const { username } = req.user;
    console.log("token: ", token)
    const userProfile = { username };
    res.status(200).json({ message: 'Usuario: ' + userProfile.username+' recuperado con éxito' });
};

function generateJWTToken(user) {
    const payload = {
        id: user._id,
        username: user.username
    };

    // Firma del token con una clave secreta
    const secretKey = 'secreto'; // Reemplaza esto con una clave secreta segura
    const options = {
        expiresIn: '1h' // Tiempo de expiración del token (ejemplo: 1 hora)
    };

    // Generar el token JWT y devolverlo
    const token = jwt.sign(payload, secretKey, options);
    return token;
}
