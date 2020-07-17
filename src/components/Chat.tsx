import React, {useEffect, useState} from 'react'
import './Chat.css'
import TwilioChat from 'twilio-chat'
import {Message as TwilioMessage} from "twilio-chat/lib/message";
import {Channel} from "twilio-chat/lib/channel";
import {Topic, Message} from "../types";

interface Props {
    chatClientToken: string
    topic: Topic
    viewpoint: string
}

let Chat = ({chatClientToken, topic, viewpoint}: Props) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [channel, setChannel] = useState<Channel>();
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        joinChannel()
    }, []);

    return (
        <div className="row">
            <div className="col">
                <div className="row">
                    <div className="col">
                        <h2>Viewpoint: {viewpoint}</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        {isLoading ? 'Loading...' : ''}
                        <div className="grid">
                            {displayMessages(messages)}
                        </div>
                        <form onSubmit={
                            async (event: React.FormEvent) =>
                                await sendMessage(event)
                        }>
                            <div className="form-group">
                                <input className="form-control" type="text"
                                       onChange={(event) => {
                                           setMessage(event.target.value)
                                       }}/>
                                <input className="form-control" type="submit" value="Send message"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )

    function displayMessages(messages: Message[]) {
        return messages.map(message => {
            return (
                <div className="row" key={message.id}>
                    <span className="author col">{message.author}</span>
                    <span className="body col">{message.body}</span>
                </div>
            )
        })
    }

    async function sendMessage(event: React.FormEvent) {
        event.preventDefault()
        await channel?.sendMessage(message)
        const rawMsgs = await channel?.getMessages()
        const totalMessages = rawMsgs?.items.length
        console.log('Total messages: ' + totalMessages)
    }

    async function joinChannel() {
        let chatClient = await TwilioChat.create(chatClientToken);

        try {
            await chatClient.createChannel({
                uniqueName: topic.id,
                friendlyName: topic.name,
            })
        } catch (e) {
            console.log(`Error creating channel: ${e.message}`)
        }

        let topicChannel = await chatClient.getChannelByUniqueName(topic.id);
        await topicChannel.join()
        topicChannel.on('messageAdded', function (m) {
            console.log(m.author, m.body);
            const newMsg: Message = {
                id: m.sid,
                author: m.author,
                body: m.body
            }
            setMessages(messages => [...messages, newMsg])
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
};

export default Chat