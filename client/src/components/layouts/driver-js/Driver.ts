import { ROLES } from "@/constants";
import type { tRole } from "@/types";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { admin_dashboard_driver_steps } from "./admin_dashboard_driver_steps";
import { homepage_driver_steps } from "./homepage_driver_steps";
import { receiver_dashboard_driver_steps } from "./receiver_dashboard_driver_steps";
import { sender_dashboard_driver_steps } from "./sender_dashboard_driver_steps";

const { SENDER, RECEIVER, ADMIN } = ROLES;

const setLocalStorage = (name: string) => () => {
  localStorage.setItem(name, "true");
};

const isDriverSeen = (name: string) => {
  if (localStorage.getItem(name) === "true") return true;
  else return false;
};

export const tour_driver = {
  //
  homePageDriver() {
    if (isDriverSeen("homepage_driver")) return;

    driver({
      showProgress: true,
      onDestroyed: setLocalStorage("homepage_driver"),
      steps: homepage_driver_steps,
    }).drive();
  },

  //
  dashboardDriver(role: tRole) {
    //
    if (role === SENDER) {
      if (isDriverSeen("sender_dashboard_driver")) return;

      driver({
        showProgress: true,
        onDestroyed: setLocalStorage("sender_dashboard_driver"),
        steps: sender_dashboard_driver_steps,
      }).drive();
    }

    //
    else if (role === RECEIVER) {
      if (isDriverSeen("receiver_dashboard_driver")) return;

      driver({
        showProgress: true,
        onDestroyed: setLocalStorage("receiver_dashboard_driver"),
        steps: receiver_dashboard_driver_steps,
      }).drive();
    }

    //
    else if (role === ADMIN) {
      if (isDriverSeen("admin_dashboard_driver")) return;

      driver({
        showProgress: true,
        onDestroyed: setLocalStorage("admin_dashboard_driver"),
        steps: admin_dashboard_driver_steps,
      }).drive();
    }
  },
};
