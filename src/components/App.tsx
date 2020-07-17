import React, {useEffect, useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import Chat from './Chat'
import TopicChooser from "./TopicChooser";
import ViewpointChooser from "./ViewpointChooser";
import {Topic} from "../types";

const availableTopics: Topic[] = [
    {id: 'cheese_delicious', name: 'Cheese is delicious'},
    {id: 'flat_earth', name: 'The Earth is flat'},
]

let App = () => {
    const [userStep, setUserStep] = useState('chooseTopic')
    const [topic, setTopic] = useState<Topic>({id: 'none', name: 'What topic interests you?'})
    const [viewpoint, setViewpoint] = useState('')
    const [chatClientToken, setChatClientToken] = useState('')

    let render
    if (userStep === 'chooseTopic') {
        render = <TopicChooser
            availableTopics={availableTopics}
            setUserStep={setUserStep}
            setTopic={setTopic}/>
    } else if (userStep === 'chooseViewpoint') {
        render = <ViewpointChooser
            setUserStep={setUserStep}
            setViewpoint={setViewpoint}/>
    } else if (userStep === 'chat') {
        render = (
            <Chat
                chatClientToken={chatClientToken}
                topic={topic}
                viewpoint={viewpoint}/>
        )
    } else {
        render = 'Invalid user step'
    }

    useEffect(() => {
        authenticate()
    }, []);

    return (
        <div className="App container">
            <div className="row justify-content-center">
                <div className="col-auto">
                    <h1>{topic.name}</h1>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-auto">{render}</div>
            </div>
        </div>
    )

    async function authenticate() {
        const identity = Math.random().toString(36).substr(2, 5);
        console.log('Identity: ' + identity)
        let response = await fetch('http://api.debate-table.com/chat/token', {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'POST',
            body: `identity=${identity}`
        });
        let json = await response.json();
        setChatClientToken(json.token)
        setUserStep('chooseTopic')
    }
}

export default App