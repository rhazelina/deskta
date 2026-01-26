// src/Pages/WakaStaff/DashboardStaff.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StaffLayout from "../../component/WakaStaff/StaffLayout";
import JadwalKelasStaff from "./JadwalKelasStaff";
import JadwalGuruStaff from "./JadwalGuruStaff";
import DetailGuru from "./LihatGuru";
import DetailKelas from "./LihatKelas";
import KehadiranGuru from "./KehadiranGuru";
import KehadiranSiswa from "./KehadiranSiswa";
import DetailSiswaStaff from "./DetailSiswaStaff";
import DetailKehadiranGuru from "./DetailKehadiranGuru";

interface DashboardStaffProps {
  user: { name: string; role: string; phone?: string };
  onLogout: () => void;
}

type WakaPage =
  | "dashboard"
  | "jadwal-kelas"
  | "jadwal-guru"
  | "kehadiran-siswa"
  | "kehadiran-guru"
  | "guru-pengganti"
  | "lihat-guru"
  | "lihat-kelas"
  | "detail-siswa-staff"
  | "detail-kehadiran-guru";

const PAGE_TITLES: Record<WakaPage, string> = {
  dashboard: "Dashboard",
  "jadwal-kelas": "Jadwal Kelas",
  "jadwal-guru": "Jadwal Guru",
  "kehadiran-siswa": "Kehadiran Siswa",
  "kehadiran-guru": "Kehadiran Guru",
  "guru-pengganti": "Daftar Guru Pengganti",
  "lihat-guru": "Detail Guru",
  "lihat-kelas": "Detail Kelas",
  "detail-siswa-staff": "Detail Siswa Staff",
  "detail-kehadiran-guru": "Detail Kehadiran Guru",
};

// Dummy data (BE bisa ganti dari API)
const weeklyAttendance = [
  { day: "Senin", hadir: 42, alpha: 4 },
  { day: "Selasa", hadir: 38, alpha: 6 },
  { day: "Rabu", hadir: 45, alpha: 3 },
  { day: "Kamis", hadir: 40, alpha: 5 },
  { day: "Jumat", hadir: 44, alpha: 2 },
  { day: "Sabtu", hadir: 28, alpha: 1 },
];

const monthlyAttendance = [
  { month: "Jan", hadir: 210, izin: 8, alpha: 4 },
  { month: "Feb", hadir: 198, izin: 12, alpha: 6 },
  { month: "Mar", hadir: 215, izin: 10, alpha: 5 },
  { month: "Apr", hadir: 224, izin: 9, alpha: 4 },
  { month: "Mei", hadir: 230, izin: 7, alpha: 3 },
  { month: "Jun", hadir: 218, izin: 11, alpha: 6 },
];

const statCards = [
  { label: "Tepat Waktu", value: "2100" },
  { label: "Terlambat", value: "10" },
  { label: "Izin", value: "18" },
  { label: "Sakit", value: "5" },
  { label: "Alpha", value: "5" },
];

const historyInfo = {
  date: "Senin, 7 Januari 2026",
  start: "07:00:00",
  end: "15:00:00",
  time: "08:00",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 12px 24px rgba(15, 23, 42, 0.08)",
};

