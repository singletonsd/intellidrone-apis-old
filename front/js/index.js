var map;

var pruebaJson = [];
var fechaHastaGlobal;
var fechaDesdeGlobal;
var colores =["#FF0000","#00FF00","#0000FF"];
var userId = sessionStorage.getItem("UserID");
//var API_URL = "http://localhost:3000/api";
var API_URL = "http://web.robotagro.com/api";

$(document).ready(function(){

  if(!sessionStorage.getItem("UserID")){
    window.location.href="../login.html";
  }
  var latitudCampo = sessionStorage.getItem("latitudCampo");
  var longitudCampo = sessionStorage.getItem("longitudCampo");
  //alert(longitudCampo);

  setDates();
  $('.collapse').collapse('show');
  //CARGO EL MAPA EN EL NAVEGADOR BAJO LA VARIABLE MAP
   map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        visible:false,
        source: new ol.source.OSM()
      }),
      new ol.layer.Tile({
        visible: true,
        source: new ol.source.BingMaps({
          key: ' Ag_JPPLAvVzaX6jHVuogsJbxttGdk2ezlcNQxi3j73VVItsoOkWoB2pQRQ34F9wJ',
          imagerySet: 'AerialWithLabels'
          // use maxZoom 19 to see stretched tiles instead of the BingMaps
          // &quot;no photos at this zoom level&quot; tiles
          // maxZoom: 19
      })
    }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([parseFloat(longitudCampo),parseFloat(latitudCampo)]),
      zoom: 18
    })
  });

  //LLAMADO ASINCRONA AL SERVIDOR PIDIENDO POR TODAS LAS VACAS
  //httpGetAsync('http://localhost:3000/api/vacas',populateSelect);
  $.getJSON(API_URL+'/vacas/'+userId,function(result){
    populateSelect(result);
  });
  //httpGetAsync('http://localhost:3000/api/vacas/0FF',respuesta);

});

function populateSelect(arreglo)
{

  var select = $("#vaca");
  for(var i=0;i<arreglo.length;i++)
  {
    // option = document.createElement("option");
    select.append($('<option>',{
      value:arreglo[i]._id,
      text:"id:"+arreglo[i]._id+" "+arreglo[i].nombre
    }));
  }

}

function setDates(estado){
  var fechaDesde = $("#fechaDesde").val();
  var fechaHasta = $("#fechaHasta").val();

  var horaDesde = $("#horaDesde").val();
  var horaHasta = $("#horaHasta").val();

  if(!fechaDesde || !fechaHasta || !horaDesde || !horaHasta){

  }
  else
  {

  fechaHastaGlobal = fechaHasta + " " + horaHasta;
  fechaDesdeGlobal = fechaDesde + " " + horaDesde;
  if(pruebaJson.length > 0){
    updateDataVacas(estado);
  }
}
}
function getDataVaca(estado = "mixto")
{
  var vaca = $("#vaca").val();
  if(vaca === "-1"){
    alert("No hay vaca seleccionda");
  }
  else{
    if(!fechaHastaGlobal || !fechaDesdeGlobal){
      alert("Definir todas las fechas");
    }
    getRemoteVaca(vaca,estado);
}
}
function updateDataVacas(estado = "mixto"){
  limpiarTodo();
  for(let i =0; i<pruebaJson.length; i++){
    getRemoteVaca(pruebaJson[i].id,estado);
  }
}
function getRemoteVaca(vaca,estado){
  const Url = API_URL+'/vacas/'+vaca+'/'+fechaDesdeGlobal+'/'+fechaHastaGlobal;

  $.getJSON(Url,function(result){
    addVacaToArray(result,estado);
  });
}

function disableOptionSelect(id){
  $("#vaca").val("-1");
  $("option[value="+id+"]").attr("disabled", "disabled");
}
