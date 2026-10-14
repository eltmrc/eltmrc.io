/**
 * Fabricated data for the mini-Palantir demonstration.
 *
 * The breach *names* are real, well-documented incidents. Every record,
 * person, address, email and number below is invented. The point is the
 * structure — how real leaks correlate — not any real person's data.
 */

export type SourceId =
  | "collection1"
  | "linkedin"
  | "adobe"
  | "dropbox"
  | "tinder"
  | "ledger"
  | "francetravail"
  | "nordvpn"
  | "google";

export type Source = {
  id: SourceId;
  name: string;
  kind: string;
  date: string;
  color: string;
};

export const SOURCES: Record<SourceId, Source> = {
  collection1: { id: "collection1", name: "Collection #1", kind: "credential compilation", date: "2019", color: "#6a5ae0" },
  linkedin: { id: "linkedin", name: "LinkedIn", kind: "scraped profiles", date: "2021", color: "#0A66C2" },
  adobe: { id: "adobe", name: "Adobe", kind: "account breach", date: "2013", color: "#EB1000" },
  dropbox: { id: "dropbox", name: "Dropbox", kind: "account breach", date: "2012", color: "#0061FF" },
  tinder: { id: "tinder", name: "Tinder", kind: "dating profiles", date: "2023", color: "#FE3C72" },
  ledger: { id: "ledger", name: "Ledger", kind: "customer + shipping leak", date: "2020", color: "#0a0a0a" },
  francetravail: { id: "francetravail", name: "France Travail", kind: "jobseeker records", date: "2024", color: "#000091" },
  nordvpn: { id: "nordvpn", name: "NordVPN", kind: "server + audit logs", date: "2019", color: "#4687FF" },
  google: { id: "google", name: "Google", kind: "account recovery data", date: "—", color: "#EA4335" },
};

export type Hit = {
  id: string;
  value: string;
  type: "name" | "email" | "username" | "phone";
  source: SourceId;
  subject: string;
};

export const INDEX: Hit[] = [
  { id: "h1", value: "John Doe", type: "name", source: "linkedin", subject: "morgan" },
  { id: "h2", value: "john.doe@gmail.com", type: "email", source: "collection1", subject: "morgan" },
  { id: "h3", value: "john_d", type: "username", source: "tinder", subject: "morgan" },
  { id: "h4", value: "jdoe.priv@proton.me", type: "email", source: "ledger", subject: "morgan" },
  { id: "h5", value: "+33 6 •• •• 1204", type: "phone", source: "francetravail", subject: "morgan" },
  { id: "h6", value: "jdoe", type: "username", source: "dropbox", subject: "morgan" },
  // decoys — thin, nothing to link
  { id: "d1", value: "Eliot Maurice", type: "name", source: "linkedin", subject: "morgane" },
  { id: "d2", value: "bob.martin", type: "username", source: "adobe", subject: "decoyvale" },
];

export type Field = { label: string; value: string; source: SourceId };

export type Subject = {
  id: string;
  name: string;
  thin?: boolean;
  primary: Field;
  linkedCount: number;
};

export const SUBJECTS: Record<string, Subject> = {
  morgan: {
    id: "morgan",
    name: "John Doe",
    linkedCount: 6,
    primary: { label: "Email", value: "john.doe@gmail.com", source: "collection1" },
  },
  morgane: {
    id: "morgane",
    name: "Eliot Maurice",
    thin: true,
    linkedCount: 0,
    primary: { label: "Full name", value: "Eliot Maurice", source: "linkedin" },
  },
  decoyvale: {
    id: "decoyvale",
    name: "Bob Martin",
    thin: true,
    linkedCount: 1,
    primary: { label: "Username", value: "bob.martin", source: "adobe" },
  },
};

export type Step = {
  id: string;
  source: SourceId | null;
  title: string;
  note: string;
  rows: { label: string; value: string; hot?: boolean }[];
};

export const STEPS: Step[] = [
  {
    id: "resolve",
    source: null,
    title: "Identity resolved",
    note: "The same email sits in four leaks. Joining them collapses the aliases into one person.",
    rows: [
      { label: "Name", value: "John Doe" },
      { label: "Born", value: "1991-03-07 · 34" },
      { label: "Links", value: "6 leaks share an identifier" },
    ],
  },
  {
    id: "professional",
    source: "linkedin",
    title: "Professional footprint",
    note: "Scraped LinkedIn fills in employer, seniority and city.",
    rows: [
      { label: "Employer", value: "Acme Corp · Lyon", hot: true },
      { label: "Role", value: "Staff Engineer" },
      { label: "Since", value: "2019" },
    ],
  },
  {
    id: "dating",
    source: "tinder",
    title: "Dating profile matched",
    note: "Same email hash in the dating dump — and it carries last-seen geo.",
    rows: [
      { label: "Profile", value: "john_d · active" },
      { label: "Last seen", value: "Lyon · Presqu'île", hot: true },
      { label: "Timestamp", value: "2023-06-14 · 21:40", hot: true },
    ],
  },
  {
    id: "household",
    source: "francetravail",
    title: "Income & household",
    note: "The jobseeker record ties the phone to a declared salary and dependents.",
    rows: [
      { label: "Declared income", value: "€82k / yr", hot: true },
      { label: "Dependents", value: "2 children", hot: true },
      { label: "Commune", value: "Lyon 2e", hot: true },
    ],
  },
  {
    id: "crypto",
    source: "ledger",
    title: "Crypto & home address",
    note: "The hardware-wallet leak shipped with names and delivery addresses.",
    rows: [
      { label: "Device", value: "Ledger Nano — registered", hot: true },
      { label: "Shipped to", value: "14 Rue Bellecour, Lyon", hot: true },
      { label: "Signup", value: "jdoe.priv@proton.me" },
    ],
  },
];

