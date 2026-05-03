import { Client, Conversation } from "@twilio/conversations";
import { config } from "./config";
import type { Channel, Message, Topic } from "./types";

export interface JoinResult {
  conversation: Conversation;
  initialMessages: Message[];
}

export async function joinChannel(
  chatClientToken: string,
  topic: Topic,
  viewpoint: string,
  onIncomingMessage: (m: Message) => void,
): Promise<JoinResult> {
  const chatClient = await Client.create(chatClientToken, {
    throwErrorsAlways: true,
  }).catch((error) => {
    throw new Error(`Twilio client failed to initialize: ${formatError(error)}`);
  });

  const response = await fetch(
    `${config.backendBaseUrl}/chat/channel?topicId=${encodeURIComponent(
      topic.id,
    )}&viewpoint=${encodeURIComponent(viewpoint)}`,
  );
  if (!response.ok) {
    throw new Error(`Backend failed to create chat channel: ${response.status}`);
  }
  const channel: Channel = await response.json();

  let conversation: Conversation;
  try {
    conversation = await chatClient.createConversation({
      uniqueName: channel.id,
      friendlyName: topic.name,
    });
  } catch (e) {
    const createMessage = formatError(e);
    try {
      conversation = await chatClient.getConversationByUniqueName(channel.id);
    } catch (lookupError) {
      throw new Error(
        `Could not create or find Twilio conversation "${channel.id}": ${createMessage}; ${formatError(
          lookupError,
        )}`,
      );
    }
  }

  try {
    await conversation.join();
  } catch (e) {
    const joinMessage = formatError(e);
    if (!joinMessage.toLowerCase().includes("already")) {
      throw new Error(
        `Could not join Twilio conversation "${channel.id}": ${joinMessage}`,
      );
    }
  }

  conversation.on("messageAdded", (m) => {
    onIncomingMessage({
      id: m.sid,
      author: m.author ?? "Unknown",
      body: m.body ?? "",
    });
  });

  const twilioMessages = await conversation.getMessages();
  const initialMessages: Message[] = twilioMessages.items.map((m) => ({
    id: m.sid,
    author: m.author ?? "Unknown",
    body: m.body ?? "",
  }));

  return { conversation, initialMessages };
}

export async function fetchChatToken(): Promise<{
  token: string;
  identity: string;
}> {
  const identity = Math.random().toString(36).substring(2, 7);
  const response = await fetch(
    `${config.backendBaseUrl}/chat/token?identity=${encodeURIComponent(
      identity,
    )}`,
  );
  const json = (await response.json()) as { token: string };
  if (!response.ok || !json.token) {
    throw new Error(`Backend failed to create chat token: ${response.status}`);
  }
  return { token: json.token, identity };
}

function formatError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message);
  }
  return String(error);
}
