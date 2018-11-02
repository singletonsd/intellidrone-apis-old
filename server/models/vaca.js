const mongoose = require('mongoose');
const {Schema} = mongoose;

const VacaSchema = new Schema({
    _id:{type:String,required:true},
    nombre:{type:String},
    sexo:{type:String},
    actividad:[{type:mongoose.Schema.ObjectId, ref:'Actividad'}],
    user:[{type:String,ref:'User'}]
});


module.exports = mongoose.model('Vaca',VacaSchema);
