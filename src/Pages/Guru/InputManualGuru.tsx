import { useState } from 'react';
import GuruLayout from '../../component/Guru/GuruLayout.tsx';
import CalendarIcon from '../../assets/Icon/calender.png';

interface InputManualGuruProps {
  user: { name: string; role: string };
  onLogout: () => void;
  currentPage: string;
  onMenuClick: (page: string) => void;
}

interface Siswa {
  id: string;
  nisn: string;
  nama: string;
  status: 'hadir' | 'sakit' | 'izin' | 'tidak hadir' | null;
}

export default function InputManualGuru({
  user,
  onLogout,
  currentPage,
  onMenuClick,
}: InputManualGuruProps) {
  const [selectedKelas] = useState('X Mekatronika 1');
  const [selectedMapel] = useState('Matematika (1-4)');
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  const [siswaList, setSiswaList] = useState<Siswa[]>([
    { id: '1', nisn: '098765432', nama: 'Wito Sableng', status: 'hadir' },
    { id: '2', nisn: '234567899', nama: 'Ahmad Sarif', status: null },
    { id: '3', nisn: '123456788', nama: 'Siti Purbaya', status: null },
    { id: '4', nisn: '122345678', nama: 'Budi Prekasa', status: null },
    { id: '5', nisn: '213456789', nama: 'Dewi Sintya', status: null },
    { id: '6', nisn: '123456789', nama: 'Rizkia Pratiwi', status: null },
    { id: '7', nisn: '213456762', nama: 'Andri S', status: null },
    { id: '8', nisn: '213456781', nama: 'Dito Pratama', status: null },
  ]);

  const handleStatusChange = (id: string, status: Siswa['status']) => {
    setSiswaList(siswaList.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const handleSimpan = () => {
    const siswaWithStatus = siswaList.filter((s) => s.status !== null);
    if (siswaWithStatus.length === 0) {
      alert('Pilih status untuk minimal satu siswa!');
      return;
    }
    alert(`Data kehadiran berhasil disimpan untuk ${siswaWithStatus.length} siswa!`);
    onMenuClick('kehadiran');
  };

  return (
    <GuruLayout
      pageTitle="Input Kehadiran Siswa"
      currentPage={currentPage}
      onMenuClick={onMenuClick}
      user={user}
      onLogout={onLogout}
    >
      <div style={{ position: 'relative', zIndex: 2 }}>

        {/* Top Section: Date & Class Info + Save Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Date Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              color: '#64748B',
              padding: '6px 12px',
              borderRadius: '100px',
              fontSize: '12px',
              fontWeight: 600,
              width: 'fit-content',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              position: 'relative',
              cursor: 'pointer'
            }}>
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
              <img src={CalendarIcon} alt="Date" style={{ width: 14, height: 14, marginRight: 6, opacity: 0.7 }} />
              {currentDate.split('-').reverse().join('-')}
            </div>

            {/* Class Info Card */}
            <div style={{
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              minWidth: '240px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '50px',
                height: '50px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '0 0 0 100%'
              }} />
              <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: 4, letterSpacing: '-0.025em' }}>{selectedKelas}</div>
              <div style={{ fontSize: '13px', opacity: 0.8, fontWeight: 500 }}>{selectedMapel}</div>
            </div>
          </div>

          {/* Simpan Button */}
          <button
            onClick={handleSimpan}
            style={{
              background: 'linear-gradient(to right, #2563EB, #1D4ED8)',
              color: 'white',
              padding: '10px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.2s ease',
              height: 'fit-content',
              marginBottom: '2px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(37, 99, 235, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(37, 99, 235, 0.3)';
            }}
          >
            Simpan
          </button>
        </div>

        {/* Table Section */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            overflow: 'hidden',
            border: '1px solid #F1F5F9',
            marginBottom: '24px',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: '700px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC' }}>
                  <th style={styles.th}>No</th>
                  <th style={styles.th}>NISN</th>
                  <th style={styles.th}>Nama Siswa</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Hadir</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Sakit</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Izin</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Tidak Hadir</th>
                  <th style={{ ...styles.th, textAlign: 'center', width: '100px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {siswaList.map((siswa, idx) => (
                  <tr
                    key={siswa.id}
                    style={{
                      borderBottom: '1px solid #F3F4F6',
                      transition: 'background-color 0.2s',
                      backgroundColor: '#FFFFFF',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#F9FAFB';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#FFFFFF';
                    }}
                  >
                    <td style={{ ...styles.td, width: '50px', textAlign: 'center' }}>{idx + 1}.</td>
                    <td style={styles.td}>{siswa.nisn}</td>
                    <td style={styles.td}>{siswa.nama}</td>
                    <td style={styles.tdCenter}>
                      <CustomRadio
                        checked={siswa.status === 'hadir'}
                        onChange={() => handleStatusChange(siswa.id, 'hadir')}
                        color="#10B981" // Emerald
                      />
                    </td>
                    <td style={styles.tdCenter}>
                      <CustomRadio
                        checked={siswa.status === 'sakit'}
                        onChange={() => handleStatusChange(siswa.id, 'sakit')}
                        color="#3B82F6" // Blue
                      />
                    </td>
                    <td style={styles.tdCenter}>
                      <CustomRadio
                        checked={siswa.status === 'izin'}
                        onChange={() => handleStatusChange(siswa.id, 'izin')}
                        color="#F59E0B" // Amber
                      />
                    </td>
                    <td style={styles.tdCenter}>
                      <CustomRadio
                        checked={siswa.status === 'tidak hadir'}
                        onChange={() => handleStatusChange(siswa.id, 'tidak hadir')}
                        color="#EF4444" // Red
                      />
                    </td>
                    <td style={styles.tdCenter}>
                      {siswa.status ? (
                        <div style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '100px',
                          fontSize: '12px',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                          backgroundColor:
                            siswa.status === 'hadir' ? '#ECFDF5' :
                              siswa.status === 'sakit' ? '#EFF6FF' :
                                siswa.status === 'izin' ? '#FFFBEB' : '#FEF2F2',
                          color:
                            siswa.status === 'hadir' ? '#059669' :
                              siswa.status === 'sakit' ? '#2563EB' :
                                siswa.status === 'izin' ? '#D97706' : '#DC2626',
                          border: `1px solid ${siswa.status === 'hadir' ? '#A7F3D0' :
                              siswa.status === 'sakit' ? '#BFDBFE' :
                                siswa.status === 'izin' ? '#FDE68A' : '#FECACA'
                            }`
                        }}>
                          {siswa.status}
                        </div>
                      ) : (
                        <span style={{ color: '#94A3B8', fontSize: '20px' }}>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </GuruLayout>
  );
}

const styles = {
  th: {
    padding: '12px 16px',
    textAlign: 'left' as const,
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    borderBottom: '1px solid #E2E8F0',
  },
  td: {
    padding: '12px 16px',
    fontSize: '13px',
    color: '#334155',
    fontWeight: '500',
    borderBottom: '1px solid #F1F5F9',
  },
  tdCenter: {
    padding: '12px',
    textAlign: 'center' as const,
    verticalAlign: 'middle',
    borderBottom: '1px solid #F1F5F9',
  },
};

function CustomRadio({ checked, onChange, color }: { checked: boolean; onChange: () => void; color: string }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        border: checked ? 'none' : '2px solid #CBD5E1',
        backgroundColor: checked ? color : 'transparent',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: checked ? `0 2px 4px ${color}66` : 'none',
      }}
    >
      {checked && (
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'white',
          boxShadow: '0 1px 1px rgba(0,0,0,0.1)'
        }} />
      )}
    </div>
  );
}






