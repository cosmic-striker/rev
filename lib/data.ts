export type NavItem = { href: string; label: string };

export type Project = {
  id: string;
  title: string;
  client: string;
  award: string;
  description: string;
  director: string;
  sound?: string;
  meta: string;
  categories: string[];
  categoryLabel: string;
};

export type RosterMember = {
  id: string;
  code: string;
  name: string;
  locations: string;
  role: string;
  bio: string;
  tags: string[];
  clients: string;
  category: "directors" | "producers" | "post" | "vfx";
};

export type ArchiveCase = {
  id: string;
  discipline: string;
  client: string;
  location: string;
  title: string;
  description: string;
  outputs: string[];
  metricLabel: string;
  metricValue: string;
  category: "vfx" | "brand" | "sound";
};

export type Hub = {
  id: string;
  city: string;
  role: string;
  code: string;
  address: string;
  desk: string;
  email: string;
  timezone: string;
};

export type Faq = { id: string; question: string; answer: string };

export const workFilters = [
  { id: "all", label: "All Work" },
  { id: "commercial", label: "Commercials" },
  { id: "documentary", label: "Documentary" },
  { id: "brand", label: "Brand Films" },
  { id: "vfx", label: "3D / VFX" },
  { id: "music", label: "Music Videos" },
];

export const projects: Project[] = [
  {
    id: "hyperion",
    title: "The Electric Shift: Beyond Carbon",
    client: "HYPERION MOTORS • 2024",
    award: "CANNES LION CRAFT GOLD",
    description:
      "A sensory odyssey through the birth of a solid-state hypercar archetype, shot in Iceland and engineered in Unreal Engine 5.4.",
    director: "M. Elgström",
    sound: "Sensu-Lab",
    meta: "03:12 • 8K RAW",
    categories: ["commercial", "brand", "vfx"],
    categoryLabel: "Brand Film / VFX Benchmark",
  },
  {
    id: "vogue",
    title: "Ephemeral Form",
    client: "VOGUE NORDIC • 2024",
    award: "GLOBAL CAMPAIGN",
    description:
      "Couture textiles sculpted through fluid simulation dynamics and tactile human choreography.",
    director: "Sara Almqvist",
    meta: "02:10 • 6K RAW",
    categories: ["commercial", "brand"],
    categoryLabel: "Commercial",
  },
  {
    id: "aura",
    title: "Sonic Sculptures",
    client: "AURA AUDIO • 2025",
    award: "D&AD PENCIL",
    description:
      "Visualizing sub-bass frequency displacement with bespoke physical simulation algorithms.",
    director: "Resolution Club",
    meta: "01:48 • 4K RAW",
    categories: ["vfx", "brand"],
    categoryLabel: "Product Film",
  },
  {
    id: "kinetix",
    title: "AI Synthetics: The Second Nervous System",
    client: "KINETIX LABS • 2024",
    award: "TRIBECA OFFICIAL SELECTION",
    description:
      "An intimate docu-feature exploring the pioneers merging neuromuscular electrical stimulation with machine learning.",
    director: "K. Vance",
    sound: "Olof D.",
    meta: "EP 01 • 18:40 MIN",
    categories: ["documentary"],
    categoryLabel: "Documentary Docuseries",
  },
  {
    id: "obsidian",
    title: "Obsidian Halo",
    client: "WARNER MUSIC • AETHEL",
    award: "UK MVA NOMINEE",
    description:
      "Cinematic music narrative synthesizing motion capture dance with volumetric fluid simulation.",
    director: "J. Naito",
    meta: "04:02 • 6K RAW",
    categories: ["music", "vfx"],
    categoryLabel: "Music Video",
  },
  {
    id: "vacheron",
    title: "Microsecond Chronology",
    client: "VACHERON CONSTANTIN",
    award: "LUXURY CRAFT GRAND PRIX",
    description:
      "Ultra-high-speed Phantom Flex 4K macro cinematography capturing escapement mechanics at 1000fps.",
    director: "Marcus Lin",
    meta: "02:24 • 8K MACRO",
    categories: ["commercial", "brand"],
    categoryLabel: "Commercial",
  },
];

