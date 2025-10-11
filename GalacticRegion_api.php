<?php
header("Content-Type: application/json; charset=UTF-8");


$conn = new mysqli("localhost", "root", "", "milky_way");
$conn->set_charset("utf8");

$sql ="SELECT galacticregion.Region_ID, galacticregion.Name , galacticregion.Coordinates, galacticregion.Type,galacticregion.Size, galacticregion.Magnitude,
               p.RA_hour, p.RA_minute, p.RA_second, p.dec_deg, p.dec_min, p.dec_sec
        FROM galacticregion
        JOIN `position` p ON galacticregion.Position_ID = p.Position_ID";

$result = $conn->query($sql);

$galactic = [];
while($row = $result->fetch_assoc()) {
    $galactic[] = $row;
}
echo json_encode($galactic);

$conn->close();
?>
