const db = require("../model/index")
const { validationResult } = require('express-validator');
const AppError = require('../utils/appErrors');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const comparePassword = require("../middleware/compare");

const User = db.user;
const Profile = db.profile;

exports.signupValidation = (req,res,next)=>{
}

//Create a profile on login
const createProfile = async (id,email,name)=>{
    const profile = await Profile.findOne({
        user: id,
    })
    if(!profile){
        console.log("Enters")
        const profile = await Profile.create({
            user: id,
            email: email,
            name: name,
        })
        return profile;
    }
    return profile;
}

//Method for login
exports.login = async (req,res,next)=>{
    const user = await  User.findOne({
        email: req.body.email,
    });
    if(!user){
        return res.status(400).json({
            message:"No such users exists"
        })
    }

    if(user){
        console.log(user.password)
        if(!comparePassword(user.password,req.body.password)){
            return res.status(400).json({
                error:"Wrong password"
            })
        }
    }

    console.log(user)

    const profile = await createProfile(user._id,user.email,user.name)

    var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

    res.status(200).send({
        id: user._id,
        username: user.name,
        email: user.email,
        accessToken: token,
        profile: profile
    });
}


//Method for signup
exports.signup = async (req,res,next)=>{
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(500).send({
            message: errors,
        })
    }
    const user = await User.findOne({
        email: req.body.email,
    })
    if(user){
         return next(new AppError('Email already taken', 400));
    }
    await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
    const user_res = await User.findOne({
        email: req.body.email,
    })
    return res.status(200).json({
        status:'success',
        data: 'Verified!!',
        user: user_res,
    })
}



