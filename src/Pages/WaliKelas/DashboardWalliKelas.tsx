import { useState, useEffect } from "react";
import { BookOpen, Users, Eye, QrCode } from "lucide-react";
import WalikelasLayout from "../../component/Walikelas/layoutwakel";
import { JadwalModal } from "../../component/Shared/Form/Jadwal";
import { MetodeGuru } from "../../component/Shared/Form/MetodeGuru";
import { InputAbsenWalikelas } from "./InputAbsenWalikelas";
import { KehadiranSiswaWakel } from "./KehadiranSiswaWakel";
import JadwalPengurus from "./JadwalPengurus";
import { RekapKehadiranSiswa } from "./RekapKehadiranSiswa";

// ==================== INTERFACES ====================
interface DashboardWalliKelasProps {
  user: { name: string; role: string };
  onLogout: () => void;
}

type WalikelasPage =
  | "Beranda"
  | "jadwal-anda"
  | "notifikasi"
  | "input-manual"
  | "kehadiran-siswa"
  | "jadwal-pengurus"
  | "rekap-kehadiran-siswa";

interface ScheduleItem {
  id: string;
  subject: string;
  className: string;
  jurusan?: string;
  jam?: string;
}

const PAGE_TITLES: Record<WalikelasPage, string> = {
  Beranda: "Beranda",
  "jadwal-anda": "Jadwal Anda",
  notifikasi: "Notifikasi",
  "input-manual": "Input Manual",
  "kehadiran-siswa": "Kehadiran Siswa",
  "jadwal-pengurus": "Jadwal Kelas",
  "rekap-kehadiran-siswa": "Rekap Kehadiran Siswa",
};

const BREAKPOINTS = {
  mobile: 768,
};

// dummy schedule
const DUMMY_SCHEDULE: ScheduleItem[] = [
  {
    id: "1",
    subject: "Matematika",
    className: "X Mekatronika 1",
    jurusan: "Mekatronika",
    jam: "08:00 - 09:00",
  },
  {
    id: "2",
    subject: "Bahasa Indonesia",
    className: "X Mekatronika 2",
    jurusan: "Mekatronika",
    jam: "09:00 - 10:00",
  },
  {
    id: "3",
    subject: "Fisika",
    className: "X Elektronika 1",
    jurusan: "Elektronika",
    jam: "10:00 - 11:00",
  },
];

const styles = {
  mainContainer: (isMobile: boolean) => ({
    position: "relative" as const,
    zIndex: 1,
    display: "flex",
    flexDirection: "column" as const,
    gap: isMobile ? 20 : 28,
    padding: isMobile ? "16px" : "28px",
    backgroundColor: "#F9FAFB",
    minHeight: "100vh",
  }),

  // ===== BAGIAN ATAS BARU =====
  topInfoCard: (isMobile: boolean) => ({
    background: "white",
    // color: "black",
    borderRadius: "12px",
    padding: isMobile ? "16px 20px" : "20px 24px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    border: "1px solid #E5E7EB",
  }),

  iconContainer: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    background: "#06254D",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  textContainer: {
    flex: 1,
    textAlign: "left" as const,
  },

  titleText: {
    color: "#06254D",
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "4px",
  },

  subtitleText: {
    color: "#6B7280",
    fontSize: "14px",
    fontWeight: 500,
  },

  // ===== CARD UNTUK SEMUA (KONSISTEN WARNA #06254D) =====
  navyCard: (isMobile: boolean) => ({
    background: "#06254D",
    borderRadius: "14px",
    padding: isMobile ? "16px" : "20px",
    color: "white",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
    boxShadow: "0 4px 12px rgba(6, 37, 77, 0.3)",
  }),

  // Card untuk tanggal & waktu (spesifik)
  dateTimeCard: (isMobile: boolean) => ({
    background: "#06254D",
    borderRadius: "14px",
    padding: isMobile ? "16px" : "20px",
    color: "#fff",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    boxShadow: "0 4px 12px rgba(6, 37, 77, 0.3)",
  }),

  dateTimeRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  dateTimeText: {
    fontSize: "14px",
    opacity: 0.9,
  },

  // Card untuk statistik
  statCard: (isMobile: boolean) => ({
    background: "#06254D",
    borderRadius: "14px",
    padding: isMobile ? "16px" : "20px",
    color: "white",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
    gap: "14px",
    boxShadow: "0 4px 12px rgba(6, 37, 77, 0.3)",
  }),

  statHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  statIcon: {
    width: "20px",
    height: "20px",
    color: "rgba(255,255,255,0.95)",
  },

  statLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "rgba(255,255,255,0.95)",
  },

  statBadge: (isMobile: boolean) => ({
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: "10px",
    padding: isMobile ? "8px 14px" : "10px 16px",
    fontSize: isMobile ? "15px" : "17px",
    fontWeight: 700,
    display: "inline-block",
    width: "fit-content",
    border: "1px solid rgba(255, 255, 255, 0.25)",
  }),

  statBadgeSmall: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: "10px",
    padding: "8px 12px",
    fontSize: "14px",
    fontWeight: 700,
    display: "inline-block",
    width: "fit-content",
    border: "1px solid rgba(255, 255, 255, 0.25)",
  },

  // Style untuk top grid
  topGrid: (isMobile: boolean) => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
    gap: isMobile ? "12px" : "16px",
    marginBottom: "8px",
  }),

  sectionTitle: (isMobile: boolean) => ({
    fontSize: isMobile ? "18px" : "20px",
    fontWeight: 700,
    color: "#06254D",
    marginBottom: "16px",
    textAlign: "left" as const,
  }),

  // ===== CARD JADWAL (KONSISTEN WARNA #06254D) =====
  scheduleCard: (isMobile: boolean) => ({
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "12px" : "16px",
    padding: isMobile ? "14px 16px" : "18px 22px",
    background: "#06254D",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(6, 37, 77, 0.3)",
  }),

  scheduleIconWrapper: (isMobile: boolean) => ({
    width: isMobile ? "44px" : "48px",
    height: isMobile ? "44px" : "48px",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    border: "1px solid rgba(255, 255, 255, 0.25)",
  }),

  scheduleContent: {
    flex: 1,
    textAlign: "left" as const,
  },

  scheduleSubject: {
    fontSize: "16px",
    fontWeight: 700,
    color: "white",
    marginBottom: "4px",
  },

  scheduleDetail: {
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: 500,
  },

  actionButton: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s",
    border: "1px solid rgba(255, 255, 255, 0.25)",
  },

  actionIcon: {
    color: "white",
  },

  eyeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: "10px",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "1px solid rgba(255, 255, 255, 0.25)",
  },

  // Container untuk aksi di card jadwal
  scheduleActions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
};

