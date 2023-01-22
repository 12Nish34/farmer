const jwt = require('jsonwebtoken')
const config = require('../config/auth.config')


const verifyToken = (req,res,next)=>{
    let token = req.header('x-access-token')
    console.log("Token recieved is:",token)
    if(!token){
        return res.status(403).send({
            message:"No token provided",
        })
    }

    jwt.verify(token, config.secret,(err,decoded)=>{
        if(err){
            return res.status(401).send({
                message:"Unauthorized!!",
            })
        }
        req.userId = decoded.id;
        next();
    })
}

const authJwt = {
    verifyToken
}

module.exports = authJwt;