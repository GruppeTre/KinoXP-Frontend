import { apiRequest } from "./module/apiRequest.js";
import { showEditForm } from "./showingForm.js";

const links = document.querySelectorAll("nav a");
const container = document.getElementById("container");
const basicArticle = document.createElement("article");
    basicArticle.classList.add("basic-article");

container.appendChild(basicArticle);
const DEFAULT_ENDPOINT = "/admin/movies";
const DEFAULT_TYPE = "movie";

window.addEventListener("DOMContentLoaded", async () => {
    const item = await apiRequest(`http://localhost:8080${DEFAULT_ENDPOINT}`);
    renderer(item, DEFAULT_TYPE);
    console.log(item);

    const defaultLink = document.querySelector(`[data-endpoint="${DEFAULT_ENDPOINT}"]`);
    if (defaultLink) {
        defaultLink.classList.add("active");
    }
});

links.forEach(link => { 
    link.addEventListener("click", async (e) => {
        e.preventDefault();
        links.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        const type = link.dataset.type;
        
        const endpoint = link.dataset.endpoint;

        const item = await apiRequest(`http://localhost:8080${endpoint}`);

        renderer(item, type);
    });
});

function renderer(item, type) {
    switch(type) {
        case "movie":
            renderMovies(item);
            break;
        case "showing":
            renderShowings(item);
            break;
        case "theater":
            renderTheaters(item);
            break;

    }
}

function rendererForms(item, id){

}

function renderMovies(movies) {
    container.innerHTML = "";
    movies.forEach(movie => {
        const searchBar = document.createElement("input");
            searchBar.type = "search";
            searchBar.placeholder = "Search movies...";
        const movieArticle = document.createElement("article");
            movieArticle.classList.add("movies");
        const title = document.createElement("div");
            title.classList.add("title");
        const actions = document.createElement("div");
            actions.classList.add("actions");
        const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", () => {
                // Implement edit functionality here
                console.log(`Edit movie with ID: ${movie.id}`);
            });
        const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => {
                // Implement delete functionality here
                console.log(`Delete movie with ID: ${movie.id}`);
            });

        title.textContent = movie.title;
        
        actions.append(editButton, deleteButton);
        movieArticle.append(title, actions);

        container.appendChild(movieArticle);
    });
}

function renderShowings(showings) {
    console.log("Fetched showings:", showings);
    container.innerHTML = "";

    const createButton = document.createElement("button");
    createButton.textContent = "Opret visning";

    const formContainer = document.createElement("div");

    createButton.addEventListener("click", () => {
        formContainer.innerHTML = "";
        showEditForm({}, formContainer);
    });

    container.appendChild(createButton);

    showings.forEach(showing => {

        const showingArticle = document.createElement("article");
        showingArticle.classList.add("showings");

        const title = document.createElement("div");
        title.classList.add("title");
        title.textContent = showing.movie.title;

        const time = document.createElement("div");
        time.classList.add("time");
        time.textContent = new Date(showing.time).toLocaleString();

        const actions = document.createElement("div");
        actions.classList.add("actions");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            formContainer.innerHTML = "";
            showEditForm(showing, formContainer);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", async () => {
            if (confirm(`Er du sikker på, du vil slette visning ${showing.id}?`)) {
                try {
                    await apiRequest(`http://localhost:8080/booking/showing/${showing.id}`, "DELETE");
                    alert("Visning slettet!");
                } catch (error) {
                    if (error.message.includes("409")) {
                        alert("Kan ikke slette visning, der har reserveringer!");
                    } else {
                        console.error(error);
                        alert("Noget gik galt!");
                    }
                }
            }
        });

        actions.append(editButton, deleteButton);
        showingArticle.append(title, time, actions);

        container.appendChild(showingArticle);
    });

    container.appendChild(formContainer);
}

function renderTheaters(theaters) {
    container.innerHTML = "";
    theaters.forEach(theater => {
        const div = document.createElement("div");
        div.textContent = theater.name;
        container.appendChild(div);
    });
}

