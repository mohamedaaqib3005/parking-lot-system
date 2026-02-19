import { parkingLayout } from "./parking-lot-layout.js";
import { ParkingLot } from "./parking-core.js";

// DOM Manipulation
const slotsContainer = document.querySelector(".slots-container");
const addButton = document.getElementById("add");

const addVehicleDialog = document.getElementById("add-vehicle-dialog");
const ticketDialog = document.getElementById("ticket-dialog");

const parkVehicle = document.getElementById("submitVehicle");
const closeTicketButton = document.getElementById("closeTicket");

const ticketNoSpan = document.getElementById("ticketNo");
const slotNoSpan = document.getElementById("slotNo");

const registrationInput = document.getElementById("registrationInput");
const colorInput = document.getElementById("colorInput");
// const searchInput = document.getElementById("search");
const colorFilter = document.getElementById("colorFilter");
const SearchBtn = document.getElementById("SearchBtn");

const searchInput = document.getElementById("search");
const exitBtn = document.getElementById("exit")

function highlightSlot(slotNumber) {
  document.querySelectorAll(".slot").forEach(div => {
    if (Number(div.dataset.slotNumber) === slotNumber) {
      slot.ClassList.add = "highlighted";
    }
  });
}

function formatExitMessage(result) {
  return `Vehicle exited\nSlot:${result.slotNumber}\nTotalHours:${result.hoursParked}\nFare:${result.totalFee}`
}

function showAlert(message) {
  alert(message)
}
// function highlightSlot(slotNumber) {
//   const slotDivs = document.querySelectorAll(".slot");

//   slotDivs.forEach(div => {
//     if (div.textContent.includes(slotNumber)) {
//       div.style.outline = "4px solid red"; // create a class which has this 4px solid red and use it here
//     }
//   });
// }

function clearHighlights() {
  document.querySelectorAll(".slot").forEach(slot => {
    slot.classList.remove = "highlighted";
  });
}

const parkingLot = new ParkingLot();//

function buildGrid(layout) {
  const grid = Array.from({ length: layout.rows }, () =>
    Array.from({ length: layout.cols }, () => null)
  );

  layout.slots.forEach(cell => {
    grid[cell.row][cell.col] = cell;
  });

  return grid;
}

function renderSlots() {
  slotsContainer.innerHTML = "";

  const grid = buildGrid(parkingLayout);

  slotsContainer.style.gridTemplateColumns =
    `repeat(${parkingLayout.cols}, 1fr)`;

  let parkingIndex = 0;

  grid.forEach(row => {
    row.forEach(cell => {
      const slotDiv = document.createElement("div");

      // GAP
      if (cell.type === "gap") {
        slotDiv.className = "slot gap";
        slotsContainer.appendChild(slotDiv); //there should be no div for gaps
        return;
      }

      // ELEVATOR
      if (cell.type === "elevator") {
        slotDiv.className = "slot elevator";
        slotDiv.textContent = "ELEVATOR";
        slotsContainer.appendChild(slotDiv);
        return;
      }

      // PARKING SLOT
      const parkingSlot = parkingLot.parkingSlots[parkingIndex++];
      slotDiv.className = "slot";
      slotDiv.dataset.slotNumber = parkingSlot.slotNumber;

      if (parkingSlot.registrationNumber) {
        slotDiv.style.backgroundColor = "var(--occupied-color)";// add a class for occupied use a css var

        const regText = document.createElement("div");
        regText.className = "slot-registration";
        regText.textContent = parkingSlot.registrationNumber;

        const exitBtn = document.createElement("button");
        exitBtn.id = "exit-button";
        exitBtn.textContent = "Exit"
        exitBtn.addEventListener("click", () => {
          try {
            const result = parkingLot.exitParkingLot(parkingSlot.registrationNumber);
            showAlert(formatExitMessage(result))
            renderSlots()

          } catch (err) {
            alert(err.message);
          }
        });
        const colorBox = document.createElement("div");
        colorBox.className = "slot-color";
        colorBox.style.backgroundColor =
          parkingSlot.color.toLowerCase();

        slotDiv.appendChild(regText);
        slotDiv.appendChild(exitBtn);
        slotDiv.appendChild(colorBox);
      } else {
        slotDiv.textContent = `Slot ${parkingSlot.slotNumber}`;
      }

      slotsContainer.appendChild(slotDiv);
    });
  });
}


// searchInput.addEventListener("input", () => {
//   const query = searchInput.value.trim().toLowerCase();

// renderSlots();// use unhighlight function instead of rendering everything


// if (registrationToSlotMap.has(query.toUpperCase())) {
//   const slotNumber = registrationToSlotMap.get(query.toUpperCase());
//   highlightSlot(slotNumber);
//   return;
// }

SearchBtn.addEventListener("click", () => {
  clearHighlights();

  const registrationQuery = searchInput.value.trim().toUpperCase();
  const colorQuery = colorFilter.value.toLowerCase();

  // renderSlots();

  if (!registrationQuery && !colorQuery) {
    alert("Please enter registration number or select a color");
    return;
  }


  if (registrationQuery) {
    try {
      const slotNumber =
        parkingLot.getSlotNumberByRegistrationNumber(registrationQuery);


      const slot = parkingLot.findSlotByNumber(slotNumber);

      if (colorQuery && slot.color !== colorQuery) {
        let alertMessage = "No vehicle found matching both registration and color"
        showAlert(alertMessage)
        return;
      }

      highlightSlot(slotNumber);
      alert(`Vehicle found at slot ${slotNumber}`);
      return;
    } catch {
      alert("Vehicle with this registration not found");
      return;
    }
  }

  if (colorQuery) {
    const registrations =
      parkingLot.getRegistrationNumbersByColor(colorQuery);

    if (registrations.length === 0) {
      let alertmessage = "No vehicles found with this color"
      showAlert(alertmessage);
      return;
    }

    document.querySelectorAll(".slot").forEach(slotDiv => {
      const colorBox = slotDiv.querySelector(".slot-color");
      if (
        colorBox &&
        colorBox.style.backgroundColor === colorQuery
      ) {
        slotDiv.style.outline = "4px solid red";
      }
    });
    let alertMessage = "Vehicles found: " + registrations.join(", ")
    showAlert(alertMessage);
  }
});



addButton.addEventListener("click", () => {
  addVehicleDialog.showModal();
});



parkVehicle.addEventListener("click", () => {
  const registration = registrationInput.value.trim().toUpperCase();
  const color = colorInput.value.trim();

  if (!registration || !color) {
    let alertMessage = "Please enter registration number and color";
    showAlert(alertMessage);
    return;
  }

  try {
    const ticketId = parkingLot.parkVehicle(registration, color);
    const slotNumber = parkingLot.getSlotNumberByRegistrationNumber(registration);


    ticketNoSpan.textContent = ticketId;
    slotNoSpan.textContent = slotNumber;

    addVehicleDialog.close();
    ticketDialog.showModal();

    renderSlots();
  } catch (error) {
    alert(error.message);
  }
});




closeTicketButton.addEventListener("click", () => {
  ticketDialog.close();
});

renderSlots()

// create a exit functionality and fare
// func not more than 15 lines
// cannot manipulate  the class variable  it should have a method and access the method
// no gap in json
// classes for style use css var