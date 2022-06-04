<?php      
    include('connect.php');  
    $email = $_POST['email'];
    $password = $_POST['password'];  
      
        //to prevent from mysqli injection  
        $email = stripcslashes($email);  
        $password = stripcslashes($password);  
        $email = mysqli_real_escape_string($connect, $email);  
        $password = mysqli_real_escape_string($connect, $password);  
    
        $sql = "SELECT * FROM akun where email = '$email' and password = '$password'";  
        $result = mysqli_query($connect, $sql);  
        $row = mysqli_fetch_array($result, MYSQLI_ASSOC);  
        $count = mysqli_num_rows($result);  
          
        if($count != 1){    
            echo("<script LANGUAGE='JavaScript'>
                        window.alert('Username or Password is wrong. Please try again.');
                        window.location.href='home.html';
                    </script>");
        }   
          
        else{
            header('Location: home.html');
            echo("<script LANGUAGE='JavaScript'>
            window.location.href='home.html';
        </script>");
        debug_to_console("login berhasil")
        }   

        function debug_to_console($data) {
            $output = $data;
            if (is_array($output))
                $output = implode(',', $output);
        
            echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
        }
        
?>