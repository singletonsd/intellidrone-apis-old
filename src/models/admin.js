const mongoose = require('mongoose');
const {Schema} = mongoose;

const AdminSchema = new Schema({
    _id:{type:String,required:true},
    usuario:{type:String,required:true},
    password:{type:String,required:true}
});


module.exports = mongoose.model('Admin',AdminSchema);
