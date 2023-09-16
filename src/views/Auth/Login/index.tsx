import { useState } from "react";
import styles from "./Login.module.scss";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { signIn } from "next-auth/react";

export default function LoginView() {
  const { push, query } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const callbackUrl: any = query.callbackUrl || "/dashboard";

  const handleSubmit = async (e: any) => {
    setIsLoading(true);
    setError("");
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: e.target.email.value,
        password: e.target.password.value,
        callbackUrl,
      });

      if (!res?.error) {
        setIsLoading(false);
        Swal.fire({
          icon: "success",
          title: "Login success 🎉",
          text: "🕒 Please wait, redirecting you to login page...",
          showConfirmButton: false,
          timer: 3000,
        });
        push(callbackUrl);
      } else {
        setError(res.error);
        Swal.fire({
          icon: "error",
          title: "Error ⛔️",
          text: res.error,
          confirmButtonText: "Oke",
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      setError(error);
      Swal.fire({
        icon: "error",
        title: "Error ⛔️",
        text: error,
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
              <h2>Login 📨</h2>
              <p>Silahkan masuk dengan akun terlebih dahulu</p>
              <form onSubmit={handleSubmit}>
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
                >
                  {isLoading ? "Loading..." : "Masuk ke Akun ✅"}
                </button>
              </form>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
