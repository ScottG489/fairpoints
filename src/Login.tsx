import React from 'react'

interface Props {
    setChatClientToken: React.Dispatch<React.SetStateAction<string>>
    setUserStep: React.Dispatch<React.SetStateAction<string>>
}

let Login = ({setChatClientToken, setUserStep}: Props) => {
    return (
        <div className="row">
            <div className="col">
                <form onSubmit={
                    async (event: React.FormEvent) =>
                        createChatClient(event)
                }>
                    <div className="form-group">
                        <input className="form-control" type="text"/>
                        <input className="form-control btn-outline-primary" type="submit" value="Login"/>
                    </div>
                </form>
            </div>
        </div>
    )

    async function createChatClient(event: React.FormEvent) {
        event.preventDefault()
        const identity = Math.random().toString(36).substr(2, 5);
        let response = await fetch('http://api.debate-table.com/chat/token', {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'POST',
            body: `identity=${identity}`
        });
        let json = await response.json();
        setChatClientToken(json.token)
        setUserStep('chooseTopic')
    }
};

export default Login