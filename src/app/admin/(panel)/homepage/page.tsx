import { AdminPageHeader } from "@/components/admin/page-parts";
import SettingsForm, { SettingsCard, Input, Textarea, Field, } from "@/components/admin/settings-form";
import { saveHomepageSettings } from "@/lib/actions/settings-actions";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

function SectionToggle({
  name,
  label,
  visible,
  titleName,
  title,
  subtitleName,
  subtitle,
  titlePlaceholder,
}: {
  name: string;
  label: string;
  visible: boolean;
  titleName: string;
  title: string;
  subtitleName: string;
  subtitle: string;
  titlePlaceholder: string;
}) {
  return (
    <SettingsCard title={label}>
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          name={`${name}Visible`}
          defaultChecked={visible}
          className="h-4 w-4 rounded border-line-strong accent-[var(--accent)] cursor-pointer"
        />
        <span className="text-sm font-medium text-foreground">Show this section on the homepage</span>
      </label>
      <Field label="Section title">
        <Input name={titleName} defaultValue={title} placeholder={titlePlaceholder} />
      </Field>
      <Field label="Section description">
        <Textarea name={subtitleName} defaultValue={subtitle} rows={2} />
      </Field>
    </SettingsCard>
  );
}

export default async function AdminHomepagePage() {
  const settings = await getSettings();
  const hp = settings.homepage;

  return (
    <>
      <AdminPageHeader
        title="Homepage"
        description="Control the hero message and every homepage section. Featured projects, research and events are pulled automatically from your content."
      />
      <SettingsForm action={saveHomepageSettings} submitLabel="Save homepage">
        <SettingsCard title="Hero" description="The first thing visitors see. Keep it strong and concise.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Badge text" className="sm:col-span-2">
              <Input name="heroBadge" defaultValue={hp.hero.badge} />
            </Field>
            <Field label="Headline — opening line">
              <Input name="heroTitleTop" defaultValue={hp.hero.titleTop} />
            </Field>
            <Field label="Headline — highlighted phrase" hint="Shown in the brand gradient">
              <Input name="heroTitleHighlight" defaultValue={hp.hero.titleHighlight} />
            </Field>
            <Field label="Headline — closing line" className="sm:col-span-2">
              <Input name="heroTitleBottom" defaultValue={hp.hero.titleBottom} />
            </Field>
            <Field label="Hero description" className="sm:col-span-2">
              <Textarea name="heroSubtitle" defaultValue={hp.hero.subtitle} rows={3} />
            </Field>
            <Field label="Primary button label">
              <Input name="heroPrimaryLabel" defaultValue={hp.hero.primaryLabel} />
            </Field>
            <Field label="Primary button link">
              <Input name="heroPrimaryHref" defaultValue={hp.hero.primaryHref} />
            </Field>
            <Field label="Secondary button label">
              <Input name="heroSecondaryLabel" defaultValue={hp.hero.secondaryLabel} />
            </Field>
            <Field label="Secondary button link">
              <Input name="heroSecondaryHref" defaultValue={hp.hero.secondaryHref} />
            </Field>
          </div>
        </SettingsCard>

        <SettingsCard title="Intro section">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="introVisible"
              defaultChecked={hp.intro.visible}
              className="h-4 w-4 rounded border-line-strong accent-[var(--accent)] cursor-pointer"
            />
            <span className="text-sm font-medium text-foreground">Show intro section</span>
          </label>
          <Field label="Title">
            <Input name="introTitle" defaultValue={hp.intro.title} />
          </Field>
          <Field label="Body">
            <Textarea name="introBody" defaultValue={hp.intro.body} rows={4} />
          </Field>
          <Field label="Key points" hint="One per line">
            <Textarea name="introPoints" defaultValue={hp.intro.points.join("\n")} rows={4} />
          </Field>
        </SettingsCard>

        <SectionToggle
          name="areas"
          label="Areas of work"
          visible={hp.areas.visible}
          titleName="areasTitle"
          title={hp.areas.title}
          subtitleName="areasSubtitle"
          subtitle={hp.areas.subtitle}
          titlePlaceholder="What we do"
        />
        <SectionToggle
          name="projects"
          label="Featured projects"
          visible={hp.projects.visible}
          titleName="projectsTitle"
          title={hp.projects.title}
          subtitleName="projectsSubtitle"
          subtitle={hp.projects.subtitle}
          titlePlaceholder="Projects we are building"
        />
        <SectionToggle
          name="research"
          label="Research preview"
          visible={hp.research.visible}
          titleName="researchTitle"
          title={hp.research.title}
          subtitleName="researchSubtitle"
          subtitle={hp.research.subtitle}
          titlePlaceholder="Research & insights"
        />
        <SectionToggle
          name="updates"
          label="Events & announcements"
          visible={hp.updates.visible}
          titleName="updatesTitle"
          title={hp.updates.title}
          subtitleName="updatesSubtitle"
          subtitle={hp.updates.subtitle}
          titlePlaceholder="Events & announcements"
        />
        <SectionToggle
          name="community"
          label="Community"
          visible={hp.community.visible}
          titleName="communityTitle"
          title={hp.community.title}
          subtitleName="communitySubtitle"
          subtitle={hp.community.subtitle}
          titlePlaceholder="Join the community"
        />
        <SectionToggle
          name="partners"
          label="Partners"
          visible={hp.partners.visible}
          titleName="partnersTitle"
          title={hp.partners.title}
          subtitleName="partnersSubtitle"
          subtitle={hp.partners.subtitle}
          titlePlaceholder="Partners & collaborators"
        />

        <SettingsCard title="Closing call-to-action">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="ctaVisible"
              defaultChecked={hp.cta.visible}
              className="h-4 w-4 rounded border-line-strong accent-[var(--accent)] cursor-pointer"
            />
            <span className="text-sm font-medium text-foreground">Show closing CTA</span>
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Title" className="sm:col-span-2">
              <Input name="ctaTitle" defaultValue={hp.cta.title} />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <Textarea name="ctaSubtitle" defaultValue={hp.cta.subtitle} rows={2} />
            </Field>
            <Field label="Primary button label">
              <Input name="ctaPrimaryLabel" defaultValue={hp.cta.primaryLabel} />
            </Field>
            <Field label="Primary button link">
              <Input name="ctaPrimaryHref" defaultValue={hp.cta.primaryHref} />
            </Field>
            <Field label="Secondary button label">
              <Input name="ctaSecondaryLabel" defaultValue={hp.cta.secondaryLabel} />
            </Field>
            <Field label="Secondary button link">
              <Input name="ctaSecondaryHref" defaultValue={hp.cta.secondaryHref} />
            </Field>
          </div>
        </SettingsCard>
      </SettingsForm>
    </>
  );
}
