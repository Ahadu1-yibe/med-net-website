export const SITE_NAME = "Med-Net Digital Health Collaborative";
export const SITE_SHORT = "Med-Net";

export type NavLink = {
  label: string;
  href: string;
  description?: string;
  children?: { label: string; href: string; description?: string }[];
};

export const NAV_LINKS: NavLink[] = [
  {
    label: "About",
    href: "/about",
    description: "Who we are, why we exist, and where we are going",
    children: [
      { label: "About Med-Net", href: "/about#story", description: "Our story and purpose" },
      { label: "Vision & Mission", href: "/about#vision", description: "What drives us forward" },
      { label: "Areas of Work", href: "/about#areas", description: "Education, research, innovation, community" },
      { label: "Governance", href: "/about#governance", description: "How Med-Net is organized" },
      { label: "Leadership", href: "/about#leadership", description: "The people building Med-Net" },
      { label: "Strategic Direction", href: "/about#strategy", description: "Our roadmap for growth" },
    ],
  },
  { label: "Research & Innovation", href: "/research", description: "Studies, evidence and health-tech initiatives" },
  { label: "Learning Hub", href: "/learn", description: "Articles, guides and learning resources" },
  { label: "Events & Insights", href: "/updates", description: "Events, news, insights and announcements" },
  { label: "Community", href: "/community", description: "Opportunities, partners and ways to participate" },
  { label: "Projects", href: "/projects", description: "Digital-health projects built by the community" },
];

export const PROJECT_CATEGORIES = [
  { value: "digital-health", label: "Digital Health" },
  { value: "education", label: "Education" },
  { value: "research", label: "Research" },
  { value: "community-health", label: "Community Health" },
  { value: "innovation", label: "Innovation" },
  { value: "other", label: "Other" },
];

export const PROJECT_STATUSES = [
  { value: "planned", label: "Planned" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

export const RESEARCH_CATEGORIES = [
  { value: "digital-health", label: "Digital Health" },
  { value: "health-systems", label: "Health Systems" },
  { value: "public-health", label: "Public Health" },
  { value: "ai-ml", label: "AI & Machine Learning" },
  { value: "data-science", label: "Data Science" },
  { value: "other", label: "Other" },
];

export const RESEARCH_STATUSES = [
  { value: "proposed", label: "Proposed" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "published", label: "Published" },
];

export const RESOURCE_TYPES = [
  { value: "article", label: "Article" },
  { value: "tutorial", label: "Tutorial" },
  { value: "guide", label: "Guide" },
  { value: "course", label: "Course" },
  { value: "video", label: "Video" },
  { value: "toolkit", label: "Toolkit" },
];

export const RESOURCE_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "all", label: "All Levels" },
];

export const POST_TYPES = [
  { value: "EVENT", label: "Event" },
  { value: "NEWS", label: "News" },
  { value: "INSIGHT", label: "Insight" },
  { value: "ANNOUNCEMENT", label: "Announcement" },
];

export const OPPORTUNITY_TYPES = [
  { value: "VOLUNTEER", label: "Volunteer" },
  { value: "AMBASSADOR", label: "Local Ambassador" },
  { value: "COLLABORATION", label: "Collaboration" },
  { value: "APPLICATION", label: "Application Call" },
  { value: "OTHER", label: "Other" },
];

export const PARTNER_TIERS = [
  { value: "STRATEGIC", label: "Strategic Partner" },
  { value: "COLLABORATING", label: "Collaborating Partner" },
  { value: "SUPPORTING", label: "Supporting Partner" },
];

export const DISCIPLINES = [
  "Medicine",
  "Nursing",
  "Pharmacy",
  "Public Health",
  "Other Health Sciences",
  "Computer Science",
  "Software Engineering",
  "Data Science & AI",
  "Design",
  "Business & Entrepreneurship",
  "Other",
];

export const INTEREST_AREAS = [
  "Digital Health",
  "Health Informatics",
  "Artificial Intelligence in Healthcare",
  "Research",
  "Data Science",
  "Software Development",
  "Health Education",
  "Innovation & Entrepreneurship",
  "Community & Advocacy",
  "Health Policy",
  "Design & UX",
  "Leadership",
];

export const CONTACT_CATEGORIES = [
  { value: "GENERAL", label: "General Inquiry" },
  { value: "PARTNERSHIP", label: "Partnership" },
  { value: "MEMBERSHIP", label: "Membership" },
  { value: "MEDIA", label: "Media & Press" },
  { value: "SUPPORT", label: "Technical Support" },
];

export const ACCENTS = [
  { value: "teal", label: "Teal (Brand)", color: "#0E8F84" },
  { value: "ocean", label: "Ocean", color: "#2563EB" },
  { value: "forest", label: "Forest", color: "#3E7C4F" },
  { value: "violet", label: "Violet", color: "#6D5BD0" },
] as const;

export const WORK_AREAS = [
  {
    id: "education",
    title: "Education & Capacity Building",
    description:
      "Practical learning in digital health, health informatics, AI, research skills and professional development — knowledge people can actually use.",
    href: "/learn",
  },
  {
    id: "research",
    title: "Research & Innovation",
    description:
      "Collaborative research, evidence generation and the development of real digital-health solutions to healthcare problems.",
    href: "/research",
  },
  {
    id: "community",
    title: "Collaboration & Community",
    description:
      "Connecting healthcare, technology, research and innovation — students, professionals and institutions working together.",
    href: "/community",
  },
  {
    id: "advocacy",
    title: "Community & Advocacy",
    description:
      "Contributing to conversations on digital health, responsible technology, digital health equity and youth participation in healthcare transformation.",
    href: "/about#areas",
  },
];

export const VERBS = [
  { word: "Learn", description: "Build practical digital-health knowledge and skills" },
  { word: "Connect", description: "Meet people across healthcare, technology and research" },
  { word: "Research", description: "Generate evidence that helps address real challenges" },
  { word: "Create", description: "Turn ideas into tools, content and solutions" },
  { word: "Collaborate", description: "Work across disciplines and institutions" },
  { word: "Serve", description: "Contribute time and skill to a shared purpose" },
  { word: "Innovate", description: "Develop new approaches to healthcare problems" },
  { word: "Impact", description: "Contribute to better healthcare for communities" },
];

export function labelOf(options: { value: string; label: string }[], value: string | null | undefined) {
  if (!value) return "";
  return options.find((o) => o.value === value)?.label ?? value;
}
