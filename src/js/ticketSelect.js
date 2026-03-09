import { getManualBlock, findInitialSeats } from './module/findSeats.js';
import { apiRequest } from "./module/apiRequest.js";

//Setup
const theaterId = 1;
const endpoint = `http://localhost:8080/theater/${theaterId}`
const MAX_ALLOWED_TICKETS = 8;


let theaterRows = [];
let selection = {
    seats: [],
}
let ticketCount = 2;

//DOM elements
const theaterGridEl = document.getElementById('theater-grid');
const ticketCounterEl = document.getElementById('ticket-count');
const debugOutputEl = document.getElementById('json-output');

async function renderTheater() {

    theaterGridEl.innerHTML = '';

    theaterRows.forEach((row, rIndex) => {
        const rowEl = document.createElement('div');
        rowEl.classList.add('seat-row')


        row.seats.forEach((seat, sIndex) => {
            const seatEl = document.createElement('div');
            seatEl.classList.add('seat');

            //set seat to occupied/available
            if (seat.inoperable) {
                seatEl.classList.add('inoperable');
            }

            //check if seat is selected
            if (selection.seats.some(s => s.id === seat.id)) {
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

    let newBlock = getManualBlock(row.seats, seatIndex, ticketCount);

    // Fallback: If the user clicks too close to the right edge of the row,
    // attempt to shift the selection leftwards to fit the ticketCount.
    if (!newBlock && seatIndex + ticketCount > row.seats.length) {
        const shiftStart = row.seats.length - ticketCount;
        if (shiftStart >= 0) {
            newBlock = getManualBlock(row.seats, shiftStart, ticketCount);
        }
    }

    if (newBlock) {
        selection.seats = newBlock;
        selection.rowIndex = rowIndex;
        selection.seatIndex = seatIndex;
        updateDebugOutput();
        renderTheater();
    } else {
        console.log('Selection blocked by inoperable seat or row boundaries.');
    }
}

function updateDebugOutput() {
    debugOutputEl.value = JSON.stringify(selection.seats, null, 4);
}


document.addEventListener('DOMContentLoaded', async () => {

    try {
        const theater = await apiRequest(endpoint);
        theaterRows = theater.rows;
    } catch (error) {
        console.error('Failed to fetch theater data:', error);
        alert('Something went wrong, please try again later!');
        return;
    }

    // Init Controls
    document.getElementById('btn-plus').addEventListener('click', () => {
        if (ticketCount < MAX_ALLOWED_TICKETS) {
            ticketCount++;
            ticketCounterEl.innerText = ticketCount;
            handleSeatSelection(selection.rowIndex, selection.seatIndex);
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
    selection = findInitialSeats(theaterRows, ticketCount);
    updateDebugOutput();
    await renderTheater();
});


