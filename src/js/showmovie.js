import {apiRequest} from "./module/apiRequest.js";

console.log("jeg er i show-movie")

let movie;
let showings;

const movieTitel = document.getElementById("movieTitle");
const movieDescription = document.getElementById("movieDescription");
const movieDirector = document.getElementById("movieDirector");
const moviePremiere = document.getElementById("moviePremiere");

const showingList = document.getElementById("showingList");





async function getSpecificMovie(){

    const params = new URLSearchParams(window.location.search); //Vi læser det der står i browserens URL efter ?
    const movieId = params.get("id"); //derefter finder vi id på den film vi har vælgt,
    const url = "http://localhost:8080/movie/" + movieId;

    movie = await apiRequest(url); //Vi henter apiRequest hvor filmene bliver kaldt fra backend

    showMovie();
    getShowingTime(movieId);
}

function showMovie() {
    movieTitel.textContent = movie.title;
    movieDescription.textContent = movie.description;
    movieDirector.textContent = movie.director;
    moviePremiere.textContent = movie.premiere;
}

/* Vi henter specifikke showings (tidspunkter) til den specifikke film */

async function getShowingTime(movieId){

    const url = "http://localhost:8080/movie/" + movieId + "/showings";

    showings = await apiRequest(url);

    showShowing()
}

function showShowing(){

    showingList.innerHTML = "";

    showings.forEach(function(showing){

        const showingButton = document.createElement("button");

        showingButton.textContent = showing.time;

        showingButton.addEventListener("click", function(){
            actionChooseShowing(showing.id);

        })
        showingList.appendChild(showingButton);
    })

    function actionChooseShowing(showingId){
        console.log(showingId);
    }

}
getSpecificMovie()


