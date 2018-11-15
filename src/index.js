const express = require('express');
const cors = require('cors');
const {mongoose} = require('./database');
const app = express();
const multer = require('multer');
require('dotenv').config()

app.set('port',process.env.PORT || 3000);

app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(multer({dest:'./uploads/'}).any());

app.use('/vacas',require('./routes/vaca.routes.js'));
app.use('/actividad',require('./routes/actividad.routes.js'));
app.use('/users',require('./routes/user.routes.js'));
app.use('/admin',require('./routes/admin.routes.js'));

if(process.env.DATABASE_LOCAL){
  console.log("Running with local database.");
  var shell = require('shelljs');
  shell.exec('./scripts/run_mongo_local.sh');
}

app.listen(app.get('port'),()=>{
  console.log("Aplicacion corriendo en puerto:",app.get('port'))
});
