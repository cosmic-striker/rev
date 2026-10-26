export const logo =
  "/images/img-2984f3015076462a.jpg";

export const profile =
  "/images/img-9c0e918229af34a4.jpg";

export const homeImages = {
  hero:
    "/images/img-6c62564840b717ea.jpg",
  festival:
    "/images/img-d9d9d3b0593040de.jpg",
  football:
    "/images/img-cd28e59b2c593fc2.jpg",
  studio:
    "/images/img-93926c1b8053efa3.jpg",
  quad:
    "/images/img-77e9db6820fb14a6.jpg",
  comedy:
    "/images/img-da5184babb385cf4.jpg",
  podcast:
    "/images/img-84dbbf2e28019a26.jpg",
  reel:
    "/images/img-b38d898aab0dda1c.jpg",
  dispatch:
    "/images/img-19246be68e1777b5.jpg",
  modal:
    "/images/img-c6468c590befa5e6.jpg",
};

export type MediaCard = {
  id: string;
  category: "fests" | "sports" | "films" | "journalism" | "podcast";
  image: string;
  alt: string;
  source: string;
  views: string;
  viewsTone: string;
  title: string;
  badge: string;
  badgeTone: string;
  secondaryBadge: string;
  duration: string;
  footer: string;
};

export const homeMedia: MediaCard[] = [
  {
    id: "spring-fling",
    category: "fests",
    image: homeImages.festival,
    alt: "Massive college music festival crowd at night during Spring Fling",
    source: "SPRING FLING '24",
    views: "42K VIEWS",
    viewsTone: "text-primary-fixed",
    title: "Official Aftermovie",
    badge: "Festival",
    badgeTone: "text-primary-fixed",
    secondaryBadge: "4K Multi-Cam",
    duration: "11:42 MIN",
    footer: "4K FESTIVAL CUT",
  },
  {
    id: "homecoming",
    category: "sports",
    image: homeImages.football,
    alt: "College football players huddling under stadium floodlights",
    source: "VARSITY FOOTBALL",
    views: "28K VIEWS",
    viewsTone: "text-secondary",
    title: "Behind The Huddle",
    badge: "Sports Doc",
    badgeTone: "text-secondary",
    secondaryBadge: "60FPS Sideline",
    duration: "18:05 MIN",
    footer: "60FPS SIDELINE",
  },
  {
    id: "late-nights",
    category: "journalism",
    image: homeImages.studio,
    alt: "Atmospheric 35mm film photograph of a university architecture studio at 3 AM",
    source: "35MM FILM PHOTO",
    views: "ZINE EDITION",
    viewsTone: "text-tertiary-fixed",
    title: "Late Nights Studio",
    badge: "Photo Essay",
    badgeTone: "text-primary-fixed",
    secondaryBadge: "35mm Kodak Portra",
    duration: "24 IMAGES",
    footer: "24 PORTRA FRAMES",
  },
  {
    id: "echoes",
    category: "journalism",
    image: homeImages.quad,
    alt: "Moody cinematic frame of a student on a misty campus quad at dawn",
    source: "INVESTIGATIVE DOC",
    views: "AWARD WINNER",
    viewsTone: "text-error",
    title: "Echoes In The Quad",
    badge: "Investigative",
    badgeTone: "text-on-error-container",
    secondaryBadge: "Daily Student Co-Op",
    duration: "15:20 MIN",
    footer: "CAMPUS DISPATCH",
  },
  {
    id: "midterms",
    category: "films",
    image: homeImages.comedy,
    alt: "Three quirky college freshmen huddled beneath a library book stack",
    source: "NARRATIVE COMEDY",
    views: "LAUREL WINNER",
    viewsTone: "text-primary-fixed",
    title: "Midterms & Mochas",
    badge: "Fiction Short",
    badgeTone: "text-on-primary-fixed",
    secondaryBadge: "Best Picture Fest '24",
    duration: "07:44 MIN",
    footer: "BEST PICTURE '24",
  },
  {
    id: "quad-mic",
    category: "podcast",
    image: homeImages.podcast,
    alt: "Two student podcast hosts inside a soundproof studio",
    source: "STUDIO B PODCAST",
    views: "TOP 10 CAMPUS",
    viewsTone: "text-secondary",
    title: "The Quad Mic: Ep #42",
    badge: "Video Podcast",
    badgeTone: "text-secondary-fixed",
    secondaryBadge: "Weekly Episode #42",
    duration: "34:10 MIN",
    footer: "WEEKLY DROP",
  },
];

export const homeFilters = [
  { id: "all", label: "All Work" },
  { id: "fests", label: "Fests & Concerts" },
  { id: "sports", label: "Sports & Gameday" },
  { id: "films", label: "Student Short Films" },
  { id: "journalism", label: "Photo Stories & Journalism" },
  { id: "podcast", label: "Podcasts & Radio" },
];

