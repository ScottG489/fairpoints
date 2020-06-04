import React, {useState} from 'react'
import tokenGenerator from './TokenGenerator'
import './App.css'

import Chat from './Chat'
import TopicChooser from "./TopicChooser";
import ViewpointChooser from "./ViewpointChooser";
import {Topic} from "./types";

const availableTopics: Topic[] = [
  {id: 'cheese_delicious', name: 'Cheese is delicious'},
  {id: 'flat_earth', name: 'The Earth is flat'},
]

let App = () => {
  const [userStep, setUserStep] = useState('chooseTopic')
  const [topic, setTopic] = useState<Topic>({id: '', name: ''})
  const [viewpoint, setViewpoint] = useState('')

  const identity = Math.random().toString(36).substr(2, 5);
    const deviceId = Math.random().toString(36).substr(2, 5);

    const token = tokenGenerator(identity, deviceId);

    let render
    if (userStep === 'chooseTopic') {
      render = <TopicChooser
          availableTopics={availableTopics}
          setUserStep={setUserStep}
          setTopic={setTopic}/>
    } else if (userStep === 'chooseViewpoint') {
      render = <ViewpointChooser
          setUserStep={setUserStep}
          setViewpoint={setViewpoint} />
    } else if (userStep === 'chat') {
      render = (
          <Chat
              topic={topic}
              viewpoint={viewpoint}
              token={{token}} />
      )
    } else {
      render = 'Invalid user step'
    }

  return (
      <div className="App">
        <h1>{topic.name}</h1>
        {render}
      </div>
  )
}

export default App