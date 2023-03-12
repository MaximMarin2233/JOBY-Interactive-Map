<?php
  header("Content-Type: text/html; charset=UTF-8");

  $email = $_POST['email'];
  $password = $_POST['password'];

  $mysqli = new Mysqli('localhost', 'root', '', 'joby');
  $mysqli->query("SET NAMES utf8");
  $result = $mysqli->query("SELECT email, password FROM user WHERE id > 0");
  $signIn = false;

  while($row = $result->fetch_assoc()) {
      $object = json_decode(json_encode($row), FALSE);
      if($object->email == $email and $object->password == $password) {
        $signIn = true;
      }
  }

   echo json_encode($signIn);
?>
