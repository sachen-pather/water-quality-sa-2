// Mock data for the application to use until backend is ready

// Beach data with water quality information
export const beachesData = [
  {
    name: "Clifton Beach",
    location: "Cape Town, South Africa",
    is_safe: true,
    date_sampled: "2025-04-12",
    description:
      "Clifton consists of four beaches, separated by granite boulders and wildly popular in summer.",
    values: [120, 140, 95],
  },
  {
    name: "Camps Bay Beach",
    location: "Cape Town, South Africa",
    is_safe: true,
    date_sampled: "2025-04-14",
    description:
      "Camps Bay is one of Cape Town's most popular beaches, with magnificent views of the Twelve Apostles mountain range.",
    values: [180, 150, 170],
  },
  {
    name: "Muizenberg Beach",
    location: "Cape Town, South Africa",
    is_safe: false,
    date_sampled: "2025-04-15",
    description:
      "Known for its colorful beach huts and ideal surfing conditions for beginners.",
    values: [520, 480, 540],
  },
  {
    name: "Fish Hoek Beach",
    location: "Cape Town, South Africa",
    is_safe: true,
    date_sampled: "2025-04-13",
    description:
      "One of the safest swimming beaches in Cape Town, set in a bay with calm and warm waters.",
    values: [110, 130, 120],
  },
  {
    name: "Bloubergstrand",
    location: "Cape Town, South Africa",
    is_safe: true,
    date_sampled: "2025-04-11",
    description:
      "Famous for its iconic view of Table Mountain across the bay and popular for kitesurfing.",
    values: [90, 85, 95],
  },
  {
    name: "Hout Bay Beach",
    location: "Cape Town, South Africa",
    is_safe: false,
    date_sampled: "2025-04-10",
    description:
      "A beautiful beach surrounded by mountains on three sides and popular for long beach walks.",
    values: [600, 520, 550],
  },
  {
    name: "Llandudno Beach",
    location: "Cape Town, South Africa",
    is_safe: true,
    date_sampled: "2025-04-12",
    description:
      "Sheltered beach with magnificent scenery, nestled in a small bay with granite boulders.",
    values: [140, 160, 130],
  },
  {
    name: "Noordhoek Beach",
    location: "Cape Town, South Africa",
    is_safe: true,
    date_sampled: "2025-04-14",
    description:
      "A long sandy beach ideal for horse riding and long walks. Stunning scenery with mountainous backdrop.",
    values: [120, 150, 110],
  },
  {
    name: "Scarborough Beach",
    location: "Cape Town, South Africa",
    is_safe: true,
    date_sampled: "2025-04-13",
    description:
      "Remote and pristine beach with strong waves, popular with surfers and nature lovers.",
    values: [80, 90, 85],
  },
];

// Community posts data
export const communityPostsData = {
  "clifton-beach": [
    {
      post_id: "1",
      beach_name: "Clifton Beach",
      author: "BeachLover22",
      content:
        "Had an amazing day at Clifton! The water was crystal clear and there was very little wind. Perfect beach day!",
      created_at: "2025-04-16T14:22:30Z",
    },
    {
      post_id: "2",
      beach_name: "Clifton Beach",
      author: "OceanExplorer",
      content:
        "Crowded today but still worth the visit. The sunset views were spectacular!",
      created_at: "2025-04-15T18:45:21Z",
    },
  ],
  "camps-bay-beach": [
    {
      post_id: "3",
      beach_name: "Camps Bay Beach",
      author: "SunSeeker",
      content:
        "Camps Bay never disappoints. Great atmosphere and the water was surprisingly warm for April!",
      created_at: "2025-04-14T15:30:00Z",
    },
  ],
  "muizenberg-beach": [
    {
      post_id: "4",
      beach_name: "Muizenberg Beach",
      author: "SurfDude",
      content:
        "Great waves for beginners today. I noticed some discoloration in the water though. Is water quality being monitored?",
      created_at: "2025-04-13T10:20:45Z",
    },
    {
      post_id: "5",
      beach_name: "Muizenberg Beach",
      author: "EcoWarrior",
      content:
        "Participated in a beach cleanup today. Found a lot of plastic waste. We need to take better care of our beaches!",
      created_at: "2025-04-12T16:18:22Z",
    },
  ],
};

// Pending posts for admin approval
export const pendingPostsData = [
  {
    post_id: "6",
    beach_name: "Fish Hoek Beach",
    author: "LocalResident",
    content:
      "Noticed unusual foam on the water's edge this morning. Anyone else see this?",
    created_at: "2025-04-17T09:15:10Z",
  },
  {
    post_id: "7",
    beach_name: "Hout Bay Beach",
    author: "MarineScientist",
    content:
      "The recent water quality reports are concerning. E.coli levels have been higher than usual.",
    created_at: "2025-04-16T11:30:20Z",
  },
  {
    post_id: "8",
    beach_name: "Bloubergstrand",
    author: "PhotoEnthusiast",
    content:
      "Perfect conditions for photography today! Got some amazing shots of Table Mountain from the beach.",
    created_at: "2025-04-15T15:45:30Z",
  },
];

