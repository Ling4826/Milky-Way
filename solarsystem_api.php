<?php
header("Content-Type: application/json; charset=UTF-8");


$conn = new mysqli("localhost", "root", "", "milky_way");
$conn->set_charset("utf8");

$sql ="SELECT solarsystem.System_ID, solarsystem.Name , solarsystem.Region_ID,solarsystem.Size, solarsystem.Magnitude,
               p.RA_hour, p.RA_minute, p.RA_second, p.dec_deg, p.dec_min, p.dec_sec
        FROM solarsystem
        JOIN `position` p ON solarsystem.Position_ID = p.Position_ID";

$result = $conn->query($sql);

$Solar = [];
while($row = $result->fetch_assoc()) {
    $Solar[] = $row;
}
echo json_encode($Solar);

$conn->close();
?>
