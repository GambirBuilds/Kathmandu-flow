/**
 * Kathmandu Valley Traffic Scenario Presets
 * Domain-authentic traffic scenarios reflecting real-world events across
 * Kathmandu, Lalitpur, and Bhaktapur.
 */

export const DEFAULT_SCENARIOS = [
  {
    id: 'normal_midday',
    name: 'Normal Midday Flow (Tri-City)',
    nepaliName: 'दिउँसोको सामान्य सवारी चाप (काठमाडौँ, ललितपुर, भक्तपुर)',
    description: 'Typical weekday traffic between 11:30 AM and 3:30 PM with moderate commercial and transit activity across all three cities.',
    volumeMultiplier: 1.0,
    capacityMultiplier: 1.0,
    weather: 'clear',
    simulationSpeed: 1.0,
    closedRoadIds: [],
    signalDuration: 35,
    incidents: [],
    category: 'Standard'
  },
  {
    id: 'arniko_highway_rush',
    name: 'Bhaktapur Arniko Express Morning Rush',
    nepaliName: 'अरनिको राजमार्ग भक्तपुर-काठमाडौँ तीव्र चाप',
    description: 'Mass commuter surge from Suryabinayak, Thimi, and Lokanthali flowing into Koteshwor choke point, creating miles of multi-lane tailbacks.',
    volumeMultiplier: 1.6,
    capacityMultiplier: 0.95,
    weather: 'clear',
    simulationSpeed: 1.0,
    closedRoadIds: [],
    signalDuration: 50,
    incidents: [
      { roadId: 'road_koteshwor_lokanthali', title: 'Koteshwor Gateway Heavy Inflow', severity: 'critical' },
      { roadId: 'road_thimi_sallaghari', title: 'Thimi-Radhe Radhe Choke', severity: 'heavy' }
    ],
    category: 'Peak Hours'
  },
  {
    id: 'morning_peak_rush',
    name: 'Morning Peak Commute (09:00 - 10:30)',
    nepaliName: 'बिहानीको कार्यालय तथा विद्यालय चाप',
    description: 'Heavy commuter inflow from outer suburbs (Kalanki, Koteshwor, Chabahil, Lalitpur Pulchowk) converging towards Singha Durbar, Maitighar, and Putalisadak.',
    volumeMultiplier: 1.55,
    capacityMultiplier: 0.95,
    weather: 'clear',
    simulationSpeed: 1.0,
    closedRoadIds: [],
    signalDuration: 45,
    incidents: [
      { roadId: 'road_dhobikhola_maitighar', title: 'Maitighar Inflow Queue', severity: 'heavy' },
      { roadId: 'road_thapathali_kupondole', title: 'Thapathali Bridge Lalitpur Inflow', severity: 'heavy' }
    ],
    category: 'Peak Hours'
  },
  {
    id: 'evening_return_rush',
    name: 'Evening Return Rush (17:00 - 19:30)',
    nepaliName: 'साँझको घर फिर्ती जाम',
    description: 'High egress pressure leaving government and commercial cores heading outward through Koteshwor to Bhaktapur, Kalanki to West, and Ring Road.',
    volumeMultiplier: 1.65,
    capacityMultiplier: 0.9,
    weather: 'clear',
    simulationSpeed: 1.0,
    closedRoadIds: [],
    signalDuration: 50,
    incidents: [
      { roadId: 'road_tinkune_baneshwor', title: 'Baneshwor-Tinkune Choke', severity: 'critical' },
      { roadId: 'road_kalimati_kalanki', title: 'Kalanki Highway Outflow', severity: 'critical' },
      { roadId: 'road_koteshwor_lokanthali', title: 'Bhaktapur Egress Queue', severity: 'critical' }
    ],
    category: 'Peak Hours'
  },
  {
    id: 'bhaktapur_biska_jatra',
    name: 'Bhaktapur Biska Jatra Chariot Procession',
    nepaliName: 'भक्तपुर बिस्का जात्रा रथयात्रा र सडक डाइभर्सन',
    description: 'Annual cultural festival in Bhaktapur core. Roads around Bhaktapur Durbar Square, Taumadhi, and Kamalbinayak closed for chariot pulling; traffic diverted to Arniko Highway.',
    volumeMultiplier: 1.2,
    capacityMultiplier: 0.85,
    weather: 'clear',
    simulationSpeed: 1.0,
    closedRoadIds: ['road_sallaghari_bhaktapur_durbar', 'road_bhaktapur_durbar_kamalbinayak'],
    signalDuration: 35,
    incidents: [
      { roadId: 'road_sallaghari_bhaktapur_durbar', title: 'Biska Jatra Cultural Perimeter', severity: 'closed' },
      { roadId: 'road_bhaktapur_durbar_kamalbinayak', title: 'Taumadhi Square Chariot Route', severity: 'closed' }
    ],
    category: 'Festivals'
  },
  {
    id: 'patan_krishna_janmashtami',
    name: 'Patan Krishna Mandir Pilgrimage Rush',
    nepaliName: 'पाटन कृष्ण मन्दिर मेला र ट्राफिक व्यवस्थापन',
    description: 'Tens of thousands of pilgrims visit Patan Durbar Square. Pulchowk to Mangal Bazar and Lagankhel access roads restricted; pedestrianized historic core.',
    volumeMultiplier: 1.3,
    capacityMultiplier: 0.85,
    weather: 'clear',
    simulationSpeed: 1.0,
    closedRoadIds: ['road_pulchowk_patan_durbar'],
    signalDuration: 40,
    incidents: [
      { roadId: 'road_pulchowk_patan_durbar', title: 'Krishna Mandir Pedestrian Zone', severity: 'closed' },
      { roadId: 'road_pulchowk_jawalakhel', title: 'Jawalakhel Diversion Congestion', severity: 'heavy' }
    ],
    category: 'Festivals'
  },
  {
    id: 'monsoon_waterlogging',
    name: 'Monsoon Torrential Rain & Inundation',
    nepaliName: 'मनसुनी मुसलधारे वर्षा र जलमग्न सडक',
    description: 'Heavy flash rains flood the Koteshwor Underpass entrance, Balkumari low bridge, and Putalisadak. Road surface traction and capacity reduced by 35%.',
    volumeMultiplier: 1.25,
    capacityMultiplier: 0.65,
    weather: 'monsoon_rain',
    simulationSpeed: 1.0,
    closedRoadIds: ['road_singha_putalisadak', 'road_rr_koteshwor_tinkune'],
    signalDuration: 40,
    incidents: [
      { roadId: 'road_singha_putalisadak', title: 'Putalisadak Flash Flooding', severity: 'closed' },
      { roadId: 'road_rr_koteshwor_tinkune', title: 'Koteshwor Underpass Waterlogging', severity: 'closed' }
    ],
    category: 'Weather Events'
  },
  {
    id: 'vip_movement_protocol',
    name: 'VIP Motorcade & Corridor Diversion',
    nepaliName: 'विशिष्ट व्यक्ति (VIP) सवारी आवागमन र डाइभर्सन',
    description: 'High-security convoy travelling from Singha Durbar via Maitighar & Baneshwor to Tribhuvan Intl Airport. Main arterial spine closed; traffic diverted to Dhobikhola and Bagmati river corridors.',
    volumeMultiplier: 1.15,
    capacityMultiplier: 0.85,
    weather: 'clear',
    simulationSpeed: 1.0,
    closedRoadIds: ['road_maitighar_singha_durbar', 'road_tinkune_baneshwor', 'road_rr_tinkune_sinamangal'],
    signalDuration: 30,
    incidents: [
      { roadId: 'road_maitighar_singha_durbar', title: 'VIP Motorcade Security Perimeter', severity: 'closed' },
      { roadId: 'road_tinkune_baneshwor', title: 'Arniko Highway Diversion', severity: 'closed' }
    ],
    category: 'Special Events'
  },
  {
    id: 'dashain_exodus',
    name: 'Dashain Festival Transit Exodus',
    nepaliName: 'बडा दसैँ उपत्यका बाहिरिने महाअभियान',
    description: 'Hundreds of thousands of travelers depart Kathmandu Valley. Gongabu New Bus Park, Kalanki, and Koteshwor/Suryabinayak experience extreme bus queues.',
    volumeMultiplier: 1.4,
    capacityMultiplier: 0.9,
    weather: 'clear',
    simulationSpeed: 1.0,
    closedRoadIds: [],
    signalDuration: 45,
    incidents: [
      { roadId: 'road_rr_basundhara_gongabu', title: 'Bus Park Perimeter Gridlock', severity: 'critical' },
      { roadId: 'road_kalimati_kalanki', title: 'Highway Outflow Bus Queues', severity: 'critical' },
      { roadId: 'road_sallaghari_suryabinayak', title: 'BP/Arniko Highway Outflow Queue', severity: 'heavy' }
    ],
    category: 'Festivals'
  },
  {
    id: 'smart_valley_upgrade',
    name: 'Smart Synchronized Signals & Express Flyovers',
    nepaliName: 'स्मार्ट ट्राफिक बत्ती तथा ८-लेन क्षमता विस्तार (उपत्यकाव्यापी)',
    description: 'Adaptive AI-optimized signal cycles across all Ring Road, Gwarko flyover, and Arniko Highway junctions with 35% expanded capacity.',
    volumeMultiplier: 1.1,
    capacityMultiplier: 1.35,
    weather: 'clear',
    simulationSpeed: 1.0,
    closedRoadIds: [],
    signalDuration: 25,
    incidents: [],
    category: 'Infrastructure Test'
  }
];
