import { useEffect, useState } from "react";

import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";
import Swal from "sweetalert2";
import { TimeDifference } from "@/components/fragment/TimeDifference";
import { notification } from "@/components/function/Notification";
import styles from "./Homework.module.scss";
import { useSession } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });
type Item = {
  id: string;
  homeworkTitle: string;
  homeworkType: string;
  homeworkCoverage: string;
  homeworkDeadline: Date;
  homeworkLink: string;
};
export default function HomeworkView() {
  const { data }: any = useSession();
  const [loadData, setLoadData] = useState(false);
  const [submitData, setSubmitData] = useState(false);
  const [rawData, setRawData] = useState([] as any[]);
  const [listData, setListData] = useState([]);
  const [previousData, setPreviousData] = useState([]);

  useEffect(() => {
    retrieveData();
    notification();
  }, []);

  const retrieveData = () => {
    setLoadData(true);
    fetch("/api/homework/data")
      .then((res) => res.json())
      .then((res) => {
        let data: any = res.data;
        data.sort((a: any, b: any) => {
          return (
            new Date(a.homeworkDeadline).getTime() -
            new Date(b.homeworkDeadline).getTime()
          );
        });
        let ongoingTask: any = [];
        let previousTask: any = [];
        for (let item of data) {
          if (TimeDifference(item.homeworkDeadline) < 0) {
            previousTask.push(item);
          } else {
            ongoingTask.push(item);
          }
        }
        setRawData(ongoingTask);
        setListData(ongoingTask);
        setPreviousData(previousTask);
        setLoadData(false);
      });
  };

  const handleSubmit = async (e: any) => {
    setSubmitData(true);
    e.preventDefault();
    const data = {
      homeworkTitle: e.target.homeworkTitle.value,
      homeworkType: e.target.homeworkType.value,
      homeworkCoverage: e.target.homeworkCoverage.value,
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

  const handleUpdate = (dataId: string) => {};

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

  const convertDate = (date: Date) => {
    let newDate = new Date(date);
    return newDate.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const convertTime = (time: Date) => {
    let newTime = new Date(time);
    return newTime.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
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
                <h2>🗃️ DAFTAR TUGAS</h2>
                {loadData && listData.length == 0 && (
                  <div className="d-flex align-items-center justify-content-center">
                    <div
                      className="spinner-border"
                      style={{ width: "50px", height: "50px" }}
                      role="status"
                    ></div>
                    <span className="ms-3">Memuat data...</span>
                  </div>
                )}
                {!loadData &&
                  listData.length != 0 &&
                  listData.map((item: Item, index: number) => (
                    <article
                      key={index}
                      className={`rounded-4 shadow-sm p-3 mb-3 ${styles.blur}`}
                    >
                      <div>
                        <div>
                          {TimeDifference(item.homeworkDeadline) <= 3 && (
                            <p
                              className={`badge rounded-pill text-bg-danger ${styles.blink}`}
                            >
                              Deadline Sudah Dekat
                            </p>
                          )}
                          <h3>{item.homeworkTitle}</h3>
                          <p>
                            📚 Tipe Tugas:
                            <span className="badge rounded-pill text-bg-secondary ms-2">
                              {item.homeworkType} - {item.homeworkCoverage}
                            </span>
                          </p>
                          <p>
                            📅 Deadline:
                            <span className="badge rounded-pill text-bg-success ms-2">
                              {convertDate(item.homeworkDeadline)}
                            </span>
                            <span className="badge rounded-pill text-bg-primary ms-2">
                              {convertTime(item.homeworkDeadline)} WIB
                            </span>
                          </p>
                          <div className="d-flex align-items-center justify-content-start">
                            <Link
                              className="border-2 rounded-pill shadow-sm px-3 py-2 bg-white btn btn-outline-success text-black me-2"
                              href={item.homeworkLink}
                            >
                              ↗️ Lihat di LMS
                            </Link>
                            <button
                              className="border-2 rounded-pill shadow-sm px-3 py-2 bg-white btn btn-outline-warning text-black me-2 opacity-50"
                              onClick={() => handleUpdate(item.id)}
                            >
                              🖊️ Edit
                            </button>
                            <button
                              className="border-2 rounded-pill shadow-sm px-3 py-2 bg-white btn btn-outline-danger text-black"
                              onClick={() => handleDelete(item.id)}
                            >
                              🗑️ Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                {!loadData && listData.length == 0 && <p>Tidak ada data</p>}
                <h2>🗃️ TUGAS SUDAH LEWAT</h2>
                {!loadData &&
                  previousData.length != 0 &&
                  previousData.map((item: Item, index: number) => (
                    <article
                      key={index}
                      className={`rounded-4 shadow-sm p-3 mb-3 ${styles.blur}`}
                    >
                      <div>
                        <div>
                          <h3>{item.homeworkTitle}</h3>
                          <div className="d-flex align-items-center justify-content-start">
                            <Link
                              className="border-2 rounded-pill shadow-sm px-3 py-2 bg-white btn btn-outline-success text-black me-2"
                              href={item.homeworkLink}
                            >
                              ↗️ Lihat di LMS
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                {!loadData && previousData.length == 0 && <p>Tidak ada data</p>}
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
                    required
                  />
                  <input
                    className={`w-100 rounded-pill shadow-sm mb-2 p-2 text-white  ${styles.blur}`}
                    type="datetime-local"
                    id="homeworkDeadline"
                    name="homeworkDeadline"
                    placeholder="Deadline Tugas"
                    required
                  />
                  <select
                    className={`w-100 rounded-pill shadow-sm mb-2 p-2 text-white ${styles.blur}`}
                    id="homeworkType"
                    name="homeworkType"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Pilih Tipe Tugas
                    </option>
                    <option value="Quiz">Quiz</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Tubes">Tubes</option>
                  </select>
                  <select
                    className={`w-100 rounded-pill shadow-sm mb-2 p-2 text-white ${styles.blur}`}
                    id="homeworkCoverage"
                    name="homeworkCoverage"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Pilih Cakupan Tugas
                    </option>
                    <option value="Individu">Individu</option>
                    <option value="Kelompok">Kelompok</option>
                  </select>
                  <input
                    className={`w-100 rounded-pill shadow-sm mb-2 p-2 text-white ${styles.blur}`}
                    type="text"
                    id="homeworkLink"
                    name="homeworkLink"
                    placeholder="Link Tugas"
                    required
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
