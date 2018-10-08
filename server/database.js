const mongoose = require('mongoose');
const uri = 'mongodb://localhost/vacas';
mongoose.connect(uri)
  .then(db => console.log('Base de datos corriendo'))
  .catch(err => console.error(err));

module.exports = mongoose;
