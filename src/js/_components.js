import './components/checkUser';
import './components/loginUser';
import './components/map';
import './components/form';

import { checkUser } from "./components/checkUser";
import { loginUser } from "./components/loginUser";
import { map } from "./components/map";
import { form } from "./components/form";

window.addEventListener('DOMContentLoaded', () => {
  let user;

  try {
    user = JSON.parse(localStorage.getItem('userInf'));
  } catch (err) {
    user = false;
  }

  if(user) {
    checkUser('libs/sign-in-LS.php', user.email, user.password, (data) => {
      if(data.response) {
        loginUser(user.email);
      }
    });
  }
  map();
  form();
});
