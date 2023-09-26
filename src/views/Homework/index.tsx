import { useEffect, useState } from "react";

import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";
import Swal from "sweetalert2";
import styles from "./Homework.module.scss";
import { useSession } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });
type Item = {
  id: string;
  homeworkTitle: string;
  homeworkDeadline: Date;
  homeworkLink: string;
};
export default function HomeworkView() {
  const { data }: any = useSession();
  const [loadData, setLoadData] = useState(true);
  const [submitData, setSubmitData] = useState(false);
  const [rawData, setRawData] = useState([] as any[]);
  const [listData, setListData] = useState([]);

  useEffect(() => {
    retrieveData();
  }, []);

  const retrieveData = () => {
    setLoadData(true);
    fetch("/api/homework/data")
      .then((res) => res.json())
      .then((res) => {
        setRawData(res.data);
        setListData(res.data);
      });
    setLoadData(false);
  };

  const handleSubmit = async (e: any) => {
    setSubmitData(true);
    e.preventDefault();
    const data = {
      homeworkTitle: e.target.homeworkTitle.value,
      homeworkDeadline: e.target.homeworkDeadline.value,
      homeworkLink: e.target.homeworkLink.value,
    };
    const result = await fetch("/api/homework/addData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (result.status === 200) {
      e.target.reset();
      setSubmitData(false);
      Swal.fire({
        icon: "success",
        title: "Add data success 🎉",
        text: "Data has been saved to database",
        showConfirmButton: false,
        timer: 3000,
      });
      retrieveData();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error ⛔️",
        text: "Failed to add data, please double check your input, make sure there are no duplicates",
        confirmButtonText: "Oke",
      });
      setSubmitData(false);
    }
  };

  const handleDelete = (dataId: string) => {
    setSubmitData(true);
    const data = {
      id: dataId,
    };
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (btn) => {
      if (btn.isConfirmed) {
        const result = await fetch("/api/homework/deleteData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (result.status === 200) {
          setSubmitData(false);
          Swal.fire({
            icon: "success",
            title: "Delete data success 🎉",
            text: "Data has been deleted from database",
            showConfirmButton: false,
            timer: 3000,
          });
          retrieveData();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error ⛔️",
            text: "Failed to delete data",
            confirmButtonText: "Oke",
          });
          setSubmitData(false);
        }
      }
    });
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
        <title>Telyutizen | Dashboard </title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-5 py-5">
        <div className="container">
          <h1 className="mb-4">
            Selamat Datang {data && data.user.fullName} 👋
          </h1>
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
            <div className="col-md-8">
              <main>
                <h2>List Tugas:</h2>
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
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h3>{item.homeworkTitle} ✅</h3>
                          <p>📅 {item.homeworkDeadline.toString()} </p>
                          <Link
                            className="text-decoration-none text-black"
                            href={item.homeworkLink}
                          >
                            🔗 {item.homeworkLink}
                          </Link>
                        </div>
                        <div>
                          <button
                            className="border-2 rounded-pill shadow-sm px-4 py-2 bg-white btn btn-outline-danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <p>Tidak ada data</p>
                )}
              </main>
            </div>
            <div className="col-md-4">
              <aside
                className={`rounded-4 shadow-sm px-3 p-3 text-white ${styles.aside}`}
              >
                <h2>Tambah Tugas 📨</h2>
                <p>Silahkan inputkan tugas baru</p>
                <form onSubmit={handleSubmit}>
                  <input
                    className={`w-100 rounded-pill shadow-sm mb-2 p-2 text-white ${styles.blur}`}
                    type="text"
                    id="homeworkTitle"
                    name="homeworkTitle"
                    placeholder="Judul Tugas"
                  />
                  <input
                    className={`w-100 rounded-pill shadow-sm mb-2 p-2 text-white  ${styles.blur}`}
                    type="date"
                    id="homeworkDeadline"
                    name="homeworkDeadline"
                    placeholder="Deadline Tugas"
                  />
                  <input
                    className={`w-100 rounded-pill shadow-sm mb-2 p-2 text-white ${styles.blur}`}
                    type="text"
                    id="homeworkLink"
                    name="homeworkLink"
                    placeholder="Link Tugas"
                  />
                  <button
                    className={`w-100 border border-0 rounded-pill shadow-sm px-4 py-2 text-white ${styles.btn__primary}`}
                    type="submit"
                    disabled={submitData}
                  >
                    {submitData ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        <span className="sr-only mr-3">Menyimpan ...</span>
                      </>
                    ) : (
                      <>Simpan</>
                    )}
                  </button>
                </form>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}