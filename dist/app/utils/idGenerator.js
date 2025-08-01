"use strict";
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTrackingID = exports.generateTrxID = void 0;
const letters = ["Z", "B", "K", "X", "O", "R", "C", "Q", "M", "J"];
const generateTrxID = () => {
    const digits = Date.now().toString().split("").map(Number);
    const random = digits.map((d) => letters[d]);
    const partA = `${random.slice(0, 5).join("")}-${random.slice(5).join("")}`;
    const partB = Math.random().toString(36).toUpperCase().slice(2, 8);
    return `TRX-${partA}-${partB}`;
};
exports.generateTrxID = generateTrxID;
const generateTrackingID = () => {
    const digits = Date.now().toString().split("").map(Number);
    const random = digits.map((d) => letters[d]);
    const partA = random.slice(5).join("");
    const partB = Math.random().toString(36).toUpperCase().slice(2, 10);
    return `TRK-${partA}${partB}`;
};
exports.generateTrackingID = generateTrackingID;
