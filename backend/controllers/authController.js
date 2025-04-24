const prisma = require("../config/prismaConfig")
require("dotenv").config();
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })
        if (!user) {
            res.status(401).json({error: "Invalid Username or password"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(401).json({error: "Incorrect username or password"})
        }

        const accessToken = jwt.sign(
            { id: user.id, username: user.username },
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