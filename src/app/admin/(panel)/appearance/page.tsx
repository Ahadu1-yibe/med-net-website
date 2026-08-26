import { AdminPageHeader } from "@/components/admin/page-parts";
import SettingsForm, { SettingsCard, Field } from "@/components/admin/settings-form";
import { saveAppearanceSettings } from "@/lib/actions/settings-actions";
import { getSettings } from "@/lib/settings";
import { ACCENTS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminAppearancePage() {
  const settings = await getSettings();

  return (
    <>
      <AdminPageHeader
        title="Appearance"
        description="Default theme behavior and accent color. Individual visitors can always switch themes themselves — these settings define the defaults."
      />
      <SettingsForm action={saveAppearanceSettings}>
        <SettingsCard title="Default color mode" description="Applied when a visitor has not chosen a preference.">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { value: "system", label: "Follow system", hint: "Matches the visitor's device setting" },
              { value: "light", label: "Light", hint: "Bright, clean surfaces" },
              { value: "dark", label: "Dark", hint: "Deep navy, soft highlights" },
            ].map((mode) => (
              <label
                key={mode.value}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-background p-4 transition-colors hover:border-accent/40 has-[:checked]:border-accent has-[:checked]:bg-accent-soft/40"
              >
                <input
                  type="radio"
                  name="defaultMode"
                  value={mode.value}
                  defaultChecked={settings.appearance.defaultMode === mode.value}
                  className="mt-0.5 h-4 w-4 accent-[var(--accent)] cursor-pointer"
                />
                <span>
                  <span className="block text-sm font-medium text-foreground">{mode.label}</span>
                  <span className="mt-0.5 block text-xs text-fg-muted">{mode.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </SettingsCard>

        <SettingsCard title="Accent color" description="A controlled palette derived from the Med-Net brand.">
          <Field label="Accent">
            <div className="grid gap-3 sm:grid-cols-4">
              {ACCENTS.map((accent) => (
                <label
                  key={accent.value}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-background p-4 transition-colors hover:border-accent/40 has-[:checked]:border-accent has-[:checked]:bg-accent-soft/40"
                >
                  <input
                    type="radio"
                    name="accent"
                    value={accent.value}
                    defaultChecked={settings.appearance.accent === accent.value}
                    className="h-4 w-4 accent-[var(--accent)] cursor-pointer"
                  />
                  <span className="h-6 w-6 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: accent.color }} />
                  <span className="text-sm font-medium text-foreground">{accent.label}</span>
                </label>
              ))}
            </div>
          </Field>
        </SettingsCard>
      </SettingsForm>
    </>
  );
}
