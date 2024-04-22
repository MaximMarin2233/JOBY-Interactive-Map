<?php
  header("Content-Type: text/html; charset=UTF-8");

  $mysqli = new Mysqli('localhost', 'root', '', 'joby');
  $mysqli->query("SET NAMES utf8");
  $result = $mysqli->query("SELECT id, coords, placemarkTitle, placemarkText, placemarkDate FROM user WHERE id > 0");
  $final = array(
    "response" => false,
  );

  $coordsArray = array();

  while($row = $result->fetch_assoc()) {
      $object = json_decode(json_encode($row), FALSE);

      if(strlen($object->coords) > 0) {
        $coordsArray[] = array(
                              'id' => $object->id,
                              'coords' => $object->coords,
                              'placemarkTitle' => $object->placemarkTitle,
                              'placemarkText' => $object->placemarkText,
                              'placemarkDate' => $object->placemarkDate
                            );
      }
  }

  if (count($coordsArray) > 0) {
    $final["response"] = true;
    $final["coordsArr"] = $coordsArray;
  }

   echo json_encode($final);
?>
