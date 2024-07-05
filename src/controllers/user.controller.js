import { User } from '../model/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config/config.js'



export const create = async (req, res) => {
    try {
        const { name, email, password, role, nivel, matricula, profileImage } = req.body; //  Obtener datos del body
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10); // Encriptar contraseña

        // Crear nuevo usuario
        const newUser = new User({  // Crear instancia de User
            name,
            email,
            password: hashedPassword, // Guardar contraseña encriptada
            role,
            nivel,
            matricula: role === 'student' ? matricula : undefined,  // Asignar matrícula solo si es estudiante
            profileImage: profileImage || '' // Asignar imagen de perfil si existe
        });

        await newUser.save(); // Guardar usuario en la base de datos

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {  // Función para iniciar sesión
    const { email, password } = req.body; // Obtener datos del body

    try {
        const user = await User.findOne({ email }); // Buscar usuario por email
        if (!user) return res.status(400).json({ message: 'User not found' }); // Si no existe el usuario

        const isPasswordValid = await bcrypt.compare(password, user.password);  // Comparar contraseñas
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' }); // Si la contraseña es inválida

        const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '2h' }); // Crear token

        res.status(200).json({ message: 'User verified', token }); // Enviar token
    } catch (error) {
        res.status(500).json({ message: error.message }); // Enviar error
    }
};

export const getAll = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Obtener token del header
        const decodedToken = jwt.verify(token, SECRET_KEY); // Verificar token

        const userEmail = decodedToken.email; // Obtener email del token
        const userRole = decodedToken.role; // Obtener rol del token
        const { email, matricula } = req.query;     // Obtener email o matrícula de la query

        if (userRole === 'teacher') { 
            if (email) {
                const user = await User.findOne({ email }); // Buscar usuario por email 
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                res.json(user);
            } else if (matricula) {     // Buscar usuario por matrícula si se especifica en la query
                const user = await User.findOne({ matricula }); // Buscar usuario por matrícula si se especifica en la query 
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                res.json(user); // Enviar usuario encontrado por matrícula
            } else {
                const users = await User.find();  // Obtener todos los usuarios si no se especifica email o matrícula
                res.json(users);
            }
        } else if (userRole === 'student') {    // Si es estudiante solo puede ver su perfil
            const user = await User.findOne({ email: userEmail });  // Buscar usuario por email
            if (!user) {
                return res.status(404).json({ message: 'User not found' }); // Si no se encuentra el usuario
            }
            res.json(user);
        } else {
            return res.status(403).json({ message: 'Access denied' }); // Si no es profesor ni estudiante
        }
    } catch (error) {
        res.status(500).json({ message: error.message }); // Enviar error
    }
};

export const updateImage = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];  // Obtener token del header
        const decodedToken = jwt.verify(token, SECRET_KEY); // Verificar token

        const userEmail = decodedToken.email; // Obtener email del token
        const image = req.file ? `/uploads/${req.file.filename}` : null; // Obtener imagen del body

        if (!image) {
            return res.status(400).json({ message: 'Profile image is required' }); // Si no hay imagen
        }
        const user = await User.findOneAndUpdate({ email: userEmail }, { profileImage: image }, { new: true }); // Actualizar imagen de perfil
        if (!user) {
            return res.status(404).json({ message: 'User not found' });     // Si no se encuentra el usuario
        }
        res.json({ message: 'Profile image updated successfully' });  // Enviar mensaje de éxito
    } catch (error) {
        res.status(500).json({ message: error.message }); // Enviar error
    }
};