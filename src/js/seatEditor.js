import { apiRequest } from "./module/apiRequest.js";

export function renderSeatEditor(theaters) {
    let selectedTheater;
    let selectedRow;
    let selectedSeat;

    const containerEl = document.createElement("div");
    containerEl.className = "seat-editor-container";

    const ddTheaterEl = createDropdown("dd-theater");
    const ddRowsEl = createDropdown("dd-rows");
    const ddSeatsEl = createDropdown("dd-seats");

    const submitBtn = document.createElement("button");
    submitBtn.id = "submit-seat-btn";
    submitBtn.innerText = "Bekræft";
    submitBtn.disabled = true;

    containerEl.appendChild(ddTheaterEl);
    containerEl.appendChild(ddRowsEl);
    containerEl.appendChild(ddSeatsEl);
    containerEl.appendChild(submitBtn);

    populateDropdown(ddTheaterEl, theaters);

    ddTheaterEl.addEventListener("change", () => {
        selectedTheater = theaters.find(
            (t) => t.id === Number(ddTheaterEl.value)
        );

        clearDropdown(ddRowsEl);
        clearDropdown(ddSeatsEl);
        submitBtn.disabled = true;
        selectedSeat = undefined;

        if (selectedTheater && selectedTheater.rows) {
            populateDropdown(ddRowsEl, selectedTheater.rows);
        }
    });

    ddRowsEl.addEventListener("change", () => {
        selectedRow = selectedTheater.rows.find(
            (r) => r.id === Number(ddRowsEl.value)
        );

        clearDropdown(ddSeatsEl);
        submitBtn.disabled = true;
        selectedSeat = undefined;

        if (selectedRow && selectedRow.seats) {
            populateDropdown(ddSeatsEl, selectedRow.seats);
        }
    });

    ddSeatsEl.addEventListener("change", () => {
        selectedSeat = selectedRow.seats.find(
            (s) => s.id === Number(ddSeatsEl.value)
        );

        submitBtn.disabled = selectedSeat === undefined;
    });

    submitBtn.addEventListener("click", () => {
        console.log(`marking seat as out of order: ${JSON.stringify(selectedSeat, null, 4)}`);

        // Execute PUT request here utilizing the selectedSeat object
    });

    return containerEl;
}

function createDropdown(id) {
    const dropdownEl = document.createElement("select");
    dropdownEl.id = id;
    dropdownEl.classList.add("seat-selector-dd");
    clearDropdown(dropdownEl);
    return dropdownEl;
}

function clearDropdown(dropdownEl) {
    dropdownEl.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.innerText = "Vælg venligst";
    dropdownEl.appendChild(defaultOption);
}

function populateDropdown(dropdownEl, elements) {
    if (!elements) return;

    elements.forEach((element) => {
        const optionEl = document.createElement("option");
        optionEl.value = element.id;
        optionEl.innerText = element.name;
        dropdownEl.appendChild(optionEl);
    });
}