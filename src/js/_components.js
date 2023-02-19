import './components/modal';
import './components/map';
import './components/form';

import { modal } from "./components/modal";
import { map } from "./components/map";
import { form } from "./components/form";

window.addEventListener('DOMContentLoaded', () => {
  modal();
  map();
  form();
});
