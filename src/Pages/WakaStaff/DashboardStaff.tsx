import { useState, useEffect } from "react";
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
import RekapKehadiranSiswa from "./RekapKehadiranSiswa";
import DaftarKetidakhadiran from "./DaftarKetidakhadiran";
import { usePopup } from "../../component/Shared/Popup/PopupProvider";
import { dashboardService } from "../../services/dashboard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

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
  | "detail-kehadiran-guru"
  | "rekap-kehadiran-siswa"
  | "daftar-ketidakhadiran";

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
  "rekap-kehadiran-siswa": "Rekap Kehadiran Siswa",
  "daftar-ketidakhadiran": "Daftar Ketidakhadiran",
};

// Dummy data updated for Monthly view (Mon-Fri) with 5 categories sesuai gambar
const dailyAttendanceData = [
  { day: "Senin", hadir: 42, tidak_hadir: 2, izin: 3, sakit: 1, pulang: 0 },
  { day: "Selasa", hadir: 38, tidak_hadir: 1, izin: 5, sakit: 2, pulang: 1 },
  { day: "Rabu", hadir: 45, tidak_hadir: 0, izin: 2, sakit: 1, pulang: 0 },
  { day: "Kamis", hadir: 40, tidak_hadir: 1, izin: 4, sakit: 3, pulang: 2 },
  { day: "Jumat", hadir: 44, tidak_hadir: 0, izin: 1, sakit: 1, pulang: 1 },
];

// Updated monthly data with 5 categories sesuai gambar
const monthlyAttendance = [
  { month: "Jan", hadir: 210, izin: 8, tidak_hadir: 4, sakit: 3, pulang: 2 },
  { month: "Feb", hadir: 198, izin: 12, tidak_hadir: 6, sakit: 2, pulang: 1 },
  { month: "Mar", hadir: 215, izin: 10, tidak_hadir: 5, sakit: 4, pulang: 3 },
  { month: "Apr", hadir: 224, izin: 9, tidak_hadir: 4, sakit: 1, pulang: 2 },
  { month: "Mei", hadir: 230, izin: 7, tidak_hadir: 3, sakit: 2, pulang: 1 },
  { month: "Jun", hadir: 218, izin: 11, tidak_hadir: 6, sakit: 3, pulang: 4 },
];

const statCards = [
  { label: "Tepat Waktu", value: "2100", color: "#1FA83D" },
  { label: "Terlambat", value: "10", color: "#ACA40D" },
  { label: "Izin", value: "18", color: "#520C8F" },
  { label: "Sakit", value: "5", color: "#D90000" },
  { label: "Pulang", value: "3", color: "#2F85EB" },
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
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.08)",
  border: "1px solid #E5E7EB",
};

// Warna sesuai format revisi
const COLORS = {
  HADIR: "#1FA83D",      // HIJAU - Hadir
  IZIN: "#ACA40D",       // KUNING - Izin
  PULANG: "#2F85EB",     // BIRU - Pulang
  TIDAK_HADIR: "#D90000", // MERAH - Tidak Hadir
  SAKIT: "#520C8F",      // UNGU - Sakit
};

