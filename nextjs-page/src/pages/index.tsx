import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Temperature of home</title>
      </Head>
      <main className="min-w-fit min-h-screen flex flex-col justify-center items-center gap-10">
        <h1 className="w-96 h-96 flex justify-center items-center text-5xl bg-teal-100 rounded-3xl">
          Iot Temperature
        </h1>
        <div className="flex gap-5 justify-center items-center">
          <Link href="/brute">
            <button className="w-36 h-20 rounded-2xl hover:bg-orange-300 bg-orange-400">
              brute
            </button>
          </Link>
          <Link href="/supabase">
            <button className="w-36 h-20 rounded-2xl hover:bg-orange-300 bg-slate-400">
              supabase
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}
