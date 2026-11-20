/* ==========================================================================
   ASWENNA - SITE CONTENT
   All copy lives here. The build script renders index.html from it, and the
   i18n module swaps the translated strings at runtime.
   ========================================================================== */

export const site = {
  name: "Aswenna",
  title: "Agriculture Intelligence Platform",
  tagline: "Smarter fields, greater future",
  promise: "Empowering Farmers, Growing Prosperity.",
  parent: "Veyra Solutions",
  /* The one-sentence description of the project, used by the page metadata
     and the structured data. It used to live in the footer as a visible
     paragraph; the paragraph is gone, the metadata still needs it. */
  description:
    "A precision farming platform for Sri Lankan agriculture - soil intelligence, hyperlocal weather, AI recommendations, smart irrigation, crop-health monitoring and market intelligence.",

  /* What a search result actually shows. Google cuts a title at roughly 60
     characters and a description at roughly 160, so these are written to fit
     rather than to be complete - `description` above stays long because the
     structured data and the manifest have no such limit. Both are written
     into index.html by scripts/gen-seo.mjs, so there is one source. */
  metaTitle: "Aswenna | Agriculture Intelligence Platform",
  metaDescription:
    "Soil intelligence, hyperlocal weather, crop recommendations and market data for Sri Lankan smallholdings. In Sinhala, Tamil and English.",
};

export const contactDetails = {
  email: "info@veyra.lk",
  phones: [
    { label: "+94 78 259 6361", href: "tel:+94786373542" },
    { label: "+94 77 786 2375", href: "tel:+94777862375" },
  ],
};

export const ui = {
  getStarted: "Get started",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  primaryNav: "Primary",
  backToTop: "Back to top",
  skipToContent: "Skip to content",
};

