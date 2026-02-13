// Parking Layout Data in the form of JSON
export const parkingLayout = {
  rows: 3,
  cols: 3,
  slots: [
    { row: 0, col: 0, type: "parking", status: "free" },
    { row: 0, col: 1, type: "gap" },
    { row: 0, col: 2, type: "parking", status: "free" },

    { row: 1, col: 0, type: "parking", status: "free" },
    { row: 1, col: 1, type: "elevator" },
    { row: 1, col: 2, type: "parking", status: "free" },

    { row: 2, col: 0, type: "parking", status: "occupied", reg: "KA05MN8750", color: "red" },
    { row: 2, col: 1, type: "gap" },
    { row: 2, col: 2, type: "parking", status: "free" },
  ]
};