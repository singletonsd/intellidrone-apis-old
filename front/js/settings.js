var arregloVacasOwned = [];
var userId = sessionStorage.getItem("UserID");
$(document).ready(function(){
  getVacasHTTP();

});

function getVacasHTTP(){
  $.getJSON('http://localhost:3000/api/vacas/'+userId,function(result){
    arregloVacasOwned = result;
    console.log(arregloVacasOwned)
    populateTable(result);
  });
}

function populateTable(array){
  $("#vacas-owned tbody").html("");
  for(let i=0;i<array.length;i++){
    let id = array[i]._id;
    let nombre = array[i].nombre;
    let sexo = array[i].sexo;
    let editar = "<button class='btn btn-md btn-info'>Editar</button>";
    let eliminar = "<button onclick='deleteVaca(\""+id+"\")' class='btn btn-md btn-danger'>Eliminar</button>";
    $("#vacas-owned").append("<tr><td>"+id+"</td><td>"+nombre+"</td><td>"+sexo+"</td><td>"+editar+" "+eliminar+"</td></tr>");

  }

}

$("#boton-submit-change-coordinates").click(function(e){
  e.preventDefault();
  var formData = JSON.stringify({"longitud":$("#longitud-campo-input").val(),"latitud":$("#latitud-campo-input").val(),"usuario":userId});
  $.ajax({
    url:'http://localhost:3000/api/users/setCoordinates',
    dataType:'json',
    data:formData,
    contentType: 'application/json',
    method:'POST',
    success:function(response){
      alert(response);
      sessionStorage.setItem("latitudCampo",$("#latitud-campo-input").val());
      sessionStorage.setItem("longitudCampo",$("#longitud-campo-input").val());
    },
    error:function(err){
      alert(err);
    }

  })

});

$("#boton-submit-new-vaca-form").click(function(e){
//  alert("hols");
  e.preventDefault();
  let idVaca = $("#id-vaca-input").val();
  let sexo = $("#sexo-vaca-select").val();
  let nombre = $("#nombre-vaca-input").val();
  var formData = JSON.stringify({"id":idVaca,"sexo":sexo,"nombre":nombre,"userID":userId});
  $.ajax({
    url:'http://localhost:3000/api/vacas',
    dataType:'json',
    data:formData,
    contentType: 'application/json',
    method:'POST',
    success:function(response){
      alert(response);
      getVacasHTTP();
    },
    error:function(err){
      alert(err);
    }

  })

});

function deleteVaca(id){
  $.ajax({
    url:'http://localhost:3000/api/vacas/delete/'+id,

    method:'GET',
    success:function(response){
      alert(response);
      getVacasHTTP();
    },
    error:function(err){
      alert(err);
    }

  })
}
