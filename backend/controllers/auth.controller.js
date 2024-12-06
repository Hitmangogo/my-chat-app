import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";
import generateTokenAndSetCookie from '../utils/generateTokens.js';

export const signupUser = async(req, res) => {
    try {
        const { fullname, username, password, confirmpassword, gender }= req.body;

        if(password != confirmpassword){
            return res.status(400).json({error: "Password dont match"})
        }

        const user = await User.findOne({username});

        if(user){
           return res.status(400).json({error: 'Username is already exists'})
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const profilePic = gender === "male" ? boyProfilePic : girlProfilePic;

        const newUser = new User({
            fullname,
            username,
            password: hashedPassword,
            confirmpassword,
            gender,
            profilePic: profilePic
        })

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            
            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({error: "Invalid user data"});
        }

    } catch (error) {
        console.log("error in signup controller", error.message);
        res.status(500).json({error: "internal server error"});
    }
}

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: "Invalid username or password"});
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname, 
            username: user.username,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("error in login controller", error.message);
        res.status(500).json({error: "internal server error"});
    }
}

export const logoutUser = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "User logout succesfully"});
    } catch (error) {
        console.log("error in logout controller", error.message);
        res.status(500).json({error: "internal server error"});
    }
}