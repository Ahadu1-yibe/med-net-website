"use server";

import { db } from "@/lib/db";
import { applicationSchema, contactSchema } from "@/lib/validators";
import { stringifyArray } from "@/lib/utils";
import { rateLimit, clientKey } from "@/lib/rate-limit";

export type FormState = { ok: boolean; message: string } | null;

export async function submitApplication(_prev: FormState, formData: FormData): Promise<FormState> {
  if (String(formData.get("website") ?? "") !== "") {
    return { ok: true, message: "Application received." };
  }
  if (!(await rateLimit(await clientKey("apply"), 5, 10 * 60 * 1000))) {
    return { ok: false, message: "Too many submissions. Please try again later." };
  }

  const parsed = applicationSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    institution: formData.get("institution"),
    discipline: formData.get("discipline"),
    location: formData.get("location") ?? "",
    interests: formData.getAll("interests").map(String),
    skills: formData.get("skills") ?? "",
    motivation: formData.get("motivation"),
    portfolioUrl: formData.get("portfolioUrl") ?? "",
    consent: formData.get("consent") === "on",
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, message: first?.message ?? "Please check the form and try again." };
  }

  const data = parsed.data;
  try {
    const existing = await db.membershipApplication.findFirst({
      where: { email: data.email.toLowerCase(), status: { in: ["NEW", "REVIEWING"] } },
    });
    if (existing) {
      return {
        ok: false,
        message: "An application with this email is already under review. We will be in touch soon.",
      };
    }
    await db.membershipApplication.create({
      data: {
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        institution: data.institution,
        discipline: data.discipline,
        location: data.location || null,
        interests: stringifyArray(data.interests),
        skills: data.skills || null,
        motivation: data.motivation,
        portfolioUrl: data.portfolioUrl || null,
        consent: data.consent,
      },
    });
    return {
      ok: true,
      message: "Application received. Thank you for wanting to build Med-Net with us — we review applications regularly and will contact you.",
    };
  } catch {
    return { ok: false, message: "Something went wrong while submitting. Please try again." };
  }
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  if (String(formData.get("website") ?? "") !== "") {
    return { ok: true, message: "Message sent." };
  }
  if (!(await rateLimit(await clientKey("contact"), 5, 10 * 60 * 1000))) {
    return { ok: false, message: "Too many messages. Please try again later." };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    category: formData.get("category"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, message: first?.message ?? "Please check the form and try again." };
  }

  try {
    await db.contactSubmission.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        category: parsed.data.category,
        message: parsed.data.message,
      },
    });
    return {
      ok: true,
      message: "Message sent. The Med-Net team will get back to you as soon as possible.",
    };
  } catch {
    return { ok: false, message: "Something went wrong while sending. Please try again." };
  }
}
