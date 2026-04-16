import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, LogIn, Sun, Moon } from "lucide-react";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

const Header = () => {
  const { user } = useAuth();
  const { currentTheme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 shadow-lg" style={{ backgroundColor: "#FDE7F6" }}>
      <div className="h-[2px]" style={{ backgroundImage: "var(--gradient-header)" }} />

      {/* ✅ IMPORTANTE: esse wrapper precisa estar fora da barra de 2px */}
      <div className="px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={user ? "/library" : "/"} className="flex items-center">
            <img
              src="https://auhtwkvwbgvekvwctcaj.supabase.co/storage/v1/object/public/public-assets/SNAP%20GAIN%20COM%20ROBO%20LOGOsem%20back.png"
              alt="SnapGain Logo"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <NavLink
                  to="/library"
                  className={({ isActive }) =>
                    `font-semibold transition-colors ${isActive ? "text-[var(--color-purple)]" : "text-[var(--text-primary)]"
                    } hover:text-[var(--color-pink)]`
                  }
                >
                  Library
                </NavLink>

                <NavLink
                  to="/account"
                  className={({ isActive }) =>
                    `font-semibold transition-colors ${isActive ? "text-[var(--color-purple)]" : "text-[var(--text-primary)]"
                    } hover:text-[var(--color-pink)]`
                  }
                >
                  Account
                </NavLink>

                {/* ✅ Theme Toggle */}
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
              </>
            ) : (
              <>
                {/* ✅ Theme Toggle também para visitantes (opcional, mas bom) */}
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

                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2 font-extrabold shadow-md transition hover:shadow-lg"
                  style={{
                    backgroundColor: "#7D4DFB",
                    border: "1px solid rgba(255,255,255,0.35)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <LogIn className="h-4 w-4" style={{ color: "white" }} />
                  <span style={{ color: "white" }}>Log in</span>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
            style={{ color: "var(--text-primary)" }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t"
            style={{
              borderColor: "rgba(125,77,251,0.18)",
              backgroundColor: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(10px)",
            }}
          >
            <nav className="px-4 py-4 space-y-3">
              {/* ✅ Theme toggle no mobile também */}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  toggleTheme();
                  closeMobile();
                }}
                className="w-full justify-center font-extrabold"
                style={{
                  borderColor: "rgba(125,77,251,0.35)",
                  backgroundColor: "rgba(255,255,255,0.35)",
                  color: "var(--text-primary)",
                }}
              >
                {currentTheme === "dark" ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    Light mode
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark mode
                  </>
                )}
              </Button>

              {user ? (
                <>
                  <NavLink
                    to="/library"
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `block font-semibold py-2 transition-colors ${isActive ? "text-[var(--color-purple)]" : "text-[var(--text-primary)]"
                      } hover:text-[var(--color-pink)]`
                    }
                  >
                    Library
                  </NavLink>

                  <NavLink
                    to="/account"
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `block font-semibold py-2 transition-colors ${isActive ? "text-[var(--color-purple)]" : "text-[var(--text-primary)]"
                      } hover:text-[var(--color-pink)]`
                    }
                  >
                    Account
                  </NavLink>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-extrabold shadow-md transition hover:shadow-lg"
                  style={{
                    backgroundColor: "#7D4DFB",
                    border: "1px solid rgba(255,255,255,0.35)",
                    color: "white",
                  }}
                >
                  <LogIn className="h-4 w-4" />
                  Log in
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;