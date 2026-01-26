import DashboardIcon from "../assets/Icon/home.png";
import JurusanIcon from "../assets/Icon/Chalkboard.png";
import KelasIcon from "../assets/Icon/ChalkboardTeacher.png";
import SiswaIcon from "../assets/Icon/Student.png";
import GuruIcon from "../assets/Icon/GraduationCap.png";
import NotifikasiIcon from "../assets/Icon/Bell.png";
import LogoutIcon from "../assets/Icon/Log out.png";
import ShiftIcon from "../assets/Icon/Shift.png";
import CalendarIcon from "../assets/Icon/calender.png";

interface SidebarProps {
  currentPage: string;
  onMenuClick: (page: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
  userRole?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

// Menu untuk Admin
const MENU_ITEMS_ADMIN: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
  { id: "jurusan", label: "Data Jurusan", icon: JurusanIcon },
  { id: "kelas", label: "Data Kelas", icon: KelasIcon },
  { id: "siswa", label: "Data Siswa", icon: SiswaIcon },
  { id: "guru", label: "Data Guru", icon: GuruIcon },
];

// Menu untuk Guru
const MENU_ITEMS_GURU: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
  { id: "presensi", label: "Presensi", icon: CalendarIcon },
  { id: "kehadiran", label: "Kehadiran Siswa", icon: SiswaIcon },
];

// Waka staff
const MENU_ITEMS_WAKA: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
  { id: "jadwal-kelas", label: "Jadwal Kelas", icon: KelasIcon },
  { id: "jadwal-guru", label: "Jadwal Guru", icon: GuruIcon },
  { id: "kehadiran-siswa", label: "Kehadiran Siswa", icon: SiswaIcon },
  { id: "kehadiran-guru", label: "Kehadiran Guru", icon: GuruIcon },
  // { id: "Guru-Pengganti", label: "Guru Pengganti", icon: ShiftIcon },
  // { id: "Notifikasi", label: "Notifikasi", icon: NotifikasiIcon },
];

const MENU_ITEMS_SISWA: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
  { id: "jadwal-anda", label: "Jadwal Anda", icon: CalendarIcon },
  { id: "absensi", label: "Daftar Ketidakhadiran", icon: SiswaIcon },
];

const MENU_ITEMS_PENGURUS_KELAS: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
  { id: "daftar-mapel", label: "Daftar Mapel", icon: JurusanIcon },
  { id: "absensi", label: "Daftar Ketidakhadiran", icon: SiswaIcon },
  { id: "laporan", label: "Laporan Kelas", icon: KelasIcon },
];

