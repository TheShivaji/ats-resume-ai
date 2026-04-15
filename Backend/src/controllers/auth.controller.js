import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../model/user.model.js';


/**
 * @desc    User signup controller
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

        await user.save();

        const token = jwt.sign({
            userId: user._id,
            username: user.username,
            email: user.email
        }, process.env.JWT_SECRET, {
            expiresIn: '7d' // Token valid for 7 days
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000 // 1 hour
        });
        res.status(201).json({ success: true, message: 'User created successfully' });


    } catch (error) {
        console.error("Signup error:", error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    User login controller
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

        const token = jwt.sign({
            userId: user._id,
            username: user.username,
            email: user.email
        }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000
        });

        res.status(200).json({ success: true, message: 'Login successful' ,
            user:{
                ...user._doc,
                password:undefined
            }
        }
        );
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    User logout controller
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logoutController = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    });

    return res.status(200).json({
        success: true,
        message: 'Logout successful'
    });
};

export const getMeController = async (req, res) => {

    const user = await userModel.findById(req.user.id)



    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            ...user._doc,
            password:undefined
        }
    })

}