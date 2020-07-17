import React, {useState} from 'react'

import Login from "./Login";
import Chat from './Chat'
import TopicChooser from "./TopicChooser";
import ViewpointChooser from "./ViewpointChooser";
import {Topic} from "./types";

const availableTopics: Topic[] = [
  {id: 'cheese_delicious', name: 'Cheese is delicious'},
  {id: 'flat_earth', name: 'The Earth is flat'},
]

let App = () => {
  const [userStep, setUserStep] = useState('login')
  const [topic, setTopic] = useState<Topic>({id: 'none', name: 'What topic interests you?'})
  const [viewpoint, setViewpoint] = useState('')
  const [chatClientToken, setChatClientToken] = useState('')

  let render
   if (userStep === "login") {
       render = <Login setChatClientToken={setChatClientToken} setUserStep={setUserStep}/>
   } else if (userStep === 'chooseTopic') {
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
              chatClientToken={chatClientToken}
              topic={topic}
              viewpoint={viewpoint} />
      )
    } else {
      render = 'Invalid user step'
    }

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
}

export default App