export type ChainNode = {
  id: string;
  label: string;
  value: string;
  source?: SourceId;
};

export const CHAIN: ChainNode[] = [
  { id: "vpn", label: "Hides behind", value: "NordVPN", source: "nordvpn" },
  { id: "signup", label: "Signed up with", value: "jdoe.priv@proton.me", source: "ledger" },
  { id: "audit", label: "Audit log ties it to", value: "IP 90.84.22.17", source: "nordvpn" },
  { id: "google", label: "That IP logged into", value: 'jdoe.io@gmail — "private"', source: "google" },
];

export const COMPOSITE: { label: string; value: string; source?: SourceId }[] = [
  { label: "Name", value: "John Doe", source: "linkedin" },
  { label: "Home", value: "14 Rue Bellecour, Lyon", source: "ledger" },
  { label: "Employer", value: "Acme Corp · Staff Eng.", source: "linkedin" },
  { label: "Income", value: "€82k · 2 children", source: "francetravail" },
  { label: "Last seen", value: "Lyon · 2023-06-14 21:40", source: "tinder" },
  { label: "Crypto", value: "Ledger hardware wallet", source: "ledger" },
  { label: "Identity behind the VPN", value: "jdoe.io@gmail", source: "nordvpn" },
];

/* ─── Final dossier report (fabricated) ─── */

export type LifeEvent = { icon: string; when: string; text: string; source?: SourceId };

export const LIFE: LifeEvent[] = [
  { icon: "🎓", when: "2015", text: "Student in **Paris 11e** — first seen in the Adobe signup.", source: "adobe" },
  { icon: "🏢", when: "2019", text: "Moved to **Lyon**, joined **Acme Corp** as Staff Engineer.", source: "linkedin" },
  { icon: "💳", when: "2020", text: "Bought a **Ledger**, shipped to 14 Rue Bellecour.", source: "ledger" },
  { icon: "❤️", when: "2023", text: "Active on **Tinder** around Presqu'île, late evenings.", source: "tinder" },
  { icon: "👶", when: "2024", text: "Declared **2 children** on the France Travail file.", source: "francetravail" },
  { icon: "🕐", when: "3 weeks ago", text: "Logged into a **private Gmail** from Lyon, 23:12.", source: "google" },
];

export type GeoPoint = { year: string; place: string; lat: number; lng: number; origin?: boolean };

export const GEO: GeoPoint[] = [
  { year: "2015", place: "Paris 11e", lat: 48.8578, lng: 2.3785, origin: true },
  { year: "2019", place: "Lyon · Acme Corp", lat: 45.7671, lng: 4.8341 },
  { year: "2020", place: "Lyon · Bellecour", lat: 45.7578, lng: 4.8320 },
  { year: "2023", place: "Lyon · Presqu'île", lat: 45.7640, lng: 4.8330 },
  { year: "3 wks ago", place: "Lyon · 23:12", lat: 45.7702, lng: 4.8452 },
];

export type Relation = { name: string; tie: string; via: string };

export const RELATIONS: Relation[] = [
  { name: "Claire Doe", tie: "mother", via: "shared surname + address, Paris" },
  { name: "Luc Doe", tie: "brother", via: "same emergency contact, Acme HR" },
  { name: "“J. Renaud”", tie: "partner", via: "co-located device, 2023–24" },
  { name: "2 children", tie: "dependents", via: "France Travail family fares" },
];

export const CONTACTS: { icon: string; label: string; value: string }[] = [
  { icon: "📧", label: "Email", value: "john.doe@gmail.com" },
  { icon: "🔒", label: "Private", value: "jdoe.io@gmail.com" },
  { icon: "📱", label: "Phone", value: "+33 6 •• •• 1204" },
  { icon: "🏠", label: "Home", value: "14 Rue Bellecour, Lyon 2e" },
  { icon: "💼", label: "Work", value: "Acme Corp · Staff Engineer" },
  { icon: "🌐", label: "Handles", value: "john_d · jdoe" },
];

/** Political estimate. lean: -1 (left) … +1 (right). */
export const POLITICS = {
  lean: -0.42,
  label: "Leans progressive / left-of-centre",
  confidence: "low–medium",
  signals: [
    "📸 Instagram: follows climate & mutual-aid accounts",
    "🐦 Twitter/X: liked posts from two left-leaning journalists",
    "🗳️ Petitions email in the leak set (housing, transit)",
  ],
};

export const PORTRAITS = [
  { src: "/images/glm/faces/face-1.webp", label: "Tinder selfie", source: "tinder" as SourceId },
  { src: "/images/glm/faces/face-2.webp", label: "LinkedIn headshot", source: "linkedin" as SourceId },
  { src: "/images/glm/faces/face-3.webp", label: "Found online", source: "google" as SourceId },
];