export default function Sidebar({
  currentPage,
  onMenuClick,
  onLogout,
  isOpen,
  onToggle,
  userRole = "admin",
}: SidebarProps) {
  let MENU_ITEMS = MENU_ITEMS_ADMIN;
  let roleLabel = "Admin";

  // select menu berdasarkan role
  if (userRole === "guru") {
    MENU_ITEMS = MENU_ITEMS_GURU;
    roleLabel = "Guru";
  } else if (userRole === "waka") {
    MENU_ITEMS = MENU_ITEMS_WAKA;
    roleLabel = "Waka Staff";
  } else if (userRole === "siswa") {
    MENU_ITEMS = MENU_ITEMS_SISWA;
    roleLabel = "Siswa";
  } else if (userRole === "pengurus_kelas") {
    MENU_ITEMS = MENU_ITEMS_PENGURUS_KELAS;
    roleLabel = "Pengurus Kelas";
  }

  return (
    <aside
      style={{
        width: isOpen ? "260px" : "80px",
        backgroundColor: "#111827",
        color: "white",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        transition: "width 0.3s ease-in-out",
        overflow: "hidden",
        boxShadow: "2px 0 10px rgba(0, 0, 0, 0.2)",
        position: "relative",
        zIndex: 50,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #374151",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#1F2937",
          minHeight: "64px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={onToggle}
            style={{
              backgroundColor: "transparent",
              border: "1px solid #4B5563",
              color: "white",
              cursor: "pointer",
              padding: "6px 8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "6px",
              fontSize: "16px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#374151";
              e.currentTarget.style.borderColor = "#6B7280";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "#4B5563";
            }}
            title="Toggle Sidebar"
          >
            {isOpen ? "◀" : "▶"}
          </button>
          
          {isOpen && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "20px", fontWeight: "bold", color: "#F3F4F6" }}>
                {roleLabel}
              </span>
              {/* <span style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>
                Sistem Kontrol
              </span> */}
            </div>
          )}
        </div>
        
        {!isOpen && (
          <div style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: "bold" }}>
            {roleLabel.charAt(0)}
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav
        style={{
          flex: 1,
          padding: "20px 12px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onMenuClick(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor: currentPage === item.id ? "#2563EB" : "transparent",
              color: currentPage === item.id ? "white" : "#D1D5DB",
              fontSize: "15px",
              fontWeight: "500",
              textAlign: "left",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              if (currentPage !== item.id) {
                e.currentTarget.style.backgroundColor = "#374151";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== item.id) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
            title={!isOpen ? item.label : undefined}
          >
            <div style={{
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <img
                src={item.icon}
                alt={item.label}
                style={{
                  width: "20px",
                  height: "20px",
                  filter: currentPage === item.id 
                    ? "brightness(0) invert(1)" 
                    : "brightness(0.7) invert(0.8)",
                  transition: "filter 0.2s",
                }}
              />
            </div>
            
            {isOpen && (
              <span
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  flex: 1,
                  textAlign: "left",
                }}
              >
                {item.label}
              </span>
            )}
            
            {currentPage === item.id && isOpen && (
              <div style={{
                width: "4px",
                height: "20px",
                backgroundColor: "#60A5FA",
                borderRadius: "2px",
                marginLeft: "4px",
              }} />
            )}
          </button>
        ))}
      </nav>

      {/* Footer with Logout */}
      <div
        style={{
          padding: "16px 12px",
          borderTop: "1px solid #374151",
          backgroundColor: "#1F2937",
          flexShrink: 0,
        }}
      >
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 16px",
            backgroundColor: "#DC2626",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "600",
            transition: "all 0.2s ease",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#B91C1C";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(220, 38, 38, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#DC2626";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
          title={!isOpen ? "Keluar" : undefined}
        >
          <div style={{
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <img
              src={LogoutIcon}
              alt="Logout"
              style={{
                width: "20px",
                height: "20px",
                filter: "brightness(0) invert(1)",
              }}
            />
          </div>
          
          {isOpen && (
            <>
              <span style={{ flex: 1, textAlign: "left" }}>Keluar</span>
              <span style={{ fontSize: "12px", opacity: 0.8 }}>⎋</span>
            </>
          )}
        </button>
        
        {/* {isOpen && (
          <div style={{
            fontSize: "11px",
            color: "#9CA3AF",
            textAlign: "center",
            marginTop: "12px",
            padding: "4px",
            borderTop: "1px solid #374151",
          }}>
            SMKN 2 Singosari
          </div> */}
        {/* )} */}
      </div>
    </aside>
  );
}

// import DashboardIcon from "../assets/Icon/home.png";
// import JurusanIcon from "../assets/Icon/Chalkboard.png";
// import KelasIcon from "../assets/Icon/ChalkboardTeacher.png";
// import SiswaIcon from "../assets/Icon/Student.png";
// import GuruIcon from "../assets/Icon/GraduationCap.png";
// import NotifikasiIcon from "../assets/Icon/Bell.png";
// // import PengaturanIcon from "../assets/Icon/settings.png";
// import LogoutIcon from "../assets/Icon/Log out.png";
// import ShiftIcon from "../assets/Icon/Shift.png";
// import CalendarIcon from "../assets/Icon/calender.png";

// interface SidebarProps {
//   currentPage: string;
//   onMenuClick: (page: string) => void;
//   onLogout: () => void;
//   isOpen: boolean;
//   onToggle: () => void;
//   userRole?: string;
// }

// interface MenuItem {
//   id: string;
//   label: string;
//   icon: string;
// }

