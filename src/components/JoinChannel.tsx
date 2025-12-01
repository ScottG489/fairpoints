import { Client } from "@twilio/conversations";
import {Channel, Message, Topic} from "../types";
import config from "../config.conf";
import React from "react";

const url = config.backendBaseUrl

async function joinChannel(chatClientToken: string, topic: Topic, viewpoint: string, setMessages: React.Dispatch<any>, setChannel: React.Dispatch<any>, setIsLoading: React.Dispatch<any>) {
    let chatClient = await Client.create(chatClientToken);

    let response = await fetch(url + `/chat/channel?topicId=${topic.id}&viewpoint=${viewpoint}`);
    let channel: Channel = await response.json();

    try {
        await chatClient.createConversation({
            uniqueName: channel.id,
            friendlyName: topic.name,
        })
    } catch (e: any) {
        console.log(`Error creating channel: ${e.message}`)
    }

    let topicChannel = await chatClient.getConversationByUniqueName(channel.id);
    await topicChannel.join()
    topicChannel.on('messageAdded', function (m) {
        console.log(m.author, m.body);
        const newMsg: Message = {
            id: m.sid,
            author: m.author || 'Unknown',
            body: m.body || ''
        }
        setMessages((messages: Message[]) => [...messages, newMsg])
    });
    setChannel(topicChannel)

    const twilioMessages = await topicChannel.getMessages()
    const msgs = twilioMessages.items.map((m) => {
        return {
            id: m.sid,
            author: m.author || 'Unknown',
            body: m.body || ''
        }
    })
    setIsLoading(false)
    setMessages(msgs)

    const totalMessages = twilioMessages.items.length
    console.log('Total messages: ' + totalMessages)
}

export default joinChannel