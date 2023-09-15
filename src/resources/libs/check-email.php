<?php
  require 'phpmailer/PHPMailer.php';
  require 'phpmailer/SMTP.php';
  require 'phpmailer/Exception.php';

  header("Content-Type: text/html; charset=UTF-8");

  $email = $_POST['email'];

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

        $code = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

        $mysqli->query("UPDATE user SET code = '$code' WHERE id = $object->id");

// HTML LETTER
        $title = "Проверочный код для восстановления пароля";

        $c = true;
        // Формирование самого письма
        $title = "Ваш проверочный код";
        $body .= "
        " . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #f8f8f8;">' ) . "
          <td style='padding: 10px; border: #e9e9e9 1px solid;'><b>$code</b></td>
        </tr>
        ";

        $body = "<table style='width: 100%;'>$body</table>";

        // Настройки PHPMailer
        $mail = new PHPMailer\PHPMailer\PHPMailer();

        try {
          $mail->isSMTP();
          $mail->CharSet = "UTF-8";
          $mail->SMTPAuth   = true;

          // Настройки вашей почты
          $mail->Host       = 'smtp.gmail.com'; // SMTP сервера вашей почты
          $mail->Username   = 'bafldalovdursun78@gmail.com'; // Логин на почте
          $mail->Password   = 'fldmjltbukqilegu'; // Пароль на почте
          $mail->SMTPSecure = 'ssl';
          $mail->Port       = 465;

          $mail->setFrom('bafldalovdursun78@gmail.com', 'JOBY'); // Адрес самой почты и имя отправителя

          // Получатель письма
          $mail->addAddress($email);


          // Отправка сообщения
          $mail->isHTML(true);
          $mail->Subject = $title;
          $mail->Body = $body;

          $mail->send();

        } catch (Exception $e) {
          $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
        }
// HTML LETTER CLOSE





      }
  }

   echo json_encode($final);
?>