export const homeChapters = [
  {
    time: "00:30",
    title: "Spirit Rally",
    cue: "Homecoming Bonfire & Marching Band",
    label: "Spirit Rally Quad",
    detail: "Band, Fireworks & Quad",
    progress: "28%",
  },
  {
    time: "01:15",
    title: "'Rent' Musical",
    cue: "Student Actors & Live Pit Orchestra",
    label: "Theatre Production 'Rent'",
    detail: "Center Stage Spotlights",
    progress: "48%",
  },
  {
    time: "02:00",
    title: "Solar Car Race",
    cue: "Engineering Team Race On Track",
    label: "Solar Car Speed Trials",
    detail: "Formula SAE Speed Run",
    progress: "72%",
  },
  {
    time: "02:45",
    title: "Midnight Pancakes",
    cue: "Exam Tradition in Student Commons",
    label: "Midnight Pancake Breakfast",
    detail: "Finals Week Chaos",
    progress: "92%",
  },
];

export type StoryProject = {
  id: "flagship" | "voices" | "error404" | "audit";
  title: string;
  category: string;
  synopsis: string;
  poster: string;
  cam: string;
  res: string;
  duration: string;
  currentTime: string;
  progress: number;
  crew: string;
  gear: string;
  laurel: string;
  color: string;
  badge: string;
  badgeTone: string;
  statA: string;
  statB: string;
};

export const storyProjects: Record<string, StoryProject> = {
  flagship: {
    id: "flagship",
    title: "72-Hour Turnaround Multi-Cam",
    category: "Springfest '24 Mainstage // Case Study 01",
    synopsis:
      "How 16 student filmmakers coordinated multi-cam coverage and on-site proxy edits to deliver viral recaps within 3 hours of headliners on the main stage.",
    poster:
      "/images/img-e283947b044ae742.jpg",
    cam: "CAM-01 • STAGE RIG",
    res: "4K UHD • 24 FPS",
    duration: "08:24",
    currentTime: "02:24",
    progress: 28,
    crew: "K. Vance ('25 Media Arts)",
    gear: "Sony FX3 + ATEM SDI",
    laurel: "185K+ Views // Live Doc",
    color: "DaVinci 18.6 Studio",
    badge: "Springfest '24 Mainstage",
    badgeTone: "bg-secondary text-on-secondary",
    statA: "185K+",
    statB: "72H",
  },
  voices: {
    id: "voices",
    title: "Voices of the Dorms",
    category: "Docuseries // Student Housing Exposé",
    synopsis:
      "An intimate portrait of college life after midnight across four freshmen halls, charting the quiet routines, late study marathons, and shared communal spaces.",
    poster:
      "/images/img-2273dcd5f3297756.jpg",
    cam: "CAM-A • RUN & GUN PRIME",
    res: "6K RAW • 24 FPS",
    duration: "14:18",
    currentTime: "01:05",
    progress: 12,
    crew: "M. Chen ('26 Journalism)",
    gear: "Blackmagic 6K Pro",
    laurel: "Official Selection '24",
    color: "ACES Log Pipeline",
    badge: "Docuseries",
    badgeTone: "bg-primary-container text-on-primary-fixed",
    statA: "42K+",
    statB: "4 HALLS",
  },
  error404: {
    id: "error404",
    title: "Error 404: Graduation",
    category: "Narrative Short // 48-Hour Film",
    synopsis:
      "A graduating senior discovers that the campus records server has accidentally wiped the entire graduating class database hours before commencement ceremony.",
    poster:
      "/images/img-816bf1884097cedd.jpg",
    cam: "STUDIO A • RETRO CRT RIG",
    res: "4K DCI • 24 FPS",
    duration: "09:50",
    currentTime: "03:40",
    progress: 37,
    crew: "D. Reyes ('24 Film)",
    gear: "RED Komodo 6K",
    laurel: "Audience Choice Award",
    color: "Film Emulation Print",
    badge: "Narrative",
    badgeTone: "bg-secondary-container text-secondary-fixed",
    statA: "48H",
    statB: "TRI-STATE",
  },
  audit: {
    id: "audit",
    title: "The Dining Hall Audit",
    category: "Investigative Report // Student Senate",
    synopsis:
      "Four-month investigative audit into campus dining hall compost diversion rates, tracking supplier manifests and prompting an immediate university policy change.",
    poster:
      "/images/img-36f93921650bda29.jpg",
    cam: "PRESS OVERHEAD • INVESTIGATIVE",
    res: "4K PRORES 422",
    duration: "18:02",
    currentTime: "05:12",
    progress: 29,
    crew: "L. Morales ('25 FOIA Bureau)",
    gear: "Sony FX6 Cinema Line",
    laurel: "Senate Resolution Passed",
    color: "Broadcast Neutral Rec.709",
    badge: "Investigative",
    badgeTone: "bg-surface-container-lowest/90 text-tertiary-fixed",
    statA: "4 MO",
    statB: "FOIA",
  },
};

