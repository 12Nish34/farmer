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
    const user = await User.findOne().where("_id").equals(user_id)
    console.log(user)
    if(!user){
        return res.status(404).send({
            message:"No such user",
        })
    }
    console.log()
    await Categorie.create({
        name:req.body.name,
        user_id:user._id,
    })
    const categorie = await Categorie.find({user_id:user._id})
    console.log(categorie)
    return res.status(200).json({
        message:"Created",
        category:categorie,
    })
}

exports.show = async(req,res,next)=>{
    const user_id = req.userId
    console.log("User id from get request",user_id);
    const user = await User.findOne().where("_id").equals(user_id)
    console.log(user)
    const category = await Categorie.find({}).where('user_id').equals(user._id)
    const agg = [
        {
          '$lookup': {
            'from': 'subs', 
            'localField': '_id', 
            'foreignField': 'cat_id', 
            'as': 'result'
          }
        }
      ];
    const cursor =await Categorie.aggregate(agg);
    return res.status(200).json({
        result:cursor
    })
}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

exports.showGraph = async(req,res,next)=>{
    const user_id = req.userId
    console.log("User id from get request",user_id);
    const user = await User.findOne().where("_id").equals(user_id)
    console.log(user)
    const agg = [
        {
          '$match': {
            'user_id': user._id
          }
        }, {
          '$lookup': {
            'from': 'subs', 
            'localField': '_id', 
            'foreignField': 'cat_id', 
            'as': 'result'
          }
        }, {
          '$unwind': {
            'path': '$result'
          }
        }, {
          '$group': {
            '_id': '$result.cat_id', 
            'category': {
              '$first': '$name'
            }, 
            'count': {
              '$sum': 1
            }
          }
        }, {
          '$project': {
            '_id': 0,
          }
        }
      ];
    const cursor = await Categorie.aggregate(agg);
    var data = [];
    var color = ["#233d29","#050a06","#ffbb8d","#00a4ff"]
    console.log(color[0])
    for(var i = 0;i<cursor.length;i++){
        data.push({
            name:cursor[i].category,
            sub:cursor[i].count,
            color:color[getRandomArbitrary(1,4)],
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        })
    }
    console.log(data)
    return res.status(200).json({
        data
    })      
}