let button,
  entradaM,
  entradaK1,
  entradaK2,
  entradaK3,
  entradaVel,
  entradaX0,
  masa,
  simular = false,
  timer = 0.01667,
  t = 0;
var valorK1 = 1,
  valorK2 = 1,
  valorK3 = 1,
  valorM = 1,
  valorA1 = 0,
  valorA2 = 0,
  valorB1 = 0,
  valorB2 = 0,
  W10 = 0,
  W20 = 0;
let resorteIzquierdo;
let resorteIntermedio;
let resorteDerecho;
let cubo1;
let cubo2;
let paredIzq;
let paredDer;
let suelo;

let ejeX1 = [];
let ejeX2 = [];
//let ejeyV = [];
//let ejeyA = [];
let ejeT = [];

let toggleButton;
let paused = false;
// Supongamos que tienes tus datos ya llenos en ejey, ejeyV, ejeyA y ejex

// Crear trazas para Plotly
let tracePosicion1 = {
  x: ejeT,
  y: ejeX1,
  mode: "lines",
  name: "Posición X1 (m)",
  line: {
    color: "rgb(1, 148, 254)",
  },
};
let tracePosicion2 = {
  x: ejeT,
  y: ejeX2,
  mode: "lines",
  name: "Posición X2 (m)",
  line: {
    color: "rgb(199,21,133)",
  },
};
/*
let traceVelocidad = {
  x: ejex,
  y: ejeyV,
  mode: "lines",
  name: "Velocidad",
  line: {
    color: "rgb(6, 224, 173)",
  },
};

let traceAceleracion = {
  x: ejex,
  y: ejeyA,
  mode: "lines",
  name: "Aceleración",
  line: {
    color: "rgb(241, 10, 10)",
  },
};
*/
// Definir datos
let data = [tracePosicion1, tracePosicion2]; //traceVelocidad, traceAceleracion];

// Definir diseño del gráfico
let layout = {
  title: "Gráficas en función del tiempo",
  xaxis: {
    title: "Tiempo",
  },
  yaxis: {
    title: "Valor",
  },
};

// Crear el gráfico con Plotly
var chart = Plotly.newPlot("Migrafica", data, layout, {
  displayModeBar: false,
});

function preload() {
  resorteIzquierdo = loadImage("Imagenes/resorte izquierdo.png"); // Ruta de tu imagen
  resorteIntermedio = loadImage("Imagenes/resorte intermedio.png"); // Ruta de tu imagen
  resorteDerecho = loadImage("Imagenes/resorte derecho.png"); // Ruta de tu imagen
  paredIzq = loadImage("Imagenes/paredIzq.png");
  paredDer = loadImage("Imagenes/paredDer.png");
  suelo = loadImage("Imagenes/suelo.png");
  cubo1 = loadImage("Imagenes/masa1.png");
  cubo2 = loadImage("Imagenes/masa2.png");
}

function setup() {
  createCanvas(ResX, ResY);
  botonesControl();
  sliderEntrada();
}
//----------------------------------------------
function botonesControl() {
  button = createButton("Simular");
  button.position(Xmax - 400, 70);
  button.mousePressed(() => {
    if (
      valorX10 !== 0 ||
      valorX20 !== 0 
    ) {
      //ValorV0 !== 0) && valorFo === 0) || valorFo > 0) {
      simular = true;
    }
  });
  stop = createButton("Reiniciar");
  stop.position(Xmax - 490, 70);
  stop.mousePressed(() => window.location.reload());

  toggleButton = document.getElementById("toggleButton");
  toggleButton.addEventListener("click", toggleSimulation);
}

function toggleSimulation() {
  paused = !paused; // Toggle the paused state
  // Change the button text based on the paused state
  let toggleButton = document.getElementById("toggleButton");
  if (paused) {
    toggleButton.textContent = "Reanudar";
    inhabilitarControles();
  } else {
    toggleButton.textContent = "Pausar";
    habilitarControles();
  }
}

