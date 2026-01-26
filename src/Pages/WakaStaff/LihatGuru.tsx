// src/Pages/WakaStaff/LihatGuru.tsx
import StaffLayout from "../../component/WakaStaff/StaffLayout";
import DummyJadwal from "../../assets/Icon/DummyJadwal.png";
import ProfilIcon from "../../assets/Icon/profil.png";

interface Props {
  user: { name: string; role: string };
  onLogout: () => void;
  currentPage: string;
  onMenuClick: (page: string) => void;
  namaGuru?: string;
  noIdentitas?: string;
}

export default function LihatGuru({
  user,
  onLogout,
  currentPage,
  onMenuClick,
  namaGuru = "Ewit Erniyah S.pd",
  noIdentitas = "0918415784",
}: Props) {
  return (
    <StaffLayout
      pageTitle="Jadwal Guru"
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
            CARD IDENTITAS GURU (NETRAL & KECIL)
        =============================== */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 18px",
            borderRadius: 14,
            background:
              "linear-gradient(180deg, #06223D 0%, #041A30 100%)",
            color: "#FFFFFF",
            marginBottom: 20,
            maxWidth: "fit-content",
          }}
        >
          {/* Icon Profil (NO BACKGROUND PUTIH) */}
          <img
            src={ProfilIcon}
            alt="Profil Guru"
            style={{
              width: 40,
              height: 40,
              objectFit: "contain",
              flexShrink: 0,
            }}
          />

          {/* Info Guru */}
          <div style={{ lineHeight: 1.15 }}>
            <div
              style={{
                fontSize: 15, // 🔽 diperkecil
                fontWeight: 600,
                marginBottom: 2,
                whiteSpace: "nowrap",
              }}
            >
              {namaGuru}
            </div>
            <div
              style={{
                fontSize: 13,
                opacity: 0.85,
                whiteSpace: "nowrap",
              }}
            >
              {noIdentitas}
            </div>
          </div>
        </div>

        {/* ===============================
            CONTAINER JADWAL
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
              alt="Jadwal Guru"
              style={{
                width: "100%",
                maxWidth: 850,
                height: "auto",
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
            />
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
