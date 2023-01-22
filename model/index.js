const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.profile = require("./profile.model")
db.categorie = require("./category/category.model")
//db.role = require("./role.model");

//db.ROLES = ["user", "admin", "moderator"];

module.exports = db;