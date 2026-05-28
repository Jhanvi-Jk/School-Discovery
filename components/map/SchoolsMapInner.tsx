"use client";

import { useEffect, useRef, useState } from "react";
import type { SchoolSummary } from "@/lib/types";
import { useCityStore, CITY_LABELS, CITY_CENTERS, type CityKey } from "@/store/cityStore";

// ── Exact GPS overrides (slug → [lat, lng]) ─────────────────
// Hard-coded so pins are always at the right spot regardless of DB state.
const GPS_OVERRIDES: Record<string, [number, number]> = {
  "treamis-world-school-electronic-city":             [12.816995, 77.651050],
  "greenwood-high-international-sarjapur-road":       [12.900917, 77.753180],
  "ryan-international-school-bannerghatta":           [12.819944, 77.583607],
  "ebenezer-international-school-sarjapur":           [12.840958, 77.707406],
  "christ-university-junior-college-hosur-road":      [12.939877, 77.605382],
  "primus-public-school-sarjapur-road":               [12.888342, 77.697007],
  "paradise-academy-electronic-city":                 [12.865990, 77.645387],
  "new-oxford-international-anekal":                  [12.769414, 77.653927],
  "stonehill-international-school-north-bangalore":   [13.171300, 77.596270],
  "millennium-world-school-north-bangalore":          [13.104543, 77.620341],
  "podar-global-school-yelahanka":                    [13.120993, 77.606855],
  "ryan-international-school-yelahanka":              [13.124150, 77.601381],
  "presidency-school-bangalore-north":                [13.133391, 77.558576],
  "vishwa-vidyapeeth-yelahanka":                      [13.142598, 77.568720],
  "orchids-international-yelahanka":                  [13.094396, 77.578706],
  "federal-public-school-yelahanka":                  [13.087858, 77.634705],
  "harrow-international-school-devanahalli":          [13.290318, 77.617508],
  "kesar-international-school-bagalur":               [13.147174, 77.644361],
  "new-age-world-school-yelahanka":                   [13.141047, 77.539952],
  "canadian-international-school-yelahanka":          [13.119913, 77.594983],
  "delhi-public-school-north-yelahanka":              [13.118028, 77.641709],
};

// ── Area centre coords ──────────────────────────────────────
const AREA_COORDS: Record<string, [number, number]> = {
  "Whitefield":        [12.978, 77.750],
  "Koramangala":       [12.935, 77.625],
  "Indiranagar":       [12.978, 77.645],
  "Jayanagar":         [12.931, 77.584],
  "JP Nagar":          [12.908, 77.584],
  "Hebbal":            [13.038, 77.597],
  "Yelahanka":         [13.100, 77.595],
  "Sarjapur":          [12.898, 77.700],
  "Electronic City":   [12.845, 77.670],
  "HSR Layout":        [12.912, 77.637],
  "Marathahalli":      [12.957, 77.705],
  "Malleswaram":       [13.005, 77.568],
  "Sadashivanagar":    [12.996, 77.573],
  "Bannerghatta Road": [12.882, 77.599],
  "BTM Layout":        [12.918, 77.611],
  "Rajajinagar":       [12.992, 77.550],
  "Vijayanagar":       [12.972, 77.527],
  "Basavanagudi":      [12.946, 77.573],
  "Nagarbhavi":        [12.971, 77.497],
  "Kengeri":           [12.917, 77.480],
  "Jigani":            [12.842, 77.612],
  "Attibele":          [12.783, 77.792],
  "Anekal":            [12.710, 77.697],
};

// ── Colour palette ──────────────────────────────────────────
const ZONE_COLORS: Record<string, string> = {
  north:    "#C8D8B0",  // sage green
  east:     "#B0C8D8",  // steel blue
  south_e:  "#D8B0B8",  // dusty rose
  south_w:  "#D8C8A0",  // warm straw
  west:     "#C8B8D8",  // lavender
  central:  "#D8C0A8",  // milk tea
};

