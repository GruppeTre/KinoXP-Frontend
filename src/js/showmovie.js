import {apiRequest} from "./module/apiRequest.js";

console.log("jeg er i show-movie")

let movie;
let showings;

const moviePoster = document.getElementById("moviePoster");
const movieTitle = document.getElementById("movieTitle");
const movieDescription = document.getElementById("movieDescription");
const movieDirector = document.getElementById("movieDirector");
const moviePremiere = document.getElementById("moviePremiere");
const movieRating = document.getElementById("movieRating");
const movieGenre = document.getElementById("movieGenre");

const showingList = document.getElementById("showingList");





async function fetchMovieById(){
    console.log("starter getSpecificMovie");

    const params = new URLSearchParams(window.location.search);
    const movieId = params.get("id");

    console.log("vi finder movieId"+ movieId );

    const url = "http://localhost:8080/movie/" + movieId;

    console.log("vi kalder backend url" + url);



    movie = await apiRequest(url);

    console.log("vi henter movie" , movie);

    showMovie();
    await fetchShowingByMovieId(movieId);
}

/**/

async function fetchShowingByMovieId(movieId){

    const url = "http://localhost:8080/booking/showing?movieId=" + movieId;

    console.log("vi finder url" + url );

    showings = await apiRequest(url);

    console.log("vi henter showings", showings);

    showShowings()
}


function showMovie() {

    console.log("Vi viser showMovie");

    movieTitle.textContent = movie.title;
    movieDescription.textContent = movie.description;
    movieDirector.textContent = movie.director;
    moviePremiere.textContent = movie.premiere;
    movieRating.textContent = movie.rating.name;

    moviePoster.src = movie.imgHref;
    moviePoster.alt = movie.title + "Plakat"

    if(movie.genres){
        movieGenre.textContent = movie.genres.map(function(genre){
            return genre.name;
        }).join(", ")
    }
}



function showShowings(){

    console.log("viser showing");

    showingList.innerHTML = "";
    let lastDate = "";
    let dateColumn;

    showings.sort(function(a,b){
        return new Date(a.time) - new Date(b.time);
    })
    console.log("showing efter sortering", showings)

    showingList.classList.add("showing-grid");

    showings.forEach(function(showing){

        console.log("behandling af showing", showing)

        const dateTime = showing.time.split("T");
        const date = dateTime[0];
        const time = dateTime[1].substring(0, 5);

        console.log("dato", date, "tid", time)

        if(date !== lastDate){

            console.log("ny dato fundet", date);

            dateColumn = document.createElement("div");

            const dateHeader = document.createElement("h3");
            dateHeader.textContent = date;
            dateColumn.appendChild(dateHeader);
            dateColumn.classList.add("date-column");
            showingList.appendChild(dateColumn);

            lastDate = date;
        }

        console.log("viser showing", showing);

        const showingButton = document.createElement("button");

        console.log("opretter knapper med tid", time)

        showingButton.textContent = time;

        showingButton.addEventListener("click", function(){
            window.location.href = `ticketSelect.html?showingId=${showing.id}`;
        })
        dateColumn.appendChild(showingButton);
    })
}

fetchMovieById();


