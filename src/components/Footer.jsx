import React from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer
      className="w-full py-10 px-4"
      style={{ backgroundColor: "#FDE7F6" }}   // fundo rosa SnapGain
    >
      <div className="max-w-6xl mx-auto flex justify-center">
        <div
          className="w-full max-w-3xl rounded-[18px] shadow-lg"
          style={{
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(125,77,251,0.18)",
          }}
        >
          <div className="px-6 py-5 text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold">
              <Link
                to="/about"
                className="transition"
                style={{ color: "var(--color-purple)" }}
              >
                About
              </Link>

              <Link
                to="/terms"
                className="transition"
                style={{ color: "var(--color-purple)" }}
              >
                Terms & Conditions
              </Link>

              <Link
                to="/refund"
                className="transition"
                style={{ color: "var(--color-purple)" }}
              >
                Refund Policy
              </Link>

              <a
                href="mailto:support@snapgain.uk"
                className="flex items-center gap-1 transition"
                style={{ color: "var(--color-purple)" }}
              >
                <Mail className="h-3 w-3" />
                support@snapgain.uk
              </a>
            </div>

            <div
              className="mt-3 text-xs"
              style={{ color: "rgba(125,77,251,0.85)" }}
            >
              © {new Date().getFullYear()} SnapGain. All rights reserved. Powered by SnapGain
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;