export default function DashboardStaff({ user, onLogout }: DashboardStaffProps) {
  const { confirm: popupConfirm } = usePopup();
  const [currentPage, setCurrentPage] = useState<WakaPage>("dashboard");
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("monthly");
  const navigate = useNavigate();

  // API data states
  const [adminSummary, setAdminSummary] = useState<any>(null);
  const [attendanceSummary, setAttendanceSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [summary, attendance] = await Promise.all([
          dashboardService.getAdminSummary(),
          dashboardService.getWakaAttendanceSummary(),
        ]);
        setAdminSummary(summary);
        setAttendanceSummary(attendance);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const [selectedGuru, setSelectedGuru] = useState<string | null>(null);
  const [selectedKelas, setSelectedKelas] = useState<string | null>(null);
  const [selectedKelasId, setSelectedKelasId] = useState<string | null>(null);
  const [selectedKelasInfo, setSelectedKelasInfo] = useState<{
    namaKelas: string;
    waliKelas: string;
  } | null>(null);
  const [selectedSiswa, setSelectedSiswa] = useState<{
    name: string;
    identitas: string;
  } | null>(null);

  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      setCurrentDate(now.toLocaleDateString("id-ID", options));
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMenuClick = (page: string, payload?: any) => {
    setCurrentPage(page as WakaPage);

    // Handle payload untuk daftar-ketidakhadiran
    if (page === "daftar-ketidakhadiran" && payload) {
      setSelectedSiswa({
        name: payload.siswaName,
        identitas: payload.siswaIdentitas,
      });
    }
  };

  const handleLogout = async () => {
    if (await popupConfirm("Apakah Anda yakin ingin keluar?")) {
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
            onselectKelas={(kelasId: string) => {
              setSelectedKelas(kelasId);
              handleMenuClick("lihat-kelas");
            }}
          />
        );

      case "jadwal-guru":
        return (
          <JadwalGuruStaff
            {...commonProps}
            onselectGuru={(guruId: string) => {
              setSelectedGuru(guruId);
              handleMenuClick("lihat-guru");
            }}
          />
        );

      case "lihat-guru":
        return (
          <DetailGuru
            {...commonProps}
            namaGuru={selectedGuru || undefined}
            onBack={() => handleMenuClick("jadwal-guru")}
          />
        );

      case "lihat-kelas":
        return (
          <DetailKelas
            {...commonProps}
            kelas={selectedKelas || undefined}
            onBack={() => handleMenuClick("jadwal-kelas")}
          />
        );

      case "kehadiran-siswa":
        return (
          <KehadiranSiswa
            {...commonProps}
            onNavigateToDetail={(kelasId: string, kelasInfo: { namaKelas: string; waliKelas: string }) => {
              setSelectedKelasId(kelasId);
              setSelectedKelasInfo(kelasInfo);
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

      case "rekap-kehadiran-siswa":
        return (
          <RekapKehadiranSiswa
            {...commonProps}
            namaKelas={selectedKelasInfo?.namaKelas || "X Mekatronika 1"}
            waliKelas={selectedKelasInfo?.waliKelas || "Ewit Erniyah S.pd"}
            onBack={() => handleMenuClick("detail-siswa-staff")}
          />
        );

      case "daftar-ketidakhadiran":
        return (
          <DaftarKetidakhadiran
            {...commonProps}
            siswaName={selectedSiswa?.name}
            siswaIdentitas={selectedSiswa?.identitas}
            onBack={() => handleMenuClick("rekap-kehadiran-siswa")}
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
            pageTitle="Beranda"
            currentPage={currentPage}
            onMenuClick={handleMenuClick}
            user={user}
            onLogout={handleLogout}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "28px", backgroundColor: "#F9FAFB", padding: "4px" }}>
              {/* Welcome Section */}
              <div style={{ marginBottom: "8px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: 0 }}>
                  Selamat Datang, {user.name}
                </h2>
                <p style={{ fontSize: "14px", color: "#6B7280", margin: "4px 0 0" }}>
                  Ringkasan aktivitas dan data sekolah hari ini
                </p>
              </div>

              {/* Top Section: History & Statistics */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                  gap: "24px",
                }}
              >
                {/* Riwayat Kehadiran Card */}
                <div style={cardStyle}>
                  <SectionHeader
                    title="Riwayat Kehadiran"
                    subtitle={`${currentDate} • ${currentTime}`}
                  />
                  <HistoryCard
                    start={historyInfo.start}
                    end={historyInfo.end}
                  />
                </div>

                {/* Statistik Kehadiran Card */}
                <div style={cardStyle}>
                  <SectionHeader
                    title="Statistik Kehadiran"
                    subtitle="Rekap keseluruhan"
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    {statCards.map((item) => (
                      <div
                        key={item.label}
                        style={{
                          border: `1px solid ${item.color}20`,
                          borderRadius: "12px",
                          padding: "16px",
                          textAlign: "center",
                          backgroundColor: `${item.color}10`,
                          transition: "all 0.2s ease",
                          cursor: "default",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${item.color}20`;
                          e.currentTarget.style.borderColor = item.color;
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = `${item.color}10`;
                          e.currentTarget.style.borderColor = `${item.color}20`;
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: "12px",
                            color: "#6B7280",
                            fontWeight: 600,
                            marginBottom: "6px",
                          }}
                        >
                          {item.label}
                        </p>
                        <p
                          style={{
                            margin: "0",
                            fontSize: "22px",
                            fontWeight: 700,
                            color: item.color,
                          }}
                        >
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grafik Section */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "24px",
                }}
              >
                {/* Weekly Chart - Kembali ke bentuk semula dengan warna baru */}
                <div style={cardStyle}>
                  <SectionHeader title="Grafik Kehadiran Harian" subtitle="Rekap Mingguan (Senin - Jumat)" />
                  <WeeklyBarGraph />
                </div>

                {/* Monthly Chart - Line Chart seperti DashboardSiswa */}
                <div style={{
                  ...cardStyle,
                  transition: "all 0.3s ease",
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 31, 62, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)";
                  }}>
                  <SectionHeader
                    title="Grafik Kehadiran Bulanan"
                    subtitle="Periode Jan - Jun"
                  />
                  <MonthlyLineChart data={monthlyAttendance} />
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
    <div style={{ marginBottom: "20px" }}>
      <h2
        style={{
          margin: 0,
          fontSize: "18px",
          fontWeight: 700,
          color: "#111827",
          letterSpacing: "-0.5px",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#6B7280", fontWeight: 500 }}>
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
          width: "10px",
          height: "10px",
          borderRadius: "999px",
          backgroundColor: color,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: "12px", color: "#4B5563", fontWeight: 500 }}>{label}</span>
    </div>
  );
}

function WeeklyBarGraph() {
  const maxValue =
    dailyAttendanceData.reduce(
      (acc, item) => Math.max(acc, item.hadir, item.tidak_hadir, item.izin, item.sakit, item.pulang),
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
        {dailyAttendanceData.map((item) => (
          <div key={item.day} style={{ flex: 1, textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                gap: "4px",
                height: "180px",
              }}
            >
              {/* Hadir */}
              <div
                title={`Hadir: ${item.hadir}`}
                style={{
                  width: "14px",
                  height: `${(item.hadir / maxValue) * 160}px`,
                  borderRadius: "4px 4px 0 0",
                  background: `linear-gradient(180deg, ${COLORS.HADIR} 0%, ${COLORS.HADIR}90 100%)`,
                }}
              />
              {/* Tidak Hadir */}
              <div
                title={`Tidak Hadir: ${item.tidak_hadir}`}
                style={{
                  width: "14px",
                  height: `${(item.tidak_hadir / maxValue) * 160}px`,
                  borderRadius: "4px 4px 0 0",
                  background: `linear-gradient(180deg, ${COLORS.TIDAK_HADIR} 0%, ${COLORS.TIDAK_HADIR}90 100%)`,
                }}
              />
              {/* Izin */}
              <div
                title={`Izin: ${item.izin}`}
                style={{
                  width: "14px",
                  height: `${(item.izin / maxValue) * 160}px`,
                  borderRadius: "4px 4px 0 0",
                  background: `linear-gradient(180deg, ${COLORS.IZIN} 0%, ${COLORS.IZIN}90 100%)`,
                }}
              />
              {/* Sakit */}
              <div
                title={`Sakit: ${item.sakit}`}
                style={{
                  width: "14px",
                  height: `${(item.sakit / maxValue) * 160}px`,
                  borderRadius: "4px 4px 0 0",
                  background: `linear-gradient(180deg, ${COLORS.SAKIT} 0%, ${COLORS.SAKIT}90 100%)`,
                }}
              />
              {/* Pulang */}
              <div
                title={`Pulang: ${item.pulang}`}
                style={{
                  width: "14px",
                  height: `${(item.pulang / maxValue) * 160}px`,
                  borderRadius: "4px 4px 0 0",
                  background: `linear-gradient(180deg, ${COLORS.PULANG} 0%, ${COLORS.PULANG}90 100%)`,
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
        <LegendDot color={COLORS.HADIR} label="Jumlah Guru Hadir" />
        <LegendDot color={COLORS.IZIN} label="Jumlah Guru Izin" />
        <LegendDot color={COLORS.PULANG} label="Jumlah Guru Pulang" />
        <LegendDot color={COLORS.TIDAK_HADIR} label="Jumlah Guru Tidak Hadir" />
        <LegendDot color={COLORS.SAKIT} label="Jumlah Guru Sakit" />
      </div>
    </div>
  );
}

// Monthly Line Chart Component - dengan 5 kategori
function MonthlyLineChart({
  data,
}: {
  data: Array<{ month: string; hadir: number; izin: number; tidak_hadir: number; sakit: number; pulang: number }>;
}) {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "Hadir",
        data: data.map((d) => d.hadir),
        borderColor: COLORS.HADIR,
        backgroundColor: `${COLORS.HADIR}20`,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: COLORS.HADIR,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Izin",
        data: data.map((d) => d.izin),
        borderColor: COLORS.IZIN,
        backgroundColor: `${COLORS.IZIN}20`,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: COLORS.IZIN,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Pulang",
        data: data.map((d) => d.pulang),
        borderColor: COLORS.PULANG,
        backgroundColor: `${COLORS.PULANG}20`,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: COLORS.PULANG,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Tidak Hadir",
        data: data.map((d) => d.tidak_hadir),
        borderColor: COLORS.TIDAK_HADIR,
        backgroundColor: `${COLORS.TIDAK_HADIR}20`,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: COLORS.TIDAK_HADIR,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Sakit",
        data: data.map((d) => d.sakit),
        borderColor: COLORS.SAKIT,
        backgroundColor: `${COLORS.SAKIT}20`,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: COLORS.SAKIT,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: "#1F2937",
        padding: 12,
        titleFont: { size: 13, family: "'Inter', sans-serif" },
        bodyFont: { size: 12, family: "'Inter', sans-serif" },
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.parsed.y + ' orang';
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#F3F4F6",
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          padding: 8,
          stepSize: 50,
        },
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
  };

  return (
    <div style={{ height: "300px", width: "100%" }}>
      <Line data={chartData} options={options} />
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
        border: "1px solid #E5E7EB",
        borderRadius: "10px",
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        backgroundColor: "#F9FAFB",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#3B82F6";
        e.currentTarget.style.backgroundColor = "#F0F9FF";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#E5E7EB";
        e.currentTarget.style.backgroundColor = "#F9FAFB";
      }}
    >
      <span style={{ fontSize: "11px", color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
      <strong style={{ fontSize: "18px", color: "#111827", fontWeight: 700 }}>{value}</strong>
    </div>
  );
}

function ComingSoon({ title }: { title: string }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "48px 32px",
        border: "2px dashed #E5E7EB",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚀</div>
      <h2
        style={{
          fontSize: "20px",
          marginBottom: "8px",
          color: "#111827",
          fontWeight: 700,
        }}
      >
        {title}
      </h2>
      <p style={{ color: "#6B7280", fontSize: "14px", margin: 0 }}>Konten masih dalam pengembangan.</p>
    </div>
  );
}