export const nav = [
  { href: "#why", label: "Why Aswenna" },
  { href: "#engine", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#install", label: "Hardware" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export const hero = {
  badge: "Agricultural Intelligence Platform",
  badgeTag: "Sri Lanka",
  title: ["Every Harvest Begins", "With a Smarter Beginning."],
  sub: "Discover a new way to understand your land, nurture your crops and grow with confidence through intelligent agricultural technology.",
  primaryCta: "Explore the platform",
  secondaryCta: "See how it works",
  photo: "/images/photos/hero-field.webp",
  photoAlt: "Cupped hands holding dark soil and a young seedling",
  cards: [
    {
      icon: "droplets",
      label: "Soil moisture",
      value: "Live node",
      note: "Measured on plot",
      tone: "measured",
    },
    {
      icon: "cloud-rain",
      label: "Rainfall outlook",
      value: "Hyperlocal",
      note: "Station + regional feed",
      tone: "estimated",
    },
  ],
};

export const partners = {
  note: "Aswenna is a project of Veyra Solutions.",
  logos: [
    /* The reversed logo, not the colour one: flattening the colour lockup to
       white would fuse the disc and the leaf into a blank circle. This file
       has the disc dropped already, so it reads on the dark hero. */
    { src: "/images/logos/aswenna_logo_white.png", alt: "Aswenna", cls: "" },
    {
      src: "/images/logos/veyra-placeholder.svg",
      alt: "Veyra Solutions",
      cls: "",
    },
    /* Flattening this to white turns the crest into a solid blob: the circular
       device and the "IIT" letters disappear. Greyscale keeps them, and the
       brightness lifts it off the dark hero. */
    // { src: "/images/logos/iit.png", alt: "Informatics Institute of Technology", cls: "hero__partner--tall hero__partner--mono" },
    // { src: "/images/logos/westminster.svg", alt: "University of Westminster", cls: "hero__partner--dark-art" },
    // /* Drawn in black ink - measured, 0 light pixels - so on hover it needs a
    //    light plate behind it. Every other mark here is light artwork and
    //    takes the default dark plate. */
    // { src: "/images/logos/atp.webp", alt: "Agile Team Project", cls: "hero__partner--dark-art" },
  ],
};

export const problems = {
  num: "01",
  eyebrow: "Why this matters",
  title: "Farming Shouldn't Be",
  accent: "a Gamble",
  sub: "Season after season, the same decisions are made without the information needed to make them well.",
  items: [
    {
      tag: "Soil",
      title: "Soil Mismanagement",
      photo: "/images/photos/problem-soil.webp",
      alt: "Seedlings growing through dry, cracked soil",
      text: "Fertilizer is applied on a schedule rather than on what the soil actually needs, because the nutrient status of a particular plot is rarely known.",
    },
    {
      tag: "Climate",
      title: "Climate Vulnerability",
      photo: "/images/photos/problem-climate.webp",
      alt: "A single seedling in parched, cracked ground",
      text: "Rainfall arrives earlier or later than the cultivation plan assumed, and a schedule fixed at sowing cannot respond to it.",
    },
    {
      tag: "Market",
      title: "Market Risk",
      photo: "/images/photos/problem-market.webp",
      alt: "Vegetables for sale in bowls at a market stall",
      text: "Many farmers plant the same crop in the same season, and the price at harvest reflects a supply nobody could see coming.",
    },
    {
      tag: "Pests",
      title: "Pest and Disease Pressure",
      photo: "/images/photos/problem-pests.webp",
      alt: "A dense crop of cabbages in the field",
      text: "Outbreaks are noticed once damage is visible, by which point the window for a cheaper, lighter intervention has usually closed.",
    },
    {
      tag: "Water",
      title: "Water Uncertainty",
      photo: "/images/photos/problem-water.webp",
      alt: "Sprinklers irrigating long rows of a field",
      text: "Irrigation is judged by eye and by habit. Too little stresses the crop; too much wastes water that the next cultivation will need.",
    },
    {
      tag: "Post-harvest",
      title: "Post-Harvest Loss",
      photo: "/images/photos/problem-postharvest.webp",
      alt: "A worker beside a large pile of discarded vegetables",
      text: "Produce that survived the whole season is lost in storage or sold in a hurry, because storage conditions and buyers are both unknowns.",
    },
  ],
  gap: {
    tag: "The gap",
    title: "The Connectivity Gap",
    photo: "/images/photos/connectivity-gap.webp",
    alt: "Paddy fields and coconut palms in rural Sri Lanka",
    text: "Advice that exists in a research station, a district office or a smartphone app does not reach the plot where the decision is made. Aswenna is built the other way around: it assumes patchy coverage, shared devices and a farmer who needs an answer in their own language.",
  },
};

export const soil = {
  num: "02",
  eyebrow: "Below the surface",
  title: "Healthy Harvests Begin Beneath the Surface.",
  sub: "Every plot has its own characteristics. Understanding soil moisture, temperature, pH and nutrient conditions helps farmers make better cultivation decisions.",
  capabilities: [
    {
      icon: "map-pin",
      title: "Geo-located soil profiling",
      text: "A soil profile is built for the exact plot a farmer marks on the map.",
    },
    {
      icon: "droplets",
      title: "Soil moisture monitoring",
      text: "Moisture in the root zone is tracked so watering follows the soil, not the calendar.",
    },
    {
      icon: "thermometer",
      title: "Soil temperature monitoring",
      text: "Temperature readings support sowing and germination decisions.",
    },
    {
      icon: "zap",
      title: "Electrical conductivity (EC)",
      text: "EC measurements indicate salinity and overall nutrient balance in the soil.",
    },
    {
      icon: "flask",
      title: "pH and NPK profiling",
      text: "Collected through handheld probes shared across a farmer organization.",
    },
  ],
  strata: ["Surface", "Root zone", "Sub-soil"],
  transparency: {
    title: "Two kinds of numbers. Always labelled.",
    text: "Aswenna clearly distinguishes between estimated soil values derived from regional databases and actual measurements collected by field devices. A farmer always knows which one they are reading.",
    rows: [
      {
        tone: "estimated",
        label: "Estimated",
        text: "Derived from regional soil databases for the mapped location.",
      },
      {
        tone: "measured",
        label: "Measured",
        text: "Collected directly by a field device or handheld probe on the plot.",
      },
    ],
  },
};

export const journey = {
  num: "03",
  eyebrow: "The growth journey",
  title: "From Seed to Harvest.",
  sub: "A crop passes through six recognisable stages. Aswenna's intelligent cultivation calendar adapts its recommendations at each one.",
  stages: [
    { n: "01", name: "Seed", text: "A seed placed within the soil." },
    {
      n: "02",
      name: "Germination",
      text: "The seed begins developing its first roots and shoot.",
    },
    {
      n: "03",
      name: "Seedling",
      text: "The first leaves emerge above the soil.",
    },
    {
      n: "04",
      name: "Young Plant",
      text: "The stem strengthens and the leaves develop.",
    },
    {
      n: "05",
      name: "Growing Plant",
      text: "The plant develops more branches and a larger leaf structure.",
    },
    {
      n: "06",
      name: "Mature Plant",
      text: "A fully developed crop ready for its next agricultural stage.",
    },
  ],
  adapts: {
    eyebrow: "In every season",
    title: "What the calendar adapts at every stage",
    sub: "Aswenna's intelligent cultivation calendar re-reads the plot at every stage and rewrites what it asks the farmer to do next.",
    items: [
      "Irrigation schedules",
      "Fertilizer application",
      "Crop maintenance",
      "Cultivation activities",
      "Weather-dependent adjustments",
    ],
  },
};

export const seasons = {
  num: "04",
  eyebrow: "Across the cultivation year",
  title: "How Aswenna Protects You",
  accent: "Across the Seasons",
  sub: "Every season moves through the same four stages. At each one there is a decision that data can inform.",
  stages: [
    {
      icon: "sprout",
      photo: "/images/photos/land-prep-nursery.webp",
      stage: "Stage 01",
      when: "Land preparation",
      title: "Land Prep & Nursery",
      text: "Before anything is sown, the plot is mapped and profiled, so the season starts from the soil that is actually there rather than from last year's assumptions.",
      callout: {
        label: "What Aswenna does",
        text: "Builds a geo-located soil profile for the plot and recommends crops suited to its conditions, the water available and recent price behaviour.",
      },
      link: "Soil intelligence",
      href: "#soil",
    },
    {
      icon: "leaf",
      photo: "/images/photos/vegetative-top-dressing.webp",
      stage: "Stage 02",
      when: "Vegetative growth",
      title: "Vegetative & Top-Dressing",
      text: "The crop is establishing and demand for nutrients and water rises. This is where a schedule fixed weeks earlier starts to drift away from the field.",
      callout: {
        label: "What Aswenna does",
        text: "Adjusts the cultivation calendar when rainfall or soil moisture changes, and triggers irrigation from measured moisture rather than from the date.",
      },
      link: "Cultivation calendar",
      href: "#features",
    },
    {
      icon: "bug",
      photo: "/images/photos/panicle-soil-nutrition.webp",
      stage: "Stage 03",
      when: "Flowering",
      title: "Panicle & Soil Nutrition",
      text: "Humidity and leaf wetness climb, and so does the risk of an outbreak. Nutrient deficiencies that show now are expensive to correct later.",
      callout: {
        label: "What Aswenna does",
        text: "Watches the conditions that precede an outbreak and lets a farmer photograph an affected leaf for AI-assisted diagnosis and mitigation advice.",
      },
      link: "Pest and disease",
      href: "#field",
    },
    {
      icon: "wheat",
      photo: "/images/photos/harvest-market-timing.webp",
      stage: "Stage 04",
      when: "Harvest",
      title: "Harvest & Market Timing",
      text: "The crop is ready, but when and where it is sold decides what the season was worth. Storage conditions decide how much of it survives the wait.",
      callout: {
        label: "What Aswenna does",
        text: "Tracks wholesale prices from economic centres such as Dambulla and Piliyandala, and monitors storage temperature and humidity after harvest.",
      },
      link: "Market analytics",
      href: "#features",
    },
  ],
};

export const field = {
  num: "05",
  eyebrow: "Field scanning",
  title: "Intelligence Across the Land.",
  sub: "Beyond a single sensor point, Aswenna reads the whole plot - its boundaries, its canopy, its weather and its risks.",
  items: [
    {
      icon: "map",
      title: "Geo-Located Land Mapping",
      photo: "/images/photos/field-land-mapping.webp",
      alt: "A satellite map view of farmland with place labels",
      text: "Farmers identify their plots on a map and receive a personalized soil profile for that location.",
    },
    {
      icon: "satellite",
      title: "Satellite Crop-Health Monitoring",
      photo: "/images/photos/field-crop-health.webp",
      alt: "Aerial view of circular irrigated crop fields",
      text: "Satellite imagery is converted into vegetation-index (NDVI) maps to identify stressed crop areas.",
    },
    {
      icon: "cloud-rain",
      title: "Hyperlocal Weather Intelligence",
      photo: "/images/photos/hyperlocal-weather.webp",
      alt: "A storm front moving over a green field",
      text: "Monitors rainfall, temperature, humidity, wind, and leaf wetness using weather stations and regional weather services.",
    },
    {
      icon: "bug",
      title: "Pest and Disease Detection",
      photo: "/images/photos/field-pest-detection.webp",
      alt: "Close-up of a leaf showing disease spots",
      text: "Identifies potential pest outbreaks and disease risks through monitoring, environmental conditions, and AI-assisted diagnosis.",
    },
  ],
};

export const engine = {
  num: "06",
  eyebrow: "The intelligence engine",
  title: "How Aswenna Works.",
  sub: "A closed loop of five stages. Data leaves the field, becomes understanding, and returns to the farmer as an action.",
  stages: [
    {
      icon: "radar",
      name: "Sense",
      text: "Field nodes, weather stations, pest traps, satellites, and farmer photographs produce agricultural data.",
    },
    {
      icon: "radio-tower",
      name: "Connect",
      text: "LoRaWAN technology connects field devices to village gateways, while mobile connectivity transfers data to the cloud.",
    },
    {
      icon: "layers",
      name: "Understand",
      text: "The cloud combines sensor readings, soil maps, weather forecasts, and market prices into a live profile for each plot.",
    },
    {
      icon: "brain",
      name: "Decide",
      text: "Rules and machine-learning models generate recommendations, cultivation-calendar updates, irrigation commands, and warnings.",
    },
    {
      icon: "sprout",
      name: "Act",
      text: "Farmers receive advice via the app, SMS, or voice calls, while connected irrigation valves and pumps can operate automatically.",
    },
  ],
};

export const comparison = {
  num: "07",
  eyebrow: "The Aswenna approach",
  title: "Replacing Guesswork",
  accent: "with Measurement",
  sub: "The same decisions, made from what the plot reports rather than from what the season usually does.",
  withoutLabel: "Without Aswenna",
  withLabel: "With Aswenna",
  /* `label` names the decision being compared, so the eight pairs can be a
     list you pick from rather than sixteen pills stacked down the page.
     `photo` is decorative backing for the panel - the meaning is in the two
     sentences, so the images are marked aria-hidden. */
  rows: [
    {
      label: "Fertilizer",
      photo: "/images/photos/fertilizer.webp",
      without: "Fertilizer applied to a fixed schedule.",
      with: "Applied against the plot's own soil profile and growth stage.",
    },
    {
      label: "Irrigation",
      photo: "/images/photos/irrigation.webp",
      without: "Irrigation judged by eye.",
      with: "Triggered when measured soil moisture crosses a set threshold.",
    },
    {
      label: "The calendar",
      photo: "/images/photos/calendar.webp",
      without: "A cultivation plan fixed at sowing.",
      with: "A calendar that rewrites itself when the forecast changes.",
    },
    {
      label: "Pests and disease",
      photo: "/images/photos/plant-disease.webp",
      without: "Pests found once damage is visible.",
      with: "Risk flagged from conditions, and diagnosis from a photograph.",
    },
    {
      label: "Crop choice",
      photo: "/images/photos/crop-choice.webp",
      without: "Crop choice follows the neighbours.",
      with: "Choice weighed against soil, water, forecast and price history.",
    },
    {
      label: "Price and timing",
      photo: "/images/photos/price-and-timing.webp",
      without: "Price discovered on the day of sale.",
      with: "Wholesale trends and supply forecasts followed through the season.",
    },
    {
      label: "How advice arrives",
      photo: "/images/photos/how-advice-arrives.webp",
      without: "Advice that needs a smartphone and coverage.",
      with: "Advice by app, SMS or voice call, in Sinhala, Tamil or English.",
    },
    {
      label: "Who owns the data",
      photo: "/images/photos/who-owns-the-data.webp",
      without: "Field data held by whoever collected it.",
      with: "Field data owned by the farmer, exportable at any time.",
    },
  ],
};

export const featureGroups = {
  num: "08",
  eyebrow: "Everything in one platform",
  title: "Features &",
  accent: "Capabilities",
  sub: "Start with no hardware at all, and add sensing and automation to the same account when it earns its place.",
  countWord: "capabilities",
  groups: [
    {
      id: "core",
      icon: "grid",
      label: "Group 01 · No hardware required",
      need: "No hardware required",
      title: "The Core Platform",
      note: "Everything in this group runs on regional data, satellite imagery and what the farmer tells the app. No device needs to be bought or installed.",
      items: [
        {
          icon: "map-pin",
          title: "Geo-located soil profiling",
          text: "Mark a plot on the map and receive a soil profile for that location, with every value labelled estimated or measured.",
        },
        {
          icon: "wheat",
          title: "Crop recommendation",
          text: "Soil conditions, weather forecasts, available water, historical prices and nearby planting patterns weighed together.",
        },
        {
          icon: "calendar",
          title: "Dynamic cultivation calendar",
          text: "A personalized schedule that adapts automatically when rainfall, soil conditions or forecasts change.",
        },
        {
          icon: "satellite",
          title: "Satellite crop-health maps",
          text: "Satellite imagery converted into vegetation-index (NDVI) maps that show which parts of a plot are under stress.",
        },
        {
          icon: "trending-up",
          title: "Market trend analytics",
          text: "Wholesale prices from economic centres read alongside anonymized planting data to forecast supply conditions.",
        },
        {
          icon: "scan",
          title: "AI-assisted diagnosis",
          text: "Photograph an affected leaf or pest and receive a probable match with mitigation advice to confirm with an officer.",
        },
      ],
    },
    {
      id: "iot",
      icon: "cpu",
      label: "Group 02 · Precision field automation",
      need: "Optional, and shareable",
      title: "IoT & Devices",
      note: "Devices are optional and can be shared across a farmer organization. Readings they produce are marked as measured, so they are never confused with regional estimates.",
      items: [
        {
          icon: "droplet",
          title: "Live soil monitoring",
          text: "ESP32-based nodes report soil moisture, temperature and electrical conductivity from the root zone of the plot.",
        },
        {
          icon: "waves",
          title: "Smart irrigation",
          text: "Valves and pumps open when measured moisture drops below the lower threshold and close when it recovers.",
        },
        {
          icon: "cloud-sun",
          title: "Hyperlocal weather",
          text: "Micro weather stations add rainfall, temperature, humidity, wind and leaf wetness for the village itself.",
        },
        {
          icon: "flask",
          title: "Handheld pH and NPK probes",
          text: "Shared probes let an organization collect real nutrient readings without every farmer buying an instrument.",
        },
        {
          icon: "radio-tower",
          title: "Village LoRaWAN gateways",
          text: "Long-range, low-power links carry readings from field devices to a village gateway and on to the cloud.",
        },
        {
          icon: "gauge",
          title: "Device monitoring",
          text: "Battery level, signal strength and last-reported reading for every node, so a silent sensor is noticed.",
        },
      ],
    },
    {
      id: "access",
      icon: "users",
      label: "Group 03 · Access and ownership",
      need: "However the farmer connects",
      title: "Universal Access",
      note: "A farmer without a smartphone, without coverage, or without a shared device still receives the advice their plot generates.",
      items: [
        {
          icon: "message-square",
          title: "SMS and voice delivery",
          text: "Alerts and recommendations reach a basic handset by text message or voice call when the app cannot be opened.",
        },
        {
          icon: "wifi-off",
          title: "Offline-first application",
          text: "The app works without a connection and synchronises when one returns, rather than failing in the field.",
        },
        {
          icon: "languages",
          title: "Sinhala, Tamil and English",
          text: "The interface and the alerts are written in the language the farmer actually reads.",
        },
        {
          icon: "database",
          title: "The farmer owns the data",
          text: "Plot boundaries, readings and history belong to the farmer and can be exported at any time.",
        },
        {
          icon: "users",
          title: "Organization dashboards",
          text: "Farmer organizations and extension officers see an area-wide view built from data their members chose to share.",
        },
      ],
    },
  ],
};

export const fieldFirst = {
  num: "09",
  eyebrow: "Designed for real conditions",
  title: "Designed for the Field,",
  accent: "Not an Office",
  sub: "The constraints of a Sri Lankan smallholding are the starting point, not an edge case handled later.",
  items: [
    {
      icon: "message-circle",
      title: "Plain, field-ready language",
      text: "Recommendations are written as an instruction a farmer can act on - what to do, on which plot, and by when - not as a dashboard metric to interpret.",
    },
    {
      icon: "signal-low",
      title: "Low-data, low-coverage by default",
      text: "Screens are built to load on a weak connection, and the application keeps working through the gaps rather than waiting for a signal.",
    },
    {
      icon: "phone-call",
      title: "One-tap agronomy helpline",
      text: "When a recommendation needs a human, the app places the farmer in touch with their extension officer with the plot's context already attached.",
    },
  ],
};

export const hardware = {
  num: "10",
  eyebrow: "Field technology",
  title: "The IoT Ecosystem.",
  sub: "Hardware built for village conditions - solar powered, long range, and shareable across a farmer organization.",
  components: [
    { icon: "cpu", name: "ESP32-based soil monitoring nodes" },
    { icon: "droplet", name: "Soil moisture sensors" },
    { icon: "flask", name: "Handheld pH and NPK soil probes" },
    { icon: "cloud-sun", name: "Micro weather stations" },
    { icon: "bug", name: "Smart pest traps" },
    { icon: "gauge", name: "Irrigation controllers & water flow meters" },
    { icon: "radio-tower", name: "Village LoRaWAN gateways" },
    { icon: "sun", name: "Solar-powered field power units" },
  ],
};

export const install = {
  num: "11",
  eyebrow: "Hardware in the field",
  title: "How Field Hardware Installs",
  accent: "on Your Land",
  sub: "Three devices cover a plot. All are solar powered, and none requires a wired connection or mains electricity.",
  devices: [
    {
      icon: "cpu",
      label: "Device 01",
      title: "Solar-Powered Soil Node",
      text: "Placed in the root zone of the plot. It reports soil moisture, temperature and electrical conductivity over a long-range radio link, and runs from a small solar panel.",
      points: [
        "Sits in the root zone of the crop",
        "Solar powered, no mains supply",
        "Reports over LoRaWAN to the village gateway",
      ],
      link: "Readings appear as measured values",
    },
    {
      icon: "radio-tower",
      label: "Device 02",
      title: "Long-Range LoRa Gateway",
      text: "Mounted once for the whole village, usually by the farmer organization. It collects readings from every node in range and forwards them over mobile connectivity to the cloud.",
      points: [
        "One gateway serves many plots",
        "Shared across a farmer organization",
        "Bridges field devices to mobile data",
      ],
      link: "Shared at the village level",
    },
    {
      icon: "plug",
      label: "Device 03",
      title: "Pump Controller with Manual Switch",
      text: "Fitted to an existing pump or valve. It opens when measured soil moisture falls below the threshold and closes when moisture recovers - and the farmer can always override it by hand.",
      points: [
        "Works with the pump already installed",
        "Automatic start and stop from soil moisture",
        "Manual override at the switch, always",
      ],
      link: "Farmer override is never removed",
    },
  ],
};

export const pricing = {
  num: "12",
  eyebrow: "Participation tiers",
  title: "Choose What Fits",
  accent: "Your Farm",
  sub: "No hardware is required to begin. Hardware is added only when a farmer or an organization wants it.",
  note: "Indicative hardware costs for the proposed pilot. Aswenna is a research and development project, not a commercial service, and these figures are not a sales offer.",
  flag: "Most requested",
  tiers: [
    {
      tag: "Tier 0",
      name: "Software Only",
      price: "Contact Sales",
      unit: "no hardware",
      featured: false,
      text: "The full platform on regional and satellite data.",
      items: [
        "Geo-located soil profiling",
        "Crop recommendations",
        "Dynamic cultivation calendar",
        "Alerts, SMS and voice delivery",
        "Market analytics and NDVI maps",
      ],
      cta: "Start here",
    },
    {
      tag: "Tier 1",
      name: "Shared Village Station",
      price: "Contact Sales",
      unit: "per village, indicative",
      featured: false,
      text: "Shared by a farmer organization across a community.",
      items: [
        "Everything in Tier 0",
        "Micro weather station",
        "Village LoRaWAN gateway",
        "Handheld pH and NPK probe",
        "Community-level readings",
      ],
      cta: "Enquire for a village",
    },
    {
      tag: "Tier 2",
      name: "Plot Automation",
      price: "Contact Sales",
      unit: "per plot, indicative",
      featured: true,
      text: "Dedicated sensing and automated watering on your own plot.",
      items: [
        "Everything in Tier 0",
        "Dedicated soil monitoring node",
        "Irrigation controller and flow meter",
        "Live plot monitoring",
        "Automated watering with manual override",
      ],
      cta: "Enquire about a plot",
    },
  ],
};

export const platform = {
  num: "13",
  eyebrow: "Connected agriculture",
  title: "The Aswenna Platform.",
  sub: "Proposed interfaces for farmers, their organizations and the extension officers who support them.",
  screens: [
    {
      name: "Farmer dashboard",
      text: "Today's plot status, alerts and the next action.",
    },
    {
      name: "Land registration & mapping",
      text: "Draw a plot boundary and receive its soil profile.",
    },
    {
      name: "Soil integrity & monitoring",
      text: "Moisture, temperature, EC, pH and NPK over time.",
    },
    {
      name: "Crop recommendations",
      text: "Suitable and profitable crops for this plot and season.",
    },
    {
      name: "Cultivation calendar",
      text: "A schedule that rewrites itself when conditions change.",
    },
    {
      name: "Pests and alerts",
      text: "Outbreak risks, warnings and mitigation advice.",
    },
    {
      name: "Market analytics",
      text: "Wholesale price trends and supply forecasts.",
    },
    {
      name: "Device monitoring",
      text: "Node battery, signal and last-reported readings.",
    },
    {
      name: "Smart irrigation",
      text: "Thresholds, valve state and manual override.",
    },
    {
      name: "Extension officer area dashboard",
      text: "An area-wide view for officers supporting many farms.",
    },
  ],
};

/* Not rendered on the page any more. Kept because scripts/gen-seo.mjs
   publishes it in llms-full.txt, where it is the evidence behind the
   "planned, not deployed" status note. */
export const roadmap = {
  eyebrow: "Strategic implementation",
  title: "The Roadmap.",
  sub: "Phases 01-03 define the project scope. Phase 04 collects future extensions. All phases describe planned capabilities, not deployed commercial operations.",
  scopeLabel: "Project scope: Phases 01-03",
  futureLabel: "Future work: Phase 04",
  note: "All phases above describe planned and proposed capabilities of the Aswenna project. They do not represent deployed commercial operations.",
  phases: [
    {
      n: "Phase 01",
      name: "Software Core",
      status: "Planned",
      scope: true,
      items: [
        "Soil profiling",
        "Crop recommendations",
        "Cultivation calendar",
        "Alerts",
        "Market analytics",
        "Satellite crop-health maps",
        "SMS / voice alerts",
        "Offline-first application",
      ],
    },
    {
      n: "Phase 02",
      name: "Sensing Pilot",
      status: "Planned",
      scope: true,
      items: [
        "Village gateway",
        "Shared weather station",
        "Handheld soil probe",
        "Soil nodes on selected pilot plots",
      ],
    },
    {
      n: "Phase 03",
      name: "Automation",
      status: "Planned",
      scope: true,
      items: [
        "Automated irrigation controllers",
        "Adaptive cultivation calendars",
        "Planting-data supply forecasts",
        "Digital twins",
        "Organization dashboards",
      ],
    },
    {
      n: "Phase 04",
      name: "Future Extensions",
      status: "Proposed",
      scope: false,
      items: [
        "Smart pest traps",
        "Post-harvest storage monitoring",
        "QR traceability",
        "Drone services",
        "Elephant-intrusion warnings",
      ],
    },
  ],
};

export const faq = {
  num: "14",
  eyebrow: "Questions",
  title: "Frequently Asked",
  accent: "Questions",
  sub: "What farmers and farmer organizations ask most often about the project.",
  items: [
    {
      q: "Do I need to buy sensors or hardware?",
      a: "No. Tier 0 is the whole software platform with no hardware at all - soil profiling, crop recommendations, the cultivation calendar, alerts, market analytics and satellite crop-health maps. Hardware only adds measured readings from your own plot on top of that.",
    },
    {
      q: "What if I do not have a smartphone or a signal?",
      a: "Alerts and recommendations can be delivered by SMS or by voice call to a basic handset, and the application itself is offline-first: it keeps working without a connection and synchronises when one returns.",
    },
    {
      q: "How accurate are the soil values?",
      a: "It depends on where they come from, and Aswenna always tells you which. Estimated values are derived from regional soil databases for your mapped location. Measured values come from a field device or a handheld probe on your plot. The two are never mixed or presented as the same thing.",
    },
    {
      q: "Who owns the data from my land?",
      a: "You do. Plot boundaries, readings and history belong to the farmer, and can be exported at any time. Data shared with a farmer organization or an extension officer is anonymized where it feeds area-wide analysis.",
    },
    {
      q: "Is Aswenna available in Sinhala and Tamil?",
      a: "Yes. The interface and the alerts are planned in Sinhala, Tamil and English, because advice that cannot be read is not advice.",
    },
    {
      q: "Is this available to use today?",
      a: "Not yet. Aswenna is an academic and agricultural research initiative. Phases 01 to 03 describe the planned project scope and Phase 04 collects proposed future extensions - none of it describes a deployed commercial service.",
    },
  ],
};

export const cta = {
  eyebrow: "Agricultural Intelligence Platform",
  title: "Grow Smarter. Harvest Better. Prosper Together.",
  sub: "With Aswenna, every decision begins with understanding the land. Bringing together farmers, intelligent technology and agricultural data to build a more resilient future for Sri Lankan agriculture.",
  primary: "Explore the platform",
  secondary: "Talk to the team",
  photo: "/images/photos/cta-grow-smarter.webp",
};

export const contact = {
  eyebrow: "Contact us",
  title: "Let's grow something together.",
  text: "Tell us about yourself and your land. If you are part of a farmer organization interested in a shared village station, mention it and we will come back to you.",
  note: "We usually reply within a few working days.",
  submit: "Submit enquiry",
  sending: "Sending…",
  consent: "By submitting you agree to be contacted about the Aswenna project.",
  successTitle: "Thank you - your enquiry is on its way.",
  successText:
    "We have received your details and will reply to the address or number you gave us.",
  errorTitle: "That did not send.",
  errorText:
    "Something went wrong on the way to us. Please try again, or email us directly.",
  again: "Send another",
  retry: "Try again",
  fields: {
    firstName: { label: "First name", placeholder: "Enter your first name" },
    lastName: { label: "Last name", placeholder: "Enter your last name" },
    phone: { label: "Phone number", placeholder: "e.g. 071 234 5678" },
    district: { label: "District", placeholder: "e.g. Anuradhapura" },
    email: { label: "Email", placeholder: "you@example.com" },
    location: { label: "Land location", placeholder: "Village, nearest town" },
    size: { label: "Land size", placeholder: "e.g. 2.4" },
    message: {
      label: "Message",
      placeholder: "Tell us about your plot, your crops and what you need.",
    },
  },
};

export const footer = {
  /* No paragraph explaining what Aswenna is: by the time a reader reaches the
     footer the whole page has said it, and saying it again is filler. */
  parentLine: "A project of Veyra Solutions",
  tagline: "Smarter fields, greater future.",
  cta: { label: "Let's grow something together", href: "#contact" },
  columns: [
    {
      title: "Platform",
      links: [
        { label: "Why Aswenna", href: "#why" },
        { label: "Soil intelligence", href: "#soil" },
        { label: "Across the seasons", href: "#seasons" },
        { label: "Field scanning", href: "#field" },
        { label: "The Aswenna platform", href: "#platform" },
      ],
    },
    {
      title: "Technology",
      links: [
        { label: "How it works", href: "#engine" },
        { label: "What we offer", href: "#features" },
        { label: "IoT ecosystem", href: "#hardware" },
        { label: "Field installation", href: "#install" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Participation tiers", href: "#pricing" },
        { label: "Frequently asked questions", href: "#faq" },
        { label: "Contact us", href: "#contact" },
      ],
    },
  ],
  getInTouch: "Get in touch",
  invite: ["A conversation first.", "A better season, together."],
  status: "An academic and agricultural research initiative.",
  backToTop: "Back to top",
};

/* ==========================================================================
   MOBILE APPLICATION - INTERFACE DESIGN CONCEPTS
   --------------------------------------------------------------------------
   These screens are design concepts for the proposed Aswenna application.
   Every number in them is ILLUSTRATIVE: it shows what the interface does with
   a reading, not a reading taken from a field. Each device carries a caption
   that says so, because the content-integrity rule for this project forbids
   presenting invented sensor values as measurements.

   The Estimated / Measured distinction is kept inside the mockups too:
   "Measured" marks what a device on the plot would report, "Estimated" marks
   what is derived from regional databases and forecasts.
   ========================================================================== */
export const appUi = {
  statusTime: "9:41",
  tabs: [
    { icon: "house", label: "Home" },
    { icon: "map", label: "Plots" },
    { icon: "calendar", label: "Calendar" },
    { icon: "trending-up", label: "Market" },
    { icon: "ellipsis", label: "More" },
  ],

  dashboard: {
    title: "Farmer dashboard",
    caption: "Today's plot status, alerts and the next action.",
    greeting: "Ayubowan",
    farmer: "Nimal",
    plot: "Anuradhapura · Plot A",
    weather: {
      icon: "cloud-sun",
      summary: "Partly cloudy",
      temp: "31°",
      note: "Rain likely from 16:00",
      tag: "Estimated",
    },
    tiles: [
      {
        icon: "droplets",
        label: "Soil moisture",
        value: "42",
        unit: "%",
        tag: "Measured",
      },
      {
        icon: "thermometer",
        label: "Soil temp",
        value: "29",
        unit: "°C",
        tag: "Measured",
      },
      {
        icon: "flask",
        label: "Soil pH",
        value: "6.4",
        unit: "",
        tag: "Estimated",
      },
    ],
    action: {
      label: "Next action",
      title: "Irrigate Plot A before 10:00",
      text: "Moisture is below the threshold you set for the flowering stage.",
      primary: "Open valve",
      secondary: "Later",
    },
    trendLabel: "Soil moisture · last 7 days",
    trend: [58, 55, 51, 62, 54, 47, 42],
    alert: {
      icon: "triangle-alert",
      text: "Pest risk rising in your area",
      when: "2h ago",
    },
  },

  soil: {
    title: "Soil monitoring",
    caption: "Moisture, temperature, EC, pH and NPK over time.",
    plot: "Plot A · 2.4 ha",
    depthLabel: "Moisture by depth",
    layers: [
      { name: "0-15 cm", value: 38, tag: "Measured" },
      { name: "15-30 cm", value: 54, tag: "Measured" },
      { name: "30-60 cm", value: 61, tag: "Estimated" },
    ],
    trendLabel: "Last 7 days",
    trend: [52, 49, 44, 58, 51, 45, 42],
    nutrientLabel: "Nutrients",
    nutrients: [
      { name: "N", label: "Nitrogen", level: 0.46, state: "Low" },
      { name: "P", label: "Phosphorus", level: 0.72, state: "Adequate" },
      { name: "K", label: "Potassium", level: 0.63, state: "Adequate" },
    ],
    nutrientNote: "Estimated from the regional soil profile for this location.",
  },

  calendar: {
    title: "Cultivation calendar",
    caption: "A schedule that rewrites itself when conditions change.",
    season: "Maha season",
    month: "November",
    week: ["M", "T", "W", "T", "F", "S", "S"],
    /* A month, not a single week: four tasks under a seven-day strip left
       the bottom half of the screen empty, and a calendar that cannot show
       a month is not showing much.

       November 2025 begins on a Saturday, which is why `firstCol` is 5 on a
       Monday-first grid, and it is the month the task dates already use:
       17 Nov is a Monday, 20 Nov a Thursday, 29 Nov a Saturday. `marked`
       must stay in step with `tasks` below. */
    grid: { firstCol: 5, days: 30, today: 20, marked: [17, 20, 29] },
    /* Grouped, because a month view that lists four tasks in one run leaves
       the lower half of the screen empty and says nothing about when they
       fall. The group label is carried on the first task of each group. */
    tasks: [
      {
        icon: "droplets",
        title: "Second irrigation",
        when: "Mon 17 Nov",
        state: "done",
        group: "This week",
      },
      {
        icon: "flask",
        title: "Top-dress urea",
        when: "Today · before noon",
        state: "today",
      },
      {
        icon: "bug",
        title: "Scout for leaf folder",
        when: "Thu 20 Nov",
        state: "next",
      },
      {
        icon: "wheat",
        title: "Panicle initiation check",
        when: "Sat 29 Nov",
        state: "next",
        group: "Later this month",
      },
    ],
    shift: {
      icon: "refresh",
      text: "Two tasks moved - rain forecast for Wednesday.",
    },
  },

  irrigation: {
    title: "Smart irrigation",
    caption: "Thresholds, valve state and manual override.",
    plot: "Plot A · Zone 1",
    reading: "38",
    unit: "%",
    readingLabel: "Root-zone moisture",
    tag: "Measured",
    valveOpen: "Valve open",
    valveClosed: "Valve closed",
    thresholdLabel: "Thresholds",
    lower: 35,
    upper: 75,
    lowerLabel: "Opens",
    upperLabel: "Closes",
    modes: ["Auto", "Manual"],
    logLabel: "Today",
    log: [
      {
        time: "06:12",
        text: "Valve opened - moisture below 35%",
        kind: "open",
      },
      {
        time: "07:48",
        text: "Valve closed - upper threshold reached",
        kind: "close",
      },
      { time: "09:30", text: "Next check scheduled", kind: "info" },
    ],
  },

  alerts: {
    title: "Pests and alerts",
    caption: "Outbreak risks, warnings and mitigation advice.",
    headline: "3 active alerts",
    sub: "Delivered in the app, by SMS and by voice call.",
    items: [
      {
        icon: "bug",
        severity: "high",
        label: "High risk",
        title: "Rice leaf folder",
        text: "Reported on nearby plots. Scout the field edges first.",
        when: "2h ago",
      },
      {
        icon: "cloud-rain",
        severity: "medium",
        label: "Watch",
        title: "Heavy rain Wednesday",
        text: "Hold back the planned fertiliser application.",
        when: "5h ago",
      },
      {
        icon: "signal-low",
        severity: "low",
        label: "Device",
        title: "Node 2 last reported 9h ago",
        text: "Check the battery and the antenna position.",
        when: "9h ago",
      },
    ],
    delivery: [
      { icon: "message-square", label: "SMS" },
      { icon: "phone-call", label: "Voice" },
      { icon: "wifi-off", label: "Offline" },
    ],
  },

  market: {
    title: "Market analytics",
    caption: "Wholesale price trends and supply forecasts.",
    crops: ["Paddy", "Big onion", "Chilli"],
    activeCrop: 0,
    priceLabel: "Dambulla wholesale",
    series: [38, 41, 40, 44, 47, 46, 52, 55, 53, 58],
    rangeLabel: "Last 10 weeks",
    rows: [
      { name: "Dambulla DEC", value: "Rs 58 / kg", dir: "up" },
      { name: "Keppetipola DEC", value: "Rs 54 / kg", dir: "up" },
      { name: "Meegoda DEC", value: "Rs 51 / kg", dir: "down" },
    ],
    forecast: {
      icon: "chart",
      text: "Supply from planting data suggests prices easing in 3 weeks.",
    },
  },
};

/* Four more screens, so every entry in the platform list has an interface. */
export const appUiExtra = {
  mapping: {
    title: "Land registration",
    caption: "Draw a plot boundary and receive its soil profile.",
    plot: "New plot · Anuradhapura",
    areaLabel: "Mapped area",
    area: "2.4",
    areaUnit: "ha",
    perimeterLabel: "Perimeter",
    perimeter: "684 m",
    profileLabel: "Soil profile for this location",
    rows: [
      { name: "Texture", value: "Sandy clay loam", tag: "Estimated" },
      { name: "Drainage", value: "Moderate", tag: "Estimated" },
      { name: "Elevation", value: "92 m", tag: "Estimated" },
    ],
    note: "Derived from regional soil databases for the boundary you drew.",
    cta: "Save plot",
  },

  crops: {
    title: "Crop recommendations",
    caption: "Suitable and profitable crops for this plot and season.",
    season: "Maha · Plot A",
    suitLabel: "Suitability for this plot",
    items: [
      {
        name: "Paddy (BG 300)",
        score: 0.92,
        note: "Water available, soil suits",
      },
      { name: "Big onion", score: 0.74, note: "Good price outlook" },
      { name: "Green gram", score: 0.61, note: "Low water need" },
      { name: "Chilli", score: 0.48, note: "Pest pressure in area" },
    ],
    note: "Ranked on soil profile, water availability, season and price trend.",
  },

  devices: {
    title: "Device monitoring",
    caption: "Node battery, signal and last-reported readings.",
    sub: "4 devices on this plot",
    items: [
      {
        name: "Soil node 1",
        battery: 82,
        signal: "Good",
        when: "4 min ago",
        ok: true,
      },
      {
        name: "Soil node 2",
        battery: 24,
        signal: "Weak",
        when: "9h ago",
        ok: false,
      },
      {
        name: "Weather station",
        battery: 96,
        signal: "Good",
        when: "2 min ago",
        ok: true,
      },
      {
        name: "Valve controller",
        battery: 71,
        signal: "Good",
        when: "6 min ago",
        ok: true,
      },
    ],
    gateway: "Village gateway online",
  },

  officer: {
    title: "Area dashboard",
    caption: "An area-wide view for officers supporting many farms.",
    sub: "Anuradhapura · 128 plots",
    tiles: [
      { icon: "users", label: "Farmers", value: "96" },
      { icon: "map", label: "Plots", value: "128" },
      { icon: "triangle-alert", label: "Alerts", value: "7" },
    ],
    listLabel: "Needs attention",
    rows: [
      {
        name: "Thalawa cluster",
        text: "Leaf folder risk on 9 plots",
        level: "high",
      },
      { name: "Nochchiyagama", text: "3 soil nodes offline", level: "medium" },
      {
        name: "Rambewa",
        text: "Irrigation overdue on 2 plots",
        level: "medium",
      },
    ],
    note: "Area figures are aggregated and anonymised.",
  },
};

/** Which designed screen each entry of the platform list shows. */
export const platformScreens = [
  "dashboard",
  "mapping",
  "soil",
  "crops",
  "calendar",
  "alerts",
  "market",
  "devices",
  "irrigation",
  "officer",
] as const;
