
CREATE TABLE GalacticRegion (
    Region_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Coordinates VARCHAR(100),
    Type VARCHAR(50),
    Size FLOAT,
    Magnitude FLOAT,
    Position_ID INT,
    FOREIGN KEY (Position_ID) REFERENCES `position`(Position_ID)
);

CREATE TABLE SolarSystem (
    System_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Region_ID INT,
    Size FLOAT,
    Magnitude FLOAT,
    Position_ID INT,
    FOREIGN KEY (Region_ID) REFERENCES GalacticRegion(Region_ID),
    FOREIGN KEY (Position_ID) REFERENCES `position`(Position_ID)
);

CREATE TABLE Star (
    Star_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    StarType VARCHAR(50),
    Temperature FLOAT,
    Mass FLOAT,
    Distance FLOAT,
    Magnitude FLOAT,
    Position_ID INT,
    FOREIGN KEY (Position_ID) REFERENCES `position`(Position_ID)
);

CREATE TABLE Planet (
    Planet_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    PlanetType VARCHAR(50),
    OrbitalPeriod FLOAT,
    Star_ID INT,
    Diameter FLOAT,
    Magnitude FLOAT,
    Position_ID INT,
    FOREIGN KEY (Star_ID) REFERENCES Star(Star_ID),
    FOREIGN KEY (Position_ID) REFERENCES `position`(Position_ID)
);

CREATE TABLE Moon (
    Moon_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    MoonDiameter FLOAT,
    Mass FLOAT,
    Magnitude FLOAT,
    Planet_ID INT,
    OrbitalPeriod FLOAT,
    Position_ID INT,
    FOREIGN KEY (Planet_ID) REFERENCES Planet(Planet_ID),
    FOREIGN KEY (Position_ID) REFERENCES `position`(Position_ID)
);

CREATE TABLE Comet (
    Comet_ID INT PRIMARY KEY AUTO_INCREMENT,
    System_ID INT,
    Name VARCHAR(100),
    Size FLOAT,
    Magnitude FLOAT,
    OrbitalPeriod FLOAT,
    Position_ID INT,
    FOREIGN KEY (System_ID) REFERENCES SolarSystem(System_ID),
    FOREIGN KEY (Position_ID) REFERENCES `position`(Position_ID)
);

CREATE TABLE Blackhole (
    Blackhole_ID INT PRIMARY KEY AUTO_INCREMENT,
    Region_ID INT,
    Name VARCHAR(100),
    Type VARCHAR(50),
    Mass FLOAT,
    Size FLOAT,
    Magnitude FLOAT,
    Position_ID INT,
    FOREIGN KEY (Region_ID) REFERENCES GalacticRegion(Region_ID),
    FOREIGN KEY (Position_ID) REFERENCES `position`(Position_ID)
);

CREATE TABLE Nebula (
    Nebula_ID INT PRIMARY KEY AUTO_INCREMENT,
    Region_ID INT,
    Name VARCHAR(100),
    Type VARCHAR(50),
    Size FLOAT,
    Magnitude FLOAT,
    Position_ID INT,
    FOREIGN KEY (Region_ID) REFERENCES GalacticRegion(Region_ID),
    FOREIGN KEY (Position_ID) REFERENCES `position`(Position_ID)
);
