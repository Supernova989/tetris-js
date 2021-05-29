import { SETTINGS } from "./settings";
import Scene from "./lib/Scene";


const setup = () => {
  const scene = new Scene({
    root_id: SETTINGS.root_id,
    brick_size: SETTINGS.brick_size,
    scene_width: SETTINGS.scene_width,
    scene_height: SETTINGS.scene_height
  });
};

window.addEventListener("load", setup);
