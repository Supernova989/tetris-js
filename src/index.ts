import { SETTINGS } from "./settings";


const setup = () => {
  console.log("hello");
  const root = document.getElementById(SETTINGS.root_id);
  root.innerText = "INIT DONE";
};

window.addEventListener("load", setup);
