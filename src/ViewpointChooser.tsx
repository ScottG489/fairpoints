import React, {useState} from 'react'
import './App.css'

interface Props {
  setUserStep: React.Dispatch<React.SetStateAction<string>>
  setViewpoint: React.Dispatch<React.SetStateAction<string>>
}

let ViewpointChooser = ({setUserStep, setViewpoint}: Props) => {
  const [selectedViewpoint, setSelectedViewpoint] = useState<string>('')

  return (
        <div>
          <h2>What is your viewpoint on this topic?</h2>
          <form onSubmit={submitTopicSelection}>
            <div className="form-group">
              <label>
                <input type="radio" id="agree" name="topic" value="agree" onChange={updateSelectedTopic} className="form-control" />
                Agree
              </label>
            </div>
            <div className="form-group">
              <label>
                <input type="radio" id="disagree" name="topic" value="disagree" onChange={updateSelectedTopic} className="form-control" />
                Disagree
              </label>
            </div>
            <div className="form-group">
              <button className="form-control btn-outline-primary">Submit</button>
            </div>
          </form>
        </div>
    )

  function updateSelectedTopic(event: React.ChangeEvent<HTMLInputElement>) {
      setSelectedViewpoint(event.target.value)
  }

  function submitTopicSelection(event: React.FormEvent) {
      event.preventDefault()
      setUserStep('chat')
      setViewpoint(selectedViewpoint)
  }
};

export default ViewpointChooser