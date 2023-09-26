import { useEffect, useState } from "react";

import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";
import styles from "@/styles/Home.module.scss";

const inter = Inter({ subsets: ["latin"] });

type Item = {
  id: string;
  appName: string;
  appLink: string;
};

export default function HomePage() {
  const [loadData, setLoadData] = useState(true);
  const [rawData, setRawData] = useState([] as any[]);
  const [listData, setListData] = useState([]);

  useEffect(() => {
    retrieveData();
  }, []);

  const retrieveData = () => {
    setLoadData(true);
    fetch("/api/data")
      .then((res) => res.json())
      .then((res) => {
        setRawData(res.data);
        setListData(res.data);
      });
    setLoadData(false);
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    const temp: any = [];
    const value: string = e.target.search.value.toLowerCase();
    for (let i of rawData) {
      if (i.appName.toLowerCase().includes(value)) {
        temp.push(i);
      }
    }
    setListData(temp);
  };

  return (
    <>
      <Head>
        <title>Telyutizen | Home</title>
        <meta name="description" content="Telyutizen Web Portal" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-5 py-5">
        <div className="container">
          <h1 className="mb-4">Cari Link dan Kontak Telkom University</h1>
          <div className="position-relative">
            <form onSubmit={handleSearch}>
              <input
                className={`w-100 rounded-pill shadow-sm p-3 ${styles.blur} ${styles.search}`}
                type="text"
                id="search"
                name="search"
                placeholder="Ketikan kata kunci untuk mencari... [Enter]"
              />
              <button type="submit" hidden></button>
            </form>
            <Image
              className="position-absolute top-50 start-0 translate-middle-y ms-4"
              src="/search.svg"
              alt="Telyutizen Web Portal"
              width={24}
              height={24}
            />
          </div>
        </div>
      </div>
      <div className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-3">
              <aside
                className={`rounded-4 shadow-sm px-3 pt-3 text-white ${styles.aside}`}
              >
                <p>
                  Selamat datang telyutizen👋. Ini adalah web portal🌍 untuk
                  memudahkan kamu mencari🔍 link aplikasi💻 untuk mahasiswa
                  Telkom University👨‍💻 tanpa perlu mengingat link-nya
                  satu-persatu😉.
                </p>
              </aside>
            </div>
            <div className="col-md-8">
              <main>
                <h2>List Aplikasi 🗂️</h2>
                {loadData && (
                  <div className="d-flex align-items-center justify-content-center">
                    <div
                      className="spinner-border"
                      style={{ width: "50px", height: "50px" }}
                      role="status"
                    ></div>
                    <span className="ms-3">Memuat data...</span>
                  </div>
                )}
                {listData.length !== 0 ? (
                  listData.map((item: Item, index: number) => (
                    <article
                      key={index}
                      className={`rounded-4 shadow-sm p-3 mb-3 ${styles.blur}`}
                    >
                      <h3>{item.appName} ✅</h3>
                      <Link
                        className="text-decoration-none text-black"
                        href={item.appLink}
                      >
                        🔗 {item.appLink}
                      </Link>
                    </article>
                  ))
                ) : (
                  <p>Tidak ada data</p>
                )}
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
