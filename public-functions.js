// Product requirements
// --> customer should be able to reserve a slot and recieves a token for it at the entrance
// --> customer should be able to pay the amount on the counter
// --> the rate depends on the no of hours





let parkingLotInitialized = false;
let totalSlots = 0;
let parkingSlots = [];
let availableSlots = [];
let occupiedSlots = new Map();
let registrationToSlotMap = new Map();
let activeTickets = new Map();

/**
 *  Initializes the parking lot with a fixed capacity.
 *
 * @param {number} capacity - Total number of parking slots available.
 * @returns {void}
 */
function createParkingLot(capacity) {

  if (parkingLotInitialized) {
    throw new Error("Parking lot already initialized");
  }

  // Validate if capacity is right.

  if (capacity <= 0) {
    throw new Error("Invalid parking capacity")
  }


  totalSlots = capacity;

  parkingSlots = [];
  availableSlots = [];

  for (let slotNumber = 1; slotNumber <= capacity; slotNumber++) {
    const slot = {
      slotNumber: slotNumber,
      isOccupied: false,
    }

    parkingSlots.push(slot);

    availableSlots.push(slotNumber);

    // create slots for that capacity.

  }

  occupiedSlots = new Map(); // currently occupied slots
  registrationToSlotMap = new Map();// which car is parked in which slot
  activeTickets = new Map(); // which parking session are still active

  // modify the parkinglot state


  parkingLotInitialized = true;

}



/**
 * Parks a vehicle in the nearest available slot and issues a parking ticket.
 *
 * @param {string} registrationNumber - Unique registration number of the vehicle.
 * @param {string} color - Color of the vehicle.
 * @returns {ParkingTicketId} Parking ticket issued for the parked vehicle.
 */
function parkVehicle(registrationNumber, color) {

  if (!parkingLotInitialized) {
    throw new Error("Parking lot not initialized");
  }

  // check if slot is available for car entering
  if (availableSlots.length === 0) {
    throw new Error("Parking slot is full")
  }

  // Pick the nearest slot
  const slotNumber = availableSlots.shift()

  // Assign the slot to the car
  const slot = parkingSlots.find(slot => slot.slotNumber === slotNumber);

  // Mark it occupied
  slot.isOccupied = true;

  const ticketID = `TICKET_${Date.now()}`;

  activeTickets.set(ticketID, {
    registrationNumber,
    color,
    slotNumber,
    entryTime: Date.now()
  })

  registrationToSlotMap.set(registrationNumber, slotNumber);
  occupiedSlots.set(slotNumber, true);

  // Generate a parking ticket to the customer
  return ticketID;

}


/**
 * Exits a vehicle from the parking lot using the provided ticket.
 * Frees the occupied slot and calculates the parking fee based on duration.
 *
 * @param {string} ticketId - Unique identifier of the parking ticket.
 * @returns {ParkingReceipt} Receipt containing parking details and total fee.
 */
function exitParkingLot(ticketId) {

  if (!activeTickets.has(ticketId)) {
    throw new Error("Invalid parking ticket");
  }

  //Get parking details using the ticket
  const ticket = activeTickets.get(ticketId); // returns the value of the key
  const registrationNumber = ticket.registrationNumber;
  const slotNumber = ticket.slotNumber;
  const entryTime = ticket.entryTime;

  //Calculate how long the car was parked and based on that parking Calculate the total parking fee
  const exitTime = Date.now();
  const durationMs = exitTime - entryTime;

  const hours = Math.ceil(durationMs / (1000 * 60 * 60));
  const ratePerHour = 10;
  const totalFee = hours * ratePerHour;

  //Free the occupied slot
  const slot = parkingSlots.find(
    slot => slot.slotNumber === slotNumber
  );
  slot.isOccupied = false;

  availableSlots.push(slotNumber);

  // Clean up mappings
  activeTickets.delete(ticketId);
  registrationToSlotMap.delete(registrationNumber);
  occupiedSlots.delete(slotNumber);


  //Return a receipt
  return {
    registrationNumber,
    slotNumber,
    hoursParked: hours,
    totalFee
  };

}


/**
 * Provides registration numbers of all currently parked vehicles
 * with the specified color.
 *
 * @param {string} color - Color of the vehicles to search for.
 * @returns {string[]} List of registration numbers matching the given color.
 */
function getRegistrationNumbersByColor(color) {

  if (!parkingLotInitialized) {
    throw new Error("Parking lot not initialized");
  }

  const result = [];
  // check if color in ticket matches the color provided
  for (const ticket of activeTickets.values()) {
    if (ticket.color === color) {
      result.push(ticket.registrationNumber);
    }
  }

  // Return all cars of that color
  return result;

}





/**
 * Provides the slot number where a vehicle with the given
 * registration number is currently parked.
 *
 * @param {string} registrationNumber - Registration number of the vehicle.
 * @returns {number|null} Slot number if the vehicle is parked, otherwise null.
 */
function getSlotNumberByRegistrationNumber(registrationNumber) {
  if (!parkingLotInitialized) {
    throw new Error("Parking lot not initialized");
  }

  // Check if that Registration number exists
  if (!registrationToSlotMap.has(registrationNumber)) {
    return null;
  }

  // Return slotnumber where that car of that registration number is parked
  return registrationToSlotMap.get(registrationNumber);

}
