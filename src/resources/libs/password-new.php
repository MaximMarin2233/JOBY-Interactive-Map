<?php
  header("Content-Type: text/html; charset=UTF-8");

  $email = $_POST['email'];
  $password = $_POST['password'];
  $hash = password_hash($password, PASSWORD_BCRYPT);

  $mysqli = new Mysqli('localhost', 'root', '', 'joby');
  $mysqli->query("SET NAMES utf8");
  $result = $mysqli->query("SELECT id, email FROM user WHERE id > 0");
  $final = array(
    "response" => false,
  );

  while($row = $result->fetch_assoc()) {
      $object = json_decode(json_encode($row), FALSE);

      if($object->email == $email) {
        $final["response"] = true;


        $mysqli->query("UPDATE user SET password = '$hash' WHERE id = $object->id");


      }
  }

   echo json_encode($final);
?>
