import { useState } from 'react';

const MessageType = {
    Text: 'text',
    Emoticon: 'emoticon',
    Gif: 'gif',
}

function Room() {

    const [messageType, setMessageType] = useState(MessageType.Text);
    function changeMessageType(type) {
        setMessageType(type);
    }

    return (
        <div className="room">
            <div>
                <div className="messages">
                    list of messages here...
                </div>
                <div className="participants">
                    list of participants here...
                </div>
            </div>
            <div>
                <div className="extras">
                    <button onClick={() => changeMessageType(MessageType.Text)}>text</button>
                    <button onClick={() => changeMessageType(MessageType.Emoticon)}>emoji</button>
                    <button onClick={() => changeMessageType(MessageType.Gif)}>gif</button>
                </div>
                {messageType === MessageType.Text && (
                    <>
                        <textarea placeholder="insert your message here"></textarea>
                        <button>send</button>
                    </>
                )}
                {messageType === MessageType.Emoticon && (
                    <div>EMOTICONS LIST HERE...</div>
                )}
                {messageType === MessageType.Gif && (
                    <div>GIFs LIST HERE...</div>
                )}
            </div>
        </div>
    );
}

export default Room;