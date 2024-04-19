<?php
  header("Content-Type: text/html; charset=UTF-8");

  $mysqli = new Mysqli('localhost', 'root', '', 'joby');
  $mysqli->query("SET NAMES utf8");
  $result = $mysqli->query("SELECT coords, phone, placemarkTitle, placemarkText FROM user WHERE id > 0");
  $final = array(
    "response" => false,
  );

  $coordsArray = array();

  $i = 0;

  while($row = $result->fetch_assoc()) {
      $object = json_decode(json_encode($row), FALSE);

      if(strlen($object->coords) > 0) {
        $coordsArray[] = array('coords' => $object->coords,
                              'phone' => $object->phone,
                              'placemarkTitle' => $object->placemarkTitle,
                              'placemarkText' => $object->placemarkText
                            );
      }
  }

  if (count($coordsArray) > 0) {
    $final["response"] = true;
    $final["coordsArr"] = $coordsArray;
  }

   echo json_encode($final);
?>
