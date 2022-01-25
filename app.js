const valores = document.getElementById("valoresIniciales");
const btnCalcular =  document.getElementById("calcular");
const tabla = document.querySelector(".tabla");
const numeros = document.querySelector(".numeros");

Number.prototype.countDecimals = function () {
    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0;
}


const convertirANumeros = (valoresIniciales) => {
  let estado = valoresIniciales.match(/[-/+]?\d+(?:\.\d+)?/g);
  // let numeroTemporal = "";
  // valoresIniciales += " "; //Esto es para que se pueda agregar el ultimo dato
  // for(let i=0; i<valoresIniciales.length; i++){
  //   if(valoresIniciales[i].codePointAt() >= 48 && valoresIniciales[i].codePointAt() < 58  || valoresIniciales[i].codePointAt() === 46 )
  //     numeroTemporal += valoresIniciales[i];
  //   if(valoresIniciales[i].codePointAt() === 32 || valoresIniciales[i].codePointAt() === 10){
  //     arreglo.push(Number(numeroTemporal));
  //     numeroTemporal = "";
  //   }
  // }
    return estado;
};

const distribucionFrecuencias = (arregloNumeros) => {
  const n = arregloNumeros.length;
  const intervalo = Math.round(Math.sqrt(n));
  const maximo = Math.max(...arregloNumeros);
  const minimo = Math.min(...arregloNumeros);
  const decimales = arregloNumeros[0].countDecimals();
  let redondeoDecimal = Math.pow(10, -decimales);
  const amplitud = !decimales ? Math.round(((maximo - minimo) / intervalo)): parseFloat(((maximo - minimo) / intervalo).toFixed(decimales)) + redondeoDecimal;
  return {
    maximo : maximo,
    minimo : minimo,
    intervalo: intervalo,
    amplitud:  amplitud
  }
};

const calcularLimites = (intervalo, amplitud, maximo, minimo) => {
    let arreglo = [];
    arreglo.push(
      {
        limiteInferior: minimo,
        limiteSuperior: minimo + amplitud
      }
    );

    for(let i = 1; i<intervalo; i++){
      arreglo.push(
        {
          limiteInferior: arreglo[i-1].limiteSuperior,
          limiteSuperior: arreglo[i-1].limiteSuperior + amplitud
        }
      );
    }

    while(arreglo[arreglo.length - 1].limiteSuperior <= maximo){
      arreglo.push(
        {
          limiteInferior: arreglo[arreglo.length - 1].limiteSuperior,
          limiteSuperior: arreglo[arreglo.length - 1].limiteSuperior + amplitud
        }
      );
    }

    return arreglo;
}

const calcularFrecuencias = (arregloNumeros, limites) => {
  let arreglo = [];
  let coincidencias = 0;
    for(let i=0; i<limites.length; i++){
      for(let j=0; j<arregloNumeros.length; j++){
        if(arregloNumeros[j] >= parseFloat(limites[i].limiteInferior.toFixed(2)) && arregloNumeros[j] < parseFloat(limites[i].limiteSuperior.toFixed(2)))
          coincidencias++;
      }
      arreglo.push(coincidencias);
      coincidencias = 0;
    }
  return arreglo;
}

const calcularFrecuenciasAcumuladas = (frecuencias) => {
  let arreglo = [];
  arreglo.push(frecuencias[0]);

  for(let i=1; i<frecuencias.length; i++){
    arreglo.push(frecuencias[i] + arreglo[i - 1] )
  }

  return arreglo;
}

const calcularFrecuenciasRelativas = (frecuencias, n) => {
  let arreglo = [];
  let fa = 0;

  for(let i=0; i<frecuencias.length; i++){
    fa = (frecuencias[i] / n) * 100;
    arreglo.push(fa);
  }

  return arreglo;
}

const calcularFrecuenciasRelativasAcumuladas = (frecuenciasRelativas) => {
  let arreglo = [];
  arreglo.push(frecuenciasRelativas[0]);

  for(let i=1; i<frecuenciasRelativas.length; i++){
    arreglo.push(frecuenciasRelativas[i] + arreglo[i - 1] )
  }

  return arreglo;
}

const calcularMarcaDeClase = (limites, amplitud) => {
  let arreglo = [];
  let temp = (limites[0].limiteInferior + limites[0].limiteSuperior) / 2;
  arreglo.push(temp);

  for(let i=1; i<limites.length; i++){
    arreglo.push(arreglo[i-1] + amplitud)
  }

  return arreglo;
}

