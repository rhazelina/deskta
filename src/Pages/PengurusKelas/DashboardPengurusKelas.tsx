import { useMemo, useState, useEffect } from "react";
import PengurusKelasLayout from "../../component/PengurusKelas/PengurusKelasLayout";
import DaftarMapel from "./DaftarMapel";
import TidakHadirPenguruskelas from "./TidakHadirPenguruskelas";
import JadwalPengurus from "./JadwalPengurus";
import openBook from "../../assets/Icon/open-book.png";
import INO from "../../assets/Icon/INO.png";
import RASI from "../../assets/Icon/RASI.png";
import { Modal } from "../../component/Shared/Modal";

type PageType =
  | "dashboard"
  | "daftar-mapel"
  | "absensi"
  | "jadwal-anda"
  | "laporan"
  | "profil"; // Sesuaikan dengan menu Pengurus Kelas

interface ScheduleItem {
  id: string;
  mapel: string;
  guru: string;
  start: string;
  end: string;
}

interface DashboardPengurusKelasProps {
  user: { name: string; phone: string; role?: string };
  onLogout: () => void;
}

// Dummy data untuk statistik
const monthlyTrendData = [
  { month: "Jan", hadir: 20, izin: 5, sakit: 3, alpha: 2 },
  { month: "Feb", hadir: 42, izin: 8, sakit: 2, alpha: 3 },
  { month: "Mar", hadir: 48, izin: 4, sakit: 1, alpha: 2 },
  { month: "Apr", hadir: 46, izin: 6, sakit: 2, alpha: 1 },
  { month: "Mei", hadir: 50, izin: 3, sakit: 1, alpha: 1 },
  { month: "Jun", hadir: 47, izin: 5, sakit: 2, alpha: 1 },
];

const weeklyStats = {
  hadir: 80,
  izin: 25,
  sakit: 20,
  alpha: 40,
};

