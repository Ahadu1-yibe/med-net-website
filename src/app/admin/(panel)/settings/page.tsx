import { AdminPageHeader } from "@/components/admin/page-parts";
import SettingsForm, { SettingsCard, Input, Textarea, Field } from "@/components/admin/settings-form";
import { saveSiteSettings } from "@/lib/actions/settings-actions";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminSiteSettingsPage() {
  const settings = await getSettings();
  const site = settings.site;

  return (
    <>
      <AdminPageHeader
        title="Site Settings"
        description="Organization identity, contact information and social links used across the website."
      />
      <SettingsForm action={saveSiteSettings}>
        <SettingsCard title="Organization identity">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full organization name">
              <Input name="name" defaultValue={site.name} />
            </Field>
            <Field label="Short name" hint="Used in titles and compact spaces">
              <Input name="shortName" defaultValue={site.shortName} />
            </Field>
            <Field label="Tagline" className="sm:col-span-2">
              <Input name="tagline" defaultValue={site.tagline} />
            </Field>
            <Field label="Meta description" hint="Used for search engines and link previews" className="sm:col-span-2">
              <Textarea name="description" defaultValue={site.description} rows={3} />
            </Field>
          </div>
        </SettingsCard>

        <SettingsCard title="Contact information">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Contact email">
              <Input name="email" type="email" defaultValue={site.email} />
            </Field>
            <Field label="Location" hint="Only show location that is official">
              <Input name="location" defaultValue={site.location} placeholder="Ethiopia" />
            </Field>
          </div>
        </SettingsCard>

        <SettingsCard title="Social links" description="Leave a field empty to hide that icon. Official links only.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="LinkedIn">
              <Input name="linkedin" defaultValue={site.linkedin} placeholder="https://linkedin.com/company/…" />
            </Field>
            <Field label="X / Twitter">
              <Input name="twitter" defaultValue={site.twitter} placeholder="https://x.com/…" />
            </Field>
            <Field label="GitHub">
              <Input name="github" defaultValue={site.github} placeholder="https://github.com/…" />
            </Field>
            <Field label="Telegram">
              <Input name="telegram" defaultValue={site.telegram} placeholder="https://t.me/…" />
            </Field>
          </div>
        </SettingsCard>

        <SettingsCard title="Footer">
          <Field label="Footer note" hint="e.g. registration status — keep it honest">
            <Input name="footerNote" defaultValue={site.footerNote} />
          </Field>
        </SettingsCard>
      </SettingsForm>
    </>
  );
}
