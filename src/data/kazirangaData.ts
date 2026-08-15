import { SensorMarker, AnimalCluster, CorridorPathway } from '../types';

// Kaziranga Park & Bokakhat Area Center
export const KAZIRANGA_CENTER: [number, number] = [26.592, 93.385];

// Static ESZ Circles Centers and Radii (in meters)
export const STATIC_10KM_CENTER: [number, number] = [26.592, 93.385];
export const STATIC_10KM_RADIUS_METERS = 10000; // 10 km

export const STATIC_1KM_CENTER: [number, number] = [26.592, 93.385];
export const STATIC_1KM_RADIUS_METERS = 1500; // 1.5 km tight

// Sensors array (AI Camera Traps, Acoustic Sensors, Seismic Sensors) along NH-37 & Karbi Anglong Hills
export const INITIAL_SENSORS: SensorMarker[] = [
  {
    id: 'cam-01',
    name: 'NH37-Panbari Cam 01',
    type: 'camera_trap',
    lat: 26.606,
    lng: 93.473,
    locationName: 'Panbari Wildlife Crossing (NH-37)',
    corridor: 'Panbari Corridor',
    status: 'active',
    battery: 94,
    detectionCount: 142,
    description: 'AI thermal optical lens tracking elephant herds crossing NH-37 towards Karbi Anglong.'
  },
  {
    id: 'acou-01',
    name: 'Acoustic-Panbari 02',
    type: 'acoustic_sensor',
    lat: 26.612,
    lng: 93.482,
    locationName: 'Panbari Reserve Forest Edge',
    corridor: 'Panbari Corridor',
    status: 'active',
    battery: 88,
    detectionCount: 89,
    description: 'Acoustic array listening for low-frequency elephant trumpets and vehicle diesel sound signatures.'
  },
  {
    id: 'seis-01',
    name: 'Seismic-Haldibhari 01',
    type: 'seismic_sensor',
    lat: 26.568,
    lng: 93.310,
    locationName: 'Haldibhari Highway Corridor',
    corridor: 'Haldibhari Corridor',
    status: 'active',
    battery: 91,
    detectionCount: 210,
    description: 'Sub-surface ground vibration sensor detecting heavy mammal footfalls (Rhino & Elephant).'
  },
  {
    id: 'cam-02',
    name: 'NH37-Kanchanjuri Cam',
    type: 'camera_trap',
    lat: 26.538,
    lng: 93.220,
    locationName: 'Kanchanjuri Crossing',
    corridor: 'Kanchanjuri Corridor',
    status: 'active',
    battery: 85,
    detectionCount: 175,
    description: 'High-speed camera trap capturing animal crossings across Kuthori-Kanchanjuri stretch.'
  },
  {
    id: 'acou-02',
    name: 'Acoustic-Deopahar Hill',
    type: 'acoustic_sensor',
    lat: 26.600,
    lng: 93.530,
    locationName: 'Deopahar Elephant Slope',
    corridor: 'Deopahar Corridor',
    status: 'active',
    battery: 96,
    detectionCount: 64,
    description: 'Monitors acoustic chatter of migratory elephant herds along Numaligarh-Deopahar hills.'
  },
  {
    id: 'cam-03',
    name: 'NH37-Kohora Central Cam',
    type: 'camera_trap',
    lat: 26.585,
    lng: 93.411,
    locationName: 'Kohora Range Gate NH-37',
    corridor: 'Kohora Central Corridor',
    status: 'active',
    battery: 99,
    detectionCount: 312,
    description: 'Central gate AI sensor regulating tourist traffic & monitoring megafauna movements.'
  },
  {
    id: 'seis-02',
    name: 'Seismic-Amguri Corridor',
    type: 'seismic_sensor',
    lat: 26.578,
    lng: 93.360,
    locationName: 'Amguri Tea Estate Buffer',
    corridor: 'Amguri Corridor',
    status: 'active',
    battery: 79,
    detectionCount: 118,
    description: 'Detects soil resonance from rhino & tiger movement near agricultural buffer zone.'
  },
  {
    id: 'cam-04',
    name: 'Bokakhat-Methoni AI Cam',
    type: 'camera_trap',
    lat: 26.620,
    lng: 93.570,
    locationName: 'Methoni Corridor (Bokakhat West)',
    corridor: 'Bokakhat Corridor',
    status: 'active',
    battery: 90,
    detectionCount: 156,
    description: 'Monitors movement between Diffloo river basin and Bokakhat town limits.'
  },
  {
    id: 'seis-03',
    name: 'Seismic-Burapahar Pass',
    type: 'seismic_sensor',
    lat: 26.542,
    lng: 93.180,
    locationName: 'Burapahar Range Foothills',
    corridor: 'Burapahar Corridor',
    status: 'active',
    battery: 82,
    detectionCount: 93,
    description: 'Seismic seismic node monitoring elephant troop movement from Burapahar to Karbi Anglong.'
  }
];

