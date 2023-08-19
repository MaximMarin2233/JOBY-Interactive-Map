<?php
  header("Content-Type: text/html; charset=UTF-8");

  $email = $_POST['email'];

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

        $code = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

        $mysqli2 = new Mysqli('localhost', 'root', '', 'joby');
        $mysqli2->query("SET NAMES utf8");
        $mysqli2->query("UPDATE user SET mark = '$code' WHERE id = $object->id");



      }
  }

   echo json_encode($final);
?>