// ── Area polygon definitions ────────────────────────────────
// Each polygon: [lat,lng] pairs forming a closed ring
const AREA_POLYGONS: Array<{
  name: string; zone: keyof typeof ZONE_COLORS; coords: [number, number][];
}> = [
  // ── NORTH ──
  { name: "Yelahanka", zone: "north", coords: [
    [13.085,77.575],[13.085,77.615],[13.115,77.615],[13.115,77.575],
  ]},
  { name: "Hebbal", zone: "north", coords: [
    [13.020,77.575],[13.020,77.615],[13.055,77.615],[13.055,77.575],
  ]},
  { name: "Sadashivanagar", zone: "north", coords: [
    [12.990,77.560],[12.990,77.585],[13.012,77.585],[13.012,77.560],
  ]},
  { name: "Malleswaram", zone: "north", coords: [
    [12.995,77.555],[12.995,77.580],[13.020,77.580],[13.020,77.555],
  ]},
  // ── EAST ──
  { name: "Whitefield", zone: "east", coords: [
    [12.960,77.720],[12.960,77.780],[13.000,77.780],[13.000,77.720],
  ]},
  { name: "Marathahalli", zone: "east", coords: [
    [12.940,77.695],[12.940,77.725],[12.970,77.725],[12.970,77.695],
  ]},
  { name: "Indiranagar", zone: "east", coords: [
    [12.960,77.630],[12.960,77.665],[12.990,77.665],[12.990,77.630],
  ]},
  // ── SOUTH-EAST ──
  { name: "Koramangala", zone: "south_e", coords: [
    [12.920,77.610],[12.920,77.645],[12.945,77.645],[12.945,77.610],
  ]},
  { name: "HSR Layout", zone: "south_e", coords: [
    [12.900,77.630],[12.900,77.655],[12.925,77.655],[12.925,77.630],
  ]},
  { name: "BTM Layout", zone: "south_e", coords: [
    [12.905,77.600],[12.905,77.625],[12.928,77.625],[12.928,77.600],
  ]},
  { name: "Sarjapur", zone: "south_e", coords: [
    [12.870,77.680],[12.870,77.730],[12.910,77.730],[12.910,77.680],
  ]},
  { name: "Electronic City", zone: "south_e", coords: [
    [12.820,77.648],[12.820,77.690],[12.858,77.690],[12.858,77.648],
  ]},
  { name: "Jigani", zone: "south_e", coords: [
    [12.825,77.590],[12.825,77.635],[12.860,77.635],[12.860,77.590],
  ]},
  { name: "Attibele", zone: "south_e", coords: [
    [12.765,77.772],[12.765,77.812],[12.800,77.812],[12.800,77.772],
  ]},
  { name: "Anekal", zone: "south_e", coords: [
    [12.692,77.668],[12.692,77.722],[12.728,77.722],[12.728,77.668],
  ]},
  { name: "Bannerghatta Road", zone: "south_e", coords: [
    [12.875,77.580],[12.875,77.610],[12.910,77.610],[12.910,77.580],
  ]},
  // ── SOUTH-WEST ──
  { name: "Jayanagar", zone: "south_w", coords: [
    [12.920,77.568],[12.920,77.598],[12.948,77.598],[12.948,77.568],
  ]},
  { name: "JP Nagar", zone: "south_w", coords: [
    [12.890,77.568],[12.890,77.598],[12.922,77.598],[12.922,77.568],
  ]},
  { name: "Basavanagudi", zone: "south_w", coords: [
    [12.937,77.563],[12.937,77.585],[12.958,77.585],[12.958,77.563],
  ]},
  { name: "Rajajinagar", zone: "south_w", coords: [
    [12.978,77.538],[12.978,77.565],[13.002,77.565],[13.002,77.538],
  ]},
  // ── WEST ──
  { name: "Vijayanagar", zone: "west", coords: [
    [12.960,77.515],[12.960,77.545],[12.985,77.545],[12.985,77.515],
  ]},
  { name: "Nagarbhavi", zone: "west", coords: [
    [12.955,77.485],[12.955,77.520],[12.985,77.520],[12.985,77.485],
  ]},
  { name: "Kengeri", zone: "west", coords: [
    [12.905,77.465],[12.905,77.500],[12.935,77.500],[12.935,77.465],
  ]},
];

