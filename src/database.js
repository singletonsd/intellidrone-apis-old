const mongoose = require('mongoose');
require('dotenv').config();

var uri = 'mongodb://'+process.env.DATABASE_URL+'/vacas';
if(process.env.DATABASE_URL){
  uri = 'mongodb://localhost/vacas';  
}

mongoose.connect(uri)
  .then(db => console.log('Base de datos corriendo'))
  .catch(err => console.error(err));

module.exports = mongoose;
