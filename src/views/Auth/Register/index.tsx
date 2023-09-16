import { useState } from "react";
import styles from "./Register.module.scss";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

export default function RegisterView() {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    setIsLoading(true);
    setError("");
    e.preventDefault();
    const data = {
      fullName: e.target.fullName.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };
    const result = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (result.status === 200) {
      e.target.reset();
      setIsLoading(false);
      Swal.fire({
        icon: "success",
        title: "Register success 🎉",
        text: "🕒 Please wait, redirecting you to login page...",
        showConfirmButton: false,
        timer: 5000,
      });
      push("/auth/login");
    } else {
      setError(
        result.status ? "Email already exist" : "Error! please try again later"
      );
      Swal.fire({
        icon: "error",
        title: "Error ⛔️",
        text: result.status
          ? "Email already exist"
          : "Error! please try again later",
        confirmButtonText: "Oke",
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row vh-100 d-flex align-items-center justify-content-center">
          <div className="col-md-4">
            {error && (
              <div className="alert alert-danger rounded-4">{error}</div>
            )}
            <aside className={`rounded-4 shadow-sm px-3 p-3 ${styles.blur}`}>
              <h2>Register 📨</h2>
              <p>Silahkan membuat akun terlebih dahulu</p>
              <form onSubmit={handleSubmit}>
                <input
                  className={`w-100 rounded-pill shadow-sm mb-2 p-2 text-white ${styles.blur}`}
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Nama Lengkap"
                />
                <input
                  className={`w-100 rounded-pill shadow-sm mb-2 p-2 text-white ${styles.blur}`}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                />
                <input
                  className={`w-100 rounded-pill shadow-sm mb-2 p-2 text-white  ${styles.blur}`}
                  type="text"
                  id="password"
                  name="password"
                  placeholder="Password"
                />
                <button
                  className={`w-100 border border-0 rounded-pill shadow-sm px-4 py-2 text-white ${styles.btn__primary}`}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Buat Akun ✅"}
                </button>
              </form>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
