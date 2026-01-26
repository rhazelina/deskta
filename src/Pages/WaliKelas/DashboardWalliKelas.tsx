import { useState, useEffect } from "react";
import WalikelasLayout from "../../component/Walikelas/layoutwakel";
import BookIcon from "../../assets/Icon/open-book.png";
import EyeIcon from "../../assets/Icon/Eye.png";
import QRCodeIcon from "../../assets/Icon/qr_code.png";
import { JadwalModal } from "../../component/Shared/Form/Jadwal";
import { MetodeGuru } from "../../component/Shared/Form/MetodeGuru";
import { TidakBisaMengajar } from "../../component/Shared/Form/TidakBisaMengajar";
import { InputAbsenWalikelas } from "./InputAbsenWalikelas";
import { KehadiranSiswaWakel } from "./KehadiranSiswaWakel";

// Icon Components
function CalendarIconSVG() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIconSVG() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// ==================== INTERFACES ====================
interface DashboardWalliKelasProps {
  user: { name: string; role: string };
  onLogout: () => void;
}

type WalikelasPage =
  | "dashboard"
  | "jadwal-anda"
  | "notifikasi"
  | "input-manual"
  | "kehadiran-siswa";

interface ScheduleItem {
  id: string;
  subject: string;
  className: string;
  jurusan?: string;
  jam?: string;
}

const PAGE_TITLES: Record<WalikelasPage, string> = {
  dashboard: "Dashboard",
  "jadwal-anda": "Jadwal Anda",
  notifikasi: "Notifikasi",
  "input-manual": "Input Manual",
  "kehadiran-siswa": "Kehadiran Siswa",
};

const BREAKPOINTS = {
  mobile: 768,
};

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
    gap: isMobile ? 16 : 24,
    padding: isMobile ? "16px" : "24px",
  }),

  topGrid: (isMobile: boolean) => ({
    display: "grid" as const,
    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
    gap: isMobile ? 12 : 16,
    marginBottom: 24,
  }),

  userCard: (isMobile: boolean) => ({
    position: "relative" as const,
    padding: isMobile ? "16px" : "20px",
    background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
    borderRadius: "12px",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
  }),

  decorativeCircle: {
    position: "absolute" as const,
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.1)",
    top: "-40px",
    right: "-40px",
  },

  userIcon: (isMobile: boolean) => ({
    position: "relative" as const,
    zIndex: 1,
    width: isMobile ? "40px" : "48px",
    height: isMobile ? "40px" : "48px",
    borderRadius: "10px",
    background: "rgba(255, 255, 255, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    border: "2px solid rgba(255, 255, 255, 0.3)",
  }),

  dateTimeCard: (isMobile: boolean) => ({
    position: "relative" as const,
    padding: isMobile ? "16px" : "20px",
    background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
    borderRadius: "12px",
    color: "white",
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    boxShadow: "0 4px 12px rgba(124, 58, 237, 0.25)",
  }),

  infoCard: (isMobile: boolean) => ({
    position: "relative" as const,
    padding: isMobile ? "16px" : "20px",
    background: "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
    borderRadius: "12px",
    color: "white",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
    gap: "12px",
    boxShadow: "0 4px 12px rgba(236, 72, 153, 0.25)",
  }),

  infoBadge: (isMobile: boolean) => ({
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "8px",
    padding: isMobile ? "6px 12px" : "8px 14px",
    fontSize: isMobile ? "14px" : "16px",
    fontWeight: 700,
    display: "inline-block",
    width: "fit-content",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  }),

  scheduleCard: (isMobile: boolean) => ({
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "12px" : "16px",
    padding: isMobile ? "14px 16px" : "16px 20px",
    background: "#FFFFFF",
    borderRadius: "12px",
    border: "1px solid #D1D5DB",
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  }),

  bookIconWrapper: (isMobile: boolean) => ({
    width: isMobile ? "40px" : "44px",
    height: isMobile ? "40px" : "44px",
    borderRadius: 10,
    background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
  }),

  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "1px solid #E5E7EB",
  },
};

