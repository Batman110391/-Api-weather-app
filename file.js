/* Dichiarazione delle variabili necessarie */
let input_city = document.getElementById('input-city');
let first_city = document.getElementById('first-city');
let first_city_description = document.getElementById('first-city-description');
let first_city_gradi = document.getElementById('first-city-gradi');
let first_moment = document.getElementById('first-moment');
let first_ora = document.getElementById('first-ora');
let first_city_date = document.getElementById('first-city-date');
let first_card = document.getElementById('first-card');

 /* card  group */
 let card_date = document.getElementsByClassName('card-date');
 let card_gradi_min = document.getElementsByClassName('card-gradi-min');
 let card_gradi_max = document.getElementsByClassName('card-gradi-max');
 let card_desc = document.getElementsByClassName('card-desc');
 let card_img = document.getElementsByClassName('card');

let key = 'c3ad6f2161d9bb80af798abe7a163c18';

let comuni = [];

let first_card_img = {
    
    desc: ["broken clouds", "clear sky", "few clouds", "mist", "rain", 
           "scattered clouds", "shower rain", "snow", "thunderstorm", "light rain", "overcast clouds" ],

    night: ["./img/night/broken clouds.jpg", "./img/night/clear sky.jpg", "./img/night/few clouds.jpg"
            , "./img/night/mist.jpg", "./img/night/rain.jpg", "./img/night/scattered clouds.jpg", 
            "./img/night/shower rain.jpg", "./img/night/snow.jpg", "./img/night/thunderstorm.jpg", "./img/night/light rain.jpg",
             "/img/night/overcast clouds.jpg"],

    day  : ["./img/day/broken clouds.jpg", "./img/day/clear sky.jpg", "./img/day/few clouds.jpg"
            , "./img/day/mist.jpg", "./img/day/rain.jpg", "./img/day/scattered clouds.jpg", 
            "./img/day/shower rain.jpg", "./img/day/snow.jpg", "./img/day/thunderstorm.jpg", "./img/day/light rain.jpg",
             "/img/day/overcast clouds.jpg"],
};


//metodo Fetch

fetch("./comuni.json").then(response => {
    if (response.ok) {
       return response.json();

    }else if (response.status === 404) {
       console.log("Richiesta errata");
    }

 }).then(nomi => {
    for (let i = 0; i< nomi.length; i++){
        comuni.push(nomi[i].nome); 
    }
    
 }).catch(error => console.log(error))

//Promise--------------------

function MappaCity(){

    let country = 'IT';
    let baseURL = 'http://api.openweathermap.org/data/2.5/weather?q='+input_city.value+','+country+'&appid='+key;

    var lon, lat, nome;


    fetch(baseURL).then(response => {
        if (response.ok) {
           return response.json();
    
        }else if (response.status === 404) {
           console.log("Richiesta errata");
        }
    
     }).then(nomi => {
        nome = nomi.name;
        lon = nomi.coord.lon;
        lat = nomi.coord.lat;
        CaricaMeteo(lon, lat, nome)
     }).catch(error => console.log(error))

     
}



function CaricaMeteo(lon, lat, nome){

    let baseURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=hourly&appid=' + key;

    fetch(baseURL).then(response => {
        if (response.ok) {
            return response.json();

        } else if (response.status === 404) {
            console.log("Richiesta errata");
        }

    }).then(nomi => {
        CaricaDati(nomi.daily, nome);
    }).catch(error => console.log(error))
}

//----------------------------------------------------------|

function CaricaDati(dati, nome){

    let days = new Date();
    var currentHours = days.getHours();
    var ampm = currentHours >= 12 ? "PM" : "AM";
    var currentMinutes = days.getMinutes();
    currentHours = ("0" + currentHours).slice(-2);
    currentMinutes = ("0" + currentMinutes).slice(-2);


    first_city.textContent = nome;
    first_city_description.textContent = dati[0].weather[0].description;
    first_city_gradi.textContent = parseInt(dati[0].temp.day) - 273 + "°";
    first_city_date.textContent = days.toDateString();
    first_ora.textContent = currentHours + ":" + currentMinutes;
    first_moment.textContent = ampm;

    for (var i = 0; i < 4; i++) {
        days = new Date(dati[i].dt * 1000);
        card_date[i].textContent = days.getDate();
        card_gradi_min[i].textContent = parseInt(dati[i + 1].temp.min) - 273 + "°" + " Min";
        card_gradi_max[i].textContent = parseInt(dati[i + 1].temp.max) - 273 + "°" + " Max";
        card_desc[i].textContent = dati[i + 1].weather[0].description;
    }

    CaricaImg(dati, currentHours);
}

function CaricaImg(desc, momement){

    
    for (let i = 0; i<first_card_img.desc.length; i++){
        if (desc[0].weather[0].description === first_card_img.desc[i]  && parseInt(momement) < 18 && parseInt(momement) > 6){
            first_card.style.backgroundImage = "url('"+first_card_img.day[i]+"')";
        }else if (desc[0].weather[0].description === first_card_img.desc[i]){
            if(parseInt(momement) >= 18 || parseInt(momement) <= 6){
            first_card.style.backgroundImage = "url('"+first_card_img.night[i]+"')";
            }
        }
    }

    for (let i = 0; i<4; i++){
        for (let j= 0; j<first_card_img.desc.length; j++){
            if (desc[i+1].weather[0].description === first_card_img.desc[j]){
                card_img[i+1].style.backgroundImage = "url('"+first_card_img.day[j]+"')";
            }
        }
    }

}


//Autocomplete
let move = document.getElementsByClassName('autocomplete');
var focusedIndex = -1;

input_city.addEventListener('keyup', (event) =>{

    let genitore = event.target.parentNode;

    if (event.key === 'ArrowDown' && move.length > 0){
        focusedIndex++;
        if (focusedIndex > move.length-1) focusedIndex = move.length-1;

        $(move).removeClass("active-color");
        $(move[focusedIndex]).addClass("active-color");
    }else if(event.key === 'ArrowUp' && move.length > 0){
        focusedIndex--;
        if (focusedIndex < 0) focusedIndex = 0; 

        $(move).removeClass("active-color");
        $(move[focusedIndex]).addClass("active-color");
    }else if(event.key === 'Enter'  && move.length > 0){
        if(move[focusedIndex])
        input_city.value = move[focusedIndex].textContent;

        genitore.querySelector('.container-autocomplete').innerHTML = "";
        focusedIndex = -1;
        MappaCity();
    }else{

        let filtro_comuni = [];
        for (let i = 0; i< comuni.length; i++){
            if (event.target.value.toUpperCase() == comuni[i].substr(0, event.target.value.length).toUpperCase()){
                filtro_comuni.push(comuni[i]); 
            }
            if (filtro_comuni.length == 5){
                break;
            }
        }
        ArrayFilters(event, genitore, filtro_comuni);
    }

}); 

function ArrayFilters (e, parent, arr) {

    if (e.target.value.length > 1){
        focusedIndex = -1;
        parent.querySelector('.container-autocomplete').innerHTML = "";

        for (let i = 0; i<arr.length; i++){
            parent.querySelector('.container-autocomplete').innerHTML += "<div class='autocomplete'>"+arr[i]+"</div>";
        } 

    }else{
        parent.querySelector('.container-autocomplete').innerHTML = "";
    } 

}


