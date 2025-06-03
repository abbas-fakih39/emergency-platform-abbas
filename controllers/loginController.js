const User = require("../models/userSchema");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        if (!phoneNumber || !password) {
            return res.status(400).json({ message: 'Phone number and password are required' });
        }
        const user = await User.findOne({ phoneNumber: phoneNumber.trim() });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { 
                userId: user._id, 
                userType: user.userType,
                phoneNumber: user.phoneNumber 
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            data: {
                token,
                user: {
                    id: user.id,
                    fullname: user.fullname,
                    phoneNumber: user.phoneNumber,
                    userType: user.userType,
                    location: user.location
                }
            },
            message: 'Login successful'
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};