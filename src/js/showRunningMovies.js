import {apiRequest} from "./module/apiRequest.js";

const moviesSection = document.querySelector("section")

let movies = [];


function getGenreString(movie) {
    return movie.genres.map(g => g.name).join(", ");
}

function renderMovies(movies) {

    movies.forEach(movie => {
        const article = document.createElement("article");
        article.innerHTML = `
    <h2>${movie.title}</h2>
    <p>${movie.description}</p>
    <p>${getGenreString(movie)}</p>
    <p>Director: ${movie.director}</p>
    <p>Aldersgrænse: ${movie.rating.name}</p>
    <p>Premiere: ${new Date(movie.premiere).toLocaleDateString()}</p>
    <a href="http://localhost:8080/movie/${movie.id}" target="_blank">
        <img src="${movie.imgHref}" alt="${movie.title}">
    </a>
    `;
        moviesSection.appendChild(article);
    })
}

document.addEventListener("DOMContentLoaded", async () => {

    try {
        movies = await apiRequest("http://localhost:8080/movie")
    } catch (error) {
        console.error("failed to fetch movie data", error)
        alert("Something went wrong. Try again later")
        return;
    }
    renderMovies(movies)
})


//     [
//     {
//         id: 1,
//         title: "The Dark Knight",
//         description: "Dark Knight description",
//         director: "Christopher Nolan",
//         premiere: "2025-05-10",
//         imgHref : "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQkUywIUXDjHSQJIaNHYVs08osgBpF5Ot-xmB_omyEZeeRP9Xug",
//         rating : 15,
//         genres : ["ACTION", "DRAMA"]
//     }
// ];