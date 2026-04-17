import jwt from "jsonwebtoken"

export const authUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No access token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded
        next();
    } catch (error) {
        console.log("Error in middleware" , error.message)
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};