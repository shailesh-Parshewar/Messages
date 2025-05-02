import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt"

const signUp = async (req, res) => {

    try {
        const { fullName, email, password } = req.body;

        // validate the user credentials 
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "please provide all the fields" })
        };
        if (password.length < 6) {
            return res.status(400).json({ message: "password must be longer than 6 characters" })
        };

        // check if the user already exists    
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "user already exists" })
        };

        // hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User({
            fullName,
            email,
            password: hashedPassword
        });

        if (newUser) {
            // generate the token
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePicture: newUser.profilePicture
            })
        } else {
            return res.status(400).json({ message: "could not create your account" })
        }
    } catch (error) {
        console.error("error in signUp controller: " + error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};

const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        //finding a user with the email
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }

        //comparing the password with the hashed version using bcrypt
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }

        // all the credentials are correct at this stage 
        // generating the token.
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            profilePicture: user.profilePicture,
            email: user.email,
            createdAt: user.createdAt
        })
    } catch (error) {
        console.log("Error in Login Controller : " + error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};

const logOut = (req, res) => {
    try {
        res.cookie("authToken", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out succesfully" })
    } catch (error) {
        console.log("Error in logOut controller : " + error)
        res.status(500).json({ message: "Internal Server Error" })
    }
};

const updateProfile = async (req, res) => {
    try {
        // get profilePicture from req.body
        const {profilePicture} = req.body;
        // get userId from req.user object defined in protectRoute middleware.
        const userID = req.user._id;

        if(!profilePicture) {
            //there is no profilePicture provided 
            return res.status(400).json({message: "Profile Picture is required"});
        }
         
        // upload the file to cloundinary bucket
        const uploadResponse = await cloudinary.uploader.upload(profilePicture);
        // update the database with correct credentials
        const updatedUser = await User.findByIdAndUpdate(userID,  {profilePicture: uploadResponse.secure_url}, {new: true});
        res.status(200).json(updatedUser)
    } catch (error) {
       console.log("Error in updateProfile controller : " + error);
       res.status(500).json({message : "Internal Server Error"})
    }
};

const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth controller : " + error);
        res.status(500).json({message : "Internal Server Error"})
    }
};

export { signUp, logIn, logOut, updateProfile, checkAuth};