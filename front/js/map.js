
function showData(lat,long,tiempoEnPunto,fechaFin,fechaInicio,numeroDePunto)
{
  alert("Lat Promedio: "+lat + " - Long Promedio: "+long+ "\n"+
  "Estuvo aqui aproximadamente: "+tiempoEnPunto + " minutos\n"+
  "Desde: "+new Date(fechaInicio) + " Hasta: "+new Date(fechaFin)+"\n"+
  "Numero de punto:"+numeroDePunto);
}


//FUNCION QUE COMPRUEBA QUE EL DATO ESTE DENTRO DEL RANGO DE HORA Y DIA.
function validar(actividad)
{
  var fechaSeleccionada = new Date($("#fechaDesde").val());
  var tiempoPiso = $("#slider-range").slider("values",0);
  var tiempoTecho = $("#slider-range").slider("values",1);
  var fechaDeteccion =new Date(actividad.fecha);

  if(fechaSeleccionada.getFullYear() === fechaDeteccion.getFullYear() && fechaSeleccionada.getMonth() === fechaDeteccion.getMonth() && fechaSeleccionada.getUTCDate() === fechaDeteccion.getUTCDate())
  {
    if(fechaDeteccion.getHours()>=tiempoPiso && fechaDeteccion.getHours() < tiempoTecho){
      return true;
    }
    else{
      if(fechaDeteccion.getHours() === tiempoTecho){
        if(fechaDeteccion.getMinutes() < 1){
          return true;
        }
      }
      return false;
    }
  }
  else{
    return false;
  }
}
function measure(lat1, lon1, lat2, lon2)
{  // generally used geo measurement function
  var R = 6378.137; // Radius of earth in KM
  var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d * 1000; // meters
}

function promedio(arreglo)
{
  var promedio = 0;
  for(var j =0;j<arreglo.length;j++)
  {
    promedio +=arreglo[j];
  }
  promedio = promedio/arreglo.length;
  return promedio;
}

function drawOnMap(arreglo,numeroIteracion,playAll)
{
  var segundos =playAll ? $("#segundos").val() : 0;

  let arregloActividad = arreglo.actividad;
  if(numeroIteracion < arregloActividad.length){

    disableInputs(true,arreglo.id,playAll);
    setTimeout(
      ()=>{
        const dot = document.createElement("span");
        var size = 9;
        var cantidadAzul = (255/arregloActividad.length) + (255/arregloActividad.length)*numeroIteracion;
        var opacity = 0.4 + (0.5/(arregloActividad.length/numeroIteracion));
        dot.className = "dot";
      //  dot.id='dot';
        dot.style.width = size+"px";
        dot.style.height = size+"px";
        dot.style.backgroundColor = hexToRGB(arreglo.color,opacity);
        dot.idAsociado = arreglo.id;
        dot.style.border="1px solid white";
        dot.numeroDePunto = numeroIteracion;
        //dot.style.opacity = opacity;
        console.log(numeroIteracion+": "+arregloActividad[numeroIteracion]);
        dot.onclick=function(){
          showData(arregloActividad[dot.numeroDePunto][0],arregloActividad[dot.numeroDePunto][1],arregloActividad[dot.numeroDePunto][2],arregloActividad[dot.numeroDePunto][3],arregloActividad[dot.numeroDePunto][4],dot.numeroDePunto);


        };
        var popup = new ol.Overlay({
          element: dot
        });
        popup.setPosition(ol.proj.fromLonLat([arregloActividad[numeroIteracion][1], arregloActividad[numeroIteracion][0]]));
        map.addOverlay(popup);
        setEstadoEnumeracionSpan(arreglo.id);
        if(playAll)
        {
          drawOnMap(arreglo,++numeroIteracion,true);

        }
        else{
          arreglo.numeroIteracion = ++numeroIteracion;
        }
      },segundos
    )
  }
  else {
    setEstadoEnumeracionSpan(arreglo.id);
    disableInputs(false,arreglo.id,playAll);
  }

}

function hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}

function populateDivComandos(){
  let div = $("#comandos");
  div.html("");
  div.append("<button onclick='playall()' class='btn btn-md btn-success'>Play all</button>");
  div.append("<button onclick='next()' class='btn btn-md btn-info'>Siguiente</button>");
  div.append("<button onclick='limpiar()' class='btn btn-md btn-danger'>Limpiar mapa</button>");
}

function play(id){
  for(let i=0;i<pruebaJson.length;i++){
    if(pruebaJson[i].id === id){
      if(pruebaJson[i].color === undefined){
        alert("Definir el color para la vaca seleccionada!");

      }
      else{
        $('.collapse').collapse('hide');

        drawOnMap(pruebaJson[i],0,true);


      }
      break;
    }
  }

}
function playAllCows(){
  $('.collapse').collapse('hide');
  for(let i =0; i<pruebaJson.length;i++){
    drawOnMap(pruebaJson[i],0,true);
  }
}
function next(idVaca)
{
  drawOnMap(pruebaJson[getIndexFromJson(idVaca)],pruebaJson[getIndexFromJson(idVaca)].numeroIteracion,false);
}


