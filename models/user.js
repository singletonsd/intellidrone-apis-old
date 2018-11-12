const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    _id:{type:String,required:true},
    usuario:{type:String,required:true},
    password:{type:String,required:true},
    latitud:{type:Number},
    longitud:{type:Number},
    vaca:[{type:String, ref:'Vaca'}]
});


module.exports = mongoose.model('User',UserSchema);
