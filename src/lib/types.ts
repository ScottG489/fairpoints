export interface Topic {
  id: string;
  name: string;
  blurb?: string;
}

export type ViewpointId = "agree" | "disagree";

export interface Viewpoint {
  id: ViewpointId;
  /** First-person label shown on the stance card (e.g. "I lean this way"). */
  name: string;
  /** Card description shown beneath the name. */
  description: string;
  /** Second-person chip label shown in the chat header (e.g. "you lean this way"). */
  chipLabel: string;
}

export interface Message {
  id: string;
  author: string;
  body: string;
}

export interface Channel {
  id: string;
}
