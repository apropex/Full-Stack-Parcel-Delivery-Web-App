"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eParcelTypes = exports.eParcelStatus = void 0;
/*
* Requested   — Sender পার্সেল পাঠানোর অনুরোধ করেছে।
* Approved    — Admin পার্সেলটি অনুমোদন করেছে।
* Dispatched  — পার্সেলটি কুরিয়ার বা ডেলিভারি সিস্টেমে হস্তান্তর হয়েছে।
* In_Transit  — পার্সেলটি গন্তব্যে পৌঁছানোর পথে রয়েছে।
* Delivered   — পার্সেলটি Receiver এর ঠিকানায় পৌঁছানো হয়েছে (ডেলিভারি হয়েছে)।
* Received    — Receiver পার্সেল হাতে পেয়েছে (প্রসেস শেষ)।

* Cancelled   — কোনো কারণে প্রসেস বাতিল করা হয়েছে (যেমন: Sender/Receiver এর অনুরোধে)।
* Blocked     — Admin-এর দ্বারা পার্সেল ফ্লো ব্লক করা হয়েছে, হয়তো সন্দেহজনক কার্যকলাপের জন্য।
*/
var eParcelStatus;
(function (eParcelStatus) {
    eParcelStatus["Requested"] = "Requested";
    eParcelStatus["Approved"] = "Approved";
    eParcelStatus["Dispatched"] = "Dispatched";
    eParcelStatus["In_Transit"] = "In_Transit";
    eParcelStatus["Delivered"] = "Delivered";
    eParcelStatus["Received"] = "Received";
    eParcelStatus["Cancelled"] = "Cancelled";
    eParcelStatus["Blocked"] = "Blocked";
})(eParcelStatus || (exports.eParcelStatus = eParcelStatus = {}));
var eParcelTypes;
(function (eParcelTypes) {
    eParcelTypes["Document"] = "Document";
    eParcelTypes["Box"] = "Box";
    eParcelTypes["Fragile"] = "Fragile";
    eParcelTypes["Other"] = "Other";
})(eParcelTypes || (exports.eParcelTypes = eParcelTypes = {}));
