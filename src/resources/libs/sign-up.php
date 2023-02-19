<?php
  $email = $_POST['email'];
  $password = $_POST['password'];
  $mysqli = new Mysqli('localhost', 'root', '', 'joby');
  $mysqli->query("SET NAMES utf8");
  $mysqli->query("INSERT INTO `user`(`email`, `password`) VALUES('$email', '$password')");
?>
