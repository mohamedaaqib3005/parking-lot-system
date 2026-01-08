// Product requirements
// --> customer should be able to reserve a slot and recieves a token for it at the entrance
// --> customer should be able to pay the amount on the counter
// --> the rate depends on the no of hours


/**
 *  Initializes the parking lot with a fixed capacity.
 *
 * @param {number} capacity - Total number of parking slots available.
 * @returns {void}
 */
function createParkingLot(capacity) {

}



/**
 * Parks a vehicle in the nearest available slot and issues a parking ticket.
 *
 * @param {string} registrationNumber - Unique registration number of the vehicle.
 * @param {string} color - Color of the vehicle.
 * @returns {ParkingTicket} Parking ticket issued for the parked vehicle.
 */
function parkVehicle(registrationNumber, color) {


}

/**
 * Exits a vehicle from the parking lot using the provided ticket.
 * Frees the occupied slot and calculates the parking fee based on duration.
 *
 * @param {string} ticketId - Unique identifier of the parking ticket.
 * @returns {ParkingReceipt} Receipt containing parking details and total fee.
 */
function exitParkingLot(ticketId) {



}


/**
 * Provides registration numbers of all currently parked vehicles
 * with the specified color.
 *
 * @param {string} color - Color of the vehicles to search for.
 * @returns {string[]} List of registration numbers matching the given color.
 */
function getRegistrationNumbersByColor(color) {



}





/**
 * Provides the slot number where a vehicle with the given
 * registration number is currently parked.
 *
 * @param {string} registrationNumber - Registration number of the vehicle.
 * @returns {number|null} Slot number if the vehicle is parked, otherwise null.
 */
function getSlotNumberByRegistrationNumber(registrationNumber) {


}
