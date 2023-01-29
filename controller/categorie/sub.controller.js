const db = require('../../model/index')

const User = db.user;
const Categorie = db.categorie;
const Subcategorie = db.sub;
const Expense = db.expense;

exports.create = async(req,res,next)=>{
    if(!req.body.name){
        return res.status(400).send({
            message:"Please provide with a name"
        })
    }

    const user_id = req.userId;
    const user = await User.findOne().where("_id").equals(user_id)
    console.log(user)
    //Check whether the categorie exists or not
    const cat_id = req.body.id;
    console.log(cat_id)
    const categorie = await Categorie.findOne().where("_id").equals(cat_id);
    if(!categorie){
        return res.status(404).send({
            message:"No such categorie exists!!"
        })
    }
    const sub = await Subcategorie.create({
        user_id:user._id,
        cat_id:categorie._id,
        name:req.body.name,
        description:req.body.description,
    })
    return res.status(200).json({
        result:sub
    })
}

exports.show = async(req,res,next)=>{
    const user_id = req.userId;
    const user = await User.findOne().where("_id").equals(user_id)
    if(!user){
        return res.status(401).send({
            message:"No such user",
        })
    }
    const cat_id = req.body.id;
    const categorie = await Categorie.findOne().where("_id").equals(cat_id);
    if(!categorie){
      res.status(403).send({
        message:"No such categorie"
      })
    }
    const agg = [
      {
        '$match': {
          'cat_id': categorie._id
        }
      }, {
        '$lookup': {
          'from': 'expenses', 
          'localField': '_id', 
          'foreignField': 'sub_id', 
          'as': 'result'
        }
      }, {
        '$unwind': {
          'path': '$result'
        }
      }, {
        '$group': {
          '_id': '$result.sub_id', 
          'total': {
            '$sum': '$result.amount'
          }
        }
      }
    ]
    const response = await Subcategorie.aggregate(agg)
    return res.status(200).json({
        response
    })
}

exports.getTotal = async(req,res,next)=>{

}