export default function DashboardWalliKelas({
  user,
  onLogout,
}: DashboardWalliKelasProps) {
  const [currentPage, setCurrentPage] = useState<WalikelasPage>("Beranda");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
  const [activeModal, setActiveModal] = useState<"schedule" | "metode" | null>(null);

  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  // Responsive handler
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < BREAKPOINTS.mobile;

  /* ================= DATE & TIME ================= */
  const updateDateTime = () => {
    const now = new Date();

    setCurrentDate(
      now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );

    setCurrentTime(
      now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
  };

  useEffect(() => {
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMenuClick = (page: string) => {
    setCurrentPage(page as WalikelasPage);
  };

  const handleEyeClick = () => {
    setCurrentPage("kehadiran-siswa");
  };

  // ========== MODAL HANDLERS ==========
  const handleQRClick = (e: React.MouseEvent, schedule: ScheduleItem) => {
    e.stopPropagation();
    setSelectedSchedule(schedule);
    setActiveModal("metode");
  };

  // Handler untuk klik icon mata di card jadwal - langsung ke JadwalPengurus
  const handleEyeScheduleClick = (e: React.MouseEvent, _schedule: ScheduleItem) => {
    e.stopPropagation();
    // Langsung navigasi ke halaman JadwalPengurus
    setCurrentPage("jadwal-pengurus");
  };

  const handlePilihQR = () => {
    setActiveModal("schedule");
  };

  const handlePilihManual = () => {
    setActiveModal(null);
    setCurrentPage("input-manual");
  };

  const handleMulaiAbsen = () => {
    setActiveModal(null);
    setCurrentPage("input-manual");
  };

  // ========== RENDER HALAMAN BERDASARKAN CURRENT PAGE ==========
  if (currentPage === "input-manual") {
    return (
      <InputAbsenWalikelas
        user={user}
        onLogout={onLogout}
        currentPage={currentPage}
        onMenuClick={handleMenuClick}
      />
    );
  }

  if (currentPage === "kehadiran-siswa") {
    return (
      <KehadiranSiswaWakel
        user={user}
        onLogout={onLogout}
        currentPage={currentPage}
        onMenuClick={handleMenuClick}
      />
    );
  }

  // Jika currentPage adalah "jadwal-pengurus", render komponen JadwalPengurus
  if (currentPage === "jadwal-pengurus") {
    return (
      <JadwalPengurus
        user={{ name: user.name, phone: "1234567890" }}
        currentPage="jadwal-pengurus"
        onMenuClick={handleMenuClick}
        onLogout={onLogout}
      />
    );
  }

  if (currentPage === "rekap-kehadiran-siswa") {
    return (
      <RekapKehadiranSiswa
        user={user}
        onLogout={onLogout}
        currentPage={currentPage}
        onMenuClick={handleMenuClick}
      />
    );
  }

  return (
    <WalikelasLayout
      pageTitle={PAGE_TITLES[currentPage]}
      currentPage={currentPage}
      onMenuClick={handleMenuClick}
      user={user}
      onLogout={onLogout}
    >
      <div style={styles.mainContainer(isMobile)}>
        {/* ===== BAGIAN ATAS BARU (Background Putih, Teks Rata Kiri) ===== */}
        <div style={styles.topInfoCard(isMobile)}>
          <div style={styles.iconContainer}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 21H21M5 21V7L13 2L21 7V21M5 21H9M21 21H17M9 21V13H15V21M9 21H15"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div style={styles.textContainer}>
            <div style={styles.titleText}>
              Selamat Datang di Beranda, {user.name}
            </div>
            <div style={styles.subtitleText}>
              Kelola kelas Anda, pantau kehadiran siswa, dan input jadwal mengajar dengan mudah
            </div>
          </div>
        </div>

        {/* ===== TOP GRID (4 Column Layout) - SEMUA CARD WARNA NAVY ===== */}
        <div style={styles.topGrid(isMobile)}>
          {/* 1. Date & Time Card */}
          <div style={styles.dateTimeCard(isMobile)}>
            <div style={styles.dateTimeRow}>
              📅 <span style={styles.dateTimeText}>{currentDate || "Memuat..."}</span>
            </div>
            <div style={styles.dateTimeRow}>
              ⏰ <span style={styles.dateTimeText}>{currentTime || "00:00:00"}</span>
            </div>
            <div style={styles.dateTimeRow}>
              🎓 <span style={styles.dateTimeText}>Semester Genap</span>
            </div>
          </div>

          {/* 2. Wali Kelas Card */}
          <div style={styles.statCard(isMobile)}>
            <div style={styles.statHeader}>
              <BookOpen size={20} style={styles.statIcon} />
              <span style={styles.statLabel}>Wali Kelas</span>
            </div>
            <div style={styles.statBadge(isMobile)}>
              X Mekatronika 1
            </div>
          </div>

          {/* 3. Total Siswa Card */}
          <div style={styles.statCard(isMobile)}>
            <div style={styles.statHeader}>
              <Users size={20} style={styles.statIcon} />
              <span style={styles.statLabel}>Total Siswa</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between' }}>
              <div style={styles.statBadge(isMobile)}>
                40
              </div>
              <div
                style={styles.eyeButton}
                onClick={handleEyeClick}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.25)";
                  e.currentTarget.style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <Eye size={20} color="white" strokeWidth={2} />
              </div>
            </div>
          </div>
        </div>

        {/* ===== JADWAL KELAS - SEMUA CARD WARNA NAVY ===== */}
        <div>
          <h3 style={styles.sectionTitle(isMobile)}>Jadwal Kelas Anda</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {DUMMY_SCHEDULE.map((item) => (
              <div
                key={item.id}
                style={styles.scheduleCard(isMobile)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(6, 37, 77, 0.4)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.backgroundColor = "#0A2E5C";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(6, 37, 77, 0.3)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.backgroundColor = "#06254D";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                }}
              >
                <div style={styles.scheduleIconWrapper(isMobile)}>
                  <BookOpen size={isMobile ? 20 : 24} color="white" strokeWidth={2} />
                </div>

                <div style={styles.scheduleContent}>
                  <div style={styles.scheduleSubject}>
                    {item.subject}
                  </div>
                  <div style={styles.scheduleDetail}>
                    {item.className} • {item.jam}
                  </div>
                </div>

                {/* Action Icons (Mata dan QR) */}
                <div style={styles.scheduleActions}>
                  {/* Icon Mata - untuk melihat jadwal */}
                  <div
                    onClick={(e) => handleEyeScheduleClick(e, item)}
                    style={styles.actionButton}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.25)";
                      e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                    title="Lihat Jadwal Kelas"
                  >
                    <Eye size={20} color="white" strokeWidth={2} />
                  </div>

                  {/* Icon QR - untuk absensi */}
                  <div
                    onClick={(e) => handleQRClick(e, item)}
                    style={styles.actionButton}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.25)";
                      e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                    title="Absensi Kelas"
                  >
                    <QrCode size={20} color="white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modals */}
        {activeModal === "metode" && (
          <MetodeGuru
            isOpen={true}
            onClose={() => setActiveModal(null)}
            onPilihQR={handlePilihQR}
            onPilihManual={handlePilihManual}
          />
        )}

        {activeModal === "schedule" && (
          <JadwalModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            data={
              selectedSchedule
                ? {
                  subject: selectedSchedule.subject,
                  className: selectedSchedule.className,
                  jurusan: selectedSchedule.jurusan,
                  jam: selectedSchedule.jam,
                  statusGuru: "Hadir",
                }
                : { subject: "", className: "" }
            }
            onMulaiAbsen={handleMulaiAbsen}
          />
        )}
      </div>
    </WalikelasLayout>
  );
}