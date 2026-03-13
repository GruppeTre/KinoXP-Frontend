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

            div.innerHTML = `
            <p>Navn: ${reservation.name}</p>
            <p>E-mail: ${reservation.email}</p>
            <p>Telefon: ${reservation.phone_number}</p>
            <p>Status: ${reservation.status}</p>
            <p>Showing ID: ${reservation.showing_id}</p>
        
            `;
            reservationsList.appendChild(div);

        })
    }

    function searchReservations() {
        const searchValue = searchEmail.value.toLowerCase()

        const filterReservations = allReservations.filter(function (reservation) {
            return reservation.email.toLowerCase().includes(searchValue);
        })

        showReservations(filterReservations);
    }

    searchButton.addEventListener("click", searchReservations);
    fetchReservations()
});



//siden skal indeholde forestillingsinfo, hvilken sal, tidspunkt
//derefter skal der være en knap så man kan opdatere status

//Vi skal også have em knap til at frigive alle billetter hvis det er tæt på forestillingsstart og der er mange i kø som gerne vil have billet.

