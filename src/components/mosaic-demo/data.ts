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
  { id: "h1", value: "Morgan Vale", type: "name", source: "linkedin", subject: "morgan" },
  { id: "h2", value: "morgan.vale@gmail.com", type: "email", source: "collection1", subject: "morgan" },
  { id: "h3", value: "morgan_v", type: "username", source: "tinder", subject: "morgan" },
  { id: "h4", value: "mvale.priv@proton.me", type: "email", source: "ledger", subject: "morgan" },
  { id: "h5", value: "+33 6 •• •• 1204", type: "phone", source: "francetravail", subject: "morgan" },
  { id: "h6", value: "mvale", type: "username", source: "dropbox", subject: "morgan" },
  // decoys — thin, nothing to link
  { id: "d1", value: "Morgane Dubois", type: "name", source: "linkedin", subject: "morgane" },
  { id: "d2", value: "m.vale", type: "username", source: "adobe", subject: "decoyvale" },
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
    name: "Morgan Vale",
    linkedCount: 6,
    primary: { label: "Email", value: "morgan.vale@gmail.com", source: "collection1" },
  },
  morgane: {
    id: "morgane",
    name: "Morgane Dubois",
    thin: true,
    linkedCount: 0,
    primary: { label: "Full name", value: "Morgane Dubois", source: "linkedin" },
  },
  decoyvale: {
    id: "decoyvale",
    name: "m.vale",
    thin: true,
    linkedCount: 1,
    primary: { label: "Username", value: "m.vale", source: "adobe" },
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
      { label: "Name", value: "Morgan Vale" },
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
      { label: "Profile", value: "morgan_v · active" },
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
      { label: "Signup", value: "mvale.priv@proton.me" },
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
  { id: "signup", label: "Signed up with", value: "mvale.priv@proton.me", source: "ledger" },
  { id: "audit", label: "Audit log ties it to", value: "IP 90.84.22.17", source: "nordvpn" },
  { id: "google", label: "That IP logged into", value: 'mvale.io@gmail — "private"', source: "google" },
];

export const COMPOSITE: { label: string; value: string; source?: SourceId }[] = [
  { label: "Name", value: "Morgan Vale", source: "linkedin" },
  { label: "Home", value: "14 Rue Bellecour, Lyon", source: "ledger" },
  { label: "Employer", value: "Acme Corp · Staff Eng.", source: "linkedin" },
  { label: "Income", value: "€82k · 2 children", source: "francetravail" },
  { label: "Last seen", value: "Lyon · 2023-06-14 21:40", source: "tinder" },
  { label: "Crypto", value: "Ledger hardware wallet", source: "ledger" },
  { label: "Identity behind the VPN", value: "mvale.io@gmail", source: "nordvpn" },
];
