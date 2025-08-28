import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { homepage_driver_steps } from "./homepage_driver_steps";

const setLocalStorage = (name: string) => () => {
  localStorage.setItem(name, "true");
};

const isDriverSeen = (name: string) => {
  if (localStorage.getItem(name) === "true") return true;
  else return false;
};

export const homePageDriver = () => {
  if (isDriverSeen("homepage_driver")) return;

  driver({
    showProgress: true,
    onDestroyed: setLocalStorage("homepage_driver"),
    steps: homepage_driver_steps,
  }).drive();
};
