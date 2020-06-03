import React, {useState} from 'react'
import './App.css'

interface Props {
  setUserStep: React.Dispatch<React.SetStateAction<string>>
  setTopic: React.Dispatch<React.SetStateAction<string>>
}

let TopicChooser = ({setUserStep, setTopic}: Props) => {
    const [selectedTopic, setSelectedTopic] = useState('')
    return (
        <div>
          <form onSubmit={submitTopicSelection}>
            <div className="form-group">
              <label>
                <input type="radio" id="topicA" name="topic" value="topic_a" onChange={updateSelectedTopic} className="form-control" />
                Topic A
              </label>
            </div>
            <div className="form-group">
              <label>
                <input type="radio" id="topicB" name="topic" value="topic_b" onChange={updateSelectedTopic} className="form-control" />
                Topic B
              </label>
            </div>
            <div className="form-group">
              <button className="form-control btn-outline-primary">Submit</button>
            </div>
          </form>
        </div>
    )

  function updateSelectedTopic(event: React.ChangeEvent<HTMLInputElement>) {
      setSelectedTopic(event.target.value)
  }

  function submitTopicSelection(event: React.FormEvent) {
      event.preventDefault()
      setUserStep('chat')
      setTopic(selectedTopic)
  }
};

export default TopicChooser