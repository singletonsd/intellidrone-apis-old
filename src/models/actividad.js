const mongoose = require('mongoose');
const {Schema} = mongoose;

const ActividadSchema = new Schema({
    vaca:[{type:String, ref:'Vaca'}],
    fecha:{type:Date},
    latitud:{type:Number},
    longitud:{type:Number},
    fecha_recoleccion:{type:Date},
    fecha_insercion:{type:Date},
    HDOP:{type:Number}
});


module.exports = mongoose.model('Actividad',ActividadSchema);
