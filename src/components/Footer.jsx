import React from "react";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <p>&copy; {currentYear} Movies Library. All rights reserved.</p>
      <p>
        This product uses the TMDb API but is not endorsed or certified by{" "}
        <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
          TMDb
        </a>
        .
      </p>
    </footer>
  );
}