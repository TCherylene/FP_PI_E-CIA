<?php
     $connect = mysqli_connect("localhost", "root", "", "e-cia");
    if(!$connect){
        echo "<script>console.log('Debug Objects: database tidak connect' );</script>";
        exit("Database has not been connected");   
    } 
    echo "<script>console.log('Debug Objects: database sudah connect' );</script>"; 
?>

   