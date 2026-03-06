console.log("jeg er i show-movie")

const movie = {
    title: "Dune",
    imgHref: "kl",
    description: "Paul Atreides arrives on Arrakis after his father accepts the stewardship of the dangerous planet.",
    director: "Denis Villeneuve",
    premiere: 2024-12-12,
    rating: 15,
    genres: [action, fantasy]
}

document.getElementById("title").textContent = movie.title;
document.getElementById("description").textContent = movie.description;
document.getElementById("director").textContent = movie.director;
document.getElementById("premiere").textContent = movie.premiere;
document.getElementById("rating").textContent = movie.rating;
document.getElementById("genre").textContent = movie.genres;
document.getElementById("rating").textContent = movie.rating;
document.getElementById("genre").textContent = movie.genres;

/*function fetchAnyUrl(url){
    console.log("jeg er i fetch url=" + url)
    return fetch(url).then(response => response.json());
}*/


async function getSpecificMovie(){

    const params = new URLSearchParams(window.location.search); //Vi læser det der står i browserens URL efter ?
    const movieId = params.get("id"); //derefter finder vi id på den film vi har vælgt,
    const url = "http://localhost:8080/movie/showmovie/" + movieId;

    let movie = await fetchAnyUrl(url); //vi bruger await functionen, da vi har async, så den venter på at backend har sendt filmen tilbage

    document.getElementById("movieTitle").textContent = movie.title;
    document.getElementById("movieDescription").textContent = movie.description;

}

getSpecificMovie();

