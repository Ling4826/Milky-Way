<?php
header("Content-Type: application/json; charset=UTF-8");


$conn = new mysqli("localhost", "root", "", "milky_way");
$conn->set_charset("utf8");

$sql = "SELECT st.Star_ID, st.Name, st.StarType, st.Temperature, st.Mass, st.Distance, st.magnitude,
               p.RA_hour, p.RA_minute, p.RA_second, p.dec_deg, p.dec_min, p.dec_sec
        FROM Star st
        JOIN `position` p ON st.Position_ID = p.Position_ID";

$result = $conn->query($sql);

$stars = [];
while($row = $result->fetch_assoc()) {
    $stars[] = $row;
}
echo json_encode($stars);

$conn->close();
?>
