<?php
  header("Content-Type: text/html; charset=UTF-8");

  $email = $_POST['email'];
  $coords = $_POST['coords'];
  $phone = $_POST['phone'];
  $title = $_POST['title'];
  $text = $_POST['text'];

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

        $mysqli->query("UPDATE user SET coords = '$coords', phone = '$phone', placemarkTitle = '$title', placemarkText = '$text' WHERE id = $object->id");
      }
  }

   echo json_encode($final);
?>