// Initial Animal Clusters (Clustered presence near NH-37 crossings)
export const INITIAL_ANIMAL_CLUSTERS: AnimalCluster[] = [
  {
    id: 'cluster-ele-01',
    species: 'Asian Elephant',
    count: 18,
    lat: 26.618,
    lng: 93.468,
    density: 88,
    threatScore: 85,
    movementVector: { angle: 165, speedKmH: 4.8 },
    corridorName: 'Panbari Corridor',
    isHistoricalPath: true,
    isActivePath: true,
    timestamp: 'Live GPS',
    status: 'migrating',
    targetIndex: 0,
    direction: 'southbound',
    progress: 0.1,
    trail: [
      [26.626, 93.462],
      [26.622, 93.465],
      [26.618, 93.468]
    ],
    pathCoordinates: [
      [26.628, 93.460], // Floodplain North
      [26.615, 93.468], // Approaching NH-37
      [26.604, 93.473], // NH-37 Panbari Crossing (Sensors)
      [26.588, 93.481], // Panbari Reserve Forest Buffer
      [26.570, 93.490], // Karbi Anglong High Elevation Refuge
      [26.558, 93.498]  // Southern Sanctuary Hills
    ]
  },
  {
    id: 'cluster-ele-02',
    species: 'Asian Elephant',
    count: 24,
    lat: 26.556,
    lng: 93.208,
    density: 92,
    threatScore: 90,
    movementVector: { angle: 145, speedKmH: 5.5 },
    corridorName: 'Kanchanjuri Corridor',
    isHistoricalPath: true,
    isActivePath: true,
    timestamp: 'Live GPS',
    status: 'migrating',
    targetIndex: 0,
    direction: 'southbound',
    progress: 0.15,
    trail: [
      [26.564, 93.200],
      [26.560, 93.204],
      [26.556, 93.208]
    ],
    pathCoordinates: [
      [26.568, 93.195], // Kuthori lowlands
      [26.552, 93.210], // Kanchanjuri approach
      [26.538, 93.220], // NH-37 Highway Crossing Pass
      [26.520, 93.232], // Tea Estate Ascent
      [26.502, 93.245]  // Karbi Hills Peak
    ]
  },
  {
    id: 'cluster-rhi-01',
    species: 'One-Horned Rhino',
    count: 4,
    lat: 26.582,
    lng: 93.305,
    density: 65,
    threatScore: 72,
    movementVector: { angle: 150, speedKmH: 2.8 },
    corridorName: 'Haldibhari Corridor',
    isHistoricalPath: true,
    isActivePath: true,
    timestamp: 'Live GPS',
    status: 'grazing',
    targetIndex: 0,
    direction: 'southbound',
    progress: 0.2,
    trail: [
      [26.588, 93.300],
      [26.582, 93.305]
    ],
    pathCoordinates: [
      [26.592, 93.298], // Wetland marsh
      [26.578, 93.307], // Haldibhari marsh edge
      [26.568, 93.312], // NH-37 Crossing & Seismic Array
      [26.550, 93.320], // Karbi foothills
      [26.535, 93.328]
    ]
  },
  {
    id: 'cluster-tig-01',
    species: 'Royal Bengal Tiger',
    count: 2,
    lat: 26.590,
    lng: 93.355,
    density: 45,
    threatScore: 60,
    movementVector: { angle: 135, speedKmH: 4.2 },
    corridorName: 'Amguri Corridor',
    isHistoricalPath: true,
    isActivePath: false,
    timestamp: 'Patrol Track',
    status: 'migrating',
    targetIndex: 0,
    direction: 'southbound',
    progress: 0.05,
    trail: [
      [26.595, 93.350],
      [26.590, 93.355]
    ],
    pathCoordinates: [
      [26.602, 93.345],
      [26.588, 93.358],
      [26.578, 93.365],
      [26.562, 93.376],
      [26.548, 93.388]
    ]
  },
  {
    id: 'cluster-dee-01',
    species: 'Swamp Deer',
    count: 35,
    lat: 26.630,
    lng: 93.560,
    density: 55,
    threatScore: 38,
    movementVector: { angle: 140, speedKmH: 3.5 },
    corridorName: 'Bokakhat Corridor',
    isHistoricalPath: false,
    isActivePath: true,
    timestamp: 'Herd Beacon',
    status: 'grazing',
    targetIndex: 0,
    direction: 'southbound',
    progress: 0.1,
    trail: [
      [26.638, 93.552],
      [26.630, 93.560]
    ],
    pathCoordinates: [
      [26.640, 93.550],
      [26.622, 93.565],
      [26.605, 93.578],
      [26.588, 93.590],
      [26.572, 93.602]
    ]
  }
];

