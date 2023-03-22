export function addToLS(email, password) {
  localStorage.setItem('userInf', JSON.stringify({
    email: email,
    password: password
  }));
}
