<?php

require_once("config.php");

if(isset($_POST['register'])){

    // filter data yang diinputkan
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    // $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);
    // enkripsi password
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    $password = password_hash($_POST["password"], PASSWORD_DEFAULT);
    


    // menyiapkan query
    $sql = "INSERT INTO users (name,  email, password) 
            VALUES (:name,  :email, :password)";
    $stmt = $db->prepare($sql);

    // bind parameter ke query
    $params = array(
        ":name" => $name,
        // ":username" => $username,
        ":email" => $email,
        ":password" => $password
      
    );

    // eksekusi query untuk menyimpan ke database
    $saved = $stmt->execute($params);

    // jika query simpan berhasil, maka user sudah terdaftar
    // maka alihkan ke halaman login
    if($saved) header("Location: login.php");
}

?>

<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link rel="stylesheet" href="css/style.css">
   
    <title>Register!</title>
  </head>
<body>
  <div class="parent clearfix">
    <div class="bg-illustration">
  
    </div>
    
    <div class="login">
      <div class="container">
        <h1>Register </h1>
    
        <div class="login-form">
          <form method="POST" action="" onsubmit="return formValidation()">
            <input type="text" id="name" name="name" placeholder="Name">
            <input type="email" id="email" name="email" placeholder="Email">
            <input type="password"id="password" name="password" placeholder="Password">
            <p>Sudah punya akun? <a href="login.php">Login</a></p>
            <div class='row'></div>
            <!-- <button type="submit" id="submit">Register</button> -->
            <button type="submit" class="btn btn-success btn-block"id="submit" name="register" value="Daftar">Register </button>
          </div>
          </form>
      </div>
      </div>
      </div>
  </div>
</body>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.1/jquery.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/js/materialize.min.js"></script>
<script>
     </body>
</html>