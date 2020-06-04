import React, {useState} from 'react'
import './App.css'
import {Topic} from "./types";

interface Props {
  availableTopics: Topic[]
  setUserStep: React.Dispatch<React.SetStateAction<string>>
  setTopic: React.Dispatch<React.SetStateAction<Topic>>
}

let TopicChooser = ({availableTopics, setUserStep, setTopic}: Props) => {
    const [selectedTopic, setSelectedTopic] = useState<Topic>({id: '', name: ''})

    let topics = availableTopics.map((topic) => {
      return (
          <div key={topic.id} className="form-group">
            <label>
              <input type="radio" id={topic.id} name="topic" value={topic.id} onChange={updateSelectedTopic} className="form-control" />
              {topic.name}
            </label>
          </div>
      )
    });
    return (
        <div>
          <h2>Choose a topic you have an opinion on</h2>
          <form onSubmit={submitTopicSelection}>
            {topics}
            <div className="form-group">
              <button className="form-control btn-outline-primary">Submit</button>
            </div>
          </form>
        </div>
    )

  function updateSelectedTopic(event: React.ChangeEvent<HTMLInputElement>) {
      const selectedTopic = availableTopics.find((topic) => {
        return topic.id === event.target.value
      })
      if (!selectedTopic) {
        throw new Error('Selected topic not found')
      }
      setSelectedTopic(selectedTopic)
  }

  function submitTopicSelection(event: React.FormEvent) {
      event.preventDefault()
      setUserStep('chooseViewpoint')
      setTopic(selectedTopic)
  }
};

export default TopicChooser