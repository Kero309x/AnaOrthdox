"use client";

import {
  BottomNav,
  Header,
  SectionTitle,
  useTheme,
} from "@/shared/ui/chrome";
import { FacebookIcon, GitHubIcon } from "@/shared/ui/icons";

export type ContributorsLang = "ar" | "en";

type Contributor = {
  // Names stay exactly as supplied by the team (Latin script) in both languages.
  name: string;
  role: Record<ContributorsLang, string>;
  blurb: Record<ContributorsLang, string>;
  initial: string;
  // When a real profile photo becomes available, drop it in /public/team and
  // set photo; the initial badge stays as the fallback.
  photo?: string;
  badgeClass: string;
  links: { github?: string; facebook?: string };
};

const CONTRIBUTORS: Contributor[] = [
  {
    name: "Kyrillos Atef",
    role: { ar: "المطوّر الأساسي", en: "Lead Developer" },
    blurb: {
      ar: "يتولى التطوير الأساسي للتطبيق.",
      en: "Leads the development of Ana Orthodoxi.",
    },
    initial: "K",
    photo: "/team/kyrillos.jpg",
    badgeClass: "icon-badge--pebble bg-rose-badge text-primary",
    links: {
      github: "https://github.com/Kero309x",
      facebook: "https://www.facebook.com/share/1FFBeUBatZ/",
    },
  },
  {
    name: "Mina Ramsis",
    role: { ar: "مطوّر برمجيات", en: "Software Developer" },
    blurb: {
      ar: "يشارك في تطوير التطبيق.",
      en: "Contributes to the app's development.",
    },
    initial: "M",
    photo: "/team/mina-ramsis.jpg",
    badgeClass: "icon-badge--soft-square bg-gold-soft text-gold-ink",
    links: {
      github: "https://github.com/minaramsis19",
      facebook: "https://www.facebook.com/share/1Dx9cobWW3/",
    },
  },
  {
    name: "Mina Morris",
    role: { ar: "مراجع المحتوى", en: "Content Reviewer" },
    blurb: {
      ar: "يراجع محتوى التطبيق قبل نشره.",
      en: "Reviews the app's content before publication.",
    },
    initial: "M",
    photo: "/team/mina-morris.jpg",
    badgeClass: "icon-badge--calendar bg-blush text-primary",
    links: { facebook: "https://www.facebook.com/share/1DenLP1qHz/" },
  },
];

const COPY = {
  ar: {
    title: "المساهمون",
    intro: "الفريق الذي يطوّر «أنا أرثوذكسي» ويراجع محتواه.",
    team: "الفريق",
  },
  en: {
    title: "Contributors",
    intro: "The team that develops Ana Orthodoxi and reviews its content.",
    team: "Team",
  },
} as const;

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="bg-blush text-ink dark:bg-night-chip dark:text-night-ink flex h-11 w-11 items-center justify-center rounded-full transition-transform active:scale-95"
    >
      {children}
    </a>
  );
}

export default function Contributors({ lang }: { lang: ContributorsLang }) {
  const { dark, toggleTheme } = useTheme();
  const copy = COPY[lang];
  const ltr = lang === "en";
  const align = ltr ? "text-left" : "text-right";

  return (
    <div className="bg-cream dark:bg-night min-h-dvh transition-colors">
      <main
        dir={ltr ? "ltr" : "rtl"}
        lang={lang}
        className="relative mx-auto min-h-dvh max-w-md pb-32"
      >
        <Header
          title={copy.title}
          dark={dark}
          onToggleTheme={toggleTheme}
          back
          backHref="/settings"
        />

        <p
          className={`text-ink/60 dark:text-night-ink/60 px-8 pt-4 text-[13px] leading-6 ${align}`}
        >
          {copy.intro}
        </p>

        <section className="px-6 pt-2">
          <SectionTitle>{copy.team}</SectionTitle>
          <div className="flex flex-col gap-4">
            {CONTRIBUTORS.map((person) => (
              <div
                key={person.name}
                className="rounded-3xl border border-card-border bg-white p-5 shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`icon-badge ${person.badgeClass} flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden`}
                  >
                    {person.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={person.photo}
                        alt={person.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-black">
                        {person.initial}
                      </span>
                    )}
                  </span>
                  <div className={`flex-1 ${align}`}>
                    <span
                      dir="ltr"
                      className="text-ink dark:text-night-ink block text-lg font-black"
                    >
                      {person.name}
                    </span>
                    <span className="mt-1.5 inline-block">
                      <span className="bg-rose-badge text-primary rounded-full px-3 py-1 text-[11px] font-bold">
                        {person.role[lang]}
                      </span>
                    </span>
                  </div>
                </div>
                <p
                  className={`text-ink/60 dark:text-night-ink/60 pt-3 text-[13px] leading-6 ${align}`}
                >
                  {person.blurb[lang]}
                </p>
                <div className="flex items-center gap-2 pt-3">
                  {person.links.github && (
                    <SocialButton
                      href={person.links.github}
                      label={`${person.name} on GitHub`}
                    >
                      <GitHubIcon className="h-5 w-5" />
                    </SocialButton>
                  )}
                  {person.links.facebook && (
                    <SocialButton
                      href={person.links.facebook}
                      label={`${person.name} on Facebook`}
                    >
                      <FacebookIcon className="h-5 w-5" />
                    </SocialButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <BottomNav
          active="settings"
          labels={
            ltr
              ? { home: "Home", account: "Account", settings: "Settings" }
              : undefined
          }
        />
      </main>
    </div>
  );
}
