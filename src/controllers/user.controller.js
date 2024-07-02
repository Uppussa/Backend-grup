import { User } from '../model/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config/config.js'



export const create = async (req, res) => {
    try {
        const { name, email, password, role, nivel, matricula } = req.body;

        // Validar que si el rol es 'student', se incluya la matrícula
        if (role === 'student' && !matricula) {
            return res.status(400).json({ message: 'Student must provide matricula' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo usuario
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            nivel,
            matricula: role === 'student' ? matricula : undefined  // Asignar matrícula solo si es estudiante
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '2h' });

        res.status(200).json({ message: 'User verified', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAll = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, SECRET_KEY);

        const userEmail = decodedToken.email;
        const userRole = decodedToken.role;
        const { email, matricula } = req.query;

        if (userRole === 'teacher') {
            if (email) {
                const user = await User.findOne({ email });
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                res.json(user);
            } else if (matricula) {
                const user = await User.findOne({ matricula });
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                res.json(user);
            } else {
                const users = await User.find();
                res.json(users);
            }
        } else if (userRole === 'student') {
            const user = await User.findOne({ email: userEmail });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateImage = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, SECRET_KEY);

        const userEmail = decodedToken.email;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        if (!image) {
            return res.status(400).json({ message: 'Profile image is required' });
        }
        const user = await User.findOneAndUpdate({ email: userEmail }, { image }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Profile image updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};