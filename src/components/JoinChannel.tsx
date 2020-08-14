import TwilioChat from "twilio-chat";
import {Channel, Message, Topic} from "../types";
import {Message as TwilioMessage} from "twilio-chat/lib/message";
import config from "../config.conf";
import React from "react";

const url = config.backendBaseUrl

async function joinChannel(chatClientToken: string, topic: Topic, viewpoint: string, setMessages: React.Dispatch<any>, setChannel: React.Dispatch<any>, setIsLoading: React.Dispatch<any>) {
    let chatClient = await TwilioChat.create(chatClientToken);

    let response = await fetch(url + `/chat/channel?topicId=${topic.id}&viewpoint=${viewpoint}`);
    let channel: Channel = await response.json();

    try {
        await chatClient.createChannel({
            uniqueName: channel.id,
            friendlyName: topic.name,
        })
    } catch (e) {
        console.log(`Error creating channel: ${e.message}`)
    }

    let topicChannel = await chatClient.getChannelByUniqueName(channel.id);
    await topicChannel.join()
    topicChannel.on('messageAdded', function (m) {
        console.log(m.author, m.body);
        const newMsg: Message = {
            id: m.sid,
            author: m.author,
            body: m.body
        }
        setMessages((messages: Message[]) => [...messages, newMsg])
    });
    setChannel(topicChannel)

    const twilioMessages = await topicChannel.getMessages()
    const msgs = twilioMessages.items.map((m: TwilioMessage) => {
        return {
            id: m.sid,
            author: m.author,
            body: m.body
        }
    })
    setIsLoading(false)
    setMessages(msgs)

    const totalMessages = twilioMessages.items.length
    console.log('Total messages: ' + totalMessages)
}

export default joinChannel