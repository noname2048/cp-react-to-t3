import "@/styles/globals.css";
import Nav from "@/components/nav";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Nav />
      <Component {...pageProps} />;
    </>
  );
}
