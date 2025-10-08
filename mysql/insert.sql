-- 1. ตำแหน่งทุก entity
INSERT INTO `position` (RA_hour, RA_minute, RA_second, dec_deg, dec_min, dec_sec)
VALUES (5, 30, 15.0, -10, 20, 22.5); -- ID = 1

INSERT INTO `position` (RA_hour, RA_minute, RA_second, dec_deg, dec_min, dec_sec)
VALUES (13, 12, 7.0, 0, 0, 0);

INSERT INTO `position` (RA_hour, RA_minute, RA_second, dec_deg, dec_min, dec_sec)
VALUES (18, 36, 56.2, 38, 47, 1.2); -- ID = 3

INSERT INTO `position` (RA_hour, RA_minute, RA_second, dec_deg, dec_min, dec_sec)
VALUES (19, 10, 34.2, 20, 12, 44.5); -- ID = 4

INSERT INTO `position` (RA_hour, RA_minute, RA_second, dec_deg, dec_min, dec_sec)
VALUES (20, 30, 12.0, -10, 10, 17.7); -- ID = 5

INSERT INTO `position` (RA_hour, RA_minute, RA_second, dec_deg, dec_min, dec_sec)
VALUES (7, 13, 57.4, 40, 0, 0.1); -- ID = 6

-- 2. GalacticRegion
INSERT INTO GalacticRegion (Name, Coordinates, Type, Size, Position_ID)
VALUES ('Orion Arm', '05h 35m 17.3s, -05° 23′ 28″', 'Spiral Arm', 12000, 1);

-- 3. SolarSystem
INSERT INTO SolarSystem (Name, Region_ID, Size, Position_ID)
VALUES ('Solar System', 1, 300, 2);

-- 4. Star
INSERT INTO Star (Name, StarType, Temperature, Mass, Distance, magnitude, Position_ID)
VALUES ('Vega', 'A0V', 9602, 2.13, 25.04, 0.03, 3);

-- 5. Planet
INSERT INTO Planet (Name, PlanetType, OrbitalPeriod, Star_ID, Diameter, Position_ID)
VALUES ('Neptune', 'Gas Giant', 60190, 1, 49244, 4);

-- 6. Moon
INSERT INTO Moon (Name, MoonDiameter, Mass, Planet_ID, OrbitalPeriod, Position_ID)
VALUES ('Triton', 2706.8, 2.14e22, 1, 5.9, 5);

-- 7. Comet
INSERT INTO Comet (System_ID, Name, Size, magnitude, OrbitalPeriod, Position_ID)
VALUES (1, 'Halley', 11, 28.2, 75.3, 6);

-- 8. Blackhole
INSERT INTO Blackhole (Region_ID, Name, Type, Mass, Size, Position_ID)
VALUES (1, 'Cygnus X-1', 'Stellar', 14.8, 43, 1);

-- 9. Nebula
INSERT INTO Nebula (Region_ID, Name, Type, Size, magnitude, Position_ID)
VALUES (1, 'Orion Nebula', 'Diffuse', 24, 4.0, 1);