export const workStats = [
  { value: "120", suffix: "+", label: "Commercials & Films", detail: "High-end creative execution worldwide" },
  { value: "04", suffix: "×", label: "Cannes Lions Gold", detail: "Film Craft & Spatial Innovation" },
  { value: "85M", suffix: "+", label: "Aggregate Views", detail: "Global audience engagement footprint" },
  { value: "99.4", suffix: "%", label: "VFX Delivery Precision", detail: "Zero-defect architectural grade rendering" },
];

export const showreelChapters = [
  { time: "00:00 – 00:42", title: "Architectural Spatial Worldbuilding" },
  { time: "00:43 – 01:28", title: "Automotive & High-Velocity Lighting" },
  { time: "01:29 – 02:48", title: "Sensory Human Forms & Soundscapes" },
];

export const clients = [
  { name: "POLÉSTAR", detail: "Commercial / 3D" },
  { name: "SONY MUSIC", detail: "Visual Identity" },
  { name: "BALENCIAGA", detail: "Runway Media" },
  { name: "RIMOWA", detail: "Global Campaign" },
  { name: "APPLE TV+", detail: "Title Sequence" },
  { name: "BANG & OLUFSEN", detail: "Spatial Audio" },
];

export const testimonials = [
  {
    quote:
      "Resolution Club engineered a visual grammar for our EV launch that completely rewired luxury automotive aesthetics.",
    name: "Henrik Lindqvist",
    role: "Chief Creative Director • Hyperion",
  },
  {
    quote:
      "Rarely does a motion atelier possess both the photographic poetry of Didone editorial and the computational rigor of high VFX.",
    name: "Camilla Stenberg",
    role: "Head of Visual Content • Vogue Nordic",
  },
  {
    quote:
      "A flawless collaboration resulting in over 40 million organic views and multiple Cannes Lion craft distinctions.",
    name: "Devon Aris",
    role: "VP Brand Strategy • Warner Music Group",
  },
];

export const apexCase = {
  code: "Case 001 // Flagship Launch",
  client: "Apex Automotive Labs (Munich)",
  tags: ["Cinematic Film", "Global 360 Campaign", "Spatial Audio", "Project Monograph"],
  title: "Apex Hyper-Electric GT Reveal",
  summary:
    "Apex needed to unveil their zero-emission prototype not merely as an engineering marvel, but as an evocative, kinetic sculpture. We executed a four-continent production pipeline coupling high-speed robotic camera rigs with hyper-accurate volumetric digital doubles.",
  challenge:
    "Conceal proprietary aerodynamic surfaces while teasing hypercar silhouettes before formal Geneva autoshow embargo.",
  creative:
    "Photonic laser mapping over obsidian clay mockups and night-desert aerial sequences tracked with custom anamorphic lenses.",
  metrics: [
    { label: "Impressions", value: "14.2M", detail: "Across 18 Markets" },
    { label: "Engagement", value: "+340%", detail: "Vs. Target Benchmark" },
    { label: "Pre-Orders", value: "2,450", detail: "Units Sold Out 48h" },
  ],
  endorsement:
    "Resolution Club elevated our prototype from vehicle to mythos. Their grasp of light, speed, and sound design established a new paradigm for how luxury automotive films can resonate.",
  endorser: "Sebastian Koenig",
  endorserRole: "VP Global Brand & Marketing, Apex Mobility",
  reel: {
    title: "Master Reel // 02:44 Anamorphic 2.39:1",
    rig: ["ARRI ALEXA 35", "COOKE SF ANAMORPHIC", "Night Rigging", "VFX Mesh", "Color Suite"],
  },
  deliverables: [
    "4K DCI Pro-Res 4444",
    "18 Vertical Cutdowns",
    "Dolby Atmos Print Master",
    "Custom 33-pt 3D LUT Pack",
  ],
  turnaround: "9 Weeks",
};

