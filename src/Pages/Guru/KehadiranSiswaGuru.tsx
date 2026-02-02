import { useState } from 'react';
import GuruLayout from '../../component/Guru/GuruLayout.tsx';
import CalendarIcon from '../../assets/Icon/calender.png';
import EditIcon from '../../assets/Icon/Edit.png';
import ChalkboardIcon from '../../assets/Icon/Chalkboard.png';

// STATUS COLOR PALETTE - High Contrast for Accessibility
const STATUS_COLORS = {
  hadir: '#15803d',   // Green 700 - Strong Green
  izin: '#ca8a04',    // Yellow 600 - Dark Gold
  sakit: '#c2410c',   // Orange 700 - Deep Orange (High Contrast)
  alpha: '#b91c1c',   // Red 700 - Deep Red
  pulang: '#1d4ed8',  // Blue 700 - Strong Blue
};

interface KehadiranSiswaGuruProps {
  user: { name: string; role: string };
  onLogout: () => void;
  currentPage: string;
  onMenuClick: (page: string) => void;
}

interface SiswaData {
  id: string;
  nisn: string;
  nama: string;
  mapel: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpha' | 'pulang';
}

export default function KehadiranSiswaGuru({
  user,
  onLogout,
  currentPage,
  onMenuClick,
}: KehadiranSiswaGuruProps) {
  const [currentDate] = useState('25-01-2025');
  const [selectedKelas] = useState('X Mekatronika 1');
  const [selectedMapel] = useState('Matematika (1-4)');
  const [editingSiswa, setEditingSiswa] = useState<SiswaData | null>(null);

  const [siswaList, setSiswaList] = useState<SiswaData[]>([
    { id: '1', nisn: '1348576392', nama: 'Wito Suherman Suhermin', mapel: 'Matematika', status: 'hadir' },
    { id: '2', nisn: '1348576392', nama: 'Wito Suherman Suhermin', mapel: 'Matematika', status: 'hadir' },
    { id: '3', nisn: '1348576392', nama: 'Wito Suherman Suhermin', mapel: 'Matematika', status: 'izin' },
    { id: '4', nisn: '1348576392', nama: 'Wito Suherman Suhermin', mapel: 'Matematika', status: 'sakit' },
    { id: '5', nisn: '1348576392', nama: 'Wito Suherman Suhermin', mapel: 'Matematika', status: 'alpha' },
    { id: '6', nisn: '1348576392', nama: 'Wito Suherman Suhermin', mapel: 'Matematika', status: 'alpha' },
    { id: '7', nisn: '1348576392', nama: 'Wito Suherman Suhermin', mapel: 'Matematika', status: 'pulang' },
  ]);

  const handleEditClick = (siswa: SiswaData) => {
    setEditingSiswa(siswa);
  };

  const handleSaveStatus = (newStatus: SiswaData['status']) => {
    if (!editingSiswa) return;

    setSiswaList(prevList =>
      prevList.map(s =>
        s.id === editingSiswa.id ? { ...s, status: newStatus } : s
      )
    );
    setEditingSiswa(null);
  };

  const getStatusBadge = (status: string) => {
    const color = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#10B981';
    const label = status.charAt(0).toUpperCase() + status.slice(1);

    return (
      <div style={{
        backgroundColor: color,
        color: 'white',
        padding: '8px 20px',
        borderRadius: '50px',
        fontSize: '13px',
        fontWeight: '700',
        display: 'inline-block',
        minWidth: '100px',
        textAlign: 'center',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255,255,255,0.2)',
        letterSpacing: '0.5px'
      }}>
        {label}
      </div>
    );
  };

  return (
    <GuruLayout
      pageTitle="Kehadiran Siswa"
      currentPage={currentPage}
      onMenuClick={onMenuClick}
      user={user}
      onLogout={onLogout}
    >
      <div style={{ padding: '0 4px' }}>

        {/* Top Info Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>

          {/* Date Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#0F172A',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            width: 'fit-content',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <img src={CalendarIcon} alt="Date" style={{ width: 18, height: 18, marginRight: 10, filter: 'brightness(0) invert(1)' }} />
            {currentDate}
          </div>

          {/* Class Info Card */}
          <div style={{
            backgroundColor: '#0F172A',
            color: 'white',
            padding: '16px 20px',
            borderRadius: '12px',
            width: 'fit-content',
            minWidth: '250px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative circle */}
            <div style={{
              position: 'absolute',
              left: -10,
              bottom: -20,
              width: 60,
              height: 60,
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '50%'
            }} />

            <img src={ChalkboardIcon} alt="Class" style={{ width: 24, height: 24, filter: 'brightness(0) invert(1)', zIndex: 1 }} />
            <div style={{ zIndex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: '700' }}>{selectedKelas}</div>
              <div style={{ fontSize: '13px', opacity: 0.8 }}>{selectedMapel}</div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #E2E8F0'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ backgroundColor: '#1E293B', color: 'white' }}>
                  <th style={{ ...styles.th, color: 'black' }}>No</th>
                  <th style={{ ...styles.th, color: 'black' }}>NISN</th>
                  <th style={{ ...styles.th, color: 'black' }}>Nama Siswa</th>
                  <th style={{ ...styles.th, color: 'black' }}>Mata Pelajaran</th>
                  <th style={{ ...styles.th, textAlign: 'center', color: 'black' }}>Status</th>
                  <th style={{ ...styles.th, textAlign: 'center', color: 'black' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {siswaList.map((siswa, index) => (
                  <tr key={index} style={{
                    borderBottom: '1px solid #E2E8F0',
                    backgroundColor: index % 2 === 0 ? '#F8FAFC' : 'white'
                  }}>
                    <td style={styles.td}>{index + 1}.</td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '15px' }}>{siswa.nisn}</td>
                    <td style={{ ...styles.td, fontWeight: '700', color: '#111827' }}>{siswa.nama}</td>
                    <td style={styles.td}>{siswa.mapel}</td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      {getStatusBadge(siswa.status)}
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <button
                        onClick={() => handleEditClick(siswa)}
                        style={{
                          background: 'white',
                          border: '1px solid #CBD5E1',
                          borderRadius: '8px',
                          padding: '6px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.borderColor = '#3B82F6'}
                        onMouseOut={(e) => e.currentTarget.style.borderColor = '#CBD5E1'}
                      >
                        <img src={EditIcon} alt="Edit" style={{ width: 18, height: 18 }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Edit Status Modal */}
      {editingSiswa && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '0', // Remove padding from container to handle sections
            borderRadius: '16px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden' // Ensure children respect border radius
          }}>
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #F3F4F6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>
                Edit Status Kehadiran
              </h3>
              <button
                onClick={() => setEditingSiswa(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9CA3AF',
                  fontSize: '24px',
                  padding: 0,
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                &times;
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px' }}>
              {/* Nama Siswa Field */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Nama Siswa
                </label>
                <div style={{
                  backgroundColor: '#F9FAFB',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  color: '#1F2937',
                  fontSize: '15px',
                  fontWeight: '600'
                }}>
                  {editingSiswa.nama}
                </div>
              </div>

              {/* Status Select */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Status Kehadiran
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={editingSiswa.status}
                    onChange={(e) => setEditingSiswa({ ...editingSiswa, status: e.target.value as SiswaData['status'] })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #D1D5DB',
                      fontSize: '15px',
                      color: '#1F2937',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      outline: 'none',
                      appearance: 'none', // Remove default arrow
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 1rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    {Object.keys(STATUS_COLORS).map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div style={{
              padding: '20px 24px',
              backgroundColor: '#F9FAFB',
              borderTop: '1px solid #F3F4F6',
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={() => setEditingSiswa(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                Batal
              </button>
              <button
                onClick={() => handleSaveStatus(editingSiswa.status)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#2563EB',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.4)',
                  transition: 'all 0.2s'
                }}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </GuruLayout>
  );
}

const styles = {
  th: {
    padding: '16px',
    textAlign: 'left' as const,
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    letterSpacing: '0.025em'
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#1F2937',
    verticalAlign: 'middle'
  }
};