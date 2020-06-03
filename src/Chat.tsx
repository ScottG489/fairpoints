import React, {useState} from 'react'
import chat from 'twilio-chat'
import './App.css'
import {Message} from "twilio-chat/lib/message";
import {Channel} from "twilio-chat/lib/channel";

interface Props {
    token: any
    topic: string
}

let Chat = ({topic, token}: Props) => {
    const [channelName, setChannelName] = useState('');
    const [messages, setMessages] = useState();
    const [channel, setChannel] = useState();
    const [message, setMessage] = useState('')

    return (
        <div>
            <form onSubmit={
                async (event: React.FormEvent) =>
                    // dispatch(setStore(await foo(token.token.token.toJwt(), event)))
                    await joinChannel(token.token.toJwt(), event)
            }>
                <div>
                    <h1>{channelName}</h1>
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
        await channel.sendMessage(message)
        const messages = await channel.getMessages()
        const totalMessages = messages.items.length
        let messagesHtml = messages.items.map((m: Message) => {
            return <div>{m.author}: {m.body}</div>
        })
        console.log('Total messages: ' + totalMessages)

        setMessages(messagesHtml)
    }

    async function joinChannel(token: string, event: React.FormEvent) {
        event.preventDefault();
        let chatClient = await chat.create(token);

        let topicChannel: Channel = await chatClient.getChannelByUniqueName(topic);
        await topicChannel.join()
        setChannel(topicChannel)
        setChannelName(topicChannel.friendlyName)

        const messages = await topicChannel.getMessages()
        const totalMessages = messages.items.length
        let messagesHtml = messages.items.map((m: Message) => {
            return <div>{m.author}: {m.body}</div>
        })
        console.log('Total messages: ' + totalMessages)

        setMessages(messagesHtml)
    }
};

export default Chat