export default function DashboardStaff({ user, onLogout }: DashboardStaffProps) {
  const [currentPage, setCurrentPage] = useState<WakaPage>("dashboard");
  const [selectedGuru, setSelectedGuru] = useState<string | null>(null);
  const [selectedKelas, setSelectedKelas] = useState<string | null>(null);
  const [selectedKelasId, setSelectedKelasId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleMenuClick = (page: string) => setCurrentPage(page as WakaPage);

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      onLogout();
      navigate("/");
    }
  };

  const commonProps = {
    user,
    onLogout: handleLogout,
    currentPage,
    onMenuClick: handleMenuClick,
  };

  const renderPage = () => {
    switch (currentPage) {
      case "jadwal-kelas":
        return (
          <JadwalKelasStaff
            {...commonProps}
            onSelectKelas={(kelasId: string) => {
              setSelectedKelas(kelasId);
              handleMenuClick("lihat-kelas");
            }}
          />
        );

      case "jadwal-guru":
        return (
          <JadwalGuruStaff
            {...commonProps}
            onSelectGuru={(guruId: string) => {
              setSelectedGuru(guruId);
              handleMenuClick("lihat-guru");
            }}
          />
        );

      case "lihat-guru":
        return (
          <DetailGuru
            {...commonProps}
            selectedGuru={selectedGuru}
            onBack={() => handleMenuClick("jadwal-guru")}
          />
        );

      case "lihat-kelas":
        return (
          <DetailKelas
            {...commonProps}
            selectedKelas={selectedKelas}
            onBack={() => handleMenuClick("jadwal-kelas")}
          />
        );

      case "kehadiran-siswa":
        return (
          <KehadiranSiswa
            {...commonProps}
            onNavigateToDetail={(kelasId: string) => {
              setSelectedKelasId(kelasId);
              handleMenuClick("detail-siswa-staff");
            }}
          />
        );

      case "detail-siswa-staff":
        return (
          <DetailSiswaStaff
            {...commonProps}
            kelasId={selectedKelasId || undefined}
            onBack={() => handleMenuClick("kehadiran-siswa")}
          />
        );
        
      case "kehadiran-guru":
        return (
          <KehadiranGuru
            {...commonProps}
            onNavigateToDetail={() => {
              handleMenuClick("detail-kehadiran-guru");
            }}
          />
        );
        
      case "detail-kehadiran-guru":
        return (
          <DetailKehadiranGuru
            {...commonProps}
            onBack={() => handleMenuClick("kehadiran-guru")}
          />
        );
        
      case "guru-pengganti":
        return (
          <StaffLayout
            pageTitle={PAGE_TITLES[currentPage]}
            currentPage={currentPage}
            onMenuClick={handleMenuClick}
            user={user}
            onLogout={handleLogout}
          >
            <ComingSoon title={PAGE_TITLES[currentPage]} />
          </StaffLayout>
        );

      case "dashboard":
      default:
        return (
          <StaffLayout
            pageTitle="Dashboard"
            currentPage={currentPage}
            onMenuClick={handleMenuClick}
            user={user}
            onLogout={handleLogout}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Grafik Kehadiran */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "24px",
                }}
              >
                <div style={cardStyle}>
                  <SectionHeader title="Grafik Kehadiran" subtitle="Rekap mingguan" />
                  <WeeklyBarGraph />
                </div>
                <div style={cardStyle}>
                  <SectionHeader
                    title="Grafik Kehadiran Bulanan"
                    subtitle="Periode Jan - Jun"
                  />
                  <MonthlyLineChart />
                </div>
              </div>

              {/* Riwayat & Statistik */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                  gap: "24px",
                }}
              >
                <div style={cardStyle}>
                  <SectionHeader
                    title="Riwayat Kehadiran"
                    subtitle={`${historyInfo.date} • ${historyInfo.time}`}
                  />
                  <HistoryCard
                    start={historyInfo.start}
                    end={historyInfo.end}
                  />
                </div>
                <div style={cardStyle}>
                  <SectionHeader
                    title="Statistik Kehadiran"
                    subtitle="Rekap keseluruhan"
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                      gap: "8px",
                    }}
                  >
                    {statCards.map((item) => (
                      <div
                        key={item.label}
                        style={{
                          border: "1px solid #E5E7EB",
                          borderRadius: "12px",
                          padding: "16px",
                          textAlign: "center",
                          backgroundColor: "#F8FAFC",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: "13px",
                            color: "#64748B",
                          }}
                        >
                          {item.label}
                        </p>
                        <p
                          style={{
                            margin: "8px 0 0",
                            fontSize: "24px",
                            fontWeight: 700,
                            color: "#0F172A",
                          }}
                        >
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </StaffLayout>
        );
    }
  };

  return renderPage();
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <h2
        style={{
          margin: 0,
          fontSize: "20px",
          fontWeight: 700,
          color: "#0F172A",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#64748B" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "999px",
          backgroundColor: color,
          display: "inline-block",
        }}
      />
      <span style={{ fontSize: "13px", color: "#475569" }}>{label}</span>
    </div>
  );
}

