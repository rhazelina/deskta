import { type ReactNode, useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from '../Sidebar';
import AWANKIRI from '../../assets/Icon/AWANKIRI.png';
import AwanBawahkanan from '../../assets/Icon/AwanBawahkanan.png';
import { useLocalLenis } from '../Shared/SmoothScroll';

interface WalikelasLayoutProps {
  children: ReactNode;
  pageTitle: string;
  currentPage: string;
  onMenuClick: (page: string) => void;
  user: {
    name: string;
    role: string;
  };
  onLogout: () => void;
}

export default function WalikelasLayout({
  children,
  pageTitle,
  currentPage,
  onMenuClick,
  user,
  onLogout,
}: WalikelasLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('walikelasSidebarOpen');
    return saved ? saved === 'true' : true;
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useLocalLenis(scrollContainerRef);

  useEffect(() => {
    localStorage.setItem('walikelasSidebarOpen', sidebarOpen.toString());
  }, [sidebarOpen]);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      {/* BACKGROUND LAYER - Simple untuk walikelas */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <img
          src={AWANKIRI}
          alt="Awan Kiri Atas"
          style={{ position: 'absolute', top: 0, left: 0, width: 215, height: 'auto' }}
        />
        <img
          src={AwanBawahkanan}
          alt="Awan Kanan Bawah"
          style={{ position: 'absolute', bottom: 20, right: 20, width: 'auto', height: 'auto' }}
        />
      </div>

      {/* Sidebar */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Sidebar
          currentPage={currentPage}
          onMenuClick={onMenuClick}
          onLogout={onLogout}
          isOpen={sidebarOpen}
          onToggle={handleToggleSidebar}
          userRole="walikelas"
        />
      </div>

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', width: '100%' }}>
        {/* Header */}
        {/* Header */}
        <header
          style={{
            height: "72px",
            minHeight: "72px",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            boxShadow: "0 2px 12px rgba(0, 31, 62, 0.08)",
            borderBottom: "1px solid #E5E7EB",
            zIndex: 5,
            flexShrink: 0,
          }}
        >
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#001F3E",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "28px",
                  backgroundColor: "#2563EB",
                  borderRadius: "2px",
                }}
              />
              {pageTitle}
            </h1>
            {pageTitle === "Dashboard" && (
              <p style={{ margin: "4px 0 0 16px", fontSize: "14px", color: "#6B7280" }}>
                Selamat bekerja, {user.name}!
              </p>
            )}
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexShrink: 0
          }}>
            <div style={{
              textAlign: "right",
              paddingRight: "16px",
              borderRight: "1px solid #E5E7EB"
            }}>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#001F3E" }}>
                {user.name}
              </div>
              <div style={{ fontSize: "12px", color: "#6B7280" }}>
                Wali Kelas
              </div>
            </div>
            <div style={{
              width: "48px",
              height: "48px",
              backgroundColor: "#3B82F6",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "20px",
              fontWeight: "bold",
              boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)"
            }}>
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Content */}
        <main
          ref={scrollContainerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ maxWidth: '100%', width: '100%' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}