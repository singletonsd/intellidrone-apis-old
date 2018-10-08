const mongoose = require('mongoose');
const {Schema} = mongoose;

const VacaSchema = new Schema({
    _id:{type:String,required:true},
    nombre:{type:String,required:true},
    sexo:{type:String,required:true},
    actividad:[{type:mongoose.Schema.ObjectId, ref:'Actividad'}]
});


module.exports = mongoose.model('Vaca',VacaSchema);
