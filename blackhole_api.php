<?php
header("Content-Type: application/json; charset=UTF-8");


$conn = new mysqli("localhost", "root", "", "milky_way");
$conn->set_charset("utf8");

$sql ="SELECT blackhole.Blackhole_ID,blackhole.Region_ID, blackhole.Name , blackhole.Type,blackhole.Mass,blackhole.Size, blackhole.Magnitude,
               p.RA_hour, p.RA_minute, p.RA_second, p.dec_deg, p.dec_min, p.dec_sec
        FROM blackhole
        JOIN `position` p ON blackhole.Position_ID = p.Position_ID";

$result = $conn->query($sql);

$blackhole = [];
while($row = $result->fetch_assoc()) {
    $blackhole[] = $row;
}
echo json_encode($blackhole);

$conn->close();
?>
