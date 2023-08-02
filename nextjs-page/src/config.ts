const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://cu.noname2048.com";

export { baseUrl };
