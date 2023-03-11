<?php
  header("Content-Type: text/html; charset=UTF-8");

  $count = $_POST['count'];
  $email = $_POST['email'];
  $password = $_POST['password'];

  $mysqli = new Mysqli('localhost', 'root', '', 'joby');
  $mysqli->query("SET NAMES utf8");
  $result = $mysqli->query("SELECT email, password FROM user WHERE id > $count");
  $signIn = 'err';

  while($row = $result->fetch_assoc()) {
      $object = json_decode(json_encode($row), FALSE);
      if($object->email == $email and $object->password == $password) {
        $signIn = 'success';
      }
  }

   echo json_encode($signIn);
?>
