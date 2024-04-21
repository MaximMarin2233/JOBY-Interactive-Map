<?php
  $email = $_POST['email'];
  $password = $_POST['password'];
  $hash = password_hash($password, PASSWORD_BCRYPT);
  $code = $_POST['code'];
  $coords = $_POST['coords'];
  $phone = $_POST['phone'];
  $placemarkTitle = $_POST['placemarkTitle'];
  $placemarkText = $_POST['placemarkText'];
  $placemarkDate = $_POST['placemarkDate'];

  $mysqli = new Mysqli('localhost', 'root', '', 'joby');
  $mysqli->query("SET NAMES utf8");
  $mysqli->query("INSERT INTO `user`(`email`,
                                    `password`,
                                    `code`,
                                    `coords`,
                                    `phone`,
                                    `placemarkTitle`,
                                    `placemarkText`,
                                    `placemarkDate`
                                    ) VALUES('$email',
                                            '$hash',
                                            '$code',
                                            '$coords',
                                            '$phone',
                                            '$placemarkTitle',
                                            '$placemarkText',
                                            '$placemarkDate'
                                            )");
?>
