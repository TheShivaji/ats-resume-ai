import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../model/user.model.js';

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

/**
 * @desc    Register new user and generate tokens
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signupController = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return existingUser.username === username
                ? res.status(400).json({ success: false, message: 'Username already exists' })
                : res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        // tokens
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );

        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRY }
        );

        // 🔥 store refresh token in DB
        user.refreshToken = refreshToken;
        await user.save();

        // cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            accessToken,
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        console.error("Signup error:", error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


/**
 * @desc    Authenticate user and return tokens
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );

        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRY }
        );

        // 🔥 store refresh token in DB (important)
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken,
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


/**
 * @desc    Logout user and clear refresh token
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logoutController = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (token) {
            const user = await User.findOne({ refreshToken: token });

            if (user) {
                user.refreshToken = null;
                await user.save();
            }
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });

        return res.status(200).json({
            success: true,
            message: 'Logout successful'
        });

    } catch (error) {
        res.status(500).json({ message: "Logout failed" });
    }
};


/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMeController = async (req, res) => {
    const user = await User.findById(req.user);

    return res.status(200).json({
        message: "User details fetched successfully",
        user: {
            ...user._doc,
            password: undefined
        }
    });
};


/**
 * @desc    Refresh access token using refresh token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
export const refreshController = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({ message: "No refresh token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );

        const newRefreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRY }
        );

        // rotate token
        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            accessToken: newAccessToken
        });

    } catch (error) {
        console.log("Refresh error:", error.message);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};