function inhabilitarControles() {
  entradaM.attribute("disabled", true);
  entradaK1.attribute("disabled", true);
  entradaK2.attribute("disabled", true);
  entradaK3.attribute("disabled", true);
  entradaVel.attribute("disabled", true);
  entradaX10.attribute("disabled", true);
  entradaX20.attribute("disabled", true);
}

function habilitarControles() {
  entradaM.removeAttribute("disabled");
  entradaK1.removeAttribute("disabled");
  entradaK2.removeAttribute("disabled");
  entradaK3.removeAttribute("disabled");
  entradaVel.removeAttribute("disabled");
  entradaX10.removeAttribute("disabled");
  entradaX20.removeAttribute("disabled");
}

function sliderEntrada() {
  //----------------------------------------------
  // Creacion de slider de masa
  entradaM = select("#entradaM");
  entradaM.input(reiniciarSimulacion);
  //----------------------------------------------
  // Creacion de slider de constante k1
  entradaK1 = select("#entradaK1");
  entradaK1.input(reiniciarSimulacion);
  // Creacion de slider de constante k2
  entradaK2 = select("#entradaK2");
  entradaK2.input(reiniciarSimulacion);
  // Creacion de slider de constante k3
  entradaK3 = select("#entradaK3");
  entradaK3.input(reiniciarSimulacion);
  //----------------------------------------------
  // Creacion de slider de posicion inicial 1
  entradaX10 = select("#entradaX10");
  entradaX10.input(reiniciarSimulacion);
  //----------------------------------------------
  // Creacion de slider de posicion inicial 2
  entradaX20 = select("#entradaX20");
  entradaX20.input(reiniciarSimulacion);
  // Creacion de slider de velocidad
  entradaVel = select("#entradaVel");
}
function reiniciarSimulacion() {
  simular = false;
  t = 0;
  reiniciarGrafico();
}

// Función para reiniciar el gráfico
function reiniciarGrafico() {
  // Vaciar los arrays de datos
  ejeT = [];
  ejeX1 = [];
  ejeX2 = [];
  //ejeyV = [];
  //ejeyA = [];

  // Actualizar las trazas en Plotly con ejes vacíos
  Plotly.restyle("Migrafica", "x", [[]]);
  Plotly.restyle("Migrafica", "y", [[], []]);
}

function obtener() {
  //toma el valor ingresado por el slider y lo almacena en una variable
  valorM = entradaM.value();
  valorK1 = entradaK1.value();
  valorK2 = entradaK2.value();
  valorK3 = entradaK3.value();
  valorX10 = entradaX10.value();
  valorX20 = entradaX20.value();
  timer = entradaVel.value();

  W10 = sqrt(
    (valorK1 +
      2 * valorK2 +
      valorK3 -
      sqrt(pow(2 * valorK2, 2) + pow(valorK3 - valorK1, 2))) /
      (2 * valorM)
  );
  W20 = sqrt(
    (valorK1 +
      2 * valorK2 +
      valorK3 +
      sqrt(pow(2 * valorK2, 2) + pow(valorK3 - valorK1, 2))) /
      (2 * valorM)
  );

  document.getElementById("masaValue").innerText = "Masa(Kg): " + valorM;
  document.getElementById("k1Value").innerText =
    "Constante K\u2081(N/m): " + valorK1;
  document.getElementById("k2Value").innerText =
    "Constante K\u2082(N/m): " + valorK2;
  document.getElementById("k3Value").innerText =
    "Constante K\u2083(N/m): " + valorK3;
  document.getElementById("velocidadValue").innerText =
    "Velocidad de reproducción: " + timer;
  document.getElementById("X10Value").innerText = "X1\u2080(m): " + valorX10;
  document.getElementById("X20Value").innerText = "X2\u2080(m): " + valorX20;
}
//----------------------------------------------

function draw() {
  if (!paused) {
    obtener();
    entorno();

    // condicional que controla cuando se ejecutara el programa
    if (simular) {
      movimiento();
    } else {
      simular = false;
      acomodarPosicionInicial();
    }
  }
}

