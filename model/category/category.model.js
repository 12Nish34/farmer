const mongoose = require('mongoose')

var categorie = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    name:{
        type:String,
        required: true,
    },
},{ versionKey: false, timestamps: true })

const Categorie = mongoose.model('Categorie',categorie);

module.exports = Categorie;