function WeeklyBarGraph() {
  const maxValue =
    weeklyAttendance.reduce(
      (acc, item) => Math.max(acc, item.hadir, item.alpha),
      1
    ) || 1;

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "16px",
          height: "220px",
          marginBottom: "32px",
        }}
      >
        {weeklyAttendance.map((item) => (
          <div key={item.day} style={{ flex: 1, textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                gap: "8px",
                height: "180px",
              }}
            >
              <div
                style={{
                  width: "22px",
                  height: `${(item.hadir / maxValue) * 160}px`,
                  borderRadius: "8px 8px 0 0",
                  background: "linear-gradient(180deg, #1E3A8A 0%, #3B82F6 100%)",
                }}
              />
              <div
                style={{
                  width: "22px",
                  height: `${(item.alpha / maxValue) * 160}px`,
                  borderRadius: "8px 8px 0 0",
                  background: "linear-gradient(180deg, #B91C1C 0%, #F87171 100%)",
                }}
              />
            </div>
            <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#475569" }}>
              {item.day}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <LegendDot color="#3B82F6" label="Jumlah Hadir" />
        <LegendDot color="#EF4444" label="Alpha" />
      </div>
    </div>
  );
}

function MonthlyLineChart() {
  const width = 360;
  const height = 200;
  const padding = 26;
  const maxValue =
    monthlyAttendance.reduce(
      (acc, item) => Math.max(acc, item.hadir, item.izin, item.alpha),
      1
    ) || 1;

  const buildPoints = (key: "hadir" | "izin" | "alpha") =>
    monthlyAttendance
      .map((item, index) => {
        const x =
          padding +
          (monthlyAttendance.length === 1
            ? 0
            : (index / (monthlyAttendance.length - 1)) * (width - 2 * padding));
        const y =
          height - padding - (item[key] / maxValue) * (height - 2 * padding);
        return `${x},${y}`;
      })
      .join(" ");

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg width={width} height={height} style={{ display: "block", margin: "0 auto" }}>
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#CBD5F5"
          strokeWidth={1}
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#CBD5F5"
          strokeWidth={1}
        />

        <polyline
          points={buildPoints("hadir")}
          fill="none"
          stroke="#3B82F6"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <polyline
          points={buildPoints("izin")}
          fill="none"
          stroke="#F59E0B"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <polyline
          points={buildPoints("alpha")}
          fill="none"
          stroke="#EF4444"
          strokeWidth={3}
          strokeLinecap="round"
        />

        {monthlyAttendance.map((item, index) => {
          const x =
            padding +
            (monthlyAttendance.length === 1
              ? 0
              : (index / (monthlyAttendance.length - 1)) * (width - 2 * padding));
          const y = height - padding + 16;
          return (
            <text
              key={item.month}
              x={x}
              y={y}
              textAnchor="middle"
              fontSize="12"
              fill="#475569"
            >
              {item.month}
            </text>
          );
        })}
      </svg>

      <div
        style={{
          marginTop: "12px",
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <LegendDot color="#3B82F6" label="Jumlah Siswa Hadir" />
        <LegendDot color="#F59E0B" label="Jumlah Siswa Izin/Sakit" />
        <LegendDot color="#EF4444" label="Jumlah Siswa Alpha" />
      </div>
    </div>
  );
}

function HistoryCard({ start, end }: { start: string; end: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <TimeRange label="Mulai" value={start} />
        <TimeRange label="Selesai" value={end} />
      </div>
    </div>
  );
}

function TimeRange({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: "160px",
        border: "1px solid #E2E8F0",
        borderRadius: "12px",
        padding: "12px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        backgroundColor: "#FFFFFF",
      }}
    >
      <span style={{ fontSize: "12px", color: "#94A3B8" }}>{label}</span>
      <strong style={{ fontSize: "18px", color: "#0F172A" }}>{value}</strong>
    </div>
  );
}

function ComingSoon({ title }: { title: string }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "32px",
        boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: "22px",
          marginBottom: "8px",
          color: "#1F2937",
        }}
      >
        {title}
      </h2>
      <p style={{ color: "#6B7280" }}>Konten masih dalam pengembangan.</p>
    </div>
  );
}