function setActividad(arregloActividad, idVaca){

  let arregloLocal = [];
  var metros = $("#metros").val()
  var last_i=0;
  var inicio = true;
  var promediarLat = []; //Arreglo de latitudes que luego se promediaran
  var promediarLon = []; //Arreglo de longitudes que luego se promediaran
  var numeroDePunto = 0;
  for(var i=0;i<arregloActividad.length;i++){
      //console.log(new Date(arr[i].fecha).getHours());
      if(inicio){last_i = i;inicio=false;}
      if(measure(arregloActividad[last_i].latitud,arregloActividad[last_i].longitud,arregloActividad[i].latitud,arregloActividad[i].longitud)>metros)
      {
        //Calculo diferencia de tiempo
        var cantidadDeTiempo = (new Date(arregloActividad[i].fecha).getTime() - new Date(arregloActividad[last_i].fecha).getTime());
        cantidadDeTiempo = (cantidadDeTiempo/1000)/60;
        //Le paso a una funcion que dibuja el punto en el mapa la latitud, longitud y tiempo en ese punto
        //drawOnMap(promedio(promediarLat),promedio(promediarLon),cantidadDeTiempo,arr[i].fecha,arr[last_i].fecha,numeroDePunto);
        arregloLocal.push([promedio(promediarLat),promedio(promediarLon),cantidadDeTiempo,arregloActividad[i].fecha,arregloActividad[last_i].fecha]);
        numeroDePunto++;
        //Limpio el arreglo y lo cargo con el elemento que causo la entrada al if
        promediarLat=[];
        promediarLon=[];
        promediarLat.push(arregloActividad[i].latitud);
        promediarLon.push(arregloActividad[i].longitud);
        last_i=i;
      }
      else {

        promediarLat.push(arregloActividad[i].latitud);
        promediarLon.push(arregloActividad[i].longitud);
      }
    }


  pruebaJson[getIndexFromJson(idVaca)].actividad = arregloLocal;
}

function setActividadPorTiempo(arregloActividad,idVaca){

    let arregloLocal = [];
    var tiempoTecho = $("#slider-range").slider("values",1);
    var minutos = $("#intervalo").val()
    var arr = arregloActividad; //Arreglo con la actiivdad completa de la vaca
    var last_i=0;
    var inicio = true;
    var numeroDePunto = 0;
    for(var i=0;i<arr.length;i++){
        if(inicio){
          last_i = i;
          inicio=false;
        }
        let cantidadDeTiempo = (new Date(arr[i].fecha).getTime() - new Date(arr[last_i].fecha).getTime());

        cantidadDeTiempo = (cantidadDeTiempo/1000)/60;

        if(cantidadDeTiempo >= minutos || i === last_i)
        {

          arregloLocal.push([arr[i].latitud,arr[i].longitud,cantidadDeTiempo,arr[i].fecha,arr[last_i].fecha]);
          numeroDePunto++;

          last_i=i;
        }
      else {

      }


    }

    pruebaJson[getIndexFromJson(idVaca)].actividad = arregloLocal;
}

function setActividadPorDistancia(arregloActividad,idVaca){

      let arregloLocal = [];
      var metros = $("#metros").val()
      var arr = arregloActividad; //Arreglo con la actiivdad completa de la vaca
      var last_i=0;
      var inicio = true;
      var numeroDePunto = 0;
      for(var i=0;i<arr.length;i++){
          if(inicio){
            last_i = i;
            inicio=false;
          }


          if(measure(arr[last_i].latitud,arr[last_i].longitud,arr[i].latitud,arr[i].longitud)>=metros || i===last_i)
          {
            let cantidadDeTiempo = (new Date(arr[i].fecha).getTime() - new Date(arr[last_i].fecha).getTime());

            cantidadDeTiempo = (cantidadDeTiempo/1000)/60;

            arregloLocal.push([arr[i].latitud,arr[i].longitud,cantidadDeTiempo,arr[i].fecha,arr[last_i].fecha]);
            numeroDePunto++;

            last_i=i;
          }
          else {

          }
      }

      pruebaJson[getIndexFromJson(idVaca)].actividad = arregloLocal;
}
function addVacaToArray(resultado,estado){
  if(pruebaJson[getIndexFromJson(resultado._id)]){
    pruebaJson[getIndexFromJson(resultado._id)].actividadCompleta = resultado.actividad;
    detFunctionLoad(pruebaJson[getIndexFromJson(resultado._id)],estado);
    setListado();
  }else{

    let vaca = {id:resultado._id,nombre:resultado.nombre,actividadCompleta:resultado.actividad,numeroIteracion:0,color:colores[pruebaJson.length]};
    pruebaJson.push(vaca);
    disableOptionSelect(resultado._id);
    detFunctionLoad(pruebaJson[getIndexFromJson(resultado._id)],estado);
    setListado();
}

}

