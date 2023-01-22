const db = require('../../model/index')
const authJwt = require("../../middleware/authJwt")
const { where } = require('../../model/user.model')
const { categorie } = require('../../model/index')


const Categorie = db.categorie
const User = db.user

const getUserId =async (id)=>{
    const res_id = await User.find({_id:id})
    console.log("The user is",res_id)
    return res_id
}

exports.create=async(req,res,next)=>{
    if(!req.body.name){
        return res.status(400).send({
            message:"Please provide with a name"
        })
    }
    const user_id = req.userId;
    console.log("User id from post request",user_id);
    const user = await User.findOne().where("_id").equals(user_id)
    console.log(user)
    if(!user){
        return res.status(404).send({
            message:"No such user",
        })
    }
    await Categorie.create({
        name:req.body.name,
        user_id:user._id,
    })
    const categorie = await Categorie.find({user_id:user._id})
    return res.status(200).json({
        message:"Created",
    })
}

exports.show = async(req,res,next)=>{
    const user_id = req.userId
    console.log("User id from get request",user_id);
    const user = await User.findOne().where("_id").equals(user_id)
    const categorie = await Categorie.find({user_id:user._id})
    console.log(categorie)
    return res.status(200).json({
        categorie
    })
}