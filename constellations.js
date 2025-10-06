// Constellation lines data for a star map (Orion, Ursa Major, Cassiopeia as example)
// Each constellation is an array of [ [star1], [star2] ] pairs, where each star is {RA, Dec}
// For a real map, use a full dataset (this is a minimal example)
window.constellations = [
  // Orion's Belt
  [
    { RA: 5.9195, Dec: -1.2019 }, // Alnitak
    { RA: 5.6036, Dec: -1.2019 }  // Alnilam
  ],
  [
    { RA: 5.6036, Dec: -1.2019 }, // Alnilam
    { RA: 5.2423, Dec: -1.2019 }  // Mintaka
  ],
  // Big Dipper (Ursa Major, partial)
  [
    { RA: 11.0621, Dec: 61.7508 }, // Dubhe
    { RA: 13.3987, Dec: 54.9254 }  // Merak
  ],
  [
    { RA: 13.3987, Dec: 54.9254 }, // Merak
    { RA: 13.7923, Dec: 49.3133 }  // Phecda
  ],
  // Cassiopeia (partial)
  [
    { RA: 0.6751, Dec: 56.5373 }, // Caph
    { RA: 1.4303, Dec: 60.2353 }  // Schedar
  ],
  [
    { RA: 1.4303, Dec: 60.2353 }, // Schedar
    { RA: 2.2937, Dec: 59.1498 }  // Gamma Cas
  ]
];
