import type { Topic, Viewpoint } from "./types";

export const availableTopics: Topic[] = [
  {
    id: "cheese_delicious",
    name: "Cheese is delicious",
    blurb: "A classic culinary debate. Bring your sharpest takes.",
  },
  {
    id: "flat_earth",
    name: "The Earth is flat",
    blurb: "Geodesy meets skepticism. Defend your worldview.",
  },
];

export const availableViewpoints: Viewpoint[] = [
  {
    id: "agree",
    name: "Agree",
    description: "You hold this view and want to defend it.",
  },
  {
    id: "disagree",
    name: "Disagree",
    description: "You reject this view and want to argue against it.",
  },
];

export function findTopic(id: string | null | undefined): Topic | undefined {
  if (!id) return undefined;
  return availableTopics.find((t) => t.id === id);
}
