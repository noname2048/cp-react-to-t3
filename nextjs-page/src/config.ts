const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8000"
    : "https://cu.noname2048.com";

const baseWsUrl =
  process.env.NODE_ENV === "development"
    ? "ws://127.0.0.1:8000"
    : "wss://cu.noname2048.com";

export { baseUrl, baseWsUrl };
