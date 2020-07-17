import React, {useState} from 'react'
import {Viewpoint} from "../types";

interface Props {
    setUserStep: React.Dispatch<React.SetStateAction<string>>
    setViewpoint: React.Dispatch<React.SetStateAction<string>>
}

let ViewpointChooser = ({setUserStep, setViewpoint}: Props) => {
    const [selectedViewpoint, setSelectedViewpoint] = useState<string>('')
    const availableViewpoints: Viewpoint[] = [
        {id: 'agree', name: 'Agree'},
        {id: 'disagree', name: 'Disagree'},
    ]

    return (
        <div className="row">
            <div className="col">
                <div className="row">
                    <div className="col">
                        <h2>What is your viewpoint on this topic?</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <form onSubmit={submitTopicSelection}>
                            {displayViewpoints(availableViewpoints)}
                            <div className="form-group row">
                                <div className="col">
                                    <button className="form-control btn-outline-primary">Join Channel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )

    function displayViewpoints(viewpoints: Viewpoint[]) {
        return viewpoints.map((viewpoint) => {
            return (
                <div key={viewpoint.id} className="form-group row justify-content-center">
                    <div className="col-auto">
                        <label>
                            <input type="radio" id={viewpoint.id} name="topic" value="agree"
                                   onChange={updateSelectedTopic} className="form-control"/>
                            {viewpoint.name}
                        </label>
                    </div>
                </div>
            )
        });
    }

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