// ── Bangalore Urban District boundary ────────────────────────
// Real boundary from OpenStreetMap (Nominatim, 134 points).
// Coordinates converted from [lon,lat] → [lat,lon] for Leaflet.
// Note: actual district ends ~13.23°N; Harrow (13.29°N) is in
// Bangalore Rural district and will appear just north of the line.
const CITY_BOUNDARY: [number, number][] = [
  [12.9760,77.3255],[12.9336,77.3403],[12.8888,77.3436],[12.8871,77.3321],
  [12.8769,77.3366],[12.8702,77.3661],[12.8569,77.3698],[12.8552,77.3794],
  [12.8756,77.4082],[12.8749,77.4313],[12.8693,77.4188],[12.8510,77.4275],
  [12.8497,77.4377],[12.8262,77.4199],[12.8234,77.4335],[12.8067,77.4440],
  [12.8187,77.4492],[12.8073,77.4611],[12.8115,77.4788],[12.8023,77.4831],
  [12.7939,77.4700],[12.7805,77.4785],[12.7573,77.4738],[12.7428,77.4864],
  [12.7356,77.5028],[12.7468,77.5128],[12.7317,77.5218],[12.7559,77.5347],
  [12.7481,77.5410],[12.7724,77.5517],[12.7758,77.5438],[12.8014,77.5475],
  [12.7996,77.5560],[12.7897,77.5529],[12.7881,77.5636],[12.7773,77.5562],
  [12.7600,77.5648],[12.7878,77.5797],[12.7798,77.5921],[12.7515,77.5953],
  [12.7512,77.5765],[12.7310,77.5719],[12.7275,77.5571],[12.7012,77.5681],
  [12.7209,77.5947],[12.7120,77.6142],[12.6925,77.6037],[12.6668,77.5946],
  [12.6642,77.5963],[12.6833,77.6633],[12.6793,77.6771],[12.6634,77.6761],
  [12.6585,77.6896],[12.6664,77.7109],[12.6834,77.7120],[12.6794,77.7232],
  [12.6708,77.7248],[12.6737,77.7410],[12.6984,77.7376],[12.6970,77.7626],
  [12.7245,77.7744],[12.7273,77.7611],[12.7364,77.7630],[12.7467,77.7920],
  [12.7582,77.7950],[12.7680,77.7789],[12.7917,77.7947],[12.7968,77.8090],
  [12.8054,77.7999],[12.8171,77.8022],[12.8158,77.8098],[12.8310,77.8101],
  [12.8348,77.7956],[12.8434,77.7926],[12.8519,77.7990],[12.8477,77.8079],
  [12.8620,77.8331],[12.8704,77.8370],[12.9149,77.8166],[12.9217,77.8168],
  [12.9197,77.8297],[12.9256,77.8318],[12.9263,77.8060],[12.9184,77.7966],
  [12.9423,77.7653],[12.9595,77.7646],[12.9668,77.7842],[12.9750,77.7762],
  [13.0151,77.7715],[13.0333,77.7816],[13.0737,77.7583],[13.0815,77.7656],
  [13.1076,77.7665],[13.1121,77.7372],[13.1233,77.7336],[13.1254,77.7241],
  [13.1429,77.7338],[13.1925,77.7273],[13.1903,77.6999],[13.2031,77.6870],
  [13.1938,77.6869],[13.1845,77.6614],[13.1902,77.6505],[13.1993,77.6572],
  [13.2048,77.6378],[13.2056,77.6139],[13.1941,77.5996],[13.1983,77.5750],
  [13.2016,77.5677],[13.2160,77.5695],[13.2199,77.5574],[13.2320,77.5596],
  [13.2347,77.5517],[13.2331,77.5433],[13.2191,77.5372],[13.2217,77.5265],
  [13.2069,77.5213],[13.2261,77.5120],[13.2242,77.4792],[13.1623,77.4690],
  [13.1651,77.4318],[13.1237,77.4086],[13.1176,77.3929],[13.1049,77.4179],
  [13.0932,77.4160],[13.0865,77.4288],[13.0703,77.4237],[13.0679,77.3841],
  [13.0572,77.3830],[13.0529,77.3940],[13.0265,77.3891],[13.0288,77.3756],
  [13.0133,77.3699],[12.9922,77.3720],[12.9856,77.3552],[12.9743,77.3499],
  [12.9760,77.3255],
];

