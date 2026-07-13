export type Project = {
  name: string;
  role: string;
  period?: string;
  description: string;
  href?: string;
  linkLabel?: string;
  status?: "active" | "archived";
};

export const projects: Project[] = [
  {
    name: "ClinicPilot",
    role: "CTO",
    period: "Now",
    description:
      "AI-powered equipment management for dental practices — the first of its kind in France, used by 100+ clinics.",
    href: "https://clinicpilot.io",
    linkLabel: "clinicpilot.io",
    status: "active",
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
