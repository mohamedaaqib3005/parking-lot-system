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
const searchInput = document.getElementById("search");

function highlightSlot(slotNumber) {
  const slotDivs = document.querySelectorAll(".slot");

  slotDivs.forEach(div => {
    if (div.textContent.includes(slotNumber)) {
      div.style.outline = "4px solid red"; // create a class which has this 4px solid red and use it here
    }
  });
}

function renderSlots() {
  slotsContainer.innerHTML = "";//remove existing

  parkingSlots.forEach(slot => {
    const slotDiv = document.createElement("div");// creates a element in js memory
    slotDiv.className = "slot";
    slotDiv.textContent = slot.slotNumber;

    if (slot.isOccupied) {
      slotDiv.style.backgroundColor = "#896a1dff";// create a class

      const regText = document.createElement("div");
      regText.className = "slot-registration";
      regText.textContent = slot.registrationNumber;

      const colorBox = document.createElement("div");
      colorBox.className = "slot-color";
      colorBox.style.backgroundColor = slot.color.toLowerCase();// use colors from dropdown for colors ,for the dropdown have color mappings

      slotDiv.appendChild(regText);
      slotDiv.appendChild(colorBox);

    } else {
      slotDiv.textContent = `Slot ${slot.slotNumber}`;
    }


    if (slot.slotNumber % 2 === 1) {
      slotDiv.style.gridColumn = "1";
    } else {
      slotDiv.style.gridColumn = "3";
    }//expensive but used for dynamic layouts

    slotsContainer.appendChild(slotDiv); // renders the element to the browser
  });
}

renderSlots()
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();

  renderSlots();// use unhighlight function instead of rendering everything

  if (!query) return;

  if (registrationToSlotMap.has(query.toUpperCase())) {
    const slotNumber = registrationToSlotMap.get(query.toUpperCase());
    highlightSlot(slotNumber);
    return;
  }

  const registrations = getRegistrationNumbersByColor(query);

  if (registrations.length === 0) {
    alert("No vehicles found");
    return;
  }

  alert("Vehicles found: " + registrations.join(", "));
});



addButton.addEventListener("click", () => {
  addVehicleDialog.showModal();
});



parkVehicleBtn.addEventListener("click", () => {
  const registration = registrationInput.value.trim();
  const color = colorInput.value.trim();

  if (!registration || !color) {
    alert("Please enter registration number and color");
    return;
  }

  try {
    const ticketId = parkVehicle(registration, color);
    const slotNumber = getSlotNumberByRegistrationNumber(registration);

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