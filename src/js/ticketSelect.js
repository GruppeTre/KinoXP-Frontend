import {findInitialSeats, getManualBlock} from './module/findSeats.js';
import {apiRequest} from "./module/apiRequest.js";

console.log('entering ticketSelect script!');

//Setup
//Read showing id from url param
let params = new URLSearchParams(document.location.search);
let showingId = params.get('showingId');


const BASE_URL = 'http://localhost:8080';
const MAX_ALLOWED_TICKETS = 8;

let showing;
let reservation = {};
let reservedSeats;
let theaterRows = [];
let selection = {
    seats: [],
}
let ticketCount = 2;

//DOM elements
const theaterGridEl = document.getElementById('theater-grid');
const ticketCounterEl = document.getElementById('ticket-count');
const submitBtnEL = document.getElementById('btn-submit');
const movieTitleEl = document.getElementById('movie-title');
const movieTimeEl = document.getElementById('movie-time');
const totalPriceEl = document.getElementById('total-price');

function renderElements(showing) {

    //set element text:
    movieTitleEl.innerText = showing.movie.title;

    let timeDate = new Date(showing.time);
    movieTimeEl.innerText = timeDate.toLocaleString("DK", { dateStyle: "medium" });

    totalPriceEl.innerText = `DKK ${showing.price * ticketCount},-`;
}
function renderTheater() {

    theaterGridEl.innerHTML = '';

    theaterRows.forEach((row, rIndex) => {
        const rowEl = document.createElement('div');
        rowEl.classList.add('seat-row')


        row.seats.forEach((seat, sIndex) => {
            const seatEl = document.createElement('div');
            seatEl.classList.add('seat');

            //check if seat is reserved/out of order
            if (!isSeatAvailable(seat)) {
                seatEl.classList.add('unavailable');
            }

            //check if seat is selected
            if (selection?.seats.some(s => s.id === seat.id)) {
                seatEl.classList.add('selected');
            }

            //create eventListener for seat
            seatEl.addEventListener('click', () => {
                handleSeatSelection(rIndex, sIndex);
            });

            rowEl.appendChild(seatEl)
        })

        theaterGridEl.appendChild(rowEl);
    })
    console.log('rendered theater...');
}

function handleSeatSelection(rowIndex, seatIndex) {
    const row = theaterRows[rowIndex];

    let newBlock = getManualBlock(row.seats, seatIndex, ticketCount, reservedSeats);

    // Fallback: If the user clicks too close to the right edge of the row,
    // attempt to shift the selection leftwards to fit the ticketCount.
    if (!newBlock && seatIndex + ticketCount > row.seats.length) {
        const shiftStart = row.seats.length - ticketCount;
        if (shiftStart >= 0) {
            newBlock = getManualBlock(row.seats, shiftStart, ticketCount, reservedSeats);
        }
    }

    if (newBlock) {
        selection.seats = newBlock;
        selection.rowIndex = rowIndex;
        selection.seatIndex = seatIndex;
        renderElements(showing);
        renderTheater();
        return true;
    } else {
        console.log('Selection blocked by unavailable seats');
        return false;
    }
}

function isSeatAvailable(seat) {
    return !seat.inoperable && !reservedSeats.some(target => target.id === seat.id);
}

async function fetchShowing(url) {
    return await apiRequest(url);
}

async function getReservedSeats(showingId) {
    let seats = [];
    const reservationsEndpoint = BASE_URL + `/booking/reservation?showingId=${showingId}`
    const reservations = await apiRequest(reservationsEndpoint);

    reservations.forEach((reservation) => {
        seats.push(...reservation.seats);
    });

    return seats;
}

submitBtnEL.addEventListener('click', async () => {
    //check if seats are selected:
    if (ticketCount <= 0) {
        alert('Please select one or more tickets before continuing...');
        return;
    }

    let reservationTemp = {
        createdAt: new Date(),
        email: "notYetDefined",
        name: "Jens Erik",
        phoneNumber: "33333333",
        seats: selection.seats,
        showing: showing,
        status: 'PENDING'
    }
    const postEndpoint = BASE_URL + '/booking/reservation';
    const reservation = await apiRequest(postEndpoint, 'POST', reservationTemp);

    //redirect to next page
    window.location.href = `reservationConfirmation.html?reservationId=${reservation.id}`;
});


document.addEventListener('DOMContentLoaded', async () => {

    try {
        const showingEndpoint = BASE_URL + `/booking/showing/${showingId}`;
        showing = await fetchShowing(showingEndpoint);
        reservedSeats = await getReservedSeats(showing.id);
        theaterRows = showing.theater.rows;
        console.log('reserved seats: ' + JSON.stringify(reservedSeats));
    } catch (error) {
        console.error(`Failed to fetch theater data:`, error);
        alert('Something went wrong, please try again later!');
        return;
    }

    // Init Controls
    document.getElementById('btn-plus').addEventListener('click', () => {
        if (ticketCount < MAX_ALLOWED_TICKETS) {
            ticketCount++;
            if (handleSeatSelection(selection.rowIndex, selection.seatIndex)) {
                ticketCounterEl.innerText = ticketCount;
            } else {
                ticketCount--;
            }
        }
    });

    document.getElementById('btn-minus').addEventListener('click', () => {
        if (ticketCount > 1) {
            ticketCount--;
            ticketCounterEl.innerText = ticketCount;
            handleSeatSelection(selection.rowIndex, selection.seatIndex);
        }
    });

    // Initial Render
    selection = findInitialSeats(theaterRows, ticketCount, reservedSeats);
    if (!selection) {
        ticketCount = 0;
        ticketCounterEl.innerText = ticketCount;
        alert('We had trouble finding seats for you, showing may be fully booked');
    }

    renderElements(showing);
    renderTheater();
});


