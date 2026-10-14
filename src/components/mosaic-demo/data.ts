/**
 * Fabricated data for the MOSAIC demonstration.
 *
 * Nothing here is real. No real person, company, breach, address, or record.
 * The leak names evoke familiar categories (dating, ride-hailing, crypto, VPN)
 * to show what *correlation* makes possible — not to claim any company leaked.
 */

export type SourceId =
  | "collection1"
  | "tindr"
  | "taxifr"
  | "chainvault"
  | "vaultvpn"
  | "geodrop"
  | "nazapi"
  | "acmehr";

export type Source = {
  id: SourceId;
  name: string;
  kind: string;
  date: string;
  /** Accent for the logo tile. */
  color: string;
};

export const SOURCES: Record<SourceId, Source> = {
  collection1: { id: "collection1", name: "Collection #1", kind: "credential compilation", date: "2019", color: "#6a5ae0" },
  nazapi: { id: "nazapi", name: "Naz.API", kind: "credential stuffing", date: "2024", color: "#8457d6" },
  tindr: { id: "tindr", name: "Tindr", kind: "dating app", date: "2023", color: "#ff5a7a" },
  taxifr: { id: "taxifr", name: "Taxi FR", kind: "ride registry", date: "2022", color: "#f0a330" },
  chainvault: { id: "chainvault", name: "ChainVault", kind: "crypto wallet registry", date: "2021", color: "#1f9d8f" },
  vaultvpn: { id: "vaultvpn", name: "VaultVPN", kind: "VPN audit logs", date: "2024", color: "#3b7de0" },
  geodrop: { id: "geodrop", name: "GeoDrop SDK", kind: "phone location SDK", date: "2023", color: "#d64f9e" },
  acmehr: { id: "acmehr", name: "Acme HR", kind: "employer export", date: "2020", color: "#7b8495" },
};

export type Hit = {
  id: string;
  value: string;
  type: "name" | "email" | "username" | "phone";
  source: SourceId;
  subject: string;
};

/** Autocomplete index. Several hits resolve to the same subject. */
export const INDEX: Hit[] = [
  { id: "h1", value: "Morgan Vale", type: "name", source: "acmehr", subject: "morgan" },
  { id: "h2", value: "morgan@example.test", type: "email", source: "collection1", subject: "morgan" },
  { id: "h3", value: "morgan_v", type: "username", source: "tindr", subject: "morgan" },
  { id: "h4", value: "+33 6 •• •• 1204", type: "phone", source: "taxifr", subject: "morgan" },
  { id: "h5", value: "m.vale.priv@proton.me", type: "email", source: "chainvault", subject: "morgan" },
  { id: "h6", value: "mvale", type: "username", source: "nazapi", subject: "morgan" },
  // decoys — thin profiles, nothing much to link
  { id: "d1", value: "Morgane Dubois", type: "name", source: "acmehr", subject: "morgane" },
  { id: "d2", value: "morgan.alvarez", type: "username", source: "nazapi", subject: "alvarez" },
  { id: "d3", value: "m.vale@oldmail.test", type: "email", source: "collection1", subject: "decoyvale" },
];

export type Field = {
  label: string;
  value: string;
  source: SourceId;
  /** Shown only once aggregated. */
  derived?: boolean;
};

export type Subject = {
  id: string;
  name: string;
  thin?: boolean;
  primary: Field; // the one record you land on before aggregation
  linkedCount: number;
  fields: Field[];
};

