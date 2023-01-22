const express = require('express')

const {create,show} = require("../../controller/categorie/categorie.controller");
const authJwt = require('../../middleware/authJwt');

module.exports = function(app){
    var router = require("express").Router();
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });

    router.post("/",[authJwt.verifyToken],create);
    router.get("/",[authJwt.verifyToken],show);

    app.use('/api/categorie', router)
}