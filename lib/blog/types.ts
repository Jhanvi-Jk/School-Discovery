export type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "note"; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  /** ISO date */
  published: string;
  updated?: string;
  category: "Boards" | "Admissions" | "Fees" | "Choosing a school";
  readingMinutes: number;
  body: Block[];
  faqs?: { q: string; a: string }[];
}
