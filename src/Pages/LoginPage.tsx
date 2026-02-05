import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgLogin from "../assets/Background/bgLogin.png";
import LogoSchool from "../assets/Icon/logo smk.png";

interface LoginPageProps {
  role: string | null;
  onLogin: (role: string, identifier: string, phone: string) => void;
  onBack: () => void;
}

export default function LoginPage({ role, onLogin, onBack }: LoginPageProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasRedirected, setHasRedirected] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    identifier: "",
    password: "",
    phone: "",
  });

  // FIXED: Use a more controlled approach
  useEffect(() => {
    // Only redirect once when role is null
    if (!role && !hasRedirected) {
      setHasRedirected(true);
      onBack();
      navigate("/", { replace: true });
    }
  }, [role, hasRedirected, navigate, onBack]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.identifier.trim() || !form.password.trim()) {
      setError("Semua field harus diisi");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Check if role exists before calling onLogin
      if (role) {
        onLogin(role, form.identifier.trim(), form.phone.trim());
      } else {
        setError("Halaman tidak ditemukan");
      }
      setIsLoading(false);
    }, 500);
  };

  const getIdentifierLabel = () => {
    switch (role) {
      case "admin":
      case "waka":
        return "Nama Pengguna";
      case "guru":
      case "wakel":
        return "Kode Guru";
      case "siswa":
      case "pengurus_kelas":
        return "NISN";
      default:
        return "Identitas";
    }
  };

  const getPlaceholder = () => {
    switch (role) {
      case "admin":
      case "waka":
        return "Masukkan nama pengguna";
      case "guru":
      case "wakel":
        return "Masukkan kode guru";
      case "siswa":
      case "pengurus_kelas":
        return "Masukkan NISN";
      default:
        return "Masukkan identitas";
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // ✅ INPUT STYLE (PUTIH)
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    border: "2px solid #1E3A8A",
    borderRadius: 12,
    fontSize: 16,
    boxSizing: "border-box",
    backgroundColor: "#FFFFFF",
    color: "#111827",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const handleLogoClick = () => {
    onBack();
    navigate("/");
  };

  return (
    <>
      <style>
        {`
          input,
          input:focus,
          input:not(:focus),
          input:placeholder-shown,
          input:not(:placeholder-shown) {
            background-color: #ffffff !important;
          }

          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus {
            -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
            -webkit-text-fill-color: #111827 !important;
            transition: background-color 5000s ease-in-out 0s;
          }
          
          input:focus {
            border-color: #3B82F6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }

          .password-container {
            position: relative;
            display: flex;
            align-items: center;
          }

          .password-toggle {
            position: absolute;
            right: 12px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #6B7280;
            transition: color 0.2s;
          }

          .password-toggle:hover {
            color: #4B5563;
          }

          .password-toggle:disabled {
            cursor: not-allowed;
            color: #9CA3AF;
          }

          .eye-icon {
            width: 20px;
            height: 20px;
          }
        `}
      </style>

      {/* BACKGROUND */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url(${bgLogin})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
        }}
      />

      {/* CONTENT */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        {/* LOGO */}
        <button
          onClick={handleLogoClick}
          style={{
            position: "absolute",
            top: 20,
            right: 40,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            zIndex: 2,
          }}
          aria-label="Kembali ke halaman utama"
        >
          <img
            src={LogoSchool}
            alt="Logo SMK"
            style={{
              width: 90,
              height: "auto",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </button>

        <div
          style={{
            width: "100%",
            maxWidth: 420,
            padding: "40px 20px",
            textAlign: "center",
          }}
        >
          {/* TITLE */}
          <div
            style={{
              color: "#ffffff",
              marginBottom: 36,
              textShadow: "0 3px 8px rgba(0,0,0,0.35)",
            }}
          >
            <h1 style={{ fontSize: 40, fontWeight: 700, margin: 0 }}>
              Selamat Datang
            </h1>
            <h2 style={{ fontSize: 34, fontWeight: 700, margin: "6px 0 0 0" }}>
              di Presensi Pembelajaran Digital
            </h2>
          </div>

          {/* CARD */}
          <div
            style={{
              backgroundColor: "rgba(229,231,235,0.95)",
              borderRadius: 16,
              padding: 32,
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            }}
          >
            {error && (
              <div
                style={{
                  marginBottom: 16,
                  padding: "12px 16px",
                  backgroundColor: "#FEE2E2",
                  color: "#DC2626",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {!role && (
              <div
                style={{
                  marginBottom: 16,
                  padding: "12px 16px",
                  backgroundColor: "#FEF3C7",
                  color: "#92400E",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                ⚠️ Role tidak ditemukan. Kembali ke halaman utama.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* IDENTIFIER */}
              <div style={{ marginBottom: 20, textAlign: "left" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    color: "#0a1944",
                    marginBottom: 8,
                    fontSize: 14,
                  }}
                >
                  {getIdentifierLabel()}
                </label>
                <input
                  type="text"
                  value={form.identifier}
                  onChange={(e) =>
                    setForm({ ...form, identifier: e.target.value })
                  }
                  placeholder={getPlaceholder()}
                  style={inputStyle}
                  disabled={isLoading || !role}
                  aria-label={getIdentifierLabel()}
                />
              </div>

              {/* PASSWORD */}
              <div style={{ marginBottom: 24, textAlign: "left" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    color: "#0a1944",
                    marginBottom: 8,
                    fontSize: 14,
                  }}
                >
                  Kata Sandi
                </label>
                <div className="password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="Masukkan Kata Sandi"
                    style={inputStyle}
                    disabled={isLoading || !role}
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading || !role}
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? (
                      <svg className="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={isLoading || !role}
                style={{
                  width: "100%",
                  padding: 14,
                  borderRadius: 12,
                  border: "none",
                  backgroundColor: isLoading ? "#93C5FD" : "#2563EB",
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                  cursor: isLoading || !role ? "not-allowed" : "pointer",
                  opacity: isLoading || !role ? 0.7 : 1,
                  transition: "background-color 0.2s, transform 0.1s",
                }}
                onMouseDown={(e) => {
                  if (!isLoading && role) {
                    e.currentTarget.style.transform = "scale(0.98)";
                  }
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && role) {
                    e.currentTarget.style.backgroundColor = "#1D4ED8";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading && role) {
                    e.currentTarget.style.backgroundColor = "#2563EB";
                  }
                }}
              >
                {isLoading ? "Loading..." : "Masuk"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}