export type Creator = {
  id: string;
  name: string;
  image: string;
  code: string;
  tone: "lime" | "blue" | "cyan";
  department: string;
  year: string;
  role: string;
  specialty: string;
  icon: string;
  depts: string[];
  gear: string;
  gearIcon: string;
};

export const creators: Creator[] = [
  {
    id: "maya-lin",
    name: "Maya Lin",
    image:
      "/images/img-519dcdbb30f5cd95.jpg",
    code: "001 // DIR",
    tone: "lime",
    department: "President",
    year: "Film '25",
    role: "Director of Production",
    specialty: "Specialty: Cinematography",
    icon: "video_camera_front",
    depts: ["exec", "cine"],
    gear: "Sony FX6 & 35mm",
    gearIcon: "videocam",
  },
  {
    id: "devon-brooks",
    name: "Devon Brooks",
    image:
      "/images/img-f27f4e8f83687a7f.jpg",
    code: "002 // OPS",
    tone: "blue",
    department: "Vice President",
    year: "Business '25",
    role: "Operations Lead",
    specialty: "Specialty: Grants & Cage",
    icon: "verified_user",
    depts: ["exec"],
    gear: "Ops & Logistics",
    gearIcon: "hub",
  },
  {
    id: "elena-rostov",
    name: "Elena Rostov",
    image:
      "/images/img-28e73ad60ef7b493.jpg",
    code: "003 // PHOTO",
    tone: "cyan",
    department: "Darkroom",
    year: "Visual Arts '26",
    role: "Head of Photography",
    specialty: "Specialty: Leica & Darkroom",
    icon: "filter_b_and_w",
    depts: ["photo"],
    gear: "35mm Stills & Lab",
    gearIcon: "photo_camera",
  },
  {
    id: "marcus-vance",
    name: "Marcus Vance",
    image:
      "/images/img-a45ec58d1db1e0f6.jpg",
    code: "004 // ATHLETICS",
    tone: "lime",
    department: "Field Coverage",
    year: "Journalism '26",
    role: "Lead Sports Videographer",
    specialty: "Specialty: 120 FPS Burst",
    icon: "slow_motion_video",
    depts: ["cine"],
    gear: "Sony FX3 Gimbal",
    gearIcon: "sports_basketball",
  },
  {
    id: "chloe-adams",
    name: "Chloe Adams",
    image:
      "/images/img-c87ba303fe00133c.jpg",
    code: "005 // SCRIPT",
    tone: "blue",
    department: "Writers Room",
    year: "English '26",
    role: "Screenwriting Lead",
    specialty: "Specialty: Short Narrative",
    icon: "edit_note",
    depts: ["exec"],
    gear: "Final Draft Lead",
    gearIcon: "history_edu",
  },
  {
    id: "julian-ortiz",
    name: "Julian Ortiz",
    image:
      "/images/img-5944bd23eb129be0.jpg",
    code: "006 // SOUND",
    tone: "cyan",
    department: "Sound Stage",
    year: "Music '25",
    role: "Head of Audio",
    specialty: "Specialty: WLUM 91.3 Broadcast",
    icon: "mic",
    depts: ["audio"],
    gear: "Dolby Atmos",
    gearIcon: "graphic_eq",
  },
  {
    id: "aaliyah-patel",
    name: "Aaliyah Patel",
    image:
      "/images/img-3a0e75b659f256d8.jpg",
    code: "007 // VIRAL",
    tone: "lime",
    department: "Dispatch",
    year: "Marketing '27",
    role: "Social Media Director",
    specialty: "Specialty: Vertical Video",
    icon: "cell_tower",
    depts: ["social"],
    gear: "35K TikTok Lead",
    gearIcon: "trending_up",
  },
  {
    id: "kai-takahashi",
    name: "Kai Takahashi",
    image:
      "/images/img-6a46081fa6a951d3.jpg",
    code: "008 // COLOR",
    tone: "cyan",
    department: "Post-Production",
    year: "CS '25",
    role: "Technical Director",
    specialty: "Specialty: 12TB Render Pipeline",
    icon: "dns",
    depts: ["cine"],
    gear: "DaVinci Colorist",
    gearIcon: "palette",
  },
];

export const joinImages = {
  booking:
    "/images/img-2db8a0586754fbeb.jpg",
  perks:
    "/images/img-a3133f0c0079c02b.jpg",
};

export const faqs = [
  {
    question: "Do I need my own camera to join?",
    answer:
      "No — all members receive free access to our Sony FX3 rigs, prime lenses, and audio gear.",
  },
  {
    question: "Can any major join the crew?",
    answer:
      "Yes — over 60% of our creators study STEM, business, or humanities with zero prior experience.",
  },
  {
    question: "How far in advance must clubs submit requests?",
    answer:
      "Submit at least 2 weeks ahead so we can schedule crew shifts and reserve cinema cages.",
  },
  {
    question: "Do you cover off-campus student events?",
    answer:
      "Yes — provided university transportation or travel authorization is coordinated with our director.",
  },
];