export const archiveCases: ArchiveCase[] = [
  {
    id: "kronos",
    discipline: "CGI / Micro Photorealism",
    client: "Kronos Horology",
    location: "Geneva, CH",
    title: "Aethelgard Chronograph Micro-Explosion",
    description:
      "Constructed full CAD disassemblies of 312 micro-mechanical components. Animated in real-time gravity simulation accompanied by high-fidelity foley audio captures of physical titanium clicks.",
    outputs: [
      "8K CAD Structural CGI Simulation",
      "Boutique Interactive 3D WebGL Configurator",
      "Spatial Acoustics Mechanical Sound Library",
    ],
    metricLabel: "Pre-Orders Generated",
    metricValue: "$4.8M USD",
    category: "vfx",
  },
  {
    id: "aura",
    discipline: "Spatial Audio & Film",
    client: "AURA Acoustic Labs",
    location: "Stockholm, SE",
    title: "Sonic Architecture: The Sphere",
    description:
      "Crafted a multisensory launch film depicting sonic pressure waves as visible luminescent fluid particles navigating brutalist monolithic concrete structures.",
    outputs: [
      "Fluid Dynamics & Acoustic Wave Simulation",
      "Dolby Atmos Master Spatial Mix",
      "Modular Social Campaign (40 Variants)",
    ],
    metricLabel: "Global Retail Sell-Through",
    metricValue: "100% In 7 Days",
    category: "sound",
  },
  {
    id: "toranomon",
    discipline: "Spatial Identity & Film",
    client: "OMA + Vektor Studio",
    location: "Tokyo, JP",
    title: "Toranomon Pavilions Dynamic Rebrand",
    description:
      "A 360 documentary and generative video installation projecting live kinetic typography onto an 80-meter glass facade reflecting the Tokyo skyline.",
    outputs: [
      "12K Architectural LED Facade Canvas Feed",
      "Broadcast Mini-Documentary (18m)",
      "Generative Motion Identity System",
    ],
    metricLabel: "Visitor Footfall Surge",
    metricValue: "+185% Year 1",
    category: "brand",
  },
];

export const archiveFilters = [
  { id: "all", label: "All Disciplines" },
  { id: "vfx", label: "VFX & 3D" },
  { id: "brand", label: "Brand Identity" },
  { id: "sound", label: "Spatial Sound" },
];

export const productionPipeline = [
  {
    step: "01",
    icon: "stylus_note",
    title: "Pre-Production & Conception",
    description:
      "Treatment authorship, mathematical shot previz, physical set construction blueprints, talent casting, and AI-accelerated mood boards.",
    output: "Animatic & Shot Book",
  },
  {
    step: "02",
    icon: "videocam",
    title: "Principal Production",
    description:
      "Full ARRI / RED cinema packages, custom high-speed robotic motion control rigs (Bolt-X), drone operations, and high-spec lighting design.",
    output: "Uncompressed RAW Capture",
  },
  {
    step: "03",
    icon: "tune",
    title: "Post, CGI & Spatial Sound",
    description:
      "In-house Houdini/Unreal photoreal VFX, offline/online editorial, DaVinci Resolve color suites, and 7.1.4 Dolby Atmos spatial audio mixing.",
    output: "Gold Theatrical Master",
  },
  {
    step: "04",
    icon: "rocket_launch",
    title: "Transmedia Distribution",
    description:
      "Automated transcoding into 30+ platform formats, localized multilingual subtitles, digital cinema package (DCP) generation, and analytical tracking.",
    output: "Global Release Package",
  },
];

export const archiveStats = [
  { value: "148M+", label: "Accumulated Views", detail: "Global campaign reach" },
  { value: "42", label: "Industry Accolades", detail: "Cannes, D&AD, Awwwards" },
  { value: "100%", label: "Rendering Pipeline", detail: "ACES Color Calibrated" },
  { value: "4.6x", label: "Client Return Factor", detail: "Average earned media uplift" },
];

export const rosterFilters = [
  { id: "all", label: "All Roster [08]" },
  { id: "directors", label: "Directors & DP" },
  { id: "producers", label: "Creative Producers" },
  { id: "post", label: "Post & Sound" },
  { id: "vfx", label: "VFX & Motion" },
];

