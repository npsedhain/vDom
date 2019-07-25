import { createElement } from "./lib/createElement.js";
import { render } from "./lib/vDom.js";

import ToDoApp from "./todo.js";

const container = document.getElementById("app");

render(createElement(ToDoApp), container);
