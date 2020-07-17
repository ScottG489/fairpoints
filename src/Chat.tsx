import React, {useEffect, useState} from 'react'
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
    const [messages, setMessages] = useState<string[]>([]);
    const [channel, setChannel] = useState<Channel>();
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        joinChannel()
    }, []);

    return (
        <div>
            <form>
                <div>
                    <h2>Viewpoint: {viewpoint}</h2>
                </div>
                {isLoading ? 'Loading...' : ''}
                {messages}
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
        topicChannel.on('messageAdded', function(m) {
            console.log(m.author, m.body);
            const newMsg = `${m.author}: ${m.body}`
            setMessages(messages => [...messages, newMsg])
        });
        setChannel(topicChannel)
        setChannelName(topicChannel.friendlyName)

        const rawMsgs = await topicChannel.getMessages()
        const msgs = rawMsgs.items.map((m: Message) => {
            return `${m.author}: ${m.body}`
        })
        setIsLoading(false)
        setMessages(msgs)

        const totalMessages = rawMsgs.items.length
        console.log('Total messages: ' + totalMessages)
    }
};

export default Chat