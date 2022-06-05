<?php
  include "connect.php";

  $nama = isset($_POST["nama"]) ? $_POST["nama"] : "";
  $email = isset($_POST["email"]) ? $_POST["email"] : "";
  $password = isset($_POST["password"]) ? $_POST["password"] : "";

  if ($nama != "" && $email != "" && $password != "") 
  {
    $sql_nama = "SELECT * FROM akun WHERE nama = '$nama'";
    $res_nama = mysqli_query($connect, $sql_nama);

    $sql = "INSERT INTO `akun` (`nama`, `email`, `password`	) VALUES ('".$nama."', '".$email."', '".$password."');";
    $query = mysqli_query($connect, $sql);
  }

  if ($query) 
  {
    $msg = "Save account data successfully!";
  } 
  else 
  {
    $msg = "Save account data failed";
  }

  $response = array(
    "msg" => $msg
  );

  echo json_encode($response);

  header('Location: register.html');
?>
