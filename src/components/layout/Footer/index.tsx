import Link from "next/link";

export default function Footer() {
  return (
    <footer className="d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center">
          <p>
            Telyutizen v1.0.5 (Last Up: 26 Sep 23) - MIT License (c) 2023
            Muhammad Haulul Azkiyaa{" "}
            <Link href="https://raw.githubusercontent.com/haululazkiyaa/Telyutizen/main/LICENSE"></Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
