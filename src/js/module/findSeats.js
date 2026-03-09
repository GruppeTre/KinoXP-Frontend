

export function findInitialSeats(theaterRows, ticketCount) {
    //iterate through the rows
    for (let i = 0; i < theaterRows.length; i++) {
        const row = theaterRows[i];
        const seats = row.seats;

        //iterate through seats
        for (let j = 0; j < seats.length; j++) {
            let candidate = getManualBlock(seats, j, ticketCount);

            if (candidate) {
                return {
                    seats: candidate,
                    rowIndex: i,
                    seatIndex: j,
                }
            }
        }
    }

    console.log('no availabe seats found!');
    return null;
}

//find block of valid seats where user clicked
export function getManualBlock(rowSeats, startIndex, ticketCount) {

    //if the user tries to book more seats than there are in the row, return null
    if (startIndex + ticketCount > rowSeats.length) {
        return null;
    }


    //check if every seat in the block is valid
    const candidateBlock = rowSeats.slice(startIndex, startIndex + ticketCount);

    const isBlockValid = candidateBlock.every(
        (seat) => seat.inoperable === false
    );

    return isBlockValid ? candidateBlock : null;
}