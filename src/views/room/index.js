import './styles.css';
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const MessageType = {
    Text: 'text',
    Emoticon: 'emoticon',
    Gif: 'gif',
}

const socket = io('http://localhost:4000')

function Room() {
    const [messages, setMessages] = useState([]);
    const messagesRef = useRef(messages); // NOTES: 1
    const messagesListRef = useRef(); // NOTES: 2

    const [chatPause, setChatPause] = useState(false);
    const chatPauseRef = useRef(chatPause);

    const [messageType, setMessageType] = useState(MessageType.Text);
    const inputRef = useRef();

    useEffect(() => {
        socket.on('connect', ()=> {
            console.log(`socket connection: ${socket.id}`);
        });
        socket.on('disconnect', ()=> console.log('disconnected'));
        socket.on('message-add', (msg) => {
            let newMessages = [...messagesRef.current, msg]
            setMessages(newMessages);
        })
    },[])
    useEffect(() => { // NOTES: 1, 2
        messagesRef.current = messages;
        chatPauseRef.current = chatPause;
        // stay scrolled to bottom of messages unless chatPause is active
        if (!chatPauseRef.current) {
            messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
        }
    },[messages, chatPause])

    // methods 
    function sendMessage() {
        const currentText = inputRef.current.value;
        if (currentText) {
            socket.emit('message-send', currentText);
            inputRef.current.value = '';
        }
    }
    function handleKeyDown(e) {
        // ENTER keycode is 13
        if (e.keyCode === 13) {
            e.preventDefault();
            sendMessage();
        }
    }
    function handleScroll(e) {
        let scrollHeight = messagesListRef.current.scrollHeight; // total height of list plus scroll
        let clientHeight = messagesListRef.current.clientHeight; // height of list
        let scrollTop = messagesListRef.current.scrollTop; // how much is actually scrolled

        if (scrollHeight - (clientHeight + scrollTop) > 200) {
            // if we have scrolled up higher than 200 px, pause the auto scroll-to-bottom mechanic
            setChatPause(true);
        }
    }

    return (
        <div className="room-container">
            <div className="room">
                <div className="messages">
                    <ul ref={messagesListRef}
                        onScroll={handleScroll}>
                        {messages.map((msg, idx) =>(
                            <li key={idx}>
                                {msg}
                            </li>
                        ))}
                    </ul>
                    {chatPause && (
                        <div className="pause-notification">
                            <span onClick={() => setChatPause(false)}>Chat paused due to scroll. Click to unpause</span>
                        </div>
                        )}
                </div>
                <div className="participants">
                    list of participants here...
                </div>
            </div>
            <div className="options">
                <button onClick={() => setMessageType(MessageType.Text)}>text</button>
                <button onClick={() => setMessageType(MessageType.Emoticon)}>emoji</button>
                <button onClick={() => setMessageType(MessageType.Gif)}>gif</button>
            </div>
            <div className="message-input">
                {messageType === MessageType.Text && (
                    <>
                        <input ref={inputRef}
                            onKeyDown={handleKeyDown}
                            placeholder="insert your message here"
                        ></input>
                        <button onClick={sendMessage}>send</button>
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


/* NOTES
 * 1. When trying to grab state from socketio callback, it always remembers the state at time of instantiation.
    So even after updating state, any later calls to messages always returns the initial state. In order to remedy,
    we created a mutable "messagesRef" that we update whenever the state changes. The callback then uses this mutable
    array instead of the one stored in state.

 * 2. Couldnt figure any clever css tricks to keep a scroll container on the bottom.
    For now, programmatically setting the list's scroll whenever new messages are received. 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */