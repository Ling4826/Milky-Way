<?php
header("Content-Type: application/json; charset=UTF-8");


$conn = new mysqli("localhost", "root", "", "milky_way");
$conn->set_charset("utf8");

$sql ="SELECT comet.Comet_ID, comet.System_ID , comet.Name, comet.Size,comet.Magnitude, comet.OrbitalPeriod,
               p.RA_hour, p.RA_minute, p.RA_second, p.dec_deg, p.dec_min, p.dec_sec
        FROM comet
        JOIN `position` p ON comet.Position_ID = p.Position_ID";

$result = $conn->query($sql);

$comet = [];
while($row = $result->fetch_assoc()) {
    $comet[] = $row;
}
echo json_encode($comet);

$conn->close();
?>
