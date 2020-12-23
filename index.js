// variables del proyecto
let bolas = [];
let bolasEliminadas = 0;

/* iniciamos la aplicación al cargar el DOM */
$(function () {
  iniciarAppArbol();
});

/**
 * método de inicio de la aplicacion
 */
function iniciarAppArbol() {

  // creamos los listeners para los botones
  $("#btn-sacudir").on("click", function (e) {
    // llamamos a la función moverArbol
    moverArbol();
  });

  $("#btn-adorno").on("click", function (e) {
    // llamamos a la función nueva bola al hacer click
    nuevaBola();
    // debug: creamos 10 bolas para ahorrar clicks
    /*  for (let i = 0; i < 10; i++) {
       nuevaBola();
     } */
  });

  // actualizamos los datos actuales
  actualizarEstadistica();
}

/**
 * Método para crear una bola nueva al pulsar el botón
 */
function nuevaBola() {
  // seleccionamos el elemento DOM de punto de inicio de la bola
  const bCont = $("#bc");
  // asignamos un id a la nueva bola en base al tamaño del array
  const idx = bolas.length;
  const currId = "bola" + idx;
  //generamos una la posición X aleatoria 
  const posX = crearNumAleatorio(40, 340);
  //generamos una posición Y donde caer la bola en base a la pos X
  const posY = generarPosYAleatoria(posX);
  //generamos html con estilo inline dinámico, color, tamaño aleatorios
  const bola = '<div id="' + currId + '" style="' + crearEstiloBola(posX) + '"></div>';
  /* 
  comprobamos si el arreglo bolas está vacio y añadimos nuevo html, 
  así eliminamos del dom las bolas existentes si las hemos tirado antes
  */
  if (bolas.length === 0) {
    bCont.html(bola);
  } else {
    bCont.append(bola);
  }
  // añadimos el id de la bola al array
  bolas.push(idx);
  // nos queda comenzar la animación para que caiga y duración aleatoria entre 100 y 500 ms
  animar(currId, posY, crearNumAleatorio(100, 500));
  // actualizamos el texto de los datos
  actualizarEstadistica();
}

/**
 * método para animar una bola
 * @param int id de la bola a desplazar
 * @param int posY a desplazar
 * @param int duracion Opcional, duración de la animación
 */
function animar(currId, posY, duracion = 400) {

  const tmp = {
    top: posY + 'px'
  };
  // usamos la función animate de jQuery, 
  $('#' + currId).animate(tmp, duracion);
}

/**
 * método para actualizar los datos de la app
 */
function actualizarEstadistica() {
  const datos = "Bolas creadas: " + bolas.length + " - Eliminadas: " + bolasEliminadas;
  $("#datos").html(datos);
}

/**
 * Método que hace el efecto de sacudir el arbol
 */
function moverArbol() {
  // comprobamos si no hay bolas y cierro
  if (bolas.length === 0) {
    return;
  }
  // lanzamos el evento para animar las bolas al suelo
  tirarBolas();
  // asignamos las clases pertinentes
  $("#btn-sacudir").prop("disabled", true);
  $("div[id^='bola'], .arbol").addClass("menear-arbol");
  // añadimos un tiempo para eliminar disabled a botón y quitar la clase menear al árbol
  setTimeout(function () {
    $(".arbol").removeClass("menear-arbol");
    $("#btn-sacudir").prop("disabled", false);
  }, 1500);

}

/**
 * Método para animar las bolas al suelo, usamos un intervalo para hacer que caigan
 * mientras el arbol se mueve, así la experiencia visual mejora ya que no caen a la vez. 
 * 
 */
function tirarBolas() {
  const frames = bolas.length;
  let pos = 0;
  // calculamos el tiempo de 600 ms / las bolas existentes para ajustar el tiempo de cada intervalo
  const to = 600 / frames;
  const id = setInterval(frame, to);
  // usamos una funcion para hacer el frame por bola
  function frame() {
    if (pos == frames) {
      // al terminar eliminamos el intervalo y eliminamos las bolas    
      clearInterval(id);
      eliminarBolas();
    } else {
      animar("bola" + bolas[pos++], 400, crearNumAleatorio(100, 300));
    }
  }
}

/**
 * Método para eliminar las bolas que se encuentran en un arbol
 */
function eliminarBolas() {
  // recorremos el arreglo de bolas, hacemos un fadeOut de jQ 200ms
  bolas.forEach(function (b) {
    $("#bola" + b).fadeOut(200);
  })
  // finalmente limpiamos el array de las bolas
  bolasEliminadas += bolas.length;
  bolas = [];
  // actualizamos el texto de los datos
  actualizarEstadistica();
}

/**
 * Método para crear un número aleatorio entre dos valores
 * @param int min - valor mínimo por defecto 1
 * @param int max - valor máximo por defecto 10
 * @returns int Numero aleatorio - entre los valores min y max
 */
function crearNumAleatorio(min = 1, max = 10) {
  // comprobamos si el valor max es <= que min y devolvemos 0
  if (max <= min) {
    return 0;
  }
  // retornamos un número entero aleatorio entre un min y un máximo dados
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Método que crea un estilo personalizado a cada nueva bola
 * @param int posicion X de inicio 
 * @return string - css para añadir inline al div bola
 */
function crearEstiloBola(posX) {
  // creamos un tamaño aleatorio para cada bola entre 1 y 2 em
  const tamano = crearNumAleatorio(12, 20) / 10;

  // generamos un color aleatorio para cada bola  
  const rgb = colorRgbAleatorio();

  // creamor el estilo inline usando backticks
  let estilo = `
          left: ${posX}px;  
          height: 0px;        
          width: ${tamano}rem;
          height: ${tamano}rem;
          background-color: ${rgb};
          border-radius: 100%; 
          position: absolute;
          z-index: 10;`;

  // retornamos el estilo
  return estilo;
}

/**
 * método que crea un color RGB en base a 3 numeros aleatorios entre 0 y 255
 * @return string - RGB para insertar a un css
 */
function colorRgbAleatorio() {
  // creamos un string rgb CSS con tres numeros aleatorios
  let c = "rgb(";
  c += crearNumAleatorio(0, 255) + ", ";
  c += crearNumAleatorio(0, 255) + ", ";
  c += crearNumAleatorio(0, 255) + ")";
  // retornamos el string generado
  return c;
}

/** 
 * Método para generar una posición Y en el arbol, dependiendo de la posición X aleatoria
 * con el fin que caiga la bola siempre en contacto con el árbol
 * establecemos 6 bloques... se puede ajustar aún más, pero es suficientemente funcional con 6 alturas
 * @param int - Posición X de la bola 
 * @return int - Posición Y en base a la posición X
 */
function generarPosYAleatoria(posX) {

  switch (true) {
    case (posX >= 170 && posX <= 226):
      return crearNumAleatorio(55, 350);

    case (posX >= 133 && posX <= 260):
      return crearNumAleatorio(110, 350);

    case (posX >= 120 && posX <= 280):
      return crearNumAleatorio(155, 350);

    case (posX >= 100 && posX <= 310):
      return crearNumAleatorio(220, 350);

    case (posX >= 80 && posX <= 325):
      return crearNumAleatorio(265, 350);

    case (posX >= 40 && posX <= 360):
      return crearNumAleatorio(325, 350);
  }
}