function entorno() {
  // diseño de todo el entorno del programa
  background(255);
  image(suelo, Xmin, PosSuelo, PisoW, PisoH);
  image(paredIzq, Xmin, PosSuelo - MuroH, MuroW, MuroH);
  image(paredDer, Xmax - MuroW, PosSuelo - MuroH, MuroW, MuroH);
  line(MuroW + ResorW + 25, Ymax - 50, MuroW + ResorW + 25, Ymax - 75);
  fill(0); // Establece el color de relleno del texto a negro
  stroke(0); // Establece el color del contorno del texto a negro
  line(
    MuroW + 2 * ResorW + Cuadrado + 25,
    Ymax - 50,
    MuroW + 2 * ResorW + Cuadrado + 25,
    Ymax - 75
  );
  fill(0); // Establece el color de relleno del texto a negro
  stroke(0); // Establece el color del contorno del texto a negro
  textSize(30);
  text("Simulación dos masas", Xmax / 2 - 100, 30);
  textSize(20);
  text("ω1\u2080 =" + W10.toFixed(2) + " rad/seg", bordTxtX, bordTxtY - 40);
  text("ω2\u2080 =" + W20.toFixed(2) + " rad/seg", bordTxtX, bordTxtY - 10);
}
//----------------------------------------------
function acomodarPosicionInicial() {
  image(
    cubo1,
    valorX10 * multiplicador + (MuroW + ResorW),
    PosSuelo - Cuadrado,
    Cuadrado,
    Cuadrado
  );
  image(
    cubo2,
    valorX20 * multiplicador + (MuroW + 2 * ResorW + Cuadrado),
    PosSuelo - Cuadrado,
    Cuadrado,
    Cuadrado
  );
  image(
    resorteIzquierdo,
    MuroW,
    PosSuelo - ResorH - 5,
    ResorW + valorX10 * multiplicador,
    ResorH
  );
  image(
    resorteIntermedio,
    valorX10 * multiplicador + (MuroW + ResorW + Cuadrado),
    PosSuelo - ResorH - 5,
    (valorX20 - valorX10) * multiplicador + ResorW,
    ResorH
  );
  image(
    resorteDerecho,
    valorX20 * multiplicador + (MuroW + 2 * (ResorW + Cuadrado)),
    PosSuelo - ResorH - 5,
    ResorW - valorX20 * multiplicador,
    ResorH
  );
}
function movimiento() {
  armonico();
}

