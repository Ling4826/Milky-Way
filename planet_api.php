<?php
header("Content-Type: application/json; charset=UTF-8");


$conn = new mysqli("localhost", "root", "", "milky_way");
$conn->set_charset("utf8");

$sql ="SELECT pl.Planet_ID , pl.Name, pl.PlanetType, pl.OrbitalPeriod, pl.Star_ID, pl.Diameter, pl.Magnitude,
               p.RA_hour, p.RA_minute, p.RA_second, p.dec_deg, p.dec_min, p.dec_sec
        FROM planet pl
        JOIN `position` p ON pl.Planet_ID = p.Position_ID";

$result = $conn->query($sql);

$planet = [];
while($row = $result->fetch_assoc()) {
    $planet[] = $row;
}
echo json_encode($planet);

$conn->close();
?>
