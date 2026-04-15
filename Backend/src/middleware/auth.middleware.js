import jwt from "jsonwebtoken"

export const authUser = (req , res , next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send('No token provided');
    }

    let decoded ;
    try {
        decoded = jwt.verify(token , process.env.JWT_SECRET)

        req.user = decoded.id

        next()
    } catch (error) {
        console.log("Error in middleware" ,  error.message)
    }
} 