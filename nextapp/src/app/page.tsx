import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Temperature of home</title>
      </Head>
      <main className="bg-slate-200 min-h-screen min-w-full flex flex-col justify-center items-center gap-20">
        <h1 className="px-48 py-36 border-2 border-black rounded-lg flex justify-center items-center">
          Home Temperature
        </h1>
        <div className="flex justify-center items-center gap-10">
          <Link href="/bruteforce">
            <div className="w-40 h-24 border-2 border-black rounded-lg flex justify-center items-center">
              <p>fetch</p>
            </div>
          </Link>
          <Link href="/react-query">
            <div className="w-40 h-24 border-2 border-black rounded-lg flex justify-center items-center">
              <p>react-query</p>
            </div>
          </Link>
        </div>
      </main>
    </>
  );
}
