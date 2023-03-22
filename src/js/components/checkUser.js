export function checkUser(path, email, password, action) {
  const xmlhttp = new XMLHttpRequest();

  xmlhttp.open('post', path, true);
      xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xmlhttp.send("email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password));

      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
          if (xmlhttp.status == 200) {
            var data = xmlhttp.responseText;
            if (data != 'empty') {
              data = JSON.parse(data);

              action(data);
            }
          }
        }
      };
}