export default function DashboardPengurusKelas({
  user,
  onLogout,
}: DashboardPengurusKelasProps) {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [isMapelModalOpen, setIsMapelModalOpen] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setCurrentDate(now.toLocaleDateString("id-ID", options));
      setCurrentTime(
        now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const schedules = useMemo<ScheduleItem[]>(
    () => [
      {
        id: "1",
        mapel: "Matematika",
        guru: "Ewit Erniyah S.Pd",
        start: "07:00",
        end: "08:30",
      },
      {
        id: "2",
        mapel: "Bahasa Indonesia",
        guru: "Budi Santoso S.Pd",
        start: "08:30",
        end: "10:00",
      },
      {
        id: "3",
        mapel: "Bahasa Inggris",
        guru: "Siti Nurhaliza S.Pd",
        start: "10:15",
        end: "11:45",
      },
    ],
    []
  );

  const handleMenuClick = (page: string) => {
    const allowedPages: PageType[] = [
      "dashboard",
      "daftar-mapel",
      "absensi",
      "jadwal-anda",
      "laporan",
      "profil",
    ];
    if (allowedPages.includes(page as PageType)) {
      setCurrentPage(page as PageType);
      return;
    }
    setCurrentPage("dashboard");
  };

  // Dummy user info
  const userInfo = {
    name: user.name || "Muhammad Wito S.",
    id: "0918415784",
  };

  return (
    <PengurusKelasLayout
      pageTitle={
        currentPage === "daftar-mapel"
          ? "Daftar Mapel"
          : currentPage === "absensi"
          ? "Daftar Ketidakhadiran"
          : currentPage === "jadwal-anda"
          ? "Jadwal Anda"
          : "Dashboard"
      }
      currentPage={currentPage}
      onMenuClick={handleMenuClick}
      user={user}
      onLogout={onLogout}
    >
      {currentPage === "daftar-mapel" ? (
        <DaftarMapel />
      ) : currentPage === "absensi" ? (
        <TidakHadirPenguruskelas />
      ) : currentPage === "jadwal-anda" ? (
        <JadwalPengurus
          user={user}
          currentPage={currentPage}
          onMenuClick={handleMenuClick}
          onLogout={onLogout}
        />
      ) : (
        <>
          <div
            style={{
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          position: "relative",
          paddingBottom: "100px", // Space for characters
        }}
      >
        {/* Header Cards: User Info, Schedule, Total Mapel */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px",
            width: "100%",
          }}
        >
          {/* User Information Card - Dark Blue */}
          <div
            style={{
              background: "#0B2948",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(11, 41, 72, 0.2)",
              border: "1px solid #0B2948",
              minHeight: "120px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {/* Person Icon */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                style={{ filter: "brightness(0) invert(1)" }}
              >
                <path
                  d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                  fill="white"
                />
              </svg>
            </div>

            {/* User Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "16px",
                  color: "#FFFFFF",
                  marginBottom: "4px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {userInfo.name}
              </div>
              <div
                style={{
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.8)",
                }}
              >
                {userInfo.id}
              </div>
            </div>
          </div>

          {/* Card Tanggal & Waktu */}
          <div
            style={{
              background: "#F1F5F9",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
              border: "1px solid #E2E8F0",
              minHeight: "120px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "16px",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "15px",
                  color: "#0F172A",
                  lineHeight: "1.4",
                }}
              >
                {currentDate || "Memuat..."}
              </span>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "18px",
                  color: "#0B2948",
                  whiteSpace: "nowrap",
                }}
              >
                {currentTime || "00:00"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <TimePill label="07:00:00" />
              <span style={{ fontWeight: 700, color: "#64748B" }}>—</span>
              <TimePill label="15:00:00" />
            </div>
          </div>

          {/* Card Total Mapel & Tombol Lihat */}
          <div
            style={{
              background: "#F1F5F9",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
              border: "1px solid #E2E8F0",
              minHeight: "120px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: "15px",
                color: "#0F172A",
                marginBottom: "8px",
              }}
            >
              Total Mata Pelajaran Hari Ini
            </div>
            <div
              style={{
                display: "inline-flex",
                padding: "8px 24px",
                borderRadius: "12px",
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                fontWeight: 800,
                fontSize: "20px",
                color: "#0B2948",
                marginBottom: "12px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              {schedules.length} Mapel
            </div>
            <button
              onClick={() => setIsMapelModalOpen(true)}
              style={{
                background: "#0F52BA", // Blue color
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 20px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#0A3E8F")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#0F52BA")
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Lihat Mapel
            </button>
          </div>
        </div>

        {/* Statistik Kehadiran Header */}
        <div
          style={{
            background: "#0B2948",
            color: "#fff",
            borderRadius: "12px",
            padding: "16px 24px",
            fontWeight: 800,
            fontSize: "18px",
            boxShadow: "0 4px 12px rgba(11, 41, 72, 0.2)",
            width: "fit-content",
          }}
        >
          Statistik Kehadiran
        </div>

        {/* Charts Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "24px",
            width: "100%",
            zIndex: 2,
          }}
        >
          {/* Grafik Tren Bulanan */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
              border: "1px solid #E2E8F0",
            }}
          >
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "18px",
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              Grafik Tren Bulanan
            </h3>
            <MonthlyBarChart data={monthlyTrendData} />
          </div>

          {/* Statistik Minggu Ini */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
              border: "1px solid #E2E8F0",
            }}
          >
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "18px",
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              Statistik Minggu Ini
            </h3>
            <WeeklyDonutChart data={weeklyStats} />
          </div>
        </div>

        {/* Character Illustrations */}
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "200px",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <img src={INO} alt="Ino" style={{ width: "100%", height: "auto" }} />
        </div>
        <div
          style={{
            position: "fixed",
            bottom: 0,
            right: 0,
            width: "200px",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <img src={RASI} alt="Rasi" style={{ width: "100%", height: "auto" }} />
        </div>
      </div>

      {/* Modal Lihat Mapel */}
      <MapelListModal
        isOpen={isMapelModalOpen}
        onClose={() => setIsMapelModalOpen(false)}
        schedules={schedules}
      />
        </>
      )}
    </PengurusKelasLayout>
  );
}

// Sub-components

function TimePill({ label }: { label: string }) {
  return (
    <div
      style={{
        minWidth: "110px",
        padding: "10px 14px",
        borderRadius: "12px",
        border: "1px solid #CBD5E1",
        background: "#fff",
        boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.04)",
        textAlign: "center",
        fontWeight: 800,
        fontSize: "14px",
        color: "#0F172A",
      }}
    >
      {label}
    </div>
  );
}

function MonthlyBarChart({
  data,
}: {
  data: Array<{
    month: string;
    hadir: number;
    izin: number;
    sakit: number;
    alpha: number;
  }>;
}) {
  const maxValue = Math.max(
    ...data.map((item) =>
      Math.max(item.hadir, item.izin, item.sakit, item.alpha)
    )
  );
  const hasData = data.length > 0 && maxValue > 0;

  if (!hasData) {
    return (
      <div
        style={{
          padding: "24px",
          textAlign: "center",
          color: "#64748B",
          fontWeight: 600,
        }}
      >
        Belum ada data
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Y-axis labels */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: "40px",
          width: "30px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontSize: "12px",
          color: "#64748B",
        }}
      >
        <span>60</span>
        <span>40</span>
        <span>20</span>
        <span>0</span>
      </div>

      {/* Chart */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "12px",
          height: "200px",
          marginLeft: "40px",
          marginBottom: "40px",
          paddingTop: "20px",
        }}
      >
        {data.map((item) => (
          <div key={item.month} style={{ flex: 1, textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                gap: "4px",
                height: "160px",
              }}
            >
              <div
                style={{
                  width: "14px",
                  height: `${(item.hadir / maxValue) * 160}px`,
                  borderRadius: "4px 4px 0 0",
                  background: "#10B981",
                }}
              />
              <div
                style={{
                  width: "14px",
                  height: `${(item.izin / maxValue) * 160}px`,
                  borderRadius: "4px 4px 0 0",
                  background: "#F59E0B",
                }}
              />
              <div
                style={{
                  width: "14px",
                  height: `${(item.sakit / maxValue) * 160}px`,
                  borderRadius: "4px 4px 0 0",
                  background: "#3B82F6",
                }}
              />
              <div
                style={{
                  width: "14px",
                  height: `${(item.alpha / maxValue) * 160}px`,
                  borderRadius: "4px 4px 0 0",
                  background: "#EF4444",
                }}
              />
            </div>
            <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#475569" }}>
              {item.month}
            </p>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: "16px",
        }}
      >
        <LegendDot color="#10B981" label="Hadir" />
        <LegendDot color="#F59E0B" label="Izin" />
        <LegendDot color="#3B82F6" label="Sakit" />
        <LegendDot color="#EF4444" label="Alpha" />
      </div>
    </div>
  );
}

function WeeklyDonutChart({
  data,
}: {
  data: { hadir: number; izin: number; sakit: number; alpha: number };
}) {
  const total = data.hadir + data.izin + data.sakit + data.alpha;
  const radius = 70;
  const centerX = 90;
  const centerY = 90;
  let currentAngle = -90;

  const colors = {
    hadir: "#10B981",
    izin: "#F59E0B",
    sakit: "#3B82F6",
    alpha: "#EF4444",
  };

  const segments = [
    { key: "hadir", value: data.hadir, label: "Total Kehadiran" },
    { key: "izin", value: data.izin, label: "Total Izin" },
    { key: "sakit", value: data.sakit, label: "Total Sakit" },
    { key: "alpha", value: data.alpha, label: "Total Alpha" },
  ];

  const createPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      centerX,
      centerY,
      "L",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "Z",
    ].join(" ");
  };

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  if (total <= 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          padding: "24px",
          color: "#64748B",
          fontWeight: 600,
        }}
      >
        <svg width="180" height="180" style={{ display: "block" }}>
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="#F1F5F9"
            stroke="#E2E8F0"
            strokeWidth="2"
          />
          <circle cx={centerX} cy={centerY} r={radius * 0.5} fill="#FFFFFF" />
        </svg>
        Belum ada data
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {/* Donut Chart */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <svg width="180" height="180" style={{ display: "block" }}>
          {segments.map((segment) => {
            const angle = (segment.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            const path = createPath(startAngle, endAngle);
            currentAngle = endAngle;

            return (
              <path
                key={segment.key}
                d={path}
                fill={colors[segment.key as keyof typeof colors]}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            );
          })}
          {/* Inner Circle for Donut Effect */}
          <circle cx={centerX} cy={centerY} r={radius * 0.5} fill="#FFFFFF" />
        </svg>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          minWidth: "150px",
        }}
      >
        {segments.map((segment) => (
          <div
            key={segment.key}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "999px",
                backgroundColor: colors[segment.key as keyof typeof colors],
                display: "inline-block",
              }}
            />
            <span
              style={{ fontSize: "14px", color: "#475569", fontWeight: 500 }}
            >
              {segment.label} {Math.round((segment.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
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

function MapelListModal({
  isOpen,
  onClose,
  schedules,
}: {
  isOpen: boolean;
  onClose: () => void;
  schedules: ScheduleItem[];
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        style={{
          border: "2px solid #0F52BA",
          borderRadius: "16px",
          overflow: "hidden",
          width: "100%",
          maxWidth: "500px",
          background: "white",
        }}
      >
        <div
          style={{
            backgroundColor: "#0B2948",
            color: "white",
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src={openBook}
              alt="Book"
              style={{
                width: "24px",
                height: "24px",
                objectFit: "contain",
                filter: "brightness(0) invert(1)",
              }}
            />
            <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>
              Jadwal Pelajaran Hari Ini
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {schedules.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: "700",
                      color: "#0F172A",
                      fontSize: "15px",
                    }}
                  >
                    {item.mapel}
                  </div>
                  <div style={{ fontSize: "13px", color: "#64748B" }}>
                    {item.guru}
                  </div>
                </div>
                <div
                  style={{
                    fontWeight: "600",
                    color: "#0F52BA",
                    fontSize: "14px",
                    background: "#E0F2FE",
                    padding: "4px 12px",
                    borderRadius: "20px",
                  }}
                >
                  {item.start} - {item.end}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#0B2948",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
}

