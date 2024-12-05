import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";

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

        await newUser.save();

        if(newUser){
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

export const loginUser = (req, res) => {
    res.send("successful");
    console.log("signupUser");
}

export const logoutUser = (req, res) => {
    res.send("successful");
    console.log("logoutUser");
}