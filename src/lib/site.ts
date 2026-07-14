export const site = {
  name: "Eliot Maurice",
  handle: "eltmrc",
  title: "Eliot Maurice — builder, co-founder of Cial & OpenCial",
  description:
    "Eliot Maurice (eltmrc). Builder in Paris. Co-founder of Cial and ClinicPilot, creator of OpenCial. Notes and articles on AI, software, and shipping products.",
  /** Shorter description for card previews when needed */
  shortDescription:
    "Builder in Paris. Co-founder of Cial and ClinicPilot. Creator of OpenCial.",
  url: "https://eltmrc.io",
  locale: "en_US",
  lang: "en",
  email: "eliot@cial.app",
  /** Default share image (absolute path under public/) */
  defaultOgImage: "/images/portrait.jpg",
  keywords: [
    "Eliot Maurice",
    "eltmrc",
    "Cial",
    "OpenCial",
    "ClinicPilot",
    "AI workspace",
    "self-hosted AI",
    "software engineer",
    "Paris",
    "builder",
  ],
  links: {
    github: "https://github.com/eltmrc",
    x: "https://x.com/ByProcyx",
    linkedin: "https://www.linkedin.com/in/eliot-m-2b43b418b/",
    cial: "https://cial.app",
    opencial: "https://opencial.ai",
    opencialGithub: "https://github.com/eltmrc/opencial",
    discord: "https://discord.gg/YBx5CWKhNS",
  },
  socials: {
    x: "@ByProcyx",
    github: "@eltmrc",
    linkedin: "eliot-m",
  },
} as const;

/** Absolute URL for a site path or public asset. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  const base = site.url.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
