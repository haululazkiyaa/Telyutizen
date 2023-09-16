import Image from "next/image";
import styles from "@/styles/Home.module.scss";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data }: any = useSession();

  return (
    <header className={`py-3 ${styles.blur}`}>
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center">
          <Link className="text-decoration-none" href="/">
            <Image
              className="me-3"
              src="/telyutizen.svg"
              alt="Telyutizen Web Portal"
              width={150}
              height={50}
            />
          </Link>
          <nav className="me-auto">
            <ul className="list-inline m-0">
              <li className="list-inline-item ms-3">
                {data && (
                  <Link
                    className="text-decoration-none text-black"
                    href="/dashboard"
                  >
                    🗃️ Dashboard
                  </Link>
                )}
              </li>
              <li className="list-inline-item ms-3">
                <Link
                  className="text-decoration-none text-black"
                  href="https://github.com/haululazkiyaa/Telyutizen"
                >
                  💻 Contribute
                </Link>
              </li>
            </ul>
          </nav>
          {data ? (
            <button
              className={`border border-0 rounded-pill shadow-sm px-4 py-2 text-white ${styles.btn__primary}`}
              onClick={() => signOut()}
            >
              ⛔️ Logout
            </button>
          ) : (
            <Link
              className={`text-decoration-none border border-0 rounded-pill shadow-sm px-4 py-2 text-white ${styles.btn__primary}`}
              href="/auth/login"
            >
              🔒 Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