const calcularFrecuenciaPorMarcaDeClase = (frecuencias, marcaDeClase) => {
  let arreglo = [];

  for(let i=0; i<marcaDeClase.length; i++){
    arreglo.push(frecuencias[i] * marcaDeClase[i]);
  }

  return arreglo;
}

const calcularMedia = (frecuenciaPorMarcaDeClase, n) => {
  let temp = 0;
  frecuenciaPorMarcaDeClase.forEach((item, i) => {
      temp += item;
  });

  let media = temp / n;

  return media;
}

const calcularMediana = (n, limites, frecuencias, frecuenciasAcumuludas, amplitud) => {
  let CMe = n/2;
  let indice = 0;

  while(frecuenciasAcumuludas[indice] < CMe)
    indice++;

  let mediana = limites[indice].limiteInferior + amplitud * ((CMe - frecuenciasAcumuludas[indice - 1]) / frecuencias[indice]);
  return mediana;
}

const calcularModa = (limites, frecuencias, frecuenciasAcumuludas, amplitud) => {
  let indices = [], modas = [], maximo = 0;

  frecuencias.forEach((item, i) => {
      if(item > maximo)
        maximo = item;
  });

  frecuencias.forEach((item, i) => {
      if(item == maximo)
        indices.push(i);
  });

  indices.forEach((item, i) => {
    if(item > 0)
       modas.push(limites[item].limiteInferior + amplitud * ((frecuencias[item] - frecuencias[item-1]) / ((frecuencias[item] - frecuencias[item - 1]) + (frecuencias[item] - frecuencias[item + 1]))));
    if(item === 0)
       modas.push(limites[item].limiteInferior + amplitud * ((frecuencias[item]) / ((frecuencias[item]) + (frecuencias[item] - frecuencias[item + 1]))));
  });

  return modas;
}

const calcularfrecuenciaPorMarcaDeClaseMenosMediaAlCuadrado = (frecuencias, marcaDeClase, media) =>{
  let arreglo = [];

  frecuencias.forEach((item, i) => {
    let temp = frecuencias[i] *  Math.pow( (marcaDeClase[i] - media), 2);
    arreglo.push(temp);
  });

  return arreglo;
}

const calcularVarianza = (frecuenciaPorMarcaDeClaseMenosMediaAlCuadrado, n) => {
  let temp = 0;
  frecuenciaPorMarcaDeClaseMenosMediaAlCuadrado.forEach((item, i) => {
      temp += item;
  });

  let varianza = temp / (n - 1);

  return varianza;
}

const calcularVariacionEstandar = (varianza) => {

    return Math.sqrt(varianza);
}

const calcularCoeficienteDeVariacion = (variacionEstandar, media) => {
    return ( variacionEstandar / media ) * 100;
}