// Major Wildlife Corridor Pathways (NH-37 & Karbi Anglong Migrations)
export const CORRIDOR_PATHWAYS: CorridorPathway[] = [
  {
    id: 'path-panbari',
    name: 'Panbari Wildlife Corridor',
    description: 'Vital migration path connecting Kaziranga Central Range to Panbari Reserve Forest and Karbi Anglong Hills across NH-37.',
    coordinates: [
      [26.620, 93.468],
      [26.606, 93.473],
      [26.590, 93.480],
      [26.575, 93.488]
    ],
    isActive: true,
    isHistorical: true,
    criticality: 'Critical',
    avgHerdsPerMonth: 42
  },
  {
    id: 'path-haldibhari',
    name: 'Haldibhari Corridor',
    description: 'High-risk road mortality sector where rhinos and elephants cross low-lying wetlands.',
    coordinates: [
      [26.582, 93.305],
      [26.568, 93.310],
      [26.550, 93.318],
      [26.535, 93.325]
    ],
    isActive: true,
    isHistorical: true,
    criticality: 'Severe',
    avgHerdsPerMonth: 38
  },
  {
    id: 'path-kanchanjuri',
    name: 'Kanchanjuri Animal Passage',
    description: 'Monsoon flood refuge route for elephants escaping Brahmaputra overflow towards higher hill terrain.',
    coordinates: [
      [26.552, 93.212],
      [26.538, 93.220],
      [26.520, 93.228],
      [26.505, 93.235]
    ],
    isActive: true,
    isHistorical: true,
    criticality: 'Critical',
    avgHerdsPerMonth: 55
  },
  {
    id: 'path-deopahar',
    name: 'Deopahar-Numaligarh Slope',
    description: 'Eastern flank corridor utilized by elephant clans moving towards Golaghat and Karbi hills.',
    coordinates: [
      [26.618, 93.522],
      [26.600, 93.530],
      [26.582, 93.538],
      [26.565, 93.545]
    ],
    isActive: false,
    isHistorical: true,
    criticality: 'High',
    avgHerdsPerMonth: 19
  },
  {
    id: 'path-burapahar',
    name: 'Burapahar Western Pass',
    description: 'Western corridor spanning hilly highway cuttings between Kuthori and Koliabor border.',
    coordinates: [
      [26.558, 93.172],
      [26.542, 93.180],
      [26.528, 93.188],
      [26.510, 93.195]
    ],
    isActive: true,
    isHistorical: true,
    criticality: 'Severe',
    avgHerdsPerMonth: 27
  }
];

// Impacted Villages along Kaziranga-Bokakhat belt for early warning alerts
export const LOCAL_VILLAGES = [
  'Bokakhat Town Ward 4',
  'Panbari Village Panchayat',
  'Kohora Tourism Complex',
  'Haldibhari Village',
  'Kuthori Rural Sector',
  'Amguri Tea Estate Line',
  'Kanchanjuri Foothills',
  'Methoni Basti',
  'Deopahar Tribal Basti'
];
