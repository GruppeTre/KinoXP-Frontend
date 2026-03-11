import { apiRequest } from "./module/apiRequest.js";

const parent = document.getElementsByTagName("section");
console.log(parent);

const upcomingMovies = await apiRequest("http://localhost:8080/movie/upcoming");
console.log(upcomingMovies);

upcomingMovies.forEach(movie => {

    // Article Container
    const article = document.createElement("article");
        article.classList.add("movie-container");

    //Title
    const title = document.createElement("h2");
        title.classList.add("movie-title");

    //Director
    /*
    const director = document.createElement("p");
        director.classList.add("movie-director");
        const directorHighlight = document.createElement("span");
            directorHighlight.classList.add("highlight");
        const directorValue = document.createElement("span");
            directorValue.classList.add("value");
    */

    //Release Date
    const releaseDate = document.createElement("p");
        releaseDate.classList.add("movie-release-date");
        const releaseDateHighlight = document.createElement("span");
            releaseDateHighlight.classList.add("highlight");
        const releaseDateValue = document.createElement("span");
            releaseDateValue.classList.add("value");

    //Description
    /*
    const overview = document.createElement("p");
        overview.classList.add("movie-overview");
        const overviewHighlight = document.createElement("span");
            overviewHighlight.classList.add("highlight");
        const overviewValue = document.createElement("span");
            overviewValue.classList.add("value");
    */

    //Ratings
    /*
    const rating = document.createElement("p");
        rating.classList.add("movie-rating");
        const ratingHighlight = document.createElement("span");
            ratingHighlight.classList.add("highlight");
        const ratingValue = document.createElement("span");
            ratingValue.classList.add("value");
    */
    //Genres
    /*
    const genres = document.createElement("p");
        genres.classList.add("movie-genres");
        const genresHighlight = document.createElement("span");
            genresHighlight.classList.add("highlight");
        const genresValue = document.createElement("span");
            genresValue.classList.add("value");
    */
    //Convert release date to readable format
    const releaseDateObj = new Date(movie.premiere);
    const year = releaseDateObj.getFullYear();
    const month = String(releaseDateObj.getMonth() + 1).padStart(2, '0');
    const day = String(releaseDateObj.getDate()).padStart(2, '0');
    const formattedReleaseDate = `${day}/${month}/${year}`;

    title.textContent = `${movie.title}`;
    releaseDateHighlight.textContent = "Release Date: ";
    releaseDateValue.textContent = formattedReleaseDate;
    /*
    overviewHighlight.textContent = "Overview: ";
    overviewValue.textContent = `${movie.description}`;
    directorHighlight.textContent = "Director: ";
    directorValue.textContent = `${movie.director}`;
    ratingHighlight.textContent = "Rating: ";
    ratingValue.textContent = `${movie.rating.name}`;
    genresHighlight.textContent = "Genres: ";
    genresValue.textContent = `${movie.genres.map(g => g.name).sort((a, b) => a.localeCompare(b)).join(", ")}`;
    */
    
    const poster = document.createElement("img");
    poster.src = movie.imgHref;
    poster.alt = `${movie.title} Poster`;

    releaseDate.appendChild(releaseDateHighlight);
    releaseDate.appendChild(releaseDateValue);
    /*
    overview.appendChild(overviewHighlight);
    overview.appendChild(overviewValue);
    director.appendChild(directorHighlight);
    director.appendChild(directorValue);
    rating.appendChild(ratingHighlight);
    rating.appendChild(ratingValue);
    genres.appendChild(genresHighlight);
    genres.appendChild(genresValue);
    */
    
    article.append(poster, title, releaseDate);
    document.querySelector("section").appendChild(article);
});