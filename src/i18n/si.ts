/**
 * Sinhala. Same shape as src/data/content.ts.
 * EVERY STRING HERE NEEDS A NATIVE SPEAKER'S REVIEW BEFORE LAUNCH.
 *
 * RULES
 * 1. Replace only the text. Keep the keys, and keep arrays in the same order
 *    and the same length as content.ts: items are matched by position.
 * 2. Never leave a value as "". An empty string counts as a translation, so
 *    the English fallback is skipped and the page shows a blank. Leave the
 *    English text in place until you have the Sinhala.
 * 3. Icons, photos, hrefs, tones and section numbers are not translated, so
 *    they are not in this file.
 */
export const si = {
  site: {
    tagline: "බුද්ධිමත් කෙත්, වඩා හොඳ අනාගතයක්",
    promise: "ගොවීන් සවිබල ගැන්වීම, සමෘද්ධිය වර්ධනය කිරීම.",
  },

  ui: {
    getStarted: "ආරම්භ කරන්න",
    openMenu: "මෙනුව විවෘත කරන්න",
    closeMenu: "මෙනුව වසන්න",
    primaryNav: "ප්‍රධාන සංචාලනය",
    language: "භාෂාව",
    chooseLanguage: "භාෂාවක් තෝරන්න",
    home: "Aswenna home",
    backToTop: "Back to top",
    skipToContent: "Skip to content",
  },

  nav: [
    { label: "ඇයි ඇස්වැන්න?" },
    { label: "ක්‍රියාකාරිත්වය" },
    { label: "විශේෂාංග" },
    { label: "උපකරණ" },
    { label: "මිල ගණන්" },
    { label: "නිති පැන" },
  ],

  hero: {
    badge: "කෘෂිකාර්මික බුද්ධි වේදිකාව",
    badgeTag: "ශ්‍රී ලංකාව",
    title: ["Every Harvest Begins", "With a Smarter Beginning."],
    sub: "Discover a new way to understand your land, nurture your crops and grow with confidence through intelligent agricultural technology.",
    primaryCta: "වේදිකාව ගවේෂණය කරන්න",
    secondaryCta: "ක්‍රියා කරන ආකාරය බලන්න",
    cards: [
      { label: "Soil moisture", value: "Live node", note: "Measured on plot" },
      {
        label: "Rainfall outlook",
        value: "Hyperlocal",
        note: "Station + regional feed",
      },
    ],
  },

  partners: {
    note: "Aswenna is a project of Veyra Solutions.",
  },

  problems: {
    eyebrow: "Why this matters",
    title: "Farming Shouldn't Be",
    accent: "a Gamble",
    sub: "Season after season, the same decisions are made without the information needed to make them well.",
    items: [
      {
        tag: "Soil",
        title: "Soil Mismanagement",
        text: "Fertilizer is applied on a schedule rather than on what the soil actually needs, because the nutrient status of a particular plot is rarely known.",
      },
      {
        tag: "Climate",
        title: "Climate Vulnerability",
        text: "Rainfall arrives earlier or later than the cultivation plan assumed, and a schedule fixed at sowing cannot respond to it.",
      },
      {
        tag: "Market",
        title: "Market Risk",
        text: "Many farmers plant the same crop in the same season, and the price at harvest reflects a supply nobody could see coming.",
      },
      {
        tag: "Pests",
        title: "Pest and Disease Pressure",
        text: "Outbreaks are noticed once damage is visible, by which point the window for a cheaper, lighter intervention has usually closed.",
      },
      {
        tag: "Water",
        title: "Water Uncertainty",
        text: "Irrigation is judged by eye and by habit. Too little stresses the crop; too much wastes water that the next cultivation will need.",
      },
      {
        tag: "Post-harvest",
        title: "Post-Harvest Loss",
        text: "Produce that survived the whole season is lost in storage or sold in a hurry, because storage conditions and buyers are both unknowns.",
      },
    ],
    gap: {
      tag: "The gap",
      title: "The Connectivity Gap",
      text: "Advice that exists in a research station, a district office or a smartphone app does not reach the plot where the decision is made. Aswenna is built the other way around: it assumes patchy coverage, shared devices and a farmer who needs an answer in their own language.",
    },
  },

  soil: {
    eyebrow: "Below the surface",
    title: "Healthy Harvests Begin Beneath the Surface.",
    sub: "Every plot has its own characteristics. Understanding soil moisture, temperature, pH and nutrient conditions helps farmers make better cultivation decisions.",
    capabilities: [
      {
        title: "Geo-located soil profiling",
        text: "A soil profile is built for the exact plot a farmer marks on the map.",
      },
      {
        title: "Soil moisture monitoring",
        text: "Moisture in the root zone is tracked so watering follows the soil, not the calendar.",
      },
      {
        title: "Soil temperature monitoring",
        text: "Temperature readings support sowing and germination decisions.",
      },
      {
        title: "Electrical conductivity (EC)",
        text: "EC measurements indicate salinity and overall nutrient balance in the soil.",
      },
      {
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
          label: "Estimated",
          text: "Derived from regional soil databases for the mapped location.",
        },
        {
          label: "Measured",
          text: "Collected directly by a field device or handheld probe on the plot.",
        },
      ],
    },
  },

  journey: {
    eyebrow: "The growth journey",
    title: "From Seed to Harvest.",
    sub: "A crop passes through six recognisable stages. Aswenna's intelligent cultivation calendar adapts its recommendations at each one.",
    stages: [
      { name: "Seed", text: "A seed placed within the soil." },
      {
        name: "Germination",
        text: "The seed begins developing its first roots and shoot.",
      },
      { name: "Seedling", text: "The first leaves emerge above the soil." },
      {
        name: "Young Plant",
        text: "The stem strengthens and the leaves develop.",
      },
      {
        name: "Growing Plant",
        text: "The plant develops more branches and a larger leaf structure.",
      },
      {
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
  },

  seasons: {
    eyebrow: "Across the cultivation year",
    title: "How Aswenna Protects You",
    accent: "Across the Seasons",
    sub: "Every season moves through the same four stages. At each one there is a decision that data can inform.",
    stages: [
      {
        stage: "Stage 01",
        when: "Land preparation",
        title: "Land Prep & Nursery",
        text: "Before anything is sown, the plot is mapped and profiled, so the season starts from the soil that is actually there rather than from last year's assumptions.",
        callout: {
          label: "What Aswenna does",
          text: "Builds a geo-located soil profile for the plot and recommends crops suited to its conditions, the water available and recent price behaviour.",
        },
        link: "Soil intelligence",
      },
      {
        stage: "Stage 02",
        when: "Vegetative growth",
        title: "Vegetative & Top-Dressing",
        text: "The crop is establishing and demand for nutrients and water rises. This is where a schedule fixed weeks earlier starts to drift away from the field.",
        callout: {
          label: "What Aswenna does",
          text: "Adjusts the cultivation calendar when rainfall or soil moisture changes, and triggers irrigation from measured moisture rather than from the date.",
        },
        link: "Cultivation calendar",
      },
      {
        stage: "Stage 03",
        when: "Flowering",
        title: "Panicle & Soil Nutrition",
        text: "Humidity and leaf wetness climb, and so does the risk of an outbreak. Nutrient deficiencies that show now are expensive to correct later.",
        callout: {
          label: "What Aswenna does",
          text: "Watches the conditions that precede an outbreak and lets a farmer photograph an affected leaf for AI-assisted diagnosis and mitigation advice.",
        },
        link: "Pest and disease",
      },
      {
        stage: "Stage 04",
        when: "Harvest",
        title: "Harvest & Market Timing",
        text: "The crop is ready, but when and where it is sold decides what the season was worth. Storage conditions decide how much of it survives the wait.",
        callout: {
          label: "What Aswenna does",
          text: "Tracks wholesale prices from economic centres such as Dambulla and Piliyandala, and monitors storage temperature and humidity after harvest.",
        },
        link: "Market analytics",
      },
    ],
  },

  field: {
    eyebrow: "Field scanning",
    title: "Intelligence Across the Land.",
    sub: "Beyond a single sensor point, Aswenna reads the whole plot - its boundaries, its canopy, its weather and its risks.",
    items: [
      {
        title: "Geo-Located Land Mapping",
        text: "Farmers identify their plots on a map and receive a personalized soil profile for that location.",
      },
      {
        title: "Satellite Crop-Health Monitoring",
        text: "Satellite imagery is converted into vegetation-index (NDVI) maps to identify stressed crop areas.",
      },
      {
        title: "Hyperlocal Weather Intelligence",
        text: "Monitors rainfall, temperature, humidity, wind, and leaf wetness using weather stations and regional weather services.",
      },
      {
        title: "Pest and Disease Detection",
        text: "Identifies potential pest outbreaks and disease risks through monitoring, environmental conditions, and AI-assisted diagnosis.",
      },
    ],
  },

  engine: {
    eyebrow: "The intelligence engine",
    title: "How Aswenna Works.",
    sub: "A closed loop of five stages. Data leaves the field, becomes understanding, and returns to the farmer as an action.",
    stages: [
      {
        name: "Sense",
        text: "Field nodes, weather stations, pest traps, satellites, and farmer photographs produce agricultural data.",
      },
      {
        name: "Connect",
        text: "LoRaWAN technology connects field devices to village gateways, while mobile connectivity transfers data to the cloud.",
      },
      {
        name: "Understand",
        text: "The cloud combines sensor readings, soil maps, weather forecasts, and market prices into a live profile for each plot.",
      },
      {
        name: "Decide",
        text: "Rules and machine-learning models generate recommendations, cultivation-calendar updates, irrigation commands, and warnings.",
      },
      {
        name: "Act",
        text: "Farmers receive advice via the app, SMS, or voice calls, while connected irrigation valves and pumps can operate automatically.",
      },
    ],
  },

  comparison: {
    eyebrow: "The Aswenna approach",
    title: "Replacing Guesswork",
    accent: "with Measurement",
    sub: "The same decisions, made from what the plot reports rather than from what the season usually does.",
    withoutLabel: "Without Aswenna",
    withLabel: "With Aswenna",
    rows: [
      {
        label: "Fertilizer",
        without: "Fertilizer applied to a fixed schedule.",
        with: "Applied against the plot's own soil profile and growth stage.",
      },
      {
        label: "Irrigation",
        without: "Irrigation judged by eye.",
        with: "Triggered when measured soil moisture crosses a set threshold.",
      },
      {
        label: "The calendar",
        without: "A cultivation plan fixed at sowing.",
        with: "A calendar that rewrites itself when the forecast changes.",
      },
      {
        label: "Pests and disease",
        without: "Pests found once damage is visible.",
        with: "Risk flagged from conditions, and diagnosis from a photograph.",
      },
      {
        label: "Crop choice",
        without: "Crop choice follows the neighbours.",
        with: "Choice weighed against soil, water, forecast and price history.",
      },
      {
        label: "Price and timing",
        without: "Price discovered on the day of sale.",
        with: "Wholesale trends and supply forecasts followed through the season.",
      },
      {
        label: "How advice arrives",
        without: "Advice that needs a smartphone and coverage.",
        with: "Advice by app, SMS or voice call, in Sinhala, Tamil or English.",
      },
      {
        label: "Who owns the data",
        without: "Field data held by whoever collected it.",
        with: "Field data owned by the farmer, exportable at any time.",
      },
    ],
  },

  featureGroups: {
    eyebrow: "Everything in one platform",
    title: "Features &",
    accent: "Capabilities",
    sub: "Start with no hardware at all, and add sensing and automation to the same account when it earns its place.",
    countWord: "capabilities",
    groups: [
      {
        label: "Group 01 · No hardware required",
        need: "No hardware required",
        title: "The Core Platform",
        note: "Everything in this group runs on regional data, satellite imagery and what the farmer tells the app. No device needs to be bought or installed.",
        items: [
          {
            title: "Geo-located soil profiling",
            text: "Mark a plot on the map and receive a soil profile for that location, with every value labelled estimated or measured.",
          },
          {
            title: "Crop recommendation",
            text: "Soil conditions, weather forecasts, available water, historical prices and nearby planting patterns weighed together.",
          },
          {
            title: "Dynamic cultivation calendar",
            text: "A personalized schedule that adapts automatically when rainfall, soil conditions or forecasts change.",
          },
          {
            title: "Satellite crop-health maps",
            text: "Satellite imagery converted into vegetation-index (NDVI) maps that show which parts of a plot are under stress.",
          },
          {
            title: "Market trend analytics",
            text: "Wholesale prices from economic centres read alongside anonymized planting data to forecast supply conditions.",
          },
          {
            title: "AI-assisted diagnosis",
            text: "Photograph an affected leaf or pest and receive a probable match with mitigation advice to confirm with an officer.",
          },
        ],
      },
      {
        label: "Group 02 · Precision field automation",
        need: "Optional, and shareable",
        title: "IoT & Devices",
        note: "Devices are optional and can be shared across a farmer organization. Readings they produce are marked as measured, so they are never confused with regional estimates.",
        items: [
          {
            title: "Live soil monitoring",
            text: "ESP32-based nodes report soil moisture, temperature and electrical conductivity from the root zone of the plot.",
          },
          {
            title: "Smart irrigation",
            text: "Valves and pumps open when measured moisture drops below the lower threshold and close when it recovers.",
          },
          {
            title: "Hyperlocal weather",
            text: "Micro weather stations add rainfall, temperature, humidity, wind and leaf wetness for the village itself.",
          },
          {
            title: "Handheld pH and NPK probes",
            text: "Shared probes let an organization collect real nutrient readings without every farmer buying an instrument.",
          },
          {
            title: "Village LoRaWAN gateways",
            text: "Long-range, low-power links carry readings from field devices to a village gateway and on to the cloud.",
          },
          {
            title: "Device monitoring",
            text: "Battery level, signal strength and last-reported reading for every node, so a silent sensor is noticed.",
          },
        ],
      },
      {
        label: "Group 03 · Access and ownership",
        need: "However the farmer connects",
        title: "Universal Access",
        note: "A farmer without a smartphone, without coverage, or without a shared device still receives the advice their plot generates.",
        items: [
          {
            title: "SMS and voice delivery",
            text: "Alerts and recommendations reach a basic handset by text message or voice call when the app cannot be opened.",
          },
          {
            title: "Offline-first application",
            text: "The app works without a connection and synchronises when one returns, rather than failing in the field.",
          },
          {
            title: "Sinhala, Tamil and English",
            text: "The interface and the alerts are written in the language the farmer actually reads.",
          },
          {
            title: "The farmer owns the data",
            text: "Plot boundaries, readings and history belong to the farmer and can be exported at any time.",
          },
          {
            title: "Organization dashboards",
            text: "Farmer organizations and extension officers see an area-wide view built from data their members chose to share.",
          },
        ],
      },
    ],
  },

  fieldFirst: {
    eyebrow: "Designed for real conditions",
    title: "Designed for the Field,",
    accent: "Not an Office",
    sub: "The constraints of a Sri Lankan smallholding are the starting point, not an edge case handled later.",
    items: [
      {
        title: "Plain, field-ready language",
        text: "Recommendations are written as an instruction a farmer can act on - what to do, on which plot, and by when - not as a dashboard metric to interpret.",
      },
      {
        title: "Low-data, low-coverage by default",
        text: "Screens are built to load on a weak connection, and the application keeps working through the gaps rather than waiting for a signal.",
      },
      {
        title: "One-tap agronomy helpline",
        text: "When a recommendation needs a human, the app places the farmer in touch with their extension officer with the plot's context already attached.",
      },
    ],
  },

  hardware: {
    eyebrow: "Field technology",
    title: "The IoT Ecosystem.",
    sub: "Hardware built for village conditions - solar powered, long range, and shareable across a farmer organization.",
    components: [
      { name: "ESP32-based soil monitoring nodes" },
      { name: "Soil moisture sensors" },
      { name: "Handheld pH and NPK soil probes" },
      { name: "Micro weather stations" },
      { name: "Smart pest traps" },
      { name: "Irrigation controllers & water flow meters" },
      { name: "Village LoRaWAN gateways" },
      { name: "Solar-powered field power units" },
    ],
  },

  install: {
    eyebrow: "Hardware in the field",
    title: "How Field Hardware Installs",
    accent: "on Your Land",
    sub: "Three devices cover a plot. All are solar powered, and none requires a wired connection or mains electricity.",
    devices: [
      {
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
  },

  pricing: {
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
  },

  platform: {
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
  },

  faq: {
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
  },

  cta: {
    eyebrow: "Agricultural Intelligence Platform",
    title: "Grow Smarter. Harvest Better. Prosper Together.",
    sub: "With Aswenna, every decision begins with understanding the land. Bringing together farmers, intelligent technology and agricultural data to build a more resilient future for Sri Lankan agriculture.",
    primary: "වේදිකාව ගවේෂණය කරන්න",
    secondary: "කණ්ඩායම හා කතා කරන්න",
  },

  contact: {
    eyebrow: "අප හා සම්බන්ධ වන්න",
    title: "අපි එකට යමක් වවමු.",
    text: "Tell us about yourself and your land. If you are part of a farmer organization interested in a shared village station, mention it and we will come back to you.",
    note: "සාමාන්‍යයෙන් වැඩ කරන දින කිහිපයක් ඇතුළත පිළිතුරු දෙමු.",
    submit: "විමසීම යොමු කරන්න",
    sending: "Sending…",
    consent:
      "ඉදිරිපත් කිරීමෙන්, ඇස්වැන්න ව්‍යාපෘතිය සම්බන්ධයෙන් ඔබ හා සම්බන්ධ වීමට ඔබ එකඟ වේ.",
    successTitle: "ස්තූතියි - ඔබගේ විමසීම ලැබුණි.",
    successText:
      "We have received your details and will reply to the address or number you gave us.",
    errorTitle: "That did not send.",
    errorText:
      "Something went wrong on the way to us. Please try again, or email us directly.",
    again: "Send another",
    retry: "Try again",
    fields: {
      firstName: { label: "මුල් නම", placeholder: "ඔබගේ මුල් නම ඇතුළත් කරන්න" },
      lastName: {
        label: "අවසන් නම",
        placeholder: "ඔබගේ අවසන් නම ඇතුළත් කරන්න",
      },
      phone: { label: "දුරකථන අංකය", placeholder: "උදා: 071 234 5678" },
      district: { label: "දිස්ත්‍රික්කය", placeholder: "උදා: අනුරාධපුර" },
      email: { label: "විද්‍යුත් තැපෑල", placeholder: "you@example.com" },
      location: { label: "ඉඩමේ පිහිටීම", placeholder: "ගම, ළඟම නගරය" },
      size: { label: "ඉඩමේ ප්‍රමාණය", placeholder: "උදා: 2.4" },
      message: {
        label: "පණිවිඩය",
        placeholder: "ඔබගේ ඉඩම, බෝග සහ අවශ්‍යතා ගැන කියන්න.",
      },
    },
  },

  footer: {
    parentLine: "A project of Veyra Solutions",
    tagline: "Smarter fields, greater future.",
    cta: { label: "Let's grow something together" },
    columns: [
      {
        title: "වේදිකාව",
        links: [
          { label: "Why Aswenna" },
          { label: "Soil intelligence" },
          { label: "Across the seasons" },
          { label: "Field scanning" },
          { label: "The Aswenna platform" },
        ],
      },
      {
        title: "තාක්ෂණය",
        links: [
          { label: "How it works" },
          { label: "What we offer" },
          { label: "IoT ecosystem" },
          { label: "Field installation" },
        ],
      },
      {
        title: "සම්බන්ධ වන්න",
        links: [
          { label: "Participation tiers" },
          { label: "Frequently asked questions" },
          { label: "Contact us" },
        ],
      },
    ],
    getInTouch: "Get in touch",
    invite: ["A conversation first.", "A better season, together."],
    status: "An academic and agricultural research initiative.",
    backToTop: "Back to top",
  },
};