function setListado(){
  const table = $('#tabla-vacas');
  $(table).html("");
  for(let i=0;i<pruebaJson.length;i++){
    const tr = document.createElement("tr");
    //TD for id
    const tdId = document.createElement("td");
    $(tdId).text(pruebaJson[i].id);
    $(tr).append(tdId);


    //TD for name
    const tdNombre = document.createElement("td");
    $(tdNombre).text(pruebaJson[i].nombre);
    $(tr).append(tdNombre);


    //TD for color
    const tdColor = document.createElement("td");
    $(tdColor).html("<input type='color' value='"+pruebaJson[i].color+"'  onchange='setColor(\""+pruebaJson[i].id+"\",this.value)' />");
    $(tr).append(tdColor);

    //TD for actions
    const tdActions = document.createElement("td");
    $(tdActions).html("<button idVacaAsociado='"+pruebaJson[i].id+"' onclick='play(\""+pruebaJson[i].id+"\")' class='btn btn-md btn-success'>Play</button><button idVacaAsociado='"+pruebaJson[i].id+"' onclick='next(\""+pruebaJson[i].id+"\")' class='btn btn-md btn-info'>Next</button><button idVacaAsociado='"+pruebaJson[i].id+"' onclick='limpiar(\""+pruebaJson[i].id+"\")' class='btn btn-md btn-danger'>Limpiar</button>  <p id='"+pruebaJson[i].id+"'></p>");
    $(tr).append(tdActions);
    //$(div).append("<strong>Id:</strong> "+pruebaJson[i].id+" <strong>Nombre:</strong> "+pruebaJson[i].nombre+" <strong>Color:</strong> <input type='color'>");
    $(table).append(tr);
    setEstadoEnumeracionSpan(pruebaJson[i].id);
  }
}
function setColor(id,valor){
  const color = valor;
  for(let i=0;i<pruebaJson.length;i++){
    if(pruebaJson[i].id === id){
      pruebaJson[i].color = color;
    }
  }
}

function setEstadoEnumeracionSpan(idVaca){
  let cantidadPuntosDibujados = 0;
  $("span").each(function(){
    if(this.idAsociado === idVaca){
      ++cantidadPuntosDibujados;
    }
  });

  $("[id='"+idVaca+"']").html(cantidadPuntosDibujados+"/"+pruebaJson[getIndexFromJson(idVaca)].actividad.length);

}
function getIndexFromJson(idVaca){
  for(let i =0;i<pruebaJson.length;i++){
    if(pruebaJson[i].id === idVaca){
      return i;
    }
  }
}

function limpiar(id){

//  var dots = $('span');
  $("span").each(function(){
    if(this.idAsociado === id){
      $(this).remove();
    }
  })
  resetNumerosIteracion(id);
  setEstadoEnumeracionSpan(id);
}

function limpiarTodo(estado="mixto"){
  $("span").each(function(){
    if(this.className === "dot"){
      $(this).remove();
    }
  });

  for(let i=0;i<pruebaJson.length;i++){
    pruebaJson[i].actividad = [];
    detFunctionLoad(pruebaJson[i],estado);
    setEstadoEnumeracionSpan(pruebaJson[i].id);
  }
  resetNumerosIteracion();

}


function resetNumerosIteracion(id = null){
  if(id === null){
    for(let i=0;i<pruebaJson.length;i++){
      pruebaJson[i].numeroIteracion = 0;

    }
  }
  else{
    pruebaJson[getIndexFromJson(id)].numeroIteracion = 0;
  }

}


function disableInputs(bool,id,playAllBool){
//  $('#fechaDesde').attr('disabled',bool);

//  $('#metros').attr('disabled',bool);
  //$('#segundos').attr('disabled',bool);

  $("input").each(function(){
      $(this).attr('disabled',bool);

  });

  $("#playAllButton").attr('disabled',bool);
  $("#limpiarTodoButton").attr('disabled',bool);
  $("button").each(function(){
    if($(this).attr('idVacaAsociado') === id){

      $(this).attr('disabled',bool);
      if(!playAllBool){
        if($(this).html() == "Next"){
          $(this).attr('disabled',false);
        }
      }
    }
  });

}

function detFunctionLoad(resultado,estado){
  switch(estado){
    case 'mixto':
      setActividad(resultado.actividadCompleta,resultado.id);
      break;

    case 'time':
      setActividadPorTiempo(resultado.actividadCompleta,resultado.id);
      break;

    case 'distancia':
      setActividadPorDistancia(resultado.actividadCompleta,resultado.id);
      break;

    default:
      break;
  }
}
