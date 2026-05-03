import { Client, Conversation } from "@twilio/conversations";
import { config } from "./config";
import type { Channel, Message, Topic } from "./types";

export interface JoinResult {
  conversation: Conversation;
  initialMessages: Message[];
}

export async function joinChannel(
  chatClientToken: string,
  identity: string,
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
    )}&viewpoint=${encodeURIComponent(viewpoint)}&identity=${encodeURIComponent(
      identity,
    )}`,
  );
  if (!response.ok) {
    throw new Error(`Backend failed to create chat channel: ${response.status}`);
  }
  const channel: Channel = await response.json();

  const conversation = await waitForConversation(chatClient, channel.id);

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

async function waitForConversation(
  client: Client,
  uniqueName: string,
  timeoutMs = 15_000,
): Promise<Conversation> {
  try {
    return await client.getConversationByUniqueName(uniqueName);
  } catch {
    // Not yet a participant from the SDK's view — wait for the join event.
  }

  return new Promise<Conversation>((resolve, reject) => {
    const handler = (conv: Conversation) => {
      if (conv.uniqueName !== uniqueName) return;
      cleanup();
      resolve(conv);
    };
    const cleanup = () => {
      clearTimeout(timer);
      client.removeListener("conversationJoined", handler);
      client.removeListener("conversationAdded", handler);
    };
    const timer = setTimeout(() => {
      cleanup();
      reject(
        new Error(`Timed out waiting to join Twilio conversation "${uniqueName}"`),
      );
    }, timeoutMs);
    client.on("conversationJoined", handler);
    client.on("conversationAdded", handler);
  });
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
