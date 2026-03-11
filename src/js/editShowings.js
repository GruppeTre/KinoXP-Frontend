import { apiRequest } from "./module/apiRequest.js";

const container = document.getElementById("edit-showing-container");

// Hent showingId fra URL
const params = new URLSearchParams(window.location.search);
const showingId = params.get("showingId");

if (showingId) {
    loadShowing(showingId); // henter eksisterende visning
} else {
    showEditForm(); // viser tom opret-form
}

// Hent visning fra API
async function loadShowing(id) {
    try {
        const showing = await apiRequest(`http://localhost:8080/booking/showing/${id}`);
        showEditForm(showing);
    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Kunne ikke hente visning.</p>";
    }
}

// Vis redigerings-/opret-form
export function showEditForm(showing = {}) {
    container.innerHTML = "";

    const form = document.createElement("form");
    form.innerHTML = `
        <h3>${showing.id ? "Rediger visning" : "Opret ny visning"}</h3>
        <label>
            Film:
            <input type="text" name="movieTitle" value="${showing.movie?.name || ""}" required>
        </label>
        <label>
            Sal:
            <input type="text" name="theaterName" value="${showing.theater?.name || ""}" required>
        </label>
        <label>
            Tidspunkt:
            <input type="datetime-local" name="time" value="${showing.time ? showing.time.substring(0,16) : ""}" required>
        </label>
        <label>
            Pris:
            <input type="number" name="price" value="${showing.price || 0}" required>
        </label>
        <button type="submit">${showing.id ? "Opdater" : "Opret"}</button>
        <button type="button" id="cancel">Annuller</button>
    `;
    container.appendChild(form);

    // Cancel-knap
    form.querySelector("#cancel").addEventListener("click", () => {
        container.innerHTML = "";
    });

    // Submit
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = {
            movieId: parseInt(formData.get("movieId")),
            theaterId: parseInt(formData.get("theaterId")),
            time: formData.get("time"),
            price: parseFloat(formData.get("price"))
        };

        try {
            if (showing.id) {
                await apiRequest(`http://localhost:8080/booking/showing/${showing.id}`, "PUT", data);
                alert("Visning opdateret!");
            } else {
                await apiRequest("http://localhost:8080/booking/showing", "POST", data);
                alert("Ny visning oprettet!");
            }
            container.innerHTML = "";
        } catch (error) {
            console.error(error);
            alert("Noget gik galt!");
        }
    });
}