export default function DashboardWalliKelas({
  user,
  onLogout,
}: DashboardWalliKelasProps) {
  const [currentPage, setCurrentPage] = useState<WalikelasPage>("dashboard");
  const [currentDateStr, setCurrentDateStr] = useState("");
  const [currentTimeStr, setCurrentTimeStr] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
  const [activeModal, setActiveModal] = useState<"schedule" | "metode" | "tidakBisa" | null>(null);

  // Responsive handler
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < BREAKPOINTS.mobile;

  // Real-time Clock
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setCurrentDateStr(now.toLocaleDateString("id-ID", options));
      setCurrentTimeStr(
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

  const handlePilihQR = () => {
    setActiveModal("schedule");
  };

  const handlePilihManual = () => {
    setActiveModal(null);
    setCurrentPage("input-manual");
  };

  const handleTidakBisaMengajar = () => {
    setActiveModal("tidakBisa");
  };

  const handleMulaiAbsen = () => {
    setActiveModal(null);
    setCurrentPage("input-manual");
  };

  const handleSubmitTidakBisaMengajar = (data: {
    alasan: string;
    keterangan?: string;
    foto1?: File;
  }) => {
    console.log("Data tidak bisa mengajar:", data);
    alert("Laporan berhasil dikirim!");
    setActiveModal(null);
  };

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

  return (
    <WalikelasLayout
      pageTitle={PAGE_TITLES[currentPage]}
      currentPage={currentPage}
      onMenuClick={handleMenuClick}
      user={user}
      onLogout={onLogout}
    >
      <div style={styles.mainContainer(isMobile)}>
        {/* Top Grid: User Info, Date/Time, Teaching Stats, Student Stats */}
        <div style={styles.topGrid(isMobile)}>
          {/* 1. User Info Card */}
          <div style={styles.userCard(isMobile)}>
            <div style={styles.decorativeCircle} />
            <div style={styles.userIcon(isMobile)}>
              <svg
                width={isMobile ? "24" : "32"}
                height={isMobile ? "24" : "32"}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, zIndex: 1 }}>
              <span style={{ fontSize: isMobile ? "16px" : "18px", fontWeight: 700, color: "#FFFFFF" }}>
                {user.name}
              </span>
            </div>
          </div>

          {/* 2. Date & Time Card */}
          <div style={styles.dateTimeCard(isMobile)}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ opacity: 0.8 }}>
                <CalendarIconSVG />
              </div>
              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                {currentDateStr || "Memuat..."}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ opacity: 0.8 }}>
                <ClockIconSVG />
              </div>
              <span style={{ fontSize: "20px", fontWeight: "700", letterSpacing: "1px" }}>
                {currentTimeStr || "00:00:00"}
              </span>
            </div>

            <div style={{
              marginTop: "4px",
              paddingTop: "12px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              fontSize: "14px",
              fontWeight: "500",
              opacity: 0.9,
            }}>
              Semester Genap
            </div>
          </div>

          {/* 3. Total Wali Kelas Info Card */}
          <div style={styles.infoCard(isMobile)}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img 
                src={BookIcon} 
                alt="Book" 
                style={{ 
                  width: 20, 
                  height: 20, 
                  opacity: 0.9,
                  filter: "brightness(0) invert(1)"
                }} 
              />
              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                Kelas Asuh
              </span>
            </div>
            <div style={styles.infoBadge(isMobile)}>
              X Mekatronika 1
            </div>
          </div>

          {/* 4. Total Siswa Anda Card */}
          <div style={styles.infoCard(isMobile)}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                  Total Siswa
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={styles.infoBadge(isMobile)}>
                  40
                </div>
                <div style={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background-color 0.2s"
                }}
                onClick={handleEyeClick}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.25)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)"}
                >
                   <img 
                     src={EyeIcon} 
                     alt="View" 
                     style={{ 
                       width: 18, 
                       height: 18,
                       filter: "brightness(0) invert(1)"
                     }} 
                   />
                </div>
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div style={{ marginTop: 24 }}>
            {DUMMY_SCHEDULE.map((item) => (
                <div 
                  key={item.id} 
                  style={{ ...styles.scheduleCard(isMobile), marginBottom: 16 }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 6px 14px rgba(0, 0, 0, 0.15)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.backgroundColor = "#F9FAFB";
                    e.currentTarget.style.borderColor = "#9CA3AF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                    e.currentTarget.style.borderColor = "#D1D5DB";
                  }}
                >
                    <div style={styles.bookIconWrapper(isMobile)}>
                        <img 
                          src={BookIcon} 
                          alt="Mapel" 
                          style={{ 
                            width: isMobile ? "18px" : "20px",
                            height: isMobile ? "18px" : "20px",
                            filter: "brightness(0) invert(1)" 
                          }} 
                        />
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "16px", fontWeight: 700, color: "#111827", marginBottom: 4 }}>
                            {item.subject}
                        </div>
                        <div style={{ fontSize: "14px", color: "#4B5563", fontWeight: 500 }}>
                            {item.className}
                        </div>
                    </div>

                    {/* Action Icon (QR Only) */}
                    <div 
                      onClick={(e) => handleQRClick(e, item)}
                      style={styles.actionButton}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#E5E7EB";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#F3F4F6";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                        <img src={QRCodeIcon} alt="Scan" style={{ width: 18, height: 18 }} />
                    </div>
                </div>
            ))}
        </div>
        
        {/* Modals */}
        {activeModal === "metode" && (
          <MetodeGuru
            isOpen={true}
            onClose={() => setActiveModal(null)}
            onPilihQR={handlePilihQR}
            onPilihManual={handlePilihManual}
            onTidakBisaMengajar={handleTidakBisaMengajar}
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
            onTidakBisaMengajar={handleTidakBisaMengajar}
          />
        )}

        {activeModal === "tidakBisa" && (
          <TidakBisaMengajar
            isOpen={true}
            onClose={() => setActiveModal(null)}
            data={
              selectedSchedule
                ? {
                    subject: selectedSchedule.subject,
                    className: selectedSchedule.className,
                    jurusan: selectedSchedule.jurusan,
                    jam: selectedSchedule.jam,
                  }
                : { subject: "", className: "" }
            }
            onSubmit={handleSubmitTidakBisaMengajar}
            onPilihMetode={() => setActiveModal("metode")}
          />
        )}

      </div>
    </WalikelasLayout>
  );
}
