const vacaModel = require('../models/vaca');
const userModel = require('../models/user');
const actModel = require('../models/actividad');
const vacaCtrl = {};

vacaCtrl.getVacas = async(req,res) =>{
  const vacas = await vacaModel.find({},'nombre _id');
  res.json(vacas);

};

vacaCtrl.getVacasUser = async(req,res)=>{
  const vacas = await vacaModel.find({user:req.params.id});
  console.log("Buscando por id de usuario:"+req.params.id);
  res.json(vacas);
}

vacaCtrl.addVaca = async(req,res)=>{
  const vaca = new vacaModel({
      _id:req.body.id,
      nombre:req.body.nombre,
      sexo:req.body.sexo,
  });
  vaca.user.push(req.body.userID);
  await vaca.save();
  userModel.findById(req.body.userID,function(err,user){
    if(err){
      console.log("Error");
    }
    user.vaca.push(vaca);
    user.save();

  });
  res.json("Vaca Guardada!");
};

vacaCtrl.getVaca = async(req,res)=>{
  console.log(req.params);
  let fechaDesde = new Date(req.params.fechaDesde);
  let fechaHasta = new Date(req.params.fechaHasta);
  console.log(fechaDesde);
  const vaca = await vacaModel.findById(req.params.id).populate({path:'actividad',
  select:'fecha latitud longitud',
  match:{fecha:{$gte:fechaDesde,$lte:fechaHasta}},

  options:{sort:{'fecha':1}}});
  res.json(vaca);
};

vacaCtrl.deleteVaca = async(req,res)=>{
  vacaModel.findByIdAndRemove(req.params.id,(err,response)=>{
    res.json("Vaca eliminada");

  });

}
module.exports = vacaCtrl;
