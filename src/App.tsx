import React from 'react'
import tokenGenerator from './TokenGenerator'
import './App.css'

import Chat from './Chat'

let App = () => {
    const identity = Math.random().toString(36).substr(2, 5);
    const deviceId = Math.random().toString(36).substr(2, 5);

    const token = tokenGenerator(identity, deviceId);

    return (
            <div className="App">
                <Chat token={{token}}/>
            </div>
    )
}

export default App