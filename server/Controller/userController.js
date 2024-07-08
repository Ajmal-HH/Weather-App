import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'


const tokenBlacklist = new Set();


const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash
    } catch (error) {
        console.log(error.message);
    }
}

const userSignUp = async (req, res) => {
    const { email, password, name, mobile } = req.body;
    const hashedPassword = await securePassword(password)

    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                mobile
            },
        });
        res.status(201).json({ status: true });
    } catch (error) {
        res.status(400).json({ error: 'User already exists' });
    }
}

const userLogin = async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
}

const logoutUser = (req, res) => {
    req.session = null
    const token = req.headers.authorization.split(' ')[1];
    if (token) {
        tokenBlacklist.add(token);
        res.status(200).json({ message: 'User logged out successfully' });
    } else {
        res.status(400).json({ error: 'No token provided' });
    }
}

export {
    userSignUp,
    userLogin,
    logoutUser
}