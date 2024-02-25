const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const secret = "jsfnsdfbjsd";
const crypto = require('crypto');


exports.registerUser = async (req, res, next) => {

    try {

        const { email, phone, password, priority } = req.body;
        console.log(email, phone, password, priority)

        const existing_user = await User.findOne({ email});
        console.log(existing_user);

        if (existing_user) {
            return res.status(400).json({
                message: "User already registered"
            })
        }
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            phone,
            priority,
            password: securePassword,
        })
        await newUser.save();
        res.status(200).json({
            status: 'success',
            message: "User registered successfully",
            data: newUser
        })

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: "Something went wrong!",
        })
    }
}

const generateRefreshToken = () => {
    return crypto.randomBytes(10).toString('hex');
}


exports.loginUser = async (req, res, next) => {
    try {

        const { email, password } = req.body;

        const existing_user = await User.findOne({ email });
        console.log(existing_user);

        if (!existing_user) {
            res.status(404).json({
                status: 'error',
                message: "User not found"
            })
        }


        const passwordCompare = await bcrypt.compare(password, existing_user.password);
        console.log(passwordCompare);

        if (!passwordCompare) {
            res.status(401).json({
                status: 'error',
                message: "Invalid credentials"
            })
        }


        const accessToken = jwt.sign({ id: existing_user._id }, secret, { expiresIn: '1h' });
        const refreshToken = generateRefreshToken();
        existing_user.refreshToken = refreshToken;
        const saved_token_response = await existing_user.save();
        console.log(saved_token_response);

        res.cookie('accessToken', accessToken, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });

        res.status(200).json({
            status: 'success',
            message: "User logged in successfully",
            accessToken: accessToken
        })


    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: "Something went wrong!"
        })
    }
}


exports.protect = async (req, res, next) => {

    try {

        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({
                status: 'error',
                message: "Token in missing!"
            })
        }

        // verify the token
        const decoded = jwt.verify(accessToken, secret);
        req.userId = decoded.id;
        next();

    } catch (err) {

        if (err instanceof jwt.TokenExpiredError) {

            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.redirect('/login');
            }

            console.log("CLEAR1")

            const user = await User.findOne({ refreshToken });

            console.log("CLEAR2")


            if (!user) {
                return res.redirect('/login');
            }

            const newAccessToken = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
            console.log(newAccessToken);
            res.cookie('accessToken', newAccessToken, { httpOnly: true });

            console.log("CLEAR3")


            req.userId = user._id;
            next();
        } else {
            res.status(401).json({
                status: 'error',
                message: "Invalid access token"
            })
        }
    }
}