// ── Other city boundaries (from OpenStreetMap) ───────────────
const CITY_BOUNDARIES: Record<CityKey, [number, number][]> = {
  bangalore: CITY_BOUNDARY,
  delhi: [
    [28.5825,76.8394],[28.5500,76.8459],[28.5203,76.8871],[28.5014,76.8854],
    [28.5138,76.9069],[28.5053,76.9528],[28.5213,76.9784],[28.5147,77.0101],
    [28.5211,77.0170],[28.5335,77.0017],[28.5405,77.0135],[28.5166,77.0462],
    [28.5180,77.0804],[28.4951,77.1195],[28.4732,77.1125],[28.4428,77.1277],
    [28.4293,77.1615],[28.4046,77.1741],[28.4134,77.2215],[28.4354,77.2455],
    [28.4701,77.2349],[28.4974,77.2909],[28.4840,77.3148],[28.5166,77.3453],
    [28.5762,77.2929],[28.6051,77.3412],[28.6236,77.3404],[28.6377,77.3168],
    [28.7132,77.3311],[28.7064,77.2913],[28.7227,77.2909],[28.7385,77.2558],
    [28.7526,77.2587],[28.7592,77.2381],[28.7792,77.2210],[28.7846,77.2280],
    [28.7867,77.2073],[28.8136,77.2021],[28.8108,77.2187],[28.8223,77.2237],
    [28.8558,77.2142],[28.8585,77.1752],[28.8368,77.1580],[28.8381,77.1453],
    [28.8617,77.1402],[28.8580,77.1219],[28.8834,77.0826],[28.8672,77.0747],
    [28.8680,77.0583],[28.8318,77.0402],[28.8396,76.9944],[28.8215,76.9803],
    [28.8277,76.9658],[28.8149,76.9617],[28.8161,76.9492],[28.7987,76.9419],
    [28.7677,76.9557],[28.7539,76.9444],[28.7299,76.9598],[28.7125,76.9481],
    [28.6992,76.9680],[28.6696,76.9545],[28.6702,76.9374],[28.6496,76.9245],
    [28.6272,76.9424],[28.6184,76.9353],[28.6315,76.9191],[28.6318,76.8894],
    [28.5855,76.8646],[28.5825,76.8394],
  ],
  chennai: [
    [13.0934,79.9994],[13.0555,80.0066],[13.0541,80.0216],[13.0417,80.0114],
    [13.0402,80.0250],[13.0185,80.0123],[13.0011,80.0368],[12.9712,80.0374],
    [12.9776,80.0429],[12.9793,80.0505],[12.9284,80.0449],[12.9248,80.0590],
    [12.9016,80.0583],[12.8812,80.0447],[12.8626,80.0614],[12.8740,80.0855],
    [12.8550,80.1283],[12.8706,80.1364],[12.8734,80.1617],[12.8504,80.1935],
    [12.8754,80.2077],[12.8526,80.2182],[12.8567,80.2493],[13.0487,80.2835],
    [13.1017,80.3069],[13.0911,80.3003],[13.0864,80.2935],[13.1386,80.2986],
    [13.2585,80.3463],[13.2900,80.2613],[13.2700,80.2418],[13.2820,80.2048],
    [13.2580,80.1607],[13.2593,80.1313],[13.2039,80.1064],[13.2047,80.0646],
    [13.1851,80.0291],[13.1665,80.0360],[13.1618,80.0161],[13.1408,80.0027],
    [13.1132,80.0141],[13.1161,80.0035],[13.1037,80.0130],[13.0934,79.9994],
  ],
  pune: [
    [18.5638,73.3227],[18.5516,73.3334],[18.5583,73.3585],[18.5327,73.3427],
    [18.5048,73.3967],[18.4934,73.3746],[18.4821,73.3792],[18.4842,73.3608],
    [18.4692,73.3655],[18.5002,73.4085],[18.4423,73.3937],[18.4008,73.3999],
    [18.4031,73.4191],[18.3597,73.4403],[18.3042,73.4206],[18.3002,73.4765],
    [18.2684,73.4780],[18.2820,73.5004],[18.2719,73.5148],[18.2557,73.5051],
    [18.2443,73.5361],[18.2327,73.5247],[18.2262,73.5366],[18.2114,73.5209],
    [18.2077,73.5350],[18.1864,73.5221],[18.1902,73.5362],[18.2076,73.5409],
    [18.1971,73.5570],[18.2138,73.5587],[18.1787,73.5833],[18.1887,73.6045],
    [18.1614,73.6659],[18.1590,73.6490],[18.1410,73.6425],[18.1470,73.6344],
    [18.1235,73.6278],[18.1196,73.6041],[18.1344,73.6105],[18.1090,73.5935],
    [18.0976,73.6090],[18.0821,73.6022],[18.0760,73.6204],[18.0591,73.6129],
    [18.0249,73.6650],[18.0467,73.7050],[18.0376,73.7574],[18.0232,73.7663],
    [18.0213,73.7918],[18.0371,73.8131],[18.0321,73.8570],[18.0861,73.8797],
    [18.1196,73.8614],[18.1159,73.8871],[18.1282,73.9012],[18.1675,73.8731],
    [18.1824,73.8940],[18.1595,73.9030],[18.1803,73.9445],[18.1532,73.9850],
    [18.1591,74.0039],[18.1327,74.0296],[18.1389,74.0585],[18.1227,74.0931],
    [18.1327,74.1203],[18.1069,74.1650],[18.0984,74.2412],[18.0675,74.3018],
    [18.0970,74.3532],[18.0702,74.3809],[18.0647,74.4367],[18.0466,74.4592],
    [18.0702,74.5564],[18.0467,74.5821],[18.0568,74.6289],[18.0442,74.6397],
    [18.0698,74.6651],[18.0285,74.7128],[18.0163,74.7495],[18.0240,74.7667],
    [17.9974,74.8016],[18.0149,74.8187],[17.9934,74.8314],[17.9927,74.8619],
    [17.9470,74.8451],[17.9417,74.9370],[17.9248,74.9419],[17.9090,75.0175],
    [17.8951,75.0237],[17.9036,75.0524],[17.9275,75.0516],[17.9171,75.0716],
    [17.9268,75.0874],[17.9412,75.0814],[17.9381,75.1111],[17.9580,75.1295],
    [17.9723,75.1174],[17.9710,75.1354],[18.0010,75.1132],[17.9773,75.1030],
    [17.9795,75.0695],[17.9514,75.0506],[17.9674,75.0205],[18.0239,75.0515],
    [18.0377,75.0789],[18.0698,75.0951],[18.0751,75.1295],[18.1087,75.1630],
    [18.1217,75.1562],[18.1240,75.0946],[18.2188,75.1091],[18.1901,75.0241],
    [18.2123,75.0112],[18.2622,75.0430],[18.2396,74.9935],[18.2653,74.9517],
    [18.2516,74.8296],[18.2945,74.7962],[18.2936,74.8350],[18.3102,74.8461],
    [18.3381,74.8299],[18.3528,74.7950],[18.3842,74.8092],[18.4019,74.7938],
    [18.4022,74.7291],[18.4269,74.7167],[18.4842,74.7274],[18.5064,74.7015],
    [18.4929,74.6644],[18.4755,74.6556],[18.4623,74.6741],[18.4496,74.6432],
    [18.4735,74.5792],[18.4954,74.5549],[18.5079,74.5464],[18.5495,74.5777],
    [18.5829,74.5408],[18.6121,74.5496],[18.6134,74.5089],[18.6399,74.4726],
    [18.6669,74.5095],[18.6865,74.4756],[18.7177,74.4792],[18.7223,74.4434],
    [18.7495,74.4268],[18.7424,74.3993],[18.7764,74.4007],[18.8037,74.3846],
    [18.8252,74.3987],[18.8449,74.3496],[18.8406,74.3224],[18.8551,74.3068],
    [18.9037,74.2948],[18.9719,74.2218],[19.0087,74.2126],[19.0061,74.1996],
    [19.0314,74.1738],[19.1281,74.2104],[19.1225,74.2324],[19.1633,74.2667],
    [19.1805,74.2661],[19.1861,74.2944],[19.2096,74.3156],[19.2260,74.2626],
    [19.2030,74.2193],[19.2239,74.1686],[19.2041,74.1572],[19.2255,74.1514],
    [19.2221,74.1261],[19.2388,74.0839],[19.2279,74.0894],[19.2433,74.0498],
    [19.2616,74.0452],[19.2494,74.0310],[19.2826,74.0301],[19.2950,74.0118],
    [19.2986,74.0253],[19.3139,74.0252],[19.3591,73.9998],[19.3385,73.9271],
    [19.3720,73.8914],[19.3552,73.8538],[19.3864,73.8214],[19.3914,73.7894],
    [19.3868,73.7782],[19.3317,73.7954],[19.3402,73.7744],[19.3233,73.7472],
    [19.3353,73.7470],[19.3254,73.7074],[19.2945,73.6683],[19.2584,73.6940],
    [19.2429,73.6850],[19.2390,73.6591],[19.2050,73.6311],[19.2115,73.6122],
    [19.1919,73.6055],[19.1781,73.5354],[19.1189,73.5418],[19.1297,73.5258],
    [19.0950,73.5118],[19.0846,73.5273],[19.0464,73.5152],[19.0484,73.5407],
    [19.0324,73.5342],[19.0121,73.5536],[18.9679,73.5122],[18.9808,73.4817],
    [18.9682,73.4780],[18.9663,73.4610],[18.9295,73.4583],[18.9153,73.4298],
    [18.9048,73.4404],[18.8796,73.4363],[18.8433,73.4014],[18.8526,73.3880],
    [18.7929,73.3789],[18.7933,73.3680],[18.7581,73.3505],[18.7223,73.3540],
    [18.7008,73.3324],[18.7095,73.3744],[18.6559,73.3885],[18.6033,73.3418],
    [18.6086,73.3343],[18.5638,73.3227],
  ],
  mumbai: [
    [19.2245,72.7760],[19.1965,72.7968],[19.1295,72.7871],[19.1454,72.8043],
    [19.0965,72.8262],[19.0417,72.8182],[19.0478,72.8793],[18.9925,72.9045],
    [19.0215,72.9533],[19.1704,72.9817],[19.2076,72.9102],[19.2492,72.9055],
    [19.2685,72.8626],[19.2450,72.8272],[19.2649,72.7837],[19.2245,72.7760],
  ],
  kolkata: [
    [22.5492,88.2336],[22.5469,88.2544],[22.5328,88.2603],[22.5385,88.2916],
    [22.5207,88.2900],[22.4926,88.3115],[22.4821,88.2942],[22.4902,88.2693],
    [22.4531,88.2896],[22.4680,88.3290],[22.4520,88.3720],[22.4655,88.3778],
    [22.4778,88.4145],[22.4909,88.4063],[22.5238,88.4205],[22.5085,88.4484],
    [22.5226,88.4611],[22.5553,88.4128],[22.6187,88.3912],[22.6184,88.3651],
    [22.5508,88.3187],[22.5617,88.2443],[22.5492,88.2336],
  ],
};

