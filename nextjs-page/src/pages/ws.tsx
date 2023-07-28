import { useEffect, useState } from "react";

class WSManager {
  private static instance: WSManager;
  private ws: WebSocket | null = null;
  private constructor() {}
  static getInstance(): WSManager {
    if (!WSManager.instance) {
      WSManager.instance = new WSManager();
    }
    return WSManager.instance;
  }
  connect() {
    this.ws = new WebSocket("ws://localhost:8000/bb");
    this.ws.onopen = () => {
      console.log("connected");
    };
    this.ws.onclose = () => {
      console.log("disconnected");
    };
    this.ws.onerror = (event) => {
      console.error(event);
    };
    this.ws.onmessage = (event) => {
      console.log(event.data);
    };
  }
  disconnect() {
    this.ws?.close();
  }
}

export default function WS() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {}, [setWs]);

  return (
    <div>
      <div
        className="
      flex flex-column
      items-center
      "
      >
        <button
          className=" my-2 mx-4 py-2 px-4 text-blue-700 font-semibold border border-blue-500 rounded hover:text-white hover:bg-blue-500 "
          onClick={() => {
            if (
              ws?.readyState === undefined ||
              ws?.readyState === WebSocket.CLOSED
            ) {
              const websocket = new WebSocket("ws://localhost:8000/ws");
              websocket.onopen = () => {
                console.log("connected");
                setWs(websocket);
              };
              websocket.onclose = () => {
                console.log("disconnected");
                setWs(null);
              };
              websocket.onerror = (event) => {
                console.error(event);
              };
              websocket.onmessage = (event) => {
                console.log(event.data);
                setLog((prev) => [...prev, event.data]);
              };
            } else {
              alert("already connected");
            }
          }}
        >
          Connect
        </button>
        <p>{ws?.url !== undefined && ws.url}</p>
      </div>
      <button
        className=" my-2 mx-4 py-2 px-4 text-green-700 font-semibold border border-green-500 rounded hover:text-white hover:bg-green-500 "
        onClick={() => {
          if (ws?.url) {
            ws.send("hello");
          } else {
            alert("not connected");
          }
        }}
      >
        Send
      </button>
      <div>
        <button
          className=" my-2 mx-4 py-2 px-4 text-red-700 font-semibold border border-red-500 rounded hover:text-white hover:bg-red-500 "
          onClick={() => {
            if (
              ws?.readyState !== undefined &&
              ws?.readyState === WebSocket.OPEN
            ) {
              ws.close();
              setLog(() => []);
              setWs(null);
            }
          }}
        >
          Disconnect
        </button>
      </div>
      <ul className=" flex flex-col ">
        {log.map((str, idx) => (
          <li key={idx} className=" py-2 px-4 my-2 mx-2 border rounded ">
            {str}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function getStaticProps() {
  return {
    // only on local
    notFound: process.env.NEXT_PULIC_ENV === "local",
    props: {},
  };
}
