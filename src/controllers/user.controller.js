import { User } from '../model/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config/config.js'



export const create = async (req, res) => {
    const { name, email, password, role, image, videos } = req.body
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Please. Send all required fields' })
    }
    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
        image: image ?? null,
        videos: videos ?? null
    })
    await newUser.save()
    console.log(newUser);
    res.status(201).json({ message: 'User created' })
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign({ email: user.email, role: user.role}, SECRET_KEY, { expiresIn: '1h' });

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
        const { email } = req.query; 
    
        if (userRole === 'teacher') {
            if (email) {
                const user = await User.findOne({ email });
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
export const update = async (req, res) => {
    const {image, videos } = req.body
    const user = await  user.findByIdAndUpdate(req.params.id, {
        image,
        videos
    })
    res.json(user) 
}