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
    name: "I lean this way",
    description: "You hold this view and want to share why it sits right with you.",
    chipLabel: "you lean this way",
  },
  {
    id: "disagree",
    name: "I see it differently",
    description: "You don't see it that way and want to share what you see instead.",
    chipLabel: "you see it differently",
  },
];

export function findTopic(id: string | null | undefined): Topic | undefined {
  if (!id) return undefined;
  return availableTopics.find((t) => t.id === id);
}