export const roster: RosterMember[] = [
  {
    id: "kaelen",
    code: "DIR // DP",
    name: "Kaelen Voss",
    locations: "NYC / BER",
    role: "Principal Cinematographer",
    bio: "Specializing in high-grain 35mm optical capture and spatial lighting setups for speculative luxury narratives.",
    tags: ["ARRI LF", "Anamorphic", "Volumetric"],
    clients: "Nike, Apple, Balenciaga",
    category: "directors",
  },
  {
    id: "seraphina",
    code: "PROD // EXEC",
    name: "Seraphina Lin",
    locations: "LDN / TOK",
    role: "Executive Creative Producer",
    bio: "Orchestrating multi-territory soundstage productions and technical visual teams for global product launches.",
    tags: ["Virtual Prod", "Budget > $2M", "Bespoke"],
    clients: "Sony, Polestar, Rimowa",
    category: "producers",
  },
  {
    id: "marek",
    code: "3D // SPATIAL",
    name: "Marek Thorne",
    locations: "CPH / NYC",
    role: "Houdini & Unreal Lead",
    bio: "Pioneering dynamic procedural particle simulations and real-time ray-traced spatial installations.",
    tags: ["Houdini FX", "UE 5.4", "Octane"],
    clients: "Netflix, Gentle Monster",
    category: "vfx",
  },
  {
    id: "aria",
    code: "AUDIO // MASTER",
    name: "Aria Sen-Gupta",
    locations: "PAR / BER",
    role: "Spatial Sound & Score",
    bio: "Dolby Atmos acoustician engineering tactile sub-harmonic sound architectures for luxury fashion films.",
    tags: ["Dolby Atmos", "Analog Synths", "Foley"],
    clients: "B&O, Bottega Veneta",
    category: "post",
  },
  {
    id: "kenji",
    code: "DIRECTOR",
    name: "Kenji Morita",
    locations: "TOK / LA",
    role: "Narrative & Auto Director",
    bio: "Precision choreography and high-speed robotic arm camerawork capturing aerodynamic perfection.",
    tags: ["Bolt High-Speed", "Phantom 4K", "Car Rigging"],
    clients: "Porsche, Lexus, Rimac",
    category: "directors",
  },
  {
    id: "eleonore",
    code: "COLOR // GRADE",
    name: "Eléonore Blanc",
    locations: "PARIS",
    role: "Senior Colorist & DI",
    bio: "Bespoke spectral palettes and skin tone rendition honoring classic film stocks with ACES pipeline fidelity.",
    tags: ["DaVinci Advanced", "ACEScg", "Flanders XMP310"],
    clients: "Chanel, Vogue, Saint Laurent",
    category: "post",
  },
  {
    id: "tariq",
    code: "MOTION // R&D",
    name: "Tariq Al-Mansoor",
    locations: "DXB / LDN",
    role: "Creative Technologist",
    bio: "Bridging generative shader graphics, typography kinematics, and volumetric stage playback.",
    tags: ["GLSL", "TouchDesigner", "WebGL"],
    clients: "Prada, Spotify, MoMA",
    category: "vfx",
  },
  {
    id: "svenja",
    code: "DIR // PROD",
    name: "Svenja Lindqvist",
    locations: "STO / NYC",
    role: "Narrative Strategy Producer",
    bio: "Sculpting brand universes and episodic commercial anthologies with uncompromising visual restraint.",
    tags: ["Anthology", "Global Ops", "Casting"],
    clients: "Acne Studios, Volvo",
    category: "producers",
  },
];

export const protocols = [
  {
    id: "01",
    icon: "videocam",
    title: "Surgical Set Crews",
    description:
      "Hyper-specialized, agile film units that operate with zero agency friction. We deploy custom camera packages calibrated for rapid setups and intimate performance capture.",
    link: "Precision On-Set Direction",
  },
  {
    id: "02",
    icon: "tune",
    title: "Synchronized DI Suites",
    description:
      "Seamless low-latency Streambox fiber pipeline connecting our Paris color grading theaters with directors and stakeholders in Tokyo, New York, and London simultaneously.",
    link: "Color Pipeline Architecture",
  },
  {
    id: "03",
    icon: "blur_on",
    title: "Spatial Convergence",
    description:
      "We treat real-time Unreal rendering, physical kinetic set pieces, and architectural display walls as a single continuous canvas for unconstrained media execution.",
    link: "Hybrid Simulation Specs",
  },
];

export const teamStats = [
  { value: "14", label: "Cannes Lions" },
  { value: "82+", label: "Films Mastered" },
  { value: "4K", label: "HDR Suites" },
];

