export interface Topic {
  id: string;
  name: string;
  blurb?: string;
}

export type ViewpointId = "agree" | "disagree";

export interface Viewpoint {
  id: ViewpointId;
  name: string;
  description: string;
}

export interface Message {
  id: string;
  author: string;
  body: string;
}

export interface Channel {
  id: string;
}
