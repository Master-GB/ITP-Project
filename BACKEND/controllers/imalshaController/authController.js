const User = require('../../models/imalshaModel/UserModel');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists and password matches
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            'your-secret-key', // Replace with a secure secret key
            { expiresIn: '1h' }
        );

        // Return token and user info (excluding password)
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            contactNumber: user.contactNumber,
            address: user.address
        };

        res.status(200).json({
            token,
            user: userResponse
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

const register = async (req, res) => {
    const { name, email, password, role, contactNumber, address } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = new User({
            name,
            email,
            password,
            role: role || 'user', // Default role is 'user' if not specified
            contactNumber,
            address
        });

        await newUser.save();

        // Generate token for immediate login
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email, role: newUser.role },
            'your-secret-key', // Replace with a secure secret key
            { expiresIn: '1h' }
        );

        // Return token and user info (excluding password)
        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            contactNumber: newUser.contactNumber,
            address: newUser.address
        };

        res.status(201).json({
            token,
            user: userResponse
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

module.exports = {
    login,
    register
}; 