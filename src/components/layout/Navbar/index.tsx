import { signOut, useSession } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";
import { notification } from "@/components/function/Notification";
import styles from "@/styles/Home.module.scss";

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
                    🗃️ Admin
                  </Link>
                )}
              </li>
              <li className="list-inline-item ms-3">
                <Link
                  className="text-decoration-none text-black"
                  href="/homework"
                >
                  💻 Tugas
                </Link>
              </li>
              <li className="list-inline-item ms-3">
                <Link
                  className="text-decoration-none text-black"
                  href="https://github.com/haululazkiyaa/Telyutizen"
                >
                  💻 Kontribusi
                </Link>
              </li>
            </ul>
          </nav>
          <button
            type="button"
            className={`position-relative me-3 border border-0 rounded-pill shadow-sm px-3 py-2 text-white ${styles.btn__primary}`}
            onClick={() => notification()}
          >
            🔔 Deadline
            <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle mt-2">
              <span className="visually-hidden">New</span>
            </span>
          </button>
          {data ? (
            <button
              className={`border border-0 rounded-pill shadow-sm px-3 py-2 text-white ${styles.btn__primary}`}
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
