// 2026-05-20 (v2): Marketing-only header for snapgain.shop. Removed
// useAuth dependency (no auth flow in this build) and the user-aware
// navigation. Logo links to /, CTA links externally to snapgain.uk
// for sign-up.

import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

const MAIN_APP_SIGNUP = "https://snapgain.uk/auth/signup";

const Header = () => {
  const { currentTheme, toggleTheme } = useTheme();

  return (
    <header
      className="sticky top-0 z-50 shadow-lg"
      style={{ backgroundColor: "#FDE7F6" }}
    >
      <div
        className="h-[2px]"
        style={{ backgroundImage: "var(--gradient-header)" }}
      />

      <div className="px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo → marketing landing */}
          <Link to="/" className="flex items-center">
            <img
              src="https://auhtwkvwbgvekvwctcaj.supabase.co/storage/v1/object/public/public-assets/SNAP%20GAIN%20COM%20ROBO%20LOGOsem%20back.png"
              alt="SnapGain"
              className="h-12 w-auto"
            />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme toggle */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="rounded-full"
              style={{
                borderColor: "rgba(125,77,251,0.35)",
                backgroundColor: "rgba(255,255,255,0.35)",
              }}
              aria-label="Toggle theme"
              title="Toggle dark/light"
            >
              {currentTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Primary CTA: open the main app's signup */}
            <a
              href={MAIN_APP_SIGNUP}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                className="text-white font-bold rounded-full px-4 sm:px-5"
                style={{ backgroundImage: "var(--gradient-header2)" }}
              >
                <span className="hidden sm:inline">Try Premium</span>
                <span className="sm:hidden">Premium</span>
                <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
