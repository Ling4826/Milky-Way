<?php
header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli("localhost", "root", "", "milky_way");
$conn->set_charset("utf8");

$sql ="SELECT nebula.Nebula_ID, nebula.Region_ID , nebula.Name, nebula.Type, nebula.Size, nebula.Magnitude,
             p.RA_hour, p.RA_minute, p.RA_second, p.dec_deg, p.dec_min, p.dec_sec
      FROM nebula
      JOIN `position` p ON Nebula.Position_ID = p.Position_ID";

$nebula = $conn->query($sql);

$comet = [];
while($row = $nebula->fetch_assoc()) {
    $comet[] = $row;
}
echo json_encode($comet);

$conn->close();
?>
