import { z } from "zod";

const optionalString = z.string().trim().max(2000).optional().or(z.literal(""));
const urlOrEmpty = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\/.+/.test(v), "Must be a valid URL")
  .optional()
  .or(z.literal(""));

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const projectSchema = z.object({
  title: z.string().trim().min(2).max(200),
  summary: z.string().trim().min(10).max(400),
  description: z.string().max(30000).optional().or(z.literal("")),
  category: z.string().min(1),
  status: z.string().min(1),
  problem: z.string().max(8000).optional().or(z.literal("")),
  approach: z.string().max(8000).optional().or(z.literal("")),
  impact: z.string().max(8000).optional().or(z.literal("")),
  technologies: z.string().optional().or(z.literal("")),
  team: z.string().optional().or(z.literal("")),
  externalUrl: urlOrEmpty,
  repoUrl: urlOrEmpty,
  coverImage: urlOrEmpty,
  gallery: z.string().optional().or(z.literal("")),
  tags: z.string().optional().or(z.literal("")),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

export const researchSchema = z.object({
  title: z.string().trim().min(2).max(250),
  summary: z.string().trim().min(10).max(400),
  description: z.string().max(30000).optional().or(z.literal("")),
  category: z.string().min(1),
  status: z.string().min(1),
  authors: z.string().optional().or(z.literal("")),
  externalUrl: urlOrEmpty,
  coverImage: urlOrEmpty,
  tags: z.string().optional().or(z.literal("")),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

export const resourceSchema = z.object({
  title: z.string().trim().min(2).max(250),
  summary: z.string().trim().min(10).max(400),
  description: z.string().max(30000).optional().or(z.literal("")),
  type: z.string().min(1),
  level: z.string().min(1),
  externalUrl: urlOrEmpty,
  coverImage: urlOrEmpty,
  tags: z.string().optional().or(z.literal("")),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

export const postSchema = z.object({
  title: z.string().trim().min(2).max(250),
  type: z.enum(["EVENT", "NEWS", "INSIGHT", "ANNOUNCEMENT"]),
  excerpt: z.string().trim().min(10).max(400),
  description: z.string().max(30000).optional().or(z.literal("")),
  location: optionalString,
  startAt: optionalString,
  endAt: optionalString,
  registrationUrl: urlOrEmpty,
  coverImage: urlOrEmpty,
  tags: z.string().optional().or(z.literal("")),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

export const opportunitySchema = z.object({
  title: z.string().trim().min(2).max(250),
  type: z.string().min(1),
  location: optionalString,
  description: z.string().min(10).max(10000),
  requirements: z.string().max(8000).optional().or(z.literal("")),
  deadline: optionalString,
  applyUrl: urlOrEmpty,
  applyEmail: z.string().trim().max(200).optional().or(z.literal("")),
  status: z.enum(["OPEN", "CLOSED"]),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

export const partnerSchema = z.object({
  name: z.string().trim().min(2).max(200),
  description: z.string().max(1000).optional().or(z.literal("")),
  websiteUrl: urlOrEmpty,
  logoImage: urlOrEmpty,
  tier: z.string().min(1),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  published: z.boolean().optional(),
});

export const applicationSchema = z.object({
  fullName: z.string().trim().min(2).max(150),
  email: z.string().trim().email(),
  institution: z.string().trim().min(2).max(200),
  discipline: z.string().trim().min(1).max(120),
  location: optionalString,
  interests: z.array(z.string()).default([]),
  skills: optionalString,
  motivation: z.string().trim().min(20).max(3000),
  portfolioUrl: urlOrEmpty,
  consent: z.literal(true, { message: "Consent is required to apply." }),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(150),
  email: z.string().trim().email(),
  category: z.string().min(1),
  message: z.string().trim().min(20).max(4000),
});

export const mediaSchema = z.object({
  filename: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(120),
  size: z.number().int().nonnegative(),
  kind: z.enum(["UPLOAD", "EXTERNAL"]),
  externalUrl: urlOrEmpty,
  alt: z.string().max(300).optional().or(z.literal("")),
});

export const userCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  role: z.enum(["ADMIN", "EDITOR"]).default("ADMIN"),
});
