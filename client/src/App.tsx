import React, { useRef, useState, useEffect, useCallback } from 'react';

import './app.css';

const user = [];

type WsRefProps = {
    ws: WebSocket | null;
};

const App = () => {
    let wsRef = useRef<WsRefProps>({ ws: null });

    const [value, setValue] = useState('');
    const [data, setData] = useState({ users: [], messages: [] });

    const handleSendMsg = useCallback(() => {
        const { ws } = wsRef.current;
        if (value && ws) {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(value);
            }
            setValue('');
        }
    }, [value]);

    const listenMessageFromServer = (event) => {
        const data = JSON.parse(event.data);
        setData(data);
    };

    useEffect(() => {
        const targetUrl = 'localhost:3010/chat/test';
        const ws = new WebSocket(`ws://${targetUrl}`);
        wsRef.current.ws = ws;
        ws.onmessage = listenMessageFromServer;
    }, []);

    const renderUser = (user) => {
        return (
            <div key={user.id} className="user">
                <div className="user-avatar">{user.name.charAt(0)}</div>
                <div className="user-name">{user.name}</div>
            </div>
        );
    };

    const renderMessage = (msg) => {
        return (
            <div key={msg.id} className="msg">
                <div className="msg-sender-avatar">{msg.sender.name.charAt(0)}</div>
                <div className="msg-text-area">
                    <div className="sender-name">{msg.sender.name}</div>
                    <div className="text">{msg.text}</div>
                </div>
            </div>
        );
    };

    return (
        <div className="center-container">
            <div className="chat">
                <aside className="user-list">{data.users.map(renderUser)}</aside>
                <main>
                    <section className="msg-area">
                        <header> 群聊室 </header>
                        <main> {data.messages.map(renderMessage)} </main>
                    </section>
                    <section className="dialog">
                        <textarea value={value} onChange={(e) => setValue(e.target.value)} />
                        <button className={value ? '' : 'disabled'} onClick={handleSendMsg}>
                            发送
                        </button>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default App;