// General discussions data
export const discussionsData = [
  {
    _id: "1",
    title: "Best beaches for families",
    content:
      "I'm looking for recommendations on the most family-friendly beaches in Cape Town. Preferably with good facilities and safe swimming conditions for kids.",
    category: "Beach Experiences",
    author: "FamilyTraveler",
    created_at: "2025-04-10T14:30:00Z",
  },
  {
    _id: "2",
    title: "Recent water quality concerns",
    content:
      "Has anyone else been concerned about the recent reports of E.coli in some of our beaches? Would love to hear from people with knowledge about water quality testing.",
    category: "Water Quality Awareness",
    author: "HealthAwareCitizen",
    created_at: "2025-04-09T10:15:45Z",
  },
  {
    _id: "3",
    title: "Monthly beach cleanup initiative",
    content:
      "We're organizing a monthly beach cleanup event, rotating between different Cape Town beaches. Looking for volunteers and suggestions for the next locations!",
    category: "Beach Events and Cleanups",
    author: "EcoActivist",
    created_at: "2025-04-08T16:20:30Z",
  },
];

// Discussion comments data
export const commentsData = {
  1: [
    {
      _id: "c1",
      content:
        "Fish Hoek Beach is excellent for families. It's sheltered from strong winds and the water is calmer than other beaches.",
      author: "LocalGuide",
      created_at: "2025-04-10T15:20:10Z",
    },
    {
      _id: "c2",
      content:
        "I'd recommend Camps Bay for facilities, but be aware it gets crowded during peak season. Noordhoek is also beautiful but has fewer facilities.",
      author: "BeachExpert",
      created_at: "2025-04-10T16:05:22Z",
    },
  ],
  2: [
    {
      _id: "c3",
      content:
        "The city should be doing more frequent testing and publishing results in real-time. I've been tracking the data and there's definitely cause for concern at certain beaches.",
      author: "EnvironmentalScientist",
      created_at: "2025-04-09T11:30:45Z",
    },
    {
      _id: "c4",
      content:
        "I've noticed warning signs at Muizenberg recently. Does anyone know how long it takes for water quality to improve after it's been flagged?",
      author: "ConcernedSurfer",
      created_at: "2025-04-09T13:15:20Z",
    },
    {
      _id: "c5",
      content:
        "Heavy rainfall tends to worsen water quality as stormwater carries pollutants into the ocean. Best to avoid swimming for 24-48 hours after heavy rain.",
      author: "WaterQualityMonitor",
      created_at: "2025-04-09T14:40:10Z",
    },
  ],
  3: [
    {
      _id: "c6",
      content:
        "Count me in! I'd suggest adding Hout Bay to the rotation. It tends to get a lot of debris washing up after storms.",
      author: "VolunteerHero",
      created_at: "2025-04-08T17:10:30Z",
    },
  ],
};

// Beach locations data
export const beachLocationsData = [
  {
    name: "Clifton Beach",
    address: "Victoria Road, Clifton",
    lat: -33.9506,
    lng: 18.3775,
  },
  {
    name: "Camps Bay Beach",
    address: "Victoria Road, Camps Bay",
    lat: -33.9506,
    lng: 18.3775,
  },
  {
    name: "Muizenberg Beach",
    address: "Main Road, Muizenberg",
    lat: -34.1081,
    lng: 18.4698,
  },
  {
    name: "Fish Hoek Beach",
    address: "Beach Road, Fish Hoek",
    lat: -34.1375,
    lng: 18.4337,
  },
  {
    name: "Bloubergstrand",
    address: "Otto du Plessis Drive, Bloubergstrand",
    lat: -33.8102,
    lng: 18.4695,
  },
  {
    name: "Hout Bay Beach",
    address: "Beach Road, Hout Bay",
    lat: -34.046,
    lng: 18.3547,
  },
  {
    name: "Llandudno Beach",
    address: "Llandudno Road, Llandudno",
    lat: -34.008,
    lng: 18.3412,
  },
  {
    name: "Noordhoek Beach",
    address: "Noordhoek Road, Noordhoek",
    lat: -34.1137,
    lng: 18.3602,
  },
  {
    name: "Scarborough Beach",
    address: "Scarborough Road, Scarborough",
    lat: -34.1985,
    lng: 18.3769,
  },
];