function armonico() {
  //dibuja la masa o cuadrado , y controla su movimiento
  //calculo de variables

  const r1 =
    valorK2 /
    valorM /
    ((valorK1 + valorK2) / valorM -
      (valorK1 +
        2 * valorK2 +
        valorK3 -
        sqrt(pow(2 * valorK2, 2) + pow(valorK3 - valorK1, 2))) /
        (2 * valorM));
  const r2 =
    valorK2 /
    valorM /
    ((valorK1 + valorK2) / valorM -
      (valorK1 +
        2 * valorK2 +
        valorK3 +
        sqrt(pow(2 * valorK2, 2) + pow(valorK3 - valorK1, 2))) /
        (2 * valorM));
  valorA1 = (valorX10 - r2 * valorX20) / (1 - r2 / r1);
  valorA2 = valorX10 - valorA1;
  valorB1 = valorA1 / r1;
  valorB2 = valorA2 / r2;

  const X1t = valorA1 * cos(W10 * t) + valorA2 * cos(W20 * t);
  const X2t = valorB1 * cos(W10 * t) + valorB2 * cos(W20 * t);

  //const Vt = -valorA * W0 * sin(W0 * t + Fase);
  //const At = -valorA * pow(W0, 2) * cos(W0 * t + Fase);
  /*
  let multiplicadorSobre = multiplicador;
  if (Math.abs(Xt) > 2.5) {
    multiplicadorSobre =
      ((ResX - MuroW - MuroW) / 2 - multiplicador * 0.2) / Math.abs(Xt);
  }
*/
  image(
    cubo1,
    X1t * multiplicador + (MuroW + ResorW),
    PosSuelo - Cuadrado,
    Cuadrado,
    Cuadrado
  );
  image(
    cubo2,
    X2t * multiplicador + (MuroW + 2 * ResorW + Cuadrado),
    PosSuelo - Cuadrado,
    Cuadrado,
    Cuadrado
  );
  image(
    resorteIzquierdo,
    MuroW,
    PosSuelo - ResorH - 5,
    ResorW + X1t * multiplicador,
    ResorH
  );
  image(
    resorteIntermedio,
    X1t * multiplicador + (MuroW + ResorW + Cuadrado),
    PosSuelo - ResorH - 5,
    (X2t - X1t) * multiplicador + ResorW,
    ResorH
  );
  image(
    resorteDerecho,
    X2t * multiplicador + (MuroW + 2 * (ResorW + Cuadrado)),
    PosSuelo - ResorH - 5,
    ResorW - X2t * multiplicador,
    ResorH
  );
  text(
    "X1(t)= " +
      valorA1.toFixed(2) +
      "cos(" +
      W10.toFixed(2) +
      "t)" +
      formatearNumero(valorA2) +
      "cos(" +
      W20.toFixed(2) +
      "t)",
    bordTxtX ,
    270
  );
  text(
    "X2(t)= " +
      valorB1.toFixed(2) +
      "cos(" +
      W10.toFixed(2) +
      "t)" +
      formatearNumero(valorB2) +
      "cos(" +
      W20.toFixed(2) +
      "t)",
    bordTxtX ,
    300
  );

  //let T = (2 * PI) / W0;

  agregarDatos(t, X1t, X2t);
  t += timer;
  //text("T =   " + T.toFixed(2) + "seg", bordTxtX + 300, bordTxtY + 30);
  text("X1(t) = " + X1t.toFixed(2) + " m", bordTxtX, bordTxtY + 70);
  text("X2(t) = " + X2t.toFixed(2) + " m", bordTxtX, bordTxtY + 40);

  text("r1 = " + r1.toFixed(2), bordTxtX, bordTxtY + 240);
  text("r2 = " + r2.toFixed(2), bordTxtX, bordTxtY + 270);
  //text("V(t) = " + Vt.toFixed(2) + " m/seg", bordTxtX, bordTxtY + 30);
  //text("A(t) = " + At.toFixed(2) + " m/seg²", bordTxtX, bordTxtY + 60);
}

function formatearNumero(numero) {
  if (numero >= 0) {
    return "+" + numero.toFixed(2);
  } else {
    return numero.toFixed(2);
  }
}
// Función para agregar datos a las gráficas en Plotly
function agregarDatos(xTiempo, x1Posicion, x2Posicion) {
  /*if (xTiempo > 5) {
    // Eliminar el primer valor de cada arreglo de datos
    ejeT.shift();
    ejeX1.shift();
    ejeX2.shift();
    //ejeyV.shift();
    //ejeyA.shift();
    // Actualizar el gráfico en Plotly con los datos actualizados
    Plotly.restyle("Migrafica", "x", [ejeT]);
    Plotly.restyle("Migrafica", "y", [x1Posicion, x2Posicion]);
  }*/
  // Agregar nuevos datos a los arrays
  ejeT.push(xTiempo);
  ejeX1.push(x1Posicion);
  ejeX2.push(x2Posicion);
  //ejeyV.push(yVelocidad);
  //ejeyA.push(yAceleracion);

  // Actualizar las trazas en Plotly
  Plotly.extendTraces(
    "Migrafica",
    {
      x: [[xTiempo]],
      y: [[x1Posicion]],
    },
    [0]
  ); // Actualizar traza de posición

  Plotly.extendTraces(
    "Migrafica",
    {
      x: [[xTiempo]],
      y: [[x2Posicion]],
    },
    [1]
  ); // Actualizar traza de velocidad
}
