const valores = document.getElementById("valoresIniciales");
const btnCalcular =  document.getElementById("calcular");
const tabla = document.querySelector(".tabla");

const validarValores = (valoresIniciales) => {
  let estado = 0;
  for(let i=0; i<valoresIniciales.length; i++){
    if(valoresIniciales[i].codePointAt() >= 48 && valoresIniciales[i].codePointAt() < 58  || valoresIniciales[i].codePointAt() === 32 ){
      estado = 1;
    }
    else{
      estado = 0;
    }
  }
  return estado;
};

const convertirANumeros = (valoresIniciales) => {
  let arreglo = [];
  let numeroTemporal = "";
  valoresIniciales += " "; //Esto es para que se pueda agregar el ultimo dato
  for(let i=0; i<valoresIniciales.length; i++){
    if(valoresIniciales[i].codePointAt() >= 48 && valoresIniciales[i].codePointAt() < 58  || valoresIniciales[i].codePointAt() === 46 )
      numeroTemporal += valoresIniciales[i];
    if(valoresIniciales[i].codePointAt() === 32 || valoresIniciales[i].codePointAt() === 10){
      arreglo.push(Number(numeroTemporal));
      numeroTemporal = "";
    }
  }
    return arreglo;
};

const distribucionFrecuencias = (arregloNumeros) => {
  const n = arregloNumeros.length;
  const intervalo = Math.round(Math.sqrt(n));
  const maximo = Math.max(...arregloNumeros);
  const minimo = Math.min(...arregloNumeros);
  const amplitud = Math.round((maximo - minimo) / intervalo);
  console.log("Maximo " + maximo, "Minimo " + minimo);
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
        if(arregloNumeros[j] >= limites[i].limiteInferior && arregloNumeros[j] < limites[i].limiteSuperior)
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
    arreglo.push(parseFloat(fa.toFixed(2)));
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
  let indice = 0;
  let moda = 0;

  frecuencias.forEach((item, i) => {
      if(item > frecuencias[indice])
        indice = i;
  });

  if(indice > 0)
     moda = limites[indice].limiteInferior + amplitud * ((frecuencias[indice] - frecuencias[indice-1]) / ((frecuencias[indice] - frecuencias[indice - 1]) + (frecuencias[indice] - frecuencias[indice + 1])));
  if(!indice)
     moda = limites[indice].limiteInferior + amplitud * ((frecuencias[indice]) / ((frecuencias[indice]) + (frecuencias[indice] - frecuencias[indice + 1])));

  return moda;
}

const calcularfrecuenciaPorMarcaDeClaseMenosMediaAlCuadrado = (frecuencias, marcaDeClase, media) =>{
  let arreglo = [];

  frecuencias.forEach((item, i) => {
    let temp = frecuencias[i] *  Math.pow( (marcaDeClase[i] - media), 2);
    arreglo.push(parseFloat(temp.toFixed(2)));
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
    let moda = calcularModa(limites, frecuencias, frecuenciasAcumuludas, amplitud );
    let frecuenciaPorMarcaDeClaseMenosMediaAlCuadrado = [] = calcularfrecuenciaPorMarcaDeClaseMenosMediaAlCuadrado(frecuencias, marcaDeClase, media);
    let varianza = calcularVarianza(frecuenciaPorMarcaDeClaseMenosMediaAlCuadrado, n);
    let variacionEstandar = calcularVariacionEstandar(varianza);
    let coeficienteDeVariacion = calcularCoeficienteDeVariacion(variacionEstandar, media);

    let html = "";
    html += "<h1> Tabla de frecuencias </h1>";
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
            <th> ${limites[i].limiteInferior}  -< ${limites[i].limiteSuperior} </th>
            <th> ${frecuencias[i]} </th>
            <th> ${frecuenciasAcumuludas[i]} </th>
            <th> ${frecuenciasRelativas[i]} </th>
            <th> ${frecuenciasRelativasAcumuludas[i]} </th>
            <th> ${marcaDeClase[i]} </th>
            <th> ${frecuenciaPorMarcaDeClase[i]} </th>
            <th> ${frecuenciaPorMarcaDeClaseMenosMediaAlCuadrado[i]} </th>
        </tr>
      `
    });

    html += "</table>";

    html += `
    <div class="MTC">
      <h3> Media: ${media.toFixed(2)} </h3>
      <h3> Mediana: ${mediana.toFixed(2)} </h3>
      <h3> Moda: ${moda.toFixed(2)} </h3>
    </div>
    `

    html += `
    <div class="MD">
      <h3> Varianza: ${parseFloat(varianza.toFixed(2))} </h3>
      <h3> Variacion estandar ${parseFloat(variacionEstandar.toFixed(2))}</h3>
      <h3> Coeficiente de variacion ${parseFloat(coeficienteDeVariacion.toFixed(2))}</h3>
    </div>
    `

    tabla.innerHTML = html;

    // console.log(limites, frecuencias, frecuenciasAcumuludas, frecuenciasRelativas, frecuenciasRelativasAcumuludas, marcaDeClase, frecuenciaPorMarcaDeClase, media, mediana, moda);
}

btnCalcular.addEventListener("click", () => {
  const valoresIniciales = valores.value;
  const estado = validarValores(valoresIniciales);

  if(estado){
    console.log("Todos son numeros");
    const arregloNumeros = convertirANumeros(valoresIniciales);
    if(arregloNumeros.length >= 30){
      console.log(arregloNumeros);
      const {maximo, minimo, intervalo, amplitud} = distribucionFrecuencias(arregloNumeros);
      console.log("Intervalo " + intervalo);
      console.log("Amplitud " + amplitud);
      calculosTablaFrecuencias(arregloNumeros.length, intervalo, amplitud, maximo, minimo, arregloNumeros)

    }
    if(arregloNumeros.length < 30)
      console.log("Disponga de una muestra grande si quiere continuar");
  }
  if(!estado)
    console.log("No todos son numeros");
});

//
// 23 60 79 32 57 74 52 70 82 36 80 77 81 95 41 65 92 85
// 55 76 52 10 64 75 78 25 80 98 81 67 41 71 83 54 64 72
// 88 62 74 43 60 78 89 76 84 48 84 90 15 79 34 67 17 82
// 69 74 63 80 85 61
