<?php
// Enter your database connection here
$hostname = "localhost";
$username = "root";
$password = "";
 
// Connection to the database
$dbhandle = mysql_connect($hostname, $username, $password) 
	or die("Unable to connect to MySQL");

// Select a database to work with
$selected = mysql_select_db("tiva_timetables", $dbhandle) 
	or die("Could not select database");

// Select timetables table
$result = mysql_query("SELECT * FROM timetables");

// Fetch tha data from the database 
$timetables = array();
while ($row = mysql_fetch_array($result)) {
	$timetable = new stdClass();
	$timetable->name = $row{'name'};
	$timetable->image = $row{'image'};
	$timetable->date = date('j', strtotime($row{'date'})); // date : type DATE. For example: 2016-09-07
	$timetable->month = date('n', strtotime($row{'date'}));
	$timetable->year = date('Y', strtotime($row{'date'}));
	$timetable->day = $row{'day'};
	$timetable->start_time = $row{'start_time'} ? date('H:i', strtotime($row{'start_time'})) : ''; // start_time : Must be 24 hour format. For example: 18:00
	$timetable->end_time = $row{'end_time'} ? date('H:i', strtotime($row{'end_time'})) : ''; // end_time : Must be 24 hour format. For example: 20:30
	$timetable->color = $row{'color'};
	$timetable->description = utf8_encode(nl2br($row{'description'}));
	
	array_push($timetables, $timetable);
}

echo json_encode($timetables);
?>