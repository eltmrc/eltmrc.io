export type Project = {
  name: string;
  role: string;
  period?: string;
  description: string;
  /** External URL, or internal path (starts with "/") routed in-app. */
  href?: string;
  linkLabel?: string;
  status?: "active" | "archived";
  /** Path under public/, rendered via asset(). */
  icon?: string;
};

export const projects: Project[] = [
  {
    name: "Cial & OpenCial",
    role: "Founder",
    period: "Now",
    description:
      "A self-hosted AI workspace you own: agents, tools, and a product surface that lives on your machine.",
    href: "/writing/why-im-building-cial/",
    linkLabel: "Read the story",
    status: "active",
    icon: "/images/cial-icon.png",
  },
  {
    name: "ClinicPilot",
    role: "CTO",
    period: "Now",
    description:
      "AI-powered equipment management for dental practices — the first of its kind in France, used by 100+ clinics.",
    href: "https://clinicpilot.io",
    linkLabel: "clinicpilot.io",
    status: "active",
    icon: "/images/clinicpilot-icon.png",
  },
  {
    name: "visaexpress.io",
    role: "Founder",
    description:
      "French visa appointments as soon as tomorrow — appointment hunting service with a Discord notification bot.",
    href: "https://github.com/eltmrc/visaexpress.io",
    linkLabel: "GitHub",
    status: "archived",
  },
  {
    name: "Proclient",
    role: "Project lead",
    period: "2017",
    description:
      "Minecraft (Java) client — 300,000 downloads in its first four months.",
    status: "archived",
  },
  {
    name: "Hardfight",
    role: "Java developer",
    period: "2016",
    description:
      "Minecraft game-server development — a community of 150,000 registered players.",
    status: "archived",
  },
];
