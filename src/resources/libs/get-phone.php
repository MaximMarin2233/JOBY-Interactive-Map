<?php
  header("Content-Type: text/html; charset=UTF-8");

  $id = $_POST['id'];

  $mysqli = new Mysqli('localhost', 'root', '', 'joby');
  $mysqli->query("SET NAMES utf8");
  $result = $mysqli->query("SELECT phone FROM user WHERE id = $id");
  $final = array(
    "response" => false,
  );

  while($row = $result->fetch_assoc()) {
      $object = json_decode(json_encode($row), FALSE);

      if(strlen($object->phone) > 0) {
        $final["response"] = true;
        $final["phone"] = $object->phone;
      }
  }

   echo json_encode($final);
?>