// // Menu untuk Admin
// const MENU_ITEMS_ADMIN: MenuItem[] = [
//   { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
//   { id: "jurusan", label: "Data Jurusan", icon: JurusanIcon },
//   { id: "kelas", label: "Data Kelas", icon: KelasIcon },
//   { id: "siswa", label: "Data Siswa", icon: SiswaIcon },
//   { id: "guru", label: "Data Guru", icon: GuruIcon },
//   // { id: "notifikasi", label: "Notifikasi", icon: NotifikasiIcon },
//   // { id: "pengaturan", label: "Pengaturan", icon: PengaturanIcon },
// ];

// // Menu untuk Guru
// const MENU_ITEMS_GURU: MenuItem[] = [
//   { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
//   // { id: "jadwal", label: "Jadwal Mengajar", icon: KelasIcon },
//   { id: "presensi", label: "Presensi", icon: CalendarIcon },
//   // { id: "dispensasi", label: "Dispensasi & Izin", icon: JurusanIcon },
//   { id: "kehadiran", label: "Kehadiran Siswa", icon: SiswaIcon },
//   // { id: "pengaturan", label: "Pengaturan", icon: PengaturanIcon },
// ];

// // waka staff
// const MENU_ITEMS_WAKA: MenuItem[] = [
//   { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
//   { id: "jadwal-kelas", label: "Jadwal Kelas", icon: KelasIcon },
//   { id: "jadwal-guru", label: "Jadwal Guru", icon: GuruIcon },
//   { id: "kehadiran-siswa", label: "Kehadiran Siswa", icon: SiswaIcon },
//   { id: "kehadiran-guru", label: "Kehadiran Guru", icon: GuruIcon },
//   { id: "Guru-Pengganti", label: "Guru-Pengganti", icon: ShiftIcon },
//   { id: "Notifikasi", label: "Notifikasi", icon: NotifikasiIcon },
 
// ];

// const MENU_ITEMS_SISWA: MenuItem[] = [
//   { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
//   { id: "jadwal-anda", label: "Jadwal Anda", icon: CalendarIcon },
//   { id: "absensi", label: "Daftar Ketidakhadiran", icon: SiswaIcon },
//   // { id: "notidikasi", label: "Notifikasi", icon: NotifikasiIcon },
// ];

// const MENU_ITEMS_PENGURUS_KELAS: MenuItem[] = [
//   { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
//   { id: "daftar-mapel", label: "Daftar Mapel", icon: JurusanIcon },
//   { id: "absensi", label: "Daftar Ketidakhadiran", icon: SiswaIcon },
//   { id: "laporan", label: "Laporan Kelas", icon: KelasIcon },
// ];

// export default function Sidebar({
//   currentPage,
//   onMenuClick,
//   onLogout,
//   isOpen,
//   onToggle,
//   userRole = "admin", // Default admin
// }: SidebarProps) {
//   // select menu berdasarkan role

//   let MENU_ITEMS = MENU_ITEMS_ADMIN;
//   let roleLabel = "Admin";

//   if (userRole === "guru") {
//     MENU_ITEMS = MENU_ITEMS_GURU;
//     roleLabel = "Guru";
//   } else if (userRole === "waka") {
//     MENU_ITEMS = MENU_ITEMS_WAKA;
//     roleLabel = "Waka Staff";
//   } else if (userRole === "siswa") {
//     MENU_ITEMS = MENU_ITEMS_SISWA;
//     roleLabel = "Siswa";
//   } else if (userRole === "pengurus_kelas") {
//     MENU_ITEMS = MENU_ITEMS_PENGURUS_KELAS;
//     roleLabel = "Pengurus Kelas";
//   }

