<?php
  $email = $_POST['email'];
  $password = $_POST['password'];
  $mark = $_POST['mark'];
  $mysqli = new Mysqli('localhost', 'root', '', 'joby');
  $mysqli->query("SET NAMES utf8");
  $mysqli->query("INSERT INTO `user`(`email`, `password`, `mark`) VALUES('$email', '$password', '$mark')");
?>
