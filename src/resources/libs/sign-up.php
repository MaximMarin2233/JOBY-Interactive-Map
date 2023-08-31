<?php
  $email = $_POST['email'];
  $password = $_POST['password'];
  $hash = password_hash($password, PASSWORD_BCRYPT);
  $mark = $_POST['mark'];
  $code = $_POST['code'];
  $mysqli = new Mysqli('localhost', 'root', '', 'joby');
  $mysqli->query("SET NAMES utf8");
  $mysqli->query("INSERT INTO `user`(`email`, `password`, `mark`, `code`) VALUES('$email', '$hash', '$mark', '$code')");
?>
