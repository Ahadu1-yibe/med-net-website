import type { EntityFormConfig } from "@/components/admin/entity-config";
import {
  PROJECT_CATEGORIES,
  PROJECT_STATUSES,
  RESEARCH_CATEGORIES,
  RESEARCH_STATUSES,
  RESOURCE_TYPES,
  RESOURCE_LEVELS,
  POST_TYPES,
  OPPORTUNITY_TYPES,
  PARTNER_TIERS,
} from "@/lib/constants";

const publishedField = {
  name: "published",
  label: "Published",
  type: "checkbox" as const,
  hint: "Visible on the public website",
};
const featuredField = {
  name: "featured",
  label: "Featured",
  type: "checkbox" as const,
  hint: "Highlighted on the homepage",
};

export const projectConfig: EntityFormConfig = {
  fields: [
    { name: "summary", label: "Short summary", type: "textarea", rows: 3, full: true, required: true, hint: "One or two sentences shown on cards." },
    { name: "description", label: "Full description", type: "markdown", rows: 10, full: true },
    { name: "category", label: "Category", type: "select", options: PROJECT_CATEGORIES, required: true },
    { name: "status", label: "Status", type: "select", options: PROJECT_STATUSES, required: true },
    { name: "problem", label: "The problem", type: "markdown", rows: 4, full: true, hint: "What healthcare problem does this address?" },
    { name: "approach", label: "Approach / solution", type: "markdown", rows: 4, full: true },
    { name: "impact", label: "Impact & goals", type: "markdown", rows: 4, full: true },
    { name: "coverImage", label: "Cover image", type: "image", full: true },
    { name: "externalUrl", label: "External link", type: "text", placeholder: "https://…", hint: "Where people can access the project" },
    { name: "repoUrl", label: "Repository link", type: "text", placeholder: "https://github.com/…" },
    { name: "technologies", label: "Technologies", type: "tags", placeholder: "React, Python, DHIS2…", hint: "Comma-separated" },
    { name: "team", label: "Project team", type: "tags", placeholder: "Name One, Name Two", hint: "Comma-separated names" },
    { name: "tags", label: "Tags", type: "tags", placeholder: "ai, education, community" },
  ],
  sidebarFields: [publishedField, featuredField],
};

export const researchConfig: EntityFormConfig = {
  fields: [
    { name: "summary", label: "Short summary", type: "textarea", rows: 3, full: true, required: true },
    { name: "description", label: "Details", type: "markdown", rows: 10, full: true },
    { name: "category", label: "Area", type: "select", options: RESEARCH_CATEGORIES, required: true },
    { name: "status", label: "Status", type: "select", options: RESEARCH_STATUSES, required: true },
    { name: "authors", label: "Authors & contributors", type: "tags", placeholder: "Name One, Name Two", hint: "Comma-separated" },
    { name: "coverImage", label: "Cover image", type: "image", full: true },
    { name: "externalUrl", label: "Publication / resource link", type: "text", placeholder: "https://…" },
    { name: "tags", label: "Tags", type: "tags", placeholder: "digital-health, survey" },
  ],
  sidebarFields: [publishedField, featuredField],
};

export const resourceConfig: EntityFormConfig = {
  fields: [
    { name: "summary", label: "Short summary", type: "textarea", rows: 3, full: true, required: true },
    { name: "description", label: "Content", type: "markdown", rows: 12, full: true, hint: "Leave empty if this resource links externally." },
    { name: "type", label: "Type", type: "select", options: RESOURCE_TYPES, required: true },
    { name: "level", label: "Level", type: "select", options: RESOURCE_LEVELS, required: true },
    { name: "coverImage", label: "Cover image", type: "image", full: true },
    { name: "externalUrl", label: "External resource link", type: "text", placeholder: "https://…" },
    { name: "tags", label: "Topics", type: "tags", placeholder: "informatics, beginner" },
  ],
  sidebarFields: [publishedField, featuredField],
};

export const postConfig: EntityFormConfig = {
  fields: [
    { name: "type", label: "Content type", type: "select", options: POST_TYPES, required: true },
    { name: "excerpt", label: "Excerpt", type: "textarea", rows: 3, full: true, required: true },
    { name: "description", label: "Full content", type: "markdown", rows: 12, full: true },
    { name: "coverImage", label: "Cover image", type: "image", full: true },
    { name: "startAt", label: "Starts at (events)", type: "datetime" },
    { name: "endAt", label: "Ends at (events)", type: "datetime" },
    { name: "location", label: "Location (events)", type: "text", placeholder: "Addis Ababa or Online" },
    { name: "registrationUrl", label: "Registration link", type: "text", placeholder: "https://…" },
    { name: "tags", label: "Topics", type: "tags", placeholder: "event, webinar" },
    { name: "publishAt", label: "Publish date", type: "datetime", hint: "Set a future date to schedule publication." },
  ],
  sidebarFields: [publishedField, featuredField],
};

export const opportunityConfig: EntityFormConfig = {
  fields: [
    {
      name: "description",
      label: "Description",
      type: "markdown",
      rows: 6,
      full: true,
      required: true,
    },
    { name: "type", label: "Opportunity type", type: "select", options: OPPORTUNITY_TYPES, required: true },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "OPEN", label: "Open" },
        { value: "CLOSED", label: "Closed" },
      ],
      required: true,
    },
    { name: "requirements", label: "Requirements", type: "markdown", rows: 4, full: true },
    { name: "location", label: "Location", type: "text", placeholder: "Addis Ababa or Remote" },
    { name: "deadline", label: "Application deadline", type: "date" },
    { name: "applyUrl", label: "Application link", type: "text", placeholder: "https://…" },
    { name: "applyEmail", label: "Application email", type: "text", placeholder: "apply@med-net.org" },
  ],
  sidebarFields: [publishedField, featuredField],
};

export const partnerConfig: EntityFormConfig = {
  fields: [
    { name: "description", label: "Description", type: "textarea", rows: 3, full: true },
    { name: "tier", label: "Partnership tier", type: "select", options: PARTNER_TIERS, required: true },
    { name: "websiteUrl", label: "Website", type: "text", placeholder: "https://…" },
    { name: "logoImage", label: "Logo", type: "image", full: true },
    { name: "sortOrder", label: "Display order", type: "number", hint: "Lower numbers appear first" },
  ],
  sidebarFields: [
    { name: "published", label: "Published", type: "checkbox" as const, hint: "Visible on the website" },
  ],
};
