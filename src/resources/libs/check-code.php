<?php
  header("Content-Type: text/html; charset=UTF-8");

  $email = $_POST['email'];
  $code = $_POST['code'];

  $mysqli = new Mysqli('localhost', 'root', '', 'joby');
  $mysqli->query("SET NAMES utf8");
  $result = $mysqli->query("SELECT code FROM user WHERE email = '".$email."'");
  $final = array(
    "response" => false,
  );

  $object = json_decode(json_encode($result->fetch_assoc()), FALSE);

  if($object->code == $code) {
    $final["response"] = true;
  }

   echo json_encode($final);
?>
