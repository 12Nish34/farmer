const mongoose = require('mongoose');
const Expense = require('../../model/category/expenses.model');
const db = require('../../model/index')

const User = db.user;
const Sub = db.sub;
const Categorie = db.categorie;

exports.create=async(req,res,next)=>{
    console.log("Name",req.body.name)
    console.log("Amount",req.body.amount)
    console.log("subcategory id",req.body.id);
    if(!req.body.name){
        res.status(401).send({
            message:"Please provide a body"
        })
    }
    const user_token = req.userId;
    const user = await User.findOne().where('_id').equals(user_token);
    if(!user){
        return res.status(401).send({
            message:"Wrong user or token provided"
        })
    }
    const subcat_id = req.body.id;
    const subcat = await Sub.findOne().where('_id').equals(subcat_id);
    console.log({subcat})

    if(!subcat){
        return res.status(401).send({
            message:"No such subcategory"
        })
    }
    await Expense.create({
        sub_id:subcat._id,
        name:req.body.name,
        amount:req.body.amount,
    },{versionKey:false, timestamps:true})

    return res.status(200).json({
        Status:"Created",
    })
}

exports.show = async(req,res,next)=>{
    const user_token = req.userId;
    const user = await User.findOne().where('_id').equals(user_token);
    if(!user){
        return res.status(401).send({
            message:"Wrong user or token provided"
        })
    }
    const response = await Expense.find({});
    return res.status(200).json({
        response
    })
}

