import { apiRequest } from "./module/apiRequest.js";

export async function showEditForm(showing = {}, container) {
    container.innerHTML = "";

    const movies = await fetchMovies();
    const theaters = await fetchTheaters();

    const form = document.createElement("form");

    form.innerHTML = `
        <h3>${showing.id ? "Rediger visning" : "Opret ny visning"}</h3>
        <label>
            Film:
            <select name="movieId" required>
                ${movies.map(movie => `
                    <option value="${movie.id}" ${showing.movie?.id === movie.id ? "selected" : ""}>
                        ${movie.title}
                    </option>
                `).join("")}
            </select>
        </label>
        <label>
            Sal:
            <select name="theaterId" required>
                ${theaters.map(theater => `
                    <option value="${theater.id}" ${showing.theater?.id === theater.id ? "selected" : ""}>
                        ${theater.name}
                    </option>
                `).join("")}
            </select>
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
            movie: { id: parseInt(formData.get("movieId")) },
            theater: { id: parseInt(formData.get("theaterId")) },
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

async function fetchMovies() {
    return await apiRequest("http://localhost:8080/movie"); // returnerer liste af Movie
}

async function fetchTheaters() {
    return await apiRequest("http://localhost:8080/theater"); // returnerer liste af Theater
}