// ── Pin sizing by zoom level ─────────────────────────────────
const PIN_MIN_ZOOM = 9;   // stop shrinking below this zoom
const PIN_MAX_ZOOM = 15;  // stop growing above this zoom
const PIN_MIN_W   = 13;   // px at minimum zoom
const PIN_MAX_W   = 34;   // px at maximum zoom

function getPinDims(zoom: number): [number, number] {
  const z = Math.min(Math.max(zoom, PIN_MIN_ZOOM), PIN_MAX_ZOOM);
  const t = (z - PIN_MIN_ZOOM) / (PIN_MAX_ZOOM - PIN_MIN_ZOOM);
  const w = Math.round(PIN_MIN_W + t * (PIN_MAX_W - PIN_MIN_W));
  const h = Math.round(w * (28 / 22));
  return [w, h];
}

interface Props {
  schools: SchoolSummary[];
  onSchoolClick?: (slug: string) => void;
}

export default function SchoolsMapInner({ schools, onSchoolClick }: Props) {
  const [MC, setMC] = useState<any>(null);
  const [L, setL]   = useState<any>(null);
  const [zoom, setZoom] = useState(11);
  const [expanded, setExpanded] = useState(false);
  const mapRef = useRef<any>(null);
  const { selectedCity, setCity } = useCityStore();

  useEffect(() => {
    Promise.all([import("react-leaflet"), import("leaflet")]).then(([rl, leaflet]) => {
      setMC(rl);
      setL(leaflet.default);
    });
  }, []);

  // Fly to selected city whenever it changes
  useEffect(() => {
    if (!mapRef.current || !selectedCity) return;
    const [lat, lng, z] = CITY_CENTERS[selectedCity];
    mapRef.current.flyTo([lat, lng], z, { duration: 1.2 });
  }, [selectedCity]);

  // Invalidate map size after expand/collapse so tiles fill the new container
  useEffect(() => {
    const t = setTimeout(() => mapRef.current?.invalidateSize(), 50);
    return () => clearTimeout(t);
  }, [expanded]);

  // Close on Escape + lock body scroll + lift map-box above page when expanded
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setExpanded(false); };
    if (expanded) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("map-expanded");
      window.addEventListener("keydown", handler);
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("map-expanded");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("map-expanded");
      window.removeEventListener("keydown", handler);
    };
  }, [expanded]);

  if (!MC || !L) {
    return (
      <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--beige-300)" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ width:28, height:28, border:"2px solid var(--brown-dark)", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 8px" }} />
          <p style={{ color:"var(--muted)", fontSize:12 }}>Loading map…</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Polygon, Marker, Popup, useMapEvents } = MC;

  // Tracks zoom and stores map instance for invalidateSize
  function ZoomTracker() {
    const map = useMapEvents({ zoom: (e: any) => setZoom(e.target.getZoom()) });
    useEffect(() => { mapRef.current = map; }, [map]);
    return null;
  }

  const [pinW, pinH] = getPinDims(zoom);

  const schoolIcon = L.divIcon({
    html: `<div style="width:${pinW}px;height:${pinH}px;display:flex;align-items:flex-start;justify-content:center;">
      <svg width="${pinW}" height="${pinH}" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 0C4.925 0 0 4.925 0 11c0 7.667 11 17 11 17s11-9.333 11-17C22 4.925 17.075 0 11 0z" fill="#FFB3C6" stroke="#e05c80" stroke-width="1.5"/>
        <circle cx="11" cy="11" r="4" fill="white" opacity="0.85"/>
      </svg>
    </div>`,
    iconSize: [pinW, pinH], iconAnchor: [pinW / 2, pinH], className: "",
  });

  // Deduplicate stacked markers
  const placed: Record<string, number> = {};

  return (
    // Outer wrapper: handles fixed/relative positioning — NO overflow:hidden so buttons aren't clipped
    <div style={{
      position: expanded ? "fixed" : "relative",
      inset: expanded ? 0 : "auto",
      width: expanded ? "100vw" : "100%",
      height: expanded ? "100vh" : "100%",
      zIndex: expanded ? 99999 : "auto",
      background: "var(--beige-300)",
    }}>
      {/* Inner wrapper: clips Leaflet tiles to rounded corners */}
      <div style={{ width: "100%", height: "100%", overflow: "hidden",
        borderRadius: expanded ? 0 : "inherit" }}>
      <MapContainer
        center={[12.9716, 77.5946]}
        zoom={11}
        style={{ height:"100%", width:"100%" }}
        scrollWheelZoom={false}
        zoomControl={true}
      >
        <ZoomTracker />
        {/* Original light grey/white/green base tile */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />

        {/* All city boundaries — same dark-brown stroke */}
        {(Object.keys(CITY_BOUNDARIES) as CityKey[]).map((city) => (
          <Polygon
            key={city}
            positions={CITY_BOUNDARIES[city]}
            pathOptions={{
              color:       "#5C2E0A",
              weight:      1.5,
              opacity:     1,
              fillColor:   "transparent",
              fillOpacity: 0,
              lineCap:     "round",
              lineJoin:    "round",
            }}
          />
        ))}

        {/* Label tile on top */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
          attribution=""
        />

        {/* School markers — golden-angle phyllotaxis spread per area */}
        {schools.map((school) => {
          const area  = school.area || "";
          const base  = AREA_COORDS[area] || [12.9716, 77.5946];
          const idx   = placed[area] || 0;
          placed[area] = idx + 1;
          // Priority: hardcoded override → DB coords → area centre spread
          let pos: [number, number];
          const override = GPS_OVERRIDES[school.slug];
          if (override) {
            pos = override;
          } else if (school.latitude && school.longitude) {
            pos = [school.latitude, school.longitude];
          } else if (idx === 0) {
            pos = [base[0], base[1]];
          } else {
            // Golden angle spiral so markers fan out naturally, not in a line
            const angle  = idx * 2.3999632; // ~137.5° in radians
            const radius = 0.004 * Math.sqrt(idx);
            pos = [base[0] + radius * Math.sin(angle), base[1] + radius * Math.cos(angle)];
          }
          return (
            <Marker key={school.id} position={pos} icon={schoolIcon}
              eventHandlers={{
                click: () => onSchoolClick?.(school.slug),
              }}>
              <Popup>
                <div style={{ minWidth:160 }}>
                  <p style={{ fontWeight:700, fontSize:13, marginBottom:4 }}>{school.name}</p>
                  <p style={{ color:"#7a6a5a", fontSize:12, marginBottom:8 }}>{school.area}</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    <button
                      onClick={() => onSchoolClick?.(school.slug)}
                      style={{
                        display:"block", background:"#2C1810", color:"white",
                        borderRadius:8, padding:"5px 10px", fontSize:12,
                        textAlign:"center", border:"none", fontWeight:600, cursor:"pointer", width:"100%",
                      }}>
                      Scroll to Card
                    </button>
                    <a href={`/schools/${school.slug}`} style={{
                      display:"block", background:"transparent", color:"#2C1810",
                      borderRadius:8, padding:"5px 10px", fontSize:12,
                      textAlign:"center", textDecoration:"none", fontWeight:600,
                      border:"1px solid #2C1810",
                    }}>View Profile</a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      </div>{/* end inner clip wrapper */}

      {/* City selection overlay — shown until user picks a city */}
      {!selectedCity && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 2000,
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(3px)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          borderRadius: "inherit", padding: "24px 16px",
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#a89880", textTransform: "uppercase", marginBottom: 8 }}>
            Welcome to SchoolFinder
          </p>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#2C1810", marginBottom: 20, textAlign: "center" }}>
            Which city do you reside in?
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", maxWidth: 400 }}>
            {(Object.keys(CITY_LABELS) as CityKey[]).map((city) => (
              <button
                key={city}
                onClick={() => setCity(city)}
                style={{
                  padding: "10px 22px",
                  background: "white",
                  border: "1.5px solid #d4c5b0",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#2C1810",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#2C1810";
                  (e.currentTarget as HTMLButtonElement).style.color = "white";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#2C1810";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "white";
                  (e.currentTarget as HTMLButtonElement).style.color = "#2C1810";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#d4c5b0";
                }}
              >
                {CITY_LABELS[city]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Expand button (normal view) */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          title="Expand map"
          style={{
            position: "absolute", top: 12, right: 12, zIndex: 1000,
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 12px",
            background: "white", border: "1px solid #d4c5b0",
            borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
            color: "#5C2E0A", boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 15 15" fill="none" stroke="#5C2E0A" strokeWidth="1.8" strokeLinecap="round">
            <path d="M1 5V1h4M10 1h4v4M14 10v4h-4M5 14H1v-4" />
          </svg>
          Expand
        </button>
      )}

      {/* Close button (expanded view) */}
      {expanded && (
        <button
          onClick={() => setExpanded(false)}
          title="Exit fullscreen (Esc)"
          style={{
            position: "absolute", top: 16, right: 16, zIndex: 10000,
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px",
            background: "white", border: "1px solid #d4c5b0",
            borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
            color: "#5C2E0A", boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 15 15" fill="none" stroke="#5C2E0A" strokeWidth="1.8" strokeLinecap="round">
            <path d="M2 6h3V3M10 3v3h3M13 9h-3v3M5 12V9H2" />
          </svg>
          Exit fullscreen
        </button>
      )}

      {/* Legend overlay */}
      <div className="map-legend">
        <div className="leg-title">Map Legend</div>
        <div className="leg-item">
          <div className="leg-dot" style={{ background:"#FFB3C6", border:"1.5px solid #e05c80" }} />
          School
        </div>
        <div style={{ height:1, background:"#e5e5e5", margin:"6px 0" }} />
        <div className="leg-item">
          <svg width="18" height="10"><line x1="0" y1="5" x2="18" y2="5" stroke="#5C2E0A" strokeWidth="1.5"/></svg>
          City boundary
        </div>
      </div>
    </div>
  );
}
