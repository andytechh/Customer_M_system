<?php 

$host = 'localhost';
$username = 'root'; 
$password = '';
$dbname = 'cms_database'; 

$connect = mysqli_connect($host, $username, $password, $dbname);
if (!$connect) {
    die("Connection failed: " . mysqli_connect_error());
} else {
    //echo "Connected successfully";
}
?>