const adminModel = require('../models/admin');
const adminCtrl = {};


adminCtrl.addUser = async(req,res)=>{
  // const user = new adminModel({
  //   _id:req.body.id,
  //   usuario:req.body.usuario,
  //   password:req.body.password
  // });
  // await user.save();
  // res.json("Usuario guardado");
  res.json("Opción inavilitada.");
};

adminCtrl.getUser = async(req,res)=>{
  // console.log("usr: "+req.body.usuario + " pass: "+req.body.password);
  const user = await adminModel.find({usuario:req.body.usuario,password:req.body.password});
  console.log(user);
  if(user.length > 0){
    res.json(user);
  }else{
    res.json(false);
  }
}

module.exports = adminCtrl;
