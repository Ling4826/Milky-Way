<?php
header("Content-Type: application/json; charset=UTF-8");


$conn = new mysqli("localhost", "root", "", "milky_way");
$conn->set_charset("utf8");

$sql ="SELECT moon.Moon_ID , moon.Name, moon.MoonDiameter, moon.Mass, moon.Magnitude, moon.Planet_ID, moon.OrbitalPeriod,
               p.RA_hour, p.RA_minute, p.RA_second, p.dec_deg, p.dec_min, p.dec_sec
        FROM moon
        JOIN `position` p ON moon.Moon_ID = p.Position_ID";

$result = $conn->query($sql);

$moon = [];
while($row = $result->fetch_assoc()) {
    $moon[] = $row;
}
echo json_encode($moon);

$conn->close();
?>
