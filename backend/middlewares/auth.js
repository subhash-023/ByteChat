const jwt = require("jsonwebtoken")
const prisma = require("../config/prismaConfig")
require("dotenv").config()

exports.authenticateToken = async (req, res) => {
    const token = req.cookies.access_token

    if(!token) {
       return res.status(401).json({ error: "Unauthorized: No token provided"})
    }

    jwt.verify(token, process.env.JWT_SECRET, async (error, authData) => {
        if(error) {
            return res.status(403).json({ error: "Forbidden : Invalid token "})
        }

        try {
            const user = await prisma.user.findUnique({
                where: {id : authData.id}, 
                select: {
                    id: true,
                    username: true,
                    email: true,
                    avatar: true,
                },
            })
            req.user = user;
            next()
        } catch (error) {
            console.error("Error during auth", error)
            res.status(500).json({error: "Internal Server Error"})
        }
    })
}