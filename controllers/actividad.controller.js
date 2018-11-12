const actModel = require('../models/actividad');
const vacaModel = require('../models/vaca');
const userModel = require('../models/user');
const actCtrl = {};
const nodeGrok = require('node-grok');

var rl = require('readline');
var fs = require('fs');

actCtrl.addActividad = async(req,res)=>{
  //FIRST WE PARSE LOG OBJECT
  var p ='%{NOTSPACE:primerString} %{NOTSPACE:segundo} \\-- ID: %{WORD:id}, COUNT:%{NUMBER:numero_mensaje},  MSG:%{SPACE:inecesario}%{INT:tiempo_adq_satelite},%{NUMBER:latitud},%{NUMBER:longitud},%{NUMBER:dia},%{NUMBER:hora},%{NUMBER:minuto},%{NUMBER:segundo}';

  var patterns = require('node-grok').loadDefaultSync();
  var pattern = patterns.createPattern(p);
  var lineReader = rl.createInterface({
    input:fs.createReadStream(req.files[0].path)
  });

  await lineReader.on('line',function(line){
      var arreglo = pattern.parseSync(line);

      if(arreglo != null){
        var res = arreglo.dia.split("");
        //var fechaConstruida = new Date("20"+res[4]+res[5],Number(""+res[2]+res[3])-1,res[0]+res[1],arreglo.hora,arreglo.minuto,arreglo.segundo);
        var fechaConstruida = new Date();
        fechaConstruida.setFullYear("20"+res[3]+res[4]);
        fechaConstruida.setMonth(Number(""+res[1]+res[2])-1);
        fechaConstruida.setDate(res[0]);
        fechaConstruida.setHours(arreglo.hora-1);
        fechaConstruida.setMinutes(arreglo.minuto);
        fechaConstruida.setSeconds(arreglo.segundo);
      //  console.log(arreglo.id);

        var act = new actModel({
          fecha:fechaConstruida,
          latitud:arreglo.latitud,
          longitud:arreglo.longitud,
          fecha_insercion:new Date(),
          fecha_recoleccion: new Date(),

        });
        //console.log("act: "+act);
      }else{
         console.log("null");

      }
      act.save(function(err,act){
        if(err){
          console.log("Error en act save");
        }
        vacaModel.findById(arreglo.id,function(err,vaca){

          if(err){
            console.log("Error");
          }
            vaca.actividad.push(act);
            vaca.save(function(err,vaca){
              if(err){
                console.log("ERR");
              }
              console.log("All good!");
            });

        });

      });


});



    //res.json(fechaConstruida);

    res.json('Actividades insertadas');
}
actCtrl.getActividades = async(req,res)=>{
  res.json('En proceso');
}
module.exports = actCtrl;
