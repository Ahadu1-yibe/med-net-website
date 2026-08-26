import Link from "next/link";
import { Mail, MapPin, Linkedin, Twitter, Github, Send } from "lucide-react";
import Logo from "@/components/ui/logo";
import { Container } from "@/components/ui/container";
import { getSettings } from "@/lib/settings";

const exploreLinks = [
  { label: "About Med-Net", href: "/about" },
  { label: "Research & Innovation", href: "/research" },
  { label: "Learning Hub", href: "/learn" },
  { label: "Events & Insights", href: "/updates" },
  { label: "Projects", href: "/projects" },
];

const involvedLinks = [
  { label: "Join Med-Net", href: "/join" },
  { label: "Community & Opportunities", href: "/community" },
  { label: "Partner with us", href: "/community#partners" },
  { label: "Contact", href: "/contact" },
];

export default async function Footer() {
  const settings = await getSettings();
  const socials = [
    { label: "LinkedIn", href: settings.site.linkedin, icon: Linkedin },
    { label: "X / Twitter", href: settings.site.twitter, icon: Twitter },
    { label: "GitHub", href: settings.site.github, icon: Github },
    { label: "Telegram", href: settings.site.telegram, icon: Send },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-line bg-card">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" aria-label="Med-Net home" className="inline-block">
              <Logo className="h-14 w-auto" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-fg-muted">
              {settings.site.tagline}
            </p>
            {socials.length > 0 && (
              <div className="mt-5 flex items-center gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-fg-muted transition-colors hover:border-accent hover:text-accent-strong"
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <nav aria-label="Explore">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">Explore</h3>
            <ul className="mt-4 space-y-2.5">
              {exploreLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-fg-muted transition-colors hover:text-accent-strong">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Get involved">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">Get involved</h3>
            <ul className="mt-4 space-y-2.5">
              {involvedLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-fg-muted transition-colors hover:text-accent-strong">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-fg-muted">
              {settings.site.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-accent" />
                  <a href={`mailto:${settings.site.email}`} className="transition-colors hover:text-accent-strong">
                    {settings.site.email}
                  </a>
                </li>
              )}
              {settings.site.location && (
                <li className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-accent" />
                  {settings.site.location}
                </li>
              )}
            </ul>
            <p className="mt-5 rounded-lg border border-line bg-muted px-3.5 py-3 text-xs leading-relaxed text-fg-muted">
              {settings.site.footerNote}
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 sm:flex-row">
          <p className="text-xs text-fg-muted">
            © {new Date().getFullYear()} {settings.site.name}. All rights reserved.
          </p>
          <p className="text-xs text-fg-muted">Born in Ethiopia · Connected to the world · Focused on healthcare</p>
        </div>
      </Container>
    </footer>
  );
}
