import { apiRequest } from "./module/apiRequest.js";

const moviesSection = document.querySelector("section");

function getGenreString(movie) {
    return movie.genres.map(g => g.name).join(", ");
}

function filterShowingsByDate(showings, date) {
    return showings.filter(showing => {
        const showingDate = new Date(showing.time);
        return showingDate.toDateString() === date.toDateString();
    });
}

function getShowingsForMovie(movieId, showings) {
    return showings.filter(showing => showing.movie.id === movieId);
}

function renderShowings(showings, container) {
    container.innerHTML = "";

    if (!showings || showings.length === 0) {
        container.innerHTML = "<p>Ingen visninger</p>";
        return;
    }

    showings.forEach(showing => {
        const div = document.createElement("div");
        const showingDate = new Date(showing.time);
        const timeString = showingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        div.innerHTML = `
        <a href="reservation.html?showingId=${showing.id}">
            ${timeString}
        </a>
    `;
        container.appendChild(div);
    });
}

async function renderMoviesAndShowings(selectedDate = new Date()) {
    try {
        moviesSection.innerHTML = "";

        const movies = await apiRequest("http://localhost:8080/movie/running");
        const showings = await apiRequest("http://localhost:8080/booking/showing");

        const moviesWithShowings = movies.filter(movie => {
            const movieShowings = getShowingsForMovie(movie.id, showings);
            const filteredShowings = filterShowingsByDate(movieShowings, selectedDate);
            return filteredShowings.length > 0;
        });

        moviesWithShowings.forEach(movie => {
            const article = document.createElement("article");

            const movieShowings = getShowingsForMovie(movie.id, showings);
            const filteredShowings = filterShowingsByDate(movieShowings, selectedDate);

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
                <div class="showings" id="showings-${movie.id}"></div>
            `;

            moviesSection.appendChild(article);

            const container = document.getElementById(`showings-${movie.id}`);
            renderShowings(filteredShowings, container);
        });

        createDaySelector(showings, movies, selectedDate);

    } catch (error) {
        console.error("Failed to fetch movies or showings", error);
        alert("Something went wrong. Try again later");
    }
}

function createDaySelector(showings, movies, selectedDate) {
    const selector = document.getElementById("day-selector");
    selector.innerHTML = "";

    const daysAhead = 7;

    for (let i = 0; i < daysAhead; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);

        const button = document.createElement("button");
        button.textContent = date.toLocaleDateString("da-DK", {
            weekday: "short",
            day: "numeric",
            month: "short"
        });

        if (date.toDateString() === selectedDate.toDateString()) {
            button.classList.add("selected");
        }

        button.addEventListener("click", () => {
            renderMoviesAndShowings(date);
        });

        selector.appendChild(button);
    }
}

document.addEventListener("DOMContentLoaded", () => renderMoviesAndShowings());