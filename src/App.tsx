import React, {useState} from 'react'
import tokenGenerator from './TokenGenerator'
import './App.css'

import Chat from './Chat'
import TopicChooser from "./TopicChooser";

let App = () => {
  const [userStep, setUserStep] = useState('chooseTopic')
  const [topic, setTopic] = useState('')

  const identity = Math.random().toString(36).substr(2, 5);
    const deviceId = Math.random().toString(36).substr(2, 5);

    const token = tokenGenerator(identity, deviceId);

    let render
    if (userStep === 'chooseTopic') {
      render = <TopicChooser setUserStep={setUserStep} setTopic={setTopic}/>
    } else {
      render = (
          <div className="App">
            <Chat topic={topic} token={{token}} />
          </div>
      )
    }

  return render
}

export default App