export const SUBJECTS: Record<string, Subject> = {
  morgan: {
    id: "morgan",
    name: "Morgan Vale",
    linkedCount: 7,
    primary: { label: "Email", value: "morgan@example.test", source: "collection1" },
    fields: [
      { label: "Full name", value: "Morgan Vale", source: "acmehr" },
      { label: "Born", value: "1991-03-07 (34)", source: "acmehr", derived: true },
      { label: "Aliases", value: "morgan_v · mvale · m.vale.priv", source: "nazapi", derived: true },
      { label: "Phone", value: "+33 6 •• •• 1204", source: "taxifr" },
    ],
  },
  morgane: {
    id: "morgane",
    name: "Morgane Dubois",
    thin: true,
    linkedCount: 0,
    primary: { label: "Full name", value: "Morgane Dubois", source: "acmehr" },
    fields: [],
  },
  alvarez: {
    id: "alvarez",
    name: "morgan.alvarez",
    thin: true,
    linkedCount: 1,
    primary: { label: "Username", value: "morgan.alvarez", source: "nazapi" },
    fields: [{ label: "Email", value: "m.alvarez@example.test", source: "collection1" }],
  },
  decoyvale: {
    id: "decoyvale",
    name: "m.vale@oldmail.test",
    thin: true,
    linkedCount: 0,
    primary: { label: "Email", value: "m.vale@oldmail.test", source: "collection1" },
    fields: [],
  },
};

/** The staged reveal of the GLM 5.3 aggregation run (Morgan only). */
export type Step = {
  id: string;
  source: SourceId | null;
  title: string;
  /** Short agent narration shown while the step "runs". */
  note: string;
  rows: { label: string; value: string; hot?: boolean }[];
};

export const STEPS: Step[] = [
  {
    id: "resolve",
    source: null,
    title: "Identity resolved",
    note: "Joining the leaks that share an identifier — email, alias, phone.",
    rows: [
      { label: "Name", value: "Morgan Vale" },
      { label: "Born", value: "1991-03-07 · 34" },
      { label: "Links", value: "4 leaks share this email" },
    ],
  },
  {
    id: "dating",
    source: "tindr",
    title: "Dating profile matched",
    note: "Same email hash in the dating dump. It carries last-seen geo.",
    rows: [
      { label: "Profile", value: "morgan_v · active" },
      { label: "Last seen", value: "Lyon · Rue de la Ré", hot: true },
      { label: "Timestamp", value: "2023-06-14 · 21:40", hot: true },
    ],
  },
  {
    id: "mobility",
    source: "taxifr",
    title: "Mobility & household",
    note: "Ride registry ties the phone to drop-offs and a fare profile.",
    rows: [
      { label: "Home", value: "14 Rue Bellecour, Lyon", hot: true },
      { label: "Income band", value: "€82k declared", hot: true },
      { label: "Household", value: "2 children (family fares)", hot: true },
    ],
  },
  {
    id: "crypto",
    source: "chainvault",
    title: "Crypto holdings",
    note: "Warranty registry leak — a hardware wallet bought under the private email.",
    rows: [
      { label: "Device", value: "Ledger — registered", hot: true },
      { label: "Via", value: "m.vale.priv@proton.me" },
      { label: "Status", value: "funded · active 2024" },
    ],
  },
];

/** The multi-hop de-anonymisation chain (VPN → audit log → "private" account). */
export type ChainNode = {
  id: string;
  label: string;
  value: string;
  source?: SourceId;
};

export const CHAIN: ChainNode[] = [
  { id: "vpn", label: "Uses a VPN", value: "VaultVPN subscriber" },
  { id: "signup", label: "Signed up with", value: "m.vale.priv@proton.me", source: "chainvault" },
  { id: "audit", label: "Audit log ties it to", value: "IP 90.84.​22.​17", source: "vaultvpn" },
  { id: "google", label: "That IP logged into", value: 'mvale.io@gmail — "private"', source: "geodrop" },
];

export const COMPOSITE: { label: string; value: string; source?: SourceId }[] = [
  { label: "Name", value: "Morgan Vale" },
  { label: "Home", value: "14 Rue Bellecour, Lyon", source: "taxifr" },
  { label: "Employer", value: "Acme Corp", source: "acmehr" },
  { label: "Income", value: "€82k · 2 children", source: "taxifr" },
  { label: "Last location", value: "Lyon · 2023-06-14 21:40", source: "tindr" },
  { label: "Crypto", value: "Ledger hardware wallet", source: "chainvault" },
  { label: "Real identity behind VPN", value: "mvale.io@gmail", source: "vaultvpn" },
];
