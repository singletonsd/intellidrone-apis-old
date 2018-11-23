const userModel = require('../models/user');
const userCtrl = {};
const _ = require('lodash');

userCtrl.addUser = async(req,res)=>{
  const user = new userModel({
    _id:req.body.id,
    usuario:req.body.usuario,
    password:req.body.password,
    latitud:req.body.latitud,
    longitud:req.body.longitud,
  });
  await user.save();
  res.json("Usuario guardado");
};

userCtrl.getUser = async(req,res)=>{

  console.log("usr: "+req.body.usuario + " pass: "+req.body.password);
  const user = await userModel.find({usuario:req.body.usuario,password:req.body.password});
  console.log(user);
  if(user.length > 0){
    res.json(user);
  }else{
    res.json(false);
  }

}

userCtrl.getUsers = async(req,res)=>{

  const users = await userModel.find();
  _.forEach(users || [], (field) => {
    field.password = undefined;
  });
    res.json(users);
}

userCtrl.setCoordinates = async(req,res)=>{
  const user = await userModel.findByIdAndUpdate({_id:req.body.usuario}, {$set:{"latitud":req.body.latitud,"longitud":req.body.longitud}});

  user.save();

  res.json("Coordenadas guardadas");
}

module.exports = userCtrl;
