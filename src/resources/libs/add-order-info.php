<?php
  header("Content-Type: text/html; charset=UTF-8");

  date_default_timezone_set('Europe/Moscow');

  setlocale(LC_TIME, 'ru_RU.UTF-8');

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

        $now = time();
        $formatted_date = date("j F H:i", $now);

        $months = array(
            'January' => 'Января',
            'February' => 'Февраля',
            'March' => 'Марта',
            'April' => 'Апреля',
            'May' => 'Мая',
            'June' => 'Июня',
            'July' => 'Июля',
            'August' => 'Августа',
            'September' => 'Сентября',
            'October' => 'Октября',
            'November' => 'Ноября',
            'December' => 'Декабря'
        );

        $formatted_date = str_replace(array_keys($months), array_values($months), $formatted_date);

        $mysqli->query("UPDATE user SET coords = '$coords', phone = '$phone', placemarkTitle = '$title', placemarkText = '$text', placemarkDate = '$formatted_date' WHERE id = $object->id");
      }
  }

   echo json_encode($final);
?>
