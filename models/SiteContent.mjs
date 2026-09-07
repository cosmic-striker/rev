import mongoose from 'mongoose';

const siteContentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'main' },

  // 1. Hero Section
  heroHeadingLine1: { type: String, default: 'We Frame', trim: true },
  heroHeadingLine2: { type: String, default: 'The Moment.', trim: true },
  heroSubheading: { 
    type: String, 
    default: 'Resolution is an avant-garde student media collective in visual arts, filmmaking, and contemporary photo-journalism. We turn collegiate friction into archival art.',
    trim: true 
  },
  heroBadge: { type: String, default: 'STUDENT MEDIA COLLECTIVE • VOL. 03', trim: true },
  heroBackgroundImage: { 
    type: String, 
    default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrv-PYa3MJhtZxqJWg0aD6N9ZMDpfsMVYonRnLDZREBCWYfZ1nTevi_pHDP0cd1BeqIBNzQ0KgsDNzE6KUYKGzPRr5SLFCriWpncKAmbSrxnxFAj6JUvWDG3E1bsypaqyMmMcdArbpV9xbGY5laF05_Wf9TcT6bMGZ3POUDDi9bsvcGvWztWI30aL-fi7bzPcQAa-vsCqaxslGZfQetUrj0u_C5PeaplDBpEDrMXb-VJOlqKhzzj0qtQ' 
  },
  heroMediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  heroVideoUrl: { type: String, default: '', trim: true },
  heroCtaPrimaryLabel: { type: String, default: 'Explore Selected Work', trim: true },
  heroCtaPrimaryLink: { type: String, default: '#selected-works', trim: true },
  heroCtaSecondaryLabel: { type: String, default: 'Play Showreel 2026', trim: true },
  heroCtaSecondaryLink: { type: String, default: 'modal:reel', trim: true },

  // 2. Announcement Banner
  announcementText: { type: String, default: 'OPEN CALL // SPRING 2026 COHORT INTAKE ACTIVE', trim: true },
  announcementActive: { type: Boolean, default: true },
  announcementLink: { type: String, default: '#recruitment-portal', trim: true },
  announcementLinkLabel: { type: String, default: 'Apply Now', trim: true },

  // 3. Manifesto & Editorial Section
  manifestoTag: { type: String, default: '01 // MANIFESTO & POSITION', trim: true },
  manifestoHeading: { type: String, default: "We don't just capture moments.", trim: true },
  manifestoHeadingHighlight: { type: String, default: 'We give them a point of view.', trim: true },
  manifestoBody: { 
    type: String, 
    default: 'In an era flooded with ephemeral vertical reels, Resolution constructs deliberate cinematic artifacts. Our collective provides university storytellers with industry-spec glass, continuous light bays, sound stages, and festival distribution channels.',
    trim: true 
  },
  manifestoPortraitUrl: { 
    type: String, 
    default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMlPJbXnthCUotEnnysncFeo2nABnng0jI-RWv2Qn2p_W4ZqkJgNfKYTF_p0f47BWsexW48In0DbgEHv0YuxzpyGddGDh-UWi9eSap5FhYCz0apbj1cPsEnrNyXuZnlFx25SAmsVuLFHMPwAqeiZLKLfl6e-RXHuseSp88xY-jf3BmTKs0YSH0fSFu44uAtDkzctu2OXo70e1fMpQ17nLtMiC2phXaf4omtZsSZjpgfKpNjElkQvy2rQ' 
  },
  manifestoPortraitLead: { type: String, default: 'Cinematography Lead: Ananya Rao', trim: true },
  manifestoPortraitExif: { type: String, default: 'RAW / 800 ISO', trim: true },
  manifestoQuoteTitle: { type: String, default: 'PERSPECTIVE OVER PIXELS', trim: true },
  manifestoQuoteBody: { type: String, default: '"The camera does not record reality; it isolates an intention from chaos."', trim: true },

  // 4. Impact Metrics
  productionsCount: { type: String, default: '48+', trim: true },
  laurelsCount: { type: String, default: '12', trim: true },
  preservedFramesCount: { type: String, default: '140K+', trim: true },
  creatorsCount: { type: String, default: '200+', trim: true },

  // 5. Featured Works (References to Work model)
  featuredWorkIds: [{ type: String, trim: true }],
  featuredWorksMode: { type: String, enum: ['manual', 'auto'], default: 'manual' },

  // 6. Featured Events (References to Event model)
  featuredEventIds: [{ type: String, trim: true }],
  featuredEventsMode: { type: String, enum: ['upcoming', 'manual'], default: 'upcoming' },

  // 7. Section Visibility Controls
  showHero: { type: Boolean, default: true },
  showManifesto: { type: Boolean, default: true },
  showSelectedWorks: { type: Boolean, default: true },
  showOpticalEngine: { type: Boolean, default: true },
  showFilmReel: { type: Boolean, default: true },
  showEvents: { type: Boolean, default: true },
  showTeam: { type: Boolean, default: true },
  showRecruitment: { type: Boolean, default: true },
  showAnnouncement: { type: Boolean, default: true },

  // 8. About & Milestones Specific Fields (Step 9)
  aboutOriginTag: { type: String, default: '01 // ORIGINS & MANIFESTO', trim: true },
  aboutOriginHeading: { type: String, default: 'Curatorial Brutalism // Academic Commons', trim: true },
  aboutOriginStory: { 
    type: String, 
    default: 'Founded in Chennai in 2024, Resolution is an avant-garde collegiate media collective in cinematic filmmaking, 35mm darkroom photography, and audio documentation. We turn collegiate friction into archival art.',
    trim: true 
  },
  aboutOriginQuote: { type: String, default: '"The camera does not record reality; it isolates an intention from chaos."', trim: true },
  aboutOriginQuoteAuthor: { type: String, default: 'Cinematography Lead: Ananya Rao', trim: true },
  
  aboutMissionHeading: { type: String, default: "We don't just capture moments. We give them a point of view.", trim: true },
  aboutMissionStatement: { 
    type: String, 
    default: 'In an era flooded with ephemeral vertical reels, Resolution constructs deliberate cinematic artifacts. Our collective provides university storytellers with industry-spec glass, continuous light bays, sound stages, and festival distribution channels.',
    trim: true 
  },
  aboutMissionSupporting: { 
    type: String, 
    default: 'Run entirely by university students with senior industry mentorship from working cinematographers and sound designers across India.',
    trim: true 
  },

  aboutCoreValues: [{
    id: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    icon: { type: String, default: 'lens', trim: true },
    order: { type: Number, default: 0 }
  }],

  aboutChapterBase: {
    department: { type: String, default: 'Department of Visual Arts & Cinema', trim: true },
    coordinates: { type: String, default: '13.0827° N, 80.2707° E // ISO 400 35MM', trim: true },
    copyrightText: { type: String, default: '© 2026 RESOLUTION STUDENT MEDIA COLLECTIVE. ARCHIVAL GRADE ART.', trim: true },
    licenseText: { type: String, default: 'CURATORIAL BRUTALISM // ALL ASSETS UNDER ACADEMIC COMMONS', trim: true }
  },

  aboutMedia: {
    portraitUrl: { 
      type: String, 
      default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMlPJbXnthCUotEnnysncFeo2nABnng0jI-RWv2Qn2p_W4ZqkJgNfKYTF_p0f47BWsexW48In0DbgEHv0YuxzpyGddGDh-UWi9eSap5FhYCz0apbj1cPsEnrNyXuZnlFx25SAmsVuLFHMPwAqeiZLKLfl6e-RXHuseSp88xY-jf3BmTKs0YSH0fSFu44uAtDkzctu2OXo70e1fMpQ17nLtMiC2phXaf4omtZsSZjpgfKpNjElkQvy2rQ' 
    },
    studioImageUrl: { 
      type: String, 
      default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvIeU3jdu5lHhqfCgW-7sGN0Xqysy4j6kiE7qaC3UAfj-8mqLLcXnNeRcQThYp-j0yO5RZ7Fo7Kx4UILd9hm_RQDdUqEv_BakHKMVC3WYtah6nOhKGhEsH5TI60cgfAu8abjeKcQuxM4Zps03OFKAeYXo7C6qkFcI043l2jSAEMqLtMw1O7xJs99sWCSdsvrp-g723G-qiSUSppZGzrHIO4vsnpW9w0H8Yc786dQDG50EHBle0NIhxdw' 
    },
    darkroomImageUrl: { 
      type: String, 
      default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhMsijyfl9QnzLDSGgO4fdRWFVPWpj7pJQxP7JEomcE9cCosvcMLPHVsIBXPbd6DvcUP9kS80zqfy-s9A7zzTCK86k6oMzYxiIYO4OAtKR_ldSbLGsshCjcOygYQlsVJH5cx5hadIlUO2l1WMwOwx294q9bb5XQk1czhWZIcxsgwPjVyLnHteiQMdGau7vZr7YX7lqLrbBLApaCi48-zWW9rKyVy4a2Of521Bart-kOUfktvP0eC8TMA' 
    }
  },

  // 9. Publishing & Draft State
  status: { type: String, enum: ['published', 'draft'], default: 'published' },
  draftData: { type: mongoose.Schema.Types.Mixed, default: null },
  aboutDraftData: { type: mongoose.Schema.Types.Mixed, default: null },
  publishedAt: { type: Date, default: Date.now },
  lastPublishedBy: { type: String, default: 'curator_admin' }
}, { timestamps: true });

export default mongoose.models.SiteContent || mongoose.model('SiteContent', siteContentSchema);
