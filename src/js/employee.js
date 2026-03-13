import {apiRequest} from "./module/apiRequest.js";

console.log("jeg er i employee")

let allReservations = [];

document.addEventListener("DOMContentLoaded", function() {

    console.log("DOM er loaded");

    const reservationsList = document.getElementById("reservationsList");
    const searchButton = document.getElementById("searchButton");
    const searchEmail = document.getElementById("searchEmail");

    async function fetchReservations() {

        console.log("fetchReservations er kaldt");

        allReservations = await apiRequest("http://localhost:8080/booking/reservation/active");

        for(let reservation of allReservations) {
            const showing = await apiRequest(`http://localhost:8080/booking/showing/${reservation.showing.id}`);

            reservation.movieTitle = showing.movie.title;
            reservation.showingTime = showing.time;


        }
    }

    async function updateReservationStatus(id, status) {
        await fetch(`http://localhost:8080/booking/reservation/${id}/status?status=${status}`, {
            method: "PUT"
        });
    }


    function showReservations(reservations) {

        console.log("showReservations er kaldt", reservations);

        reservationsList.innerHTML = "";

        if (reservations.length === 0) {
            reservationsList.innerHTML = "<p>Ingen reservationer fundet</p>"
            return;
        }

        reservations.forEach(function (reservation) {
            const div = document.createElement("div");

            let timeDate = new Date(reservation.showingTime);

            const options = {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            };

            let formattedDate = timeDate.toLocaleString("da-DK", options);

            div.innerHTML = `
            <p>Navn: ${reservation.name}</p>
            <p>E-mail: ${reservation.email}</p>
            <p>Telefon: ${reservation.phone_number}</p>
            <p>Status: ${reservation.status}</p>
            <p>Film: ${reservation.movieTitle}</p>
            <p>Dato: ${formattedDate}</p>
            <button class="paidButton" data-id="${reservation.id}">Betalt</button>
            <button class="cancelledButton" data-id="${reservation.id}">Afbestilt</button>
        
            `;
            reservationsList.appendChild(div);

            const paidButton = div.querySelector(".paidButton");
            const cancelledButton = div.querySelector(".cancelledButton");

            paidButton.addEventListener("click", async function(){
                const confirmed = confirm("Er du sikker på at du vil markere reservationen som betalt?")
                if (!confirmed) return;

                await updateReservationStatus(reservation.id, "PAID");
                await fetchReservations();
                searchReservations()
            })

            cancelledButton.addEventListener("click", async function(){
                const confirmed = confirm("Er du sikker på at du vil afbestille reservationen?")
                if (!confirmed) return;

                await updateReservationStatus(reservation.id, "CANCELLED");
                await fetchReservations();
                searchReservations()

            })

        })
    }

    function searchReservations() {
        const searchValue = searchEmail.value.toLowerCase()

        console.log("søger efter" + searchValue)

        const filterReservations = allReservations.filter(function (reservation) {
            return reservation.email.toLowerCase().includes(searchValue);
        })

        showReservations(filterReservations);
    }

    searchButton.addEventListener("click", searchReservations);
    fetchReservations()
});





