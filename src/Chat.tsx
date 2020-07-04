import React, {useState} from 'react'
import './App.css'
import TwilioChat from 'twilio-chat'
import {Message} from "twilio-chat/lib/message";
import {Channel} from "twilio-chat/lib/channel";
import {Topic} from "./types";

interface Props {
    chatClientToken: string
    topic: Topic
    viewpoint: string
}

let Chat = ({chatClientToken, topic, viewpoint}: Props) => {
    const [channelName, setChannelName] = useState(topic.name);
    const [messages, setMessages] = useState<JSX.Element[]>();
    const [channel, setChannel] = useState<Channel>();
    const [message, setMessage] = useState('')

    return (
        <div>
            <form onSubmit={
                async (event: React.FormEvent) =>
                    await joinChannel(event)
            }>
                <div>
                    <h2>Viewpoint: {viewpoint}</h2>
                </div>
                {messages}
                <div className="form-group">
                    <input className="form-control" type="submit" value="Join"/>
                </div>
            </form>
            <form onSubmit={
                async (event: React.FormEvent) =>
                    // dispatch(setStore(await foo(token.token.token.toJwt(), event)))
                    await sendMessage(event)
            }>
                <div className="form-group">
                    <input className="form-control" type="text"
                    onChange={(event) => {
                    setMessage(event.target.value)
                }} />
                    <input className="form-control" type="submit" value="Send message"/>
                </div>
            </form>
        </div>
    )

    async function sendMessage(event: React.FormEvent) {
        event.preventDefault()
        await channel?.sendMessage(message)
        const messages = await channel?.getMessages()
        const totalMessages = messages?.items.length
        let messagesHtml = messages?.items.map((m: Message) => {
            return <div>{m.author}: {m.body}</div>
        })
        console.log('Total messages: ' + totalMessages)

        setMessages(messagesHtml)
    }

    async function joinChannel(event: React.FormEvent) {
        event.preventDefault();
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
        setChannel(topicChannel)
        setChannelName(topicChannel.friendlyName)

        const messages = await topicChannel.getMessages()
        const totalMessages = messages.items.length
        let messagesHtml = messages.items.map((m: Message) => {
            return <div key={m.sid}>{m.author}: {m.body}</div>
        })
        console.log('Total messages: ' + totalMessages)

        setMessages(messagesHtml)
    }
};

export default Chat