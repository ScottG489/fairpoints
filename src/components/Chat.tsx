import React, {useEffect, useState} from 'react'
import './Chat.css'
import joinChannel from "./JoinChannel"
import {Channel as TwilioChannel} from "twilio-chat/lib/channel";
import {Message, Topic} from "../types";

interface Props {
    chatClientToken: string
    topic: Topic
    viewpoint: string
}

let Chat = ({chatClientToken, topic, viewpoint}: Props) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [channel, setChannel] = useState<TwilioChannel>();
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        joinChannel(chatClientToken, topic, viewpoint, setMessages, setChannel, setIsLoading)
    }, [chatClientToken, topic, viewpoint]);

    return (
        <div className="row">
            <div className="col">
                <div className="row justify-content-center">
                    <div className="col-auto">
                        <h2>Viewpoint: {viewpoint}</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="row">
                            <div className="col-auto">
                                {isLoading ? 'Loading...' : ''}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <table className="table table-sm table-striped">
                                    <tbody>
                                    {displayMessages(messages)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="grid">
                        </div>
                        <form onSubmit={
                            async (event: React.FormEvent) =>
                                await sendMessage(event)
                        }>
                            <div className="form-group">
                                <input className="form-control" type="text" value={message}
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
                <tr>
                    <td>{message.author}</td>
                    <td>{message.body}</td>
                </tr>
            )
        })
    }

    async function sendMessage(event: React.FormEvent) {
        event.preventDefault()
        await channel?.sendMessage(message)

        const rawMsgs = await channel?.getMessages()
        setMessage('')
        const totalMessages = rawMsgs?.items.length
        console.log('Total messages: ' + totalMessages)
    }
};

export default Chat