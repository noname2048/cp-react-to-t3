import Link from "next/link";
import { useRouter } from "next/router";

const menu = [{ name: "Dashboard", path: "/" }];

const currentButtonClassName = `
  px-3 py-2 bg-gray-200 text-gray-800
  rounded-md text-md font-medium
`;
const defaultButtonClassName = `
  px-3 py-2  text-gray-700
  rounded-md text-md font-medium
  hover:bg-gray-300 hover:text-gray-900
  hover:ring-2 hover:ring-gray-200 ring-inset
`;

export default function Nav() {
  const router = useRouter();
  const path = router.pathname;

  return (
    <div
      className="m-2 p-4 rounded-md bg-white
        flex flex-row items-center justify-between
        shadow-xl shadow-black/5 ring-1 ring-slate-700/10"
    >
      <div className="flex h-8 items-center">
        <div className="ml-10 flex items-baseline space-x-4">
          {menu.map((item) => {
            const current = item.path === path;
            if (current)
              return (
                <div
                  key={item.path}
                  className={
                    current ? currentButtonClassName : defaultButtonClassName
                  }
                >
                  {item.name}
                </div>
              );
            else
              return (
                <Link href={item.path} key={item.path}>
                  <div
                    className={
                      current ? currentButtonClassName : defaultButtonClassName
                    }
                  >
                    {item.name}
                  </div>
                </Link>
              );
          })}
        </div>
      </div>
    </div>
  );
}
