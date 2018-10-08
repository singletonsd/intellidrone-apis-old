const vacaModel = require('../models/vaca');
const vacaCtrl = {};

vacaCtrl.getVacas = async(req,res) =>{
  const vacas = await vacaModel.find({},'nombre _id');
  res.json(vacas);

};


vacaCtrl.addVaca = async(req,res)=>{
  const vaca = new vacaModel({
      _id:req.body.id,
      nombre:req.body.nombre,
      sexo:req.body.sexo,
  });

  await vaca.save();
  res.json("Vaca Guardada");
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
module.exports = vacaCtrl;
