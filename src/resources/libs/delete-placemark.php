<?php
  header("Content-Type: text/html; charset=UTF-8");

  $email = $_POST['email'];

  $mysqli = new Mysqli('localhost', 'root', '', 'joby');
  $mysqli->query("SET NAMES utf8");
  $result = $mysqli->query("SELECT coords, phone, placemarkTitle, placemarkText, placemarkDate FROM user WHERE email = '".$email."'");
  $final = array(
    "response" => false,
  );

  $object = json_decode(json_encode($result->fetch_assoc()), FALSE);

  $mysqli->query("UPDATE user SET coords = '', phone = '', placemarkTitle = '', placemarkText = '', placemarkDate = '' WHERE email = '".$email."'");
  $final["response"] = true;


   echo json_encode($final);
?>
