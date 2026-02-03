const CONVERT_TO_HOURS = 1000 * 60 * 60;
const RATE_PER_HOUR = 10;

let parkingLotInitialized = false;
let parkingSlots = [];


function createParkingLot(capacity) {
  if (parkingLotInitialized) {
    throw new Error("Parking lot already initialized");
  }

  if (capacity <= 0) {
    throw new Error("Invalid parking capacity");
  }

  parkingSlots = Array.from({ length: capacity }, (_, i) => ({
    slotNumber: i + 1,
    registrationNumber: null,
    color: null,
    entryTime: null,
  }));

  parkingLotInitialized = true;
}

function parkVehicle(registrationNumber, color) {
  if (!parkingLotInitialized) {
    throw new Error("Parking lot not initialized");
  }

  const alreadyParked = parkingSlots.some(
    slot => slot.registrationNumber === registrationNumber
  );
  if (alreadyParked) {
    throw new Error("Vehicle already parked");
  }

  const freeSlot = parkingSlots.find(
    slot => slot.registrationNumber === null
  );
  if (!freeSlot) {
    throw new Error("Parking lot full");
  }

  freeSlot.registrationNumber = registrationNumber;
  freeSlot.color = color;
  freeSlot.entryTime = Date.now();

  return freeSlot.slotNumber;
}


function exitParkingLot(registrationNumber) {
  if (!parkingLotInitialized) {
    throw new Error("Parking lot not initialized");
  }

  const slot = parkingSlots.find(
    slot => slot.registrationNumber === registrationNumber
  );
  if (!slot) {
    throw new Error("Vehicle not found");
  }

  const durationMs = Date.now() - slot.entryTime;
  const hours = Math.ceil(durationMs / CONVERT_TO_HOURS);
  const totalFee = hours * RATE_PER_HOUR;

  slot.registrationNumber = null;
  slot.color = null;
  slot.entryTime = null;

  return {
    slotNumber: slot.slotNumber,
    hoursParked: hours,
    totalFee,
  };
}


function getRegistrationNumbersByColor(color) {
  if (!parkingLotInitialized) {
    throw new Error("Parking lot not initialized");
  }

  return parkingSlots
    .filter(slot => slot.color === color)
    .map(slot => slot.registrationNumber);
}

function getSlotNumberByRegistrationNumber(registrationNumber) {
  if (!parkingLotInitialized) {
    throw new Error("Parking lot not initialized");
  }

  const slot = parkingSlots.find(
    slot => slot.registrationNumber === registrationNumber
  );

  if (!slot) {
    throw new Error("Vehicle not found");
  }

  return slot.slotNumber;
}


createParkingLot(10);
