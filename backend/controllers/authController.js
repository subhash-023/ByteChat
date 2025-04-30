const prisma = require("../config/prismaConfig")
require("dotenv").config();
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user) {
            res.status(401).json({error: "Invalid email or password"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(401).json({error: "Incorrect email or password"})
        }

        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            samesite: 'none',
            secure: true,
            maxAge: 3600000,
            path: '/'
        })
        res.json({ message: "Login Successful" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

exports.register = async (req, res) => {
    const {username, password, email} = req.body
    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{username}, {email}]
            }
        })

        if(existingUser) {
            res.json({error: "Username or email already exists!"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
        }})

        const access_token = jwt.sign(
            { id: newUser.id, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        res.json({ access_token })
    } catch (error) {
        console.error(error)
        res.json({error: "Internal server error!"})
    }
}

exports.logout = (req, res) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        samesite: 'none',
        secure: true,
        path: '/'
    });

    res.json({message: "Logged out successfully!"})
}