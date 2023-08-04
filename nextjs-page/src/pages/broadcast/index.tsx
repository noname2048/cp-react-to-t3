import { useState } from "react";
import { css } from "@emotion/css";

export default function Index() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  return (
    <div>
      <div>
        <button
          className={
            "my-2 mx-4 py-2 px-4 cursor-pointer " +
            (isConnected
              ? "text-red-700 font-semibold border border-red-500 rounded hover:text-white hover:bg-red-500"
              : "text-blue-700 font-semibold border border-blue-500 rounded hover:text-white hover:bg-blue-500")
          }
          onClick={() => {
            console.log("click");
            if (ws === null || ws?.readyState === WebSocket.CLOSED) {
              const _ws = new WebSocket("ws://localhost:8000/ws/broadcast");
              _ws.onopen = () => {
                console.log("connected", _ws.url);
                setWs(_ws);
                setIsConnected(true);
              };
              _ws.onmessage = (event) => {
                setMessages((prev) => [...prev, event.data]);
              };
              _ws.onclose = () => {
                setWs(null);
                setIsConnected(false);
                console.log("disconnected", _ws?.url);
              };
            }
            if (ws?.readyState === WebSocket.OPEN) {
              ws.close();
              setWs(null);
              setIsConnected(false);
            }
          }}
        >
          {isConnected ? "DisConnect" : "Connect to broadcast"}
        </button>
        <span> {ws?.readyState === WebSocket.OPEN ? ws.url : " "}</span>
      </div>
      <div
        className="my-2 mx-4
      flex flex-col item-start"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className="p-2 mt-2 text-sm font-medium text-gray-900
            flex flex-row"
          >
            <p
              className="p-2 text-sm font-medium text-gray-200 rounded
              bg-gray-600 ring-1 ring-inset ring-gray-500"
            >
              {message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