const calculosTablaFrecuencias = (n, intervalo, amplitud, maximo, minimo, arregloNumeros) => {
    let limites = [] = calcularLimites(intervalo, amplitud, maximo, minimo);
    let frecuencias = [] = calcularFrecuencias(arregloNumeros, limites);
    let frecuenciasAcumuludas = [] = calcularFrecuenciasAcumuladas(frecuencias);
    let frecuenciasRelativas = [] = calcularFrecuenciasRelativas(frecuencias, n);
    let frecuenciasRelativasAcumuludas = [] = calcularFrecuenciasRelativasAcumuladas(frecuenciasRelativas);
    let marcaDeClase = [] = calcularMarcaDeClase(limites, amplitud);
    let frecuenciaPorMarcaDeClase = [] = calcularFrecuenciaPorMarcaDeClase(frecuencias, marcaDeClase);
    let media = calcularMedia(frecuenciaPorMarcaDeClase, n);
    let mediana = calcularMediana(n, limites, frecuencias, frecuenciasAcumuludas, amplitud );
    let moda = [] = calcularModa(limites, frecuencias, frecuenciasAcumuludas, amplitud );
    let frecuenciaPorMarcaDeClaseMenosMediaAlCuadrado = [] = calcularfrecuenciaPorMarcaDeClaseMenosMediaAlCuadrado(frecuencias, marcaDeClase, media);
    let varianza = calcularVarianza(frecuenciaPorMarcaDeClaseMenosMediaAlCuadrado, n);
    let variacionEstandar = calcularVariacionEstandar(varianza);
    let coeficienteDeVariacion = calcularCoeficienteDeVariacion(variacionEstandar, media);

    let html = "";
    html += "<h2> Tabla de frecuencias </h2>";
    html += "<table border = 1>";
      html += "<tr>";
        html += "<th> Limite inferior - Limite superior </th>";
        html += "<th> f </th>";
        html += "<th> fa </th>";
        html += "<th> fr </th>";
        html += "<th> fra </th>";
        html += "<th> Xi </th>";
        html += "<th> fXi </th>";
        html += "<th> f(Xi - media ) ^ 2 </th>";
      html += "</tr>";

    limites.forEach((item, i) => {
      html += `
        <tr>
            <th> ${limites[i].limiteInferior.toFixed(2)}  -< ${limites[i].limiteSuperior.toFixed(2)} </th>
            <th> ${frecuencias[i].toFixed(2)} </th>
            <th> ${frecuenciasAcumuludas[i].toFixed(2)} </th>
            <th> ${frecuenciasRelativas[i].toFixed(2)} </th>
            <th> ${frecuenciasRelativasAcumuludas[i].toFixed(2)} </th>
            <th> ${marcaDeClase[i].toFixed(2)} </th>
            <th> ${frecuenciaPorMarcaDeClase[i].toFixed(2)} </th>
            <th> ${frecuenciaPorMarcaDeClaseMenosMediaAlCuadrado[i].toFixed(2)} </th>
        </tr>
      `
    });

    html += "</table>";

    html += `
    <h3> Amplitud = ${amplitud} <br> Intervalos:  ${arregloNumeros.length}</h3>
    <div class="contenedor">
      <div class="MTC">
        <h2> Medidas de tendencia central </h2>
        <h3> Media: ${media.toFixed(2)} </h3>
        <h3> Mediana: ${mediana.toFixed(2)} </h3>
    `;

  moda.forEach((item, i) => {
    html += `<h3>Moda ${i + 1}: ${item.toFixed(2)} </h3>`;
  });


    html += `
      </div>
      <div class="MD">
        <h2> Medidas de dispersion </h2>
        <h3> Varianza: ${varianza} </h3>
        <h3> Variacion estandar ${variacionEstandar}</h3>
        <h3> Coeficiente de variacion ${coeficienteDeVariacion.toFixed(2)}</h3>
      </div>
    </div>
    `;

    tabla.innerHTML = html;

    numerosOrdenados = arregloNumeros.sort(function(a, b){return a - b});

    html = "";
    html += "<h2> Numeros ordenados </h2>";
    html += "<table border=1>"
    html += "<tr>"
    numerosOrdenados.forEach((item, i) => {
      if(i % 10 != 0)
        html += `<th> ${item} </th>`;
      if(i % 10 === 0)
        html += `</th> <tr> <th> ${item} </th>`;
    });
    html += "</table>"
    numeros.innerHTML = html;

    // console.log(limites, frecuencias, frecuenciasAcumuludas, frecuenciasRelativas, frecuenciasRelativasAcumuludas, marcaDeClase, frecuenciaPorMarcaDeClase, media, mediana, moda);
}

btnCalcular.addEventListener("click", () => {
  const valoresIniciales = valores.value;
  const estado = valoresIniciales.match(/[-/+]?\d+(?:\.\d+)?/g);
  const arregloNumeros = estado.map(i=>Number(i))

  if(estado.length != null){
    if(arregloNumeros.length >= 30){
      const {maximo, minimo, intervalo, amplitud} = distribucionFrecuencias(arregloNumeros);
      // console.log("Maximo " + maximo, "Minimo " + minimo, "Intervalo " + intervalo, "Amplitud " + amplitud);
      calculosTablaFrecuencias(arregloNumeros.length, intervalo, amplitud, maximo, minimo, arregloNumeros);
    }
  if(estado.length < 30){
    tabla.innerHTML = "";
    numeros.innerHTML = "";
    valores.value = null;
    alert("Favor de cumplir con los requerimientos");
    }
  }
});

//
// 23 60 79 32 57 74 52 70 82 36 80 77 81 95 41 65 92 85
// 55 76 52 10 64 75 78 25 80 98 81 67 41 71 83 54 64 72
// 88 62 74 43 60 78 89 76 84 48 84 90 15 79 34 67 17 82
// 69 74 63 80 85 61
