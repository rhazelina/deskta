// src/Pages/WakaStaff/LihatKelas.tsx
import StaffLayout from "../../component/WakaStaff/StaffLayout";
import DummyJadwal from "../../assets/Icon/DummyJadwal.png";

interface Props {
  user: { name: string; role: string };
  onLogout: () => void;
  currentPage: string;
  onMenuClick: (page: string) => void;
  kelas?: string;
  jurusan?: string;
}

export default function LihatKelas({
  user,
  onLogout,
  currentPage,
  onMenuClick,
  kelas = "X Mekatronika 1",
}: Props) {
  return (
    <StaffLayout
      pageTitle="Jadwal Kelas"
      currentPage={currentPage}
      onMenuClick={onMenuClick}
      user={user}
      onLogout={onLogout}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 12px 24px rgba(15, 23, 42, 0.08)",
        }}
      >
        {/* ===============================
            PILL / KOLOM KELAS (TETAP)
        =============================== */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            backgroundColor: "#0B2A4A",
            color: "#FFFFFF",
            padding: "10px 16px",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 14,
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 16 }}>🏫</span>
          {kelas}
        </div>

        {/* ===============================
            TABEL / CONTAINER JADWAL
        =============================== */}
        <div
          style={{
            width: "100%",
            border: "1px solid #E5E7EB",
            borderRadius: 12,
            overflow: "hidden",
            backgroundColor: "#F8FAFC",
          }}
        >
          {/* ===============================
              GAMBAR JADWAL
          =============================== */}
          <div
            style={{
              padding: 16,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={DummyJadwal}
              alt="Jadwal Kelas"
              style={{
                width: "100%",
                maxWidth: 850, // 🔽 DIPERKECIL (sebelumnya 1100)
                height: "auto",
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)", // 🔽 disesuaikan
              }}
            />
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