export const scopeOptions = [
  { id: "Commercial", icon: "movie", label: "Commercial Film" },
  { id: "Brand Identity Film", icon: "auto_awesome", label: "Brand Identity Film" },
  { id: "3D / VFX", icon: "view_in_ar", label: "3D / CGI & VFX" },
  { id: "Post-Production / Color", icon: "palette", label: "Post-Production / Color" },
  { id: "Full Campaign", icon: "all_inclusive", label: "Full Campaign Architecture" },
];

export const budgetTiers = [
  { value: "$25k-$50k", label: "Modular Sprint" },
  { value: "$50k-$100k", label: "Full Production" },
  { value: "$100k-$250k", label: "Flagship Narrative" },
  { value: "$250k+", label: "Global Rollout" },
];

export const hubOptions = [
  { value: "North America / Los Angeles", label: "North America / Los Angeles" },
  { value: "Europe / London", label: "Europe / London" },
  { value: "Asia-Pacific / Tokyo", label: "Asia-Pacific / Tokyo" },
  { value: "Open to Primary Available Unit", label: "Open to Primary Available Unit" },
];

export const hubs: Hub[] = [
  {
    id: "la",
    city: "Los Angeles",
    role: "Primary Soundstage",
    code: "HUB // 01",
    address: "6800 Santa Monica Blvd, Stage 4 Hollywood, CA 90038",
    desk: "+1 (310) 555-0188",
    email: "la@resolutionclub.studio",
    timezone: "America/Los_Angeles",
  },
  {
    id: "lon",
    city: "London",
    role: "Color & Finishing Suite",
    code: "HUB // 02",
    address: "14-16 Clerkenwell Close, Fl 2 London EC1R 0PQ, United Kingdom",
    desk: "+44 20 7946 0912",
    email: "london@resolutionclub.studio",
    timezone: "Europe/London",
  },
  {
    id: "tyo",
    city: "Tokyo",
    role: "Spatial VFX Lab",
    code: "HUB // 03",
    address: "5-7-2 Minami-Aoyama, Floor 9 Minato City, Tokyo 107-0062",
    desk: "+81 3 5555 0143",
    email: "tokyo@resolutionclub.studio",
    timezone: "Asia/Tokyo",
  },
];

export const studioCapacity = [
  { label: "Active Stages", value: "05", detail: "/ 06 Active" },
  { label: "Post Bandwidth", value: "24", detail: "HRS Direct Turnaround" },
  { label: "Rendering Compute", value: "142", detail: "TFLOPS Throughput" },
];

export const faqs: Faq[] = [
  {
    id: "nda",
    question: "What is Resolution Club's protocol for mutual non-disclosure agreements prior to treatment review?",
    answer:
      'All initial submissions through this terminal are instantaneously encrypted. If your entity requires a countersigned custom NDA prior to transmitting narrative scripts or proprietary industrial CAD assets, select "NDA Standard Protocols Active" or email legal@resolutionclub.studio directly. We execute mutual protections within four hours.',
  },
  {
    id: "remote",
    question: "How does Resolution Club handle dual-continent shoots or remote client monitoring?",
    answer:
      "Every soundstage in our Los Angeles, London, and Tokyo units operates a low-latency 4K encrypted QTake video village pipeline. Stakeholders anywhere in the world participate with frame-accurate video, live audio comms to the Director and DP, and instantaneous color grade LUT previews in real-time.",
  },
  {
    id: "payment",
    question: "What are your milestone payment frameworks for commissioned campaigns?",
    answer:
      "Standard commercial engagements structure under a 50% mobilization deposit upon greenlight and director treatment signoff, 25% upon completion of primary photography / assembly cut review, and the final 25% balance net 30 upon master archival delivery across ProRes 4444 XQ, spatial formats, and master stems.",
  },
  {
    id: "post",
    question: "Can Resolution Club scale solely into post-production or specialized CGI if live action is already shot?",
    answer:
      "Absolutely. Approximately 40% of our portfolio represents purely high-end CGI, visual effects supervision, procedural Houdini motion simulations, and DaVinci master finishing for external live-action director reels and architectural clients.",
  },
];