//   return (
//     <aside
//       style={{
//         width: isOpen ? "256px" : "80px",
//         backgroundColor: "#1F2937",
//         color: "white",
//         display: "flex",
//         flexDirection: "column",
//         height: "100vh",
//         transition: "width 0.3s ease-in-out",
//         overflow: "hidden",
//       }}
//     >
//       {/* Logo */}
//       <div
//         style={{
//           padding: "8px 12px",
//           borderBottom: "none",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "flex-start",
//           gap: "8px",
//           flexShrink: 0,
//           backgroundColor: "#001f3e",
//           color: "white",
//           height: "48px",
//           minHeight: "48px",
//         }}
//       >
//         {/* Hamburger Button */}
//         <button
//           onClick={onToggle}
//           style={{
//             fontSize: "18px",
//             backgroundColor: "transparent",
//             border: "1.5px solid white",
//             color: "white",
//             cursor: "pointer",
//             padding: "2px 6px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             borderRadius: "4px",
//           }}
//           title="Toggle Sidebar"
//         >
//           ☰
//         </button>

//         {/* Role Label */}
//         {isOpen && (
//           <span style={{ fontSize: "18px", fontWeight: "bold", flex: 1 }}>
//             {roleLabel}
//           </span>
//         )}
//       </div>

//       {/* Menu Items */}
//       <nav
//         style={{
//           flex: 1,
//           padding: "12px",
//           overflowY: "auto",
//           display: "flex",
//           flexDirection: "column",
//           gap: "8px",
//         }}
//       >
//         {MENU_ITEMS.map((item) => (
//           <button
//             key={item.id}
//             onClick={() => onMenuClick(item.id)}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "12px",
//               padding: "12px 16px",
//               borderRadius: "8px",
//               border: "none",
//               cursor: "pointer",
//               transition: "all 0.2s ease",
//               backgroundColor:
//                 currentPage === item.id ? "#2563EB" : "transparent",
//               color: currentPage === item.id ? "white" : "#D1D5DB",
//               fontSize: "14px",
//               fontWeight: "500",
//               textAlign: "left",
//             }}
//             onMouseEnter={(e) => {
//               if (currentPage !== item.id) {
//                 (e.currentTarget as HTMLButtonElement).style.backgroundColor =
//                   "#374151";
//               }
//             }}
//             onMouseLeave={(e) => {
//               if (currentPage !== item.id) {
//                 (e.currentTarget as HTMLButtonElement).style.backgroundColor =
//                   "transparent";
//               }
//             }}
//             title={!isOpen ? item.label : undefined}
//           >
//             <img
//               src={item.icon}
//               alt={item.label}
//               style={{
//                 width: "20px",
//                 height: "20px",
//                 flexShrink: 0,
//                 filter:
//                   currentPage === item.id
//                     ? "brightness(1) invert(0)"
//                     : "brightness(0.8) invert(1)",
//               }}
//             />
//             {isOpen && (
//               <span
//                 style={{
//                   whiteSpace: "nowrap",
//                   overflow: "hidden",
//                   textOverflow: "ellipsis",
//                 }}
//               >
//                 {item.label}
//               </span>
//             )}
//           </button>
//         ))}
//       </nav>

//       {/* Logout */}
//       <div
//         style={{
//           padding: "12px",
//           borderTop: "1px solid #374151",
//           flexShrink: 0,
//         }}
//       >
//         <button
//           onClick={onLogout}
//           style={{
//             width: "100%",
//             display: "flex",
//             alignItems: "center",
//             gap: "12px",
//             padding: "12px 16px",
//             backgroundColor: "#DC2626",
//             color: "white",
//             border: "none",
//             borderRadius: "8px",
//             cursor: "pointer",
//             fontSize: "14px",
//             fontWeight: "600",
//             transition: "background-color 0.2s ease",
//           }}
//           onMouseEnter={(e) => {
//             (e.currentTarget as HTMLButtonElement).style.backgroundColor =
//               "#B91C1C";
//           }}
//           onMouseLeave={(e) => {
//             (e.currentTarget as HTMLButtonElement).style.backgroundColor =
//               "#DC2626";
//           }}
//           title={!isOpen ? "Logout" : undefined}
//         >
//           <img
//             src={LogoutIcon}
//             alt="Logout"
//             style={{
//               width: "20px",
//               height: "20px",
//               flexShrink: 0,
//               backgroundColor: "transparent",
//               filter: "brightness(1) invert(0)",
//             }}
//           />
//           {isOpen && <span>Keluar</span>}
//         </button>
//       </div>
//     </aside>
//   );
// }
