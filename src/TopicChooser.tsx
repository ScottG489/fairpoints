import React, {useState} from 'react'
import {Topic} from "./types";

interface Props {
    availableTopics: Topic[]
    setUserStep: React.Dispatch<React.SetStateAction<string>>
    setTopic: React.Dispatch<React.SetStateAction<Topic>>
}

let TopicChooser = ({availableTopics, setUserStep, setTopic}: Props) => {
    const [selectedTopic, setSelectedTopic] = useState<Topic>({id: '', name: ''})

    return (
        <div className="row">
            <div className="col">
                <div className="row">
                    <div className="col">
                        <h2>Choose a topic you have an opinion on</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <form onSubmit={submitTopicSelection}>
                            {displayTopics(availableTopics)}
                            <div className="form-group row">
                                <div className="col">
                                    <button className="form-control btn-outline-primary">Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )

    function displayTopics(topics: Topic[]) {
        return topics.map((topic) => {
            return (
                <div key={topic.id} className="form-group row justify-content-center">
                    <div className="col-auto">
                        <label>
                            <input type="radio" id={topic.id} name="topic" value={topic.id}
                                   onChange={updateSelectedTopic}
                                   className="form-control"/>
                            {topic.name}
                        </label>
                    </div>
                </div>
            )
        });
    }

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