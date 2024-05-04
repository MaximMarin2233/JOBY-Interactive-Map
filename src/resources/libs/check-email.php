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


                $body = "
<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">
<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" lang=\"ru\">

<head>
  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />
  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
  <meta name=\"color-scheme\" content=\"light dark\" />
  <meta name=\"supported-color-schemes\" content=\"light dark\" />
  <title>JOBY</title>
  <style type=\"text/css\">
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

    table {
      border-spacing: 0;
      mso-cellspacing: 0;
      mso-padding-alt: 0;
    }

    td {
      padding: 0;
    }

    #outlook a {
      padding: 0;
    }

    a {
      text-decoration: none;
      color: #e8fbfa;
      font-size: 16px;
    }

    @media screen and (max-width: 599.98px) {}

    @media screen and (max-width: 399.98px) {
      .mobile-padding {
        padding-right: 10px !important;
        padding-left: 10px !important;
      }

      .mobile-col-padding {
        padding-right: 0 !important;
        padding-left: 0 !important;
      }

      .two-columns .column {
        width: 100% !important;
        max-width: 100% !important;
      }

      .two-columns .column img {
        width: 100% !important;
        max-width: 100% !important;
      }

      .three-columns .column {
        width: 100% !important;
        max-width: 100% !important;
      }

      .three-columns .column img {
        width: 100% !important;
        max-width: 100% !important;
      }
    }

    /* Custom Dark Mode Colors */
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }

    @media (prefers-color-scheme: dark) {

      table,
      td {
        background-color: #06080B !important;
      }

      h1,
      h2,
      h3,
      p {
        color: #ffffff !important;
      }
    }
  </style>

  <!--[if (gte mso 9)|(IE)]>
    <style type=\"text/css\">
      table {border-collapse: collapse !important;}
    </style>
  <![endif]-->

  <!--[if (gte mso 9)|(IE)]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
</head>

<body style=\"Margin:0;padding:0;min-width:100%;background-color:#dde0e1;\">

  <!--[if (gte mso 9)|(IE)]>
      <style type=\"text/css\">
         body {background-color: #dde0e1!important;}
         body, table, td, p, a {font-family: sans-serif, Arial, Helvetica!important;}
      </style>
   <![endif]-->

  <center style=\"width: 100%;table-layout:fixed;background-color: #dde0e1;padding-top: 40px;padding-bottom: 40px;\">
    <div style=\"max-width: 600px;background-color: #fafdfe;box-shadow: 0 0 10px rgba(0, 0, 0, .2);\">

      <!-- Preheader (remove comment) -->
      <div
        style=\"font-size: 0px;color: #fafdfe;line-height: 1px;mso-line-height-rule:exactly;display: none;max-width: 0px;max-height: 0px;opacity: 0;overflow: hidden;mso-hide:all;\">
        Шестизначный код
      </div>
      <!-- End Preheader (remove comment) -->

      <!--[if (gte mso 9)|(IE)]>
        <table width=\"600\" align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" role=\"presentation\"
          style=\"color:#1C1E23;\">
        <tr>
        <td>
      <![endif]-->

      <table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" role=\"presentation\"
        style=\"color:#1C1E23;font-family: 'Poppins',sans-serif, Arial, Helvetica;background-color: #fafdfe;Margin:0;padding:0;width: 100%;max-width: 600px;\">
          <!-- Logo -->
          <tr>
            <td>
              <table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" role=\"presentation\">
                <tr>
                  <td style=\"padding: 19px 0 19px 0;text-align: center;\">
                    <a href=\"https://maxgraph.ru\" target=\"_blank\">
                      <img src=\"https://i.ibb.co/Kwwv0jb/logo.png\" alt=\"JOBY Logo\" border=\"0\" width=\"173\" />
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- End Logo -->

          <!-- Hero -->
          <tr>
            <td style=\"padding: 0px 24px 25px 24px;\">
              <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" role=\"presentation\" style=\"width: 100%; max-width: 600px;\">
                <tr>
                  <td>
                    <div style=\"height: 1px; width: 100%;background-color:#f3f3f3;\"></div>
                  </td>
                </tr>
                <tr>
                  <td style=\"padding: 19px 0 10px 0;\">
                    <p style=\"margin: 0;font-weight: 400;font-size: 16px;line-height: 25px;color: #525F7F;\">
                      Ваш код для сброса пароля:
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h1 style=\"margin: 0;font-weight: 400;font-size: 30px;line-height: 1;color: #1C1E23;\">$code</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- End Hero -->


      </table>

      <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
      <![endif]-->

    </div>
  </center>

</body>

</html>";

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
