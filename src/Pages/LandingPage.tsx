import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoSchool from '../assets/Icon/logo smk.png';
import Inorasi from '../assets/Icon/INORASI2.png';
import HalamanUtama from '../assets/Icon/HalamanUtama.png';

interface LandingPageProps {
  onRoleSelect: (role: string) => void;
}

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'guru', label: 'Guru' },
  { value: 'siswa', label: 'Siswa' },
  { value: 'pengurus_kelas', label: 'Pengurus Kelas' },
  { value: 'waka', label: 'Waka Staff' },
  { value: 'wakel', label: 'Wali Kelas' },
];

export default function LandingPage({ onRoleSelect }: LandingPageProps) {
  const [selectedRole, setSelectedRole] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Tidak perlu mengatur overflow di body karena dropdown akan scroll internal
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
      navigate('/login');
    }
  };

  const selectedRoleLabel =
    selectedRole
      ? ROLES.find(role => role.value === selectedRole)?.label
      : 'Masuk sebagai';

  return (
    <>
      {/* BACKGROUND FIXED */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${HalamanUtama})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* CONTENT */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        {/* Logo SMK */}
        <img
          src={LogoSchool}
          alt="Logo SMK"
          style={{
            position: 'absolute',
            top: '20px',
            right: '40px',
            width: '90px',
            height: 'auto',
            zIndex: 2,
          }}
        />

        <div
          style={{
            width: '100%',
            maxWidth: '560px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* JUDUL */}
          <h1
            style={{
              fontSize: 'clamp(35px, 4vw, 40px)',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '2px',
              margin: 0,
              textShadow: '0 3px 8px rgba(0,0,0,0.3)',
            }}
          >
            PRESENSI PEMBELAJARAN DIGITAL
          </h1>

          <p
            style={{
              fontSize: 'clamp(16px, 3vw, 24px)',
              fontWeight: 700,
              color: '#ffffff',
              margin: '8px 0 12px',
              letterSpacing: '1px',
            }}
          >
            SMKN 2 SINGOSARI
          </p>

          {/* LOGO INORASI */}
          <img
            src={Inorasi}
            alt="Inorasi"
            style={{
              width: '100%',
              maxWidth: '400px',
              height: 'auto',
              marginBottom: '32px',
            }}
          />

          {/* FORM */}
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <div ref={dropdownRef} style={{ marginBottom: '24px', position: 'relative' }}>
              <button
                ref={buttonRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  border: '2px solid rgba(30, 58, 138, 0.8)',
                  backgroundColor: '#001F3F', // Navy color
                  color: '#ffffff', // White text
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                <span>{selectedRoleLabel}</span>
                <span style={{ marginLeft: '10px' }}>{isDropdownOpen ? '▲' : '▼'}</span>
              </button>

              {isDropdownOpen && (
                <div
                  ref={dropdownContentRef}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    border: '2px solid rgba(30, 58, 138, 0.6)',
                    borderRadius: '12px',
                    marginTop: '8px',
                    backgroundColor: '#ffffff',
                    zIndex: 1000,
                    maxHeight: 'calc(100vh - 300px)', // Responsif terhadap tinggi layar
                    overflowY: 'auto', // Scroll internal
                    overflowX: 'hidden',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {ROLES.map(role => (
                    <button
                      key={role.value}
                      onClick={() => {
                        setSelectedRole(role.value);
                        setIsDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 20px',
                        border: 'none',
                        borderBottom: '1px solid #f1f1f1',
                        backgroundColor: selectedRole === role.value ? '#1D4ED8' : '#ffffff',
                        color: selectedRole === role.value ? '#ffffff' : '#0F172A',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                        fontSize: '15px',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedRole !== role.value) {
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedRole !== role.value) {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                        }
                      }}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Button Lanjutkan - hanya muncul jika role dipilih */}
            {selectedRole && (
              <button
                onClick={handleContinue}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#ffffff',
                  backgroundColor: '#001F3F', // Navy color
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  marginTop: '8px',
                  boxShadow: '0 4px 12px rgba(0, 31, 63, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#002952';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 31, 63, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#001F3F';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 31, 63, 0.3)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
              >
                Lanjutkan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CSS untuk styling scrollbar dropdown */}
      <style>{`
        /* Scrollbar untuk dropdown */
        div[style*="maxHeight: calc(100vh - 300px)"] {
          scrollbar-width: thin;
          scrollbar-color: #001F3F #f1f1f1;
        }
        
        div[style*="maxHeight: calc(100vh - 300px)"]::-webkit-scrollbar {
          width: 8px;
        }
        
        div[style*="maxHeight: calc(100vh - 300px)"]::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 0 10px 10px 0;
        }
        
        div[style*="maxHeight: calc(100vh - 300px)"]::-webkit-scrollbar-thumb {
          background: #001F3F;
          border-radius: 4px;
        }
        
        div[style*="maxHeight: calc(100vh - 300px)"]::-webkit-scrollbar-thumb:hover {
          background: #002952;
        }
        
        /* Untuk Firefox */
        div[style*="maxHeight: calc(100vh - 300px)"] {
          scrollbar-width: thin;
          scrollbar-color: #001F3F #f1f1f1;
        }
      `}</style>
    </>
  );
}