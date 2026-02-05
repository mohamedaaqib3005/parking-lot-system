const CONVERT_TO_HOURS = 1000 * 60 * 60;
const RATE_PER_HOUR = 10;


class ParkingLot {
  constructor() {
    this.parkingLotInitialized = false;
    this.parkingSlots = [];
  }


  createParkingLot(capacity) {
    if (this.parkingLotInitialized) {
      throw new Error("Parking lot already initialized");
    }

    if (capacity <= 0) {
      throw new Error("Invalid parking capacity");
    }

    this.parkingSlots = Array.from({ length: capacity }, (_, i) => ({
      slotNumber: i + 1,
      registrationNumber: null,
      color: null,
      entryTime: null,
    }));

    this.parkingLotInitialized = true;
  }

  parkVehicle(registrationNumber, color) {
    if (!this.parkingLotInitialized) {
      throw new Error("Parking lot not initialized");
    }

    const alreadyParked = this.parkingSlots.some(
      slot => slot.registrationNumber === registrationNumber
    );
    if (alreadyParked) {
      throw new Error("Vehicle already parked");
    }

    const freeSlot = this.parkingSlots.find(
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


  exitParkingLot(registrationNumber) {
    if (!this.parkingLotInitialized) {
      throw new Error("Parking lot not initialized");
    }

    const slot = this.parkingSlots.find(
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


  getRegistrationNumbersByColor(color) {
    if (!this.parkingLotInitialized) {
      throw new Error("Parking lot not initialized");
    }

    return this.parkingSlots
      .filter(slot => slot.color === color)
      .map(slot => slot.registrationNumber);
  }

  getSlotNumberByRegistrationNumber(registrationNumber) {
    if (!this.parkingLotInitialized) {
      throw new Error("Parking lot not initialized");
    }

    const slot = this.parkingSlots.find(
      slot => slot.registrationNumber === registrationNumber
    );

    if (!slot) {
      throw new Error("Vehicle not found");
    }

    return slot.slotNumber;
  }

}

const parkingLot = new ParkingLot();   // create instance(real object)
// const obj = {};  JS does this underneath everytime u write new ParkingLot()
// obj.__proto__ = ParkingLot.prototype;
// ParkingLot.call(obj);
// return obj;
parkingLot.createParkingLot(10);       // initialize