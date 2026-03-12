import {apiRequest} from "./module/apiRequest.js";

const BASE_URL = 'http://localhost:8080';
const reservationEndpoint = BASE_URL + '/booking/reservation';
const formEl = document.getElementById('checkout-form');
let params = new URLSearchParams(document.location.search);
let reservationId = params.get('reservationId');

let reservation;

async function getReservation() {
    return apiRequest(`${reservationEndpoint}/${reservationId}`);
}

function renderReservationDetails(reservation) {
    //Get DOM elements
    const movieTitleEl = document.getElementById('showing-movie-name');
    const reservationDateEl = document.getElementById('showing-date');
    const showingTheaterNameEl = document.getElementById('showing-theater');
    const reservationSeatsEl = document.getElementById('reservation-seats');
    const totalPriceEl = document.getElementById('total-cost');

    //set elements to correct data:
    movieTitleEl.innerText = reservation.showing.movie.title;

    let timeDate = new Date(reservation.showing.time);

    const options = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };

    reservationDateEl.innerText = timeDate.toLocaleString("DK", options);

    showingTheaterNameEl.innerText = reservation.showing.theater.name;

    //immediately invoked function...
    reservationSeatsEl.innerText = (seats => {

        let rowName = (theater => {
            for (const row of theater.rows) {
                if (row.seats.some(s => s.id === seats.at(0).id)) {
                    return row.name;
                }
            }
            return "Undefined";
        })(reservation.showing.theater);

        let seatString = `Row: ${rowName} | Seats: `;
        seatString += seats.map((s) => s.name).join(",");
        return seatString;
    })(reservation.seats);

    totalPriceEl.innerText = `DKK ${reservation.showing.price * reservation.seats.length},-`;
}

async function handleSubmit() {
    //get inputs from form fields
    const name = document.getElementById('name').value;
    const mail = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    //set fields in reservation
    reservation.email = mail;
    reservation.name = name;
    reservation.phone_number = phone;
    reservation.status = 'RESERVED';
    reservation.created_at = new Date();

    //Update reservation in database
    try {
        const saveEndpoint = BASE_URL + `/booking/reservation/${reservation.id}`;
        const saved = await apiRequest(saveEndpoint, 'PUT', reservation);
        console.log(`Saved reservation to database: ${JSON.stringify(reservation, null, 4)}`);
    } catch (e) {
        console.log(`An error occurred: ${e}`);
        alert('Something went wrong, please try again later');
    }

    //redirect back to front page
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        reservation = await getReservation();

        //check that reservation is open
        if (reservation.status !== 'PENDING') {
            alert('You do not have access to this reservation!');
            return;
        }
    } catch (error) {
        console.log(`Couldn't fetch reservation: ${error}`);
        alert('Something went wrong, please try again later...');
        return;
    }
    // console.log(JSON.stringify(reservation));
    renderReservationDetails(reservation);
});

formEl.addEventListener('submit', async (event) => {
    event.preventDefault();
    await handleSubmit();
});