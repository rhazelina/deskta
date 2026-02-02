import { useState, useEffect, useMemo } from 'react';
import WalikelasLayout from '../../component/Walikelas/layoutwakel';
import { Calendar, Download, ChevronLeft, Search, CheckCircle } from 'lucide-react';

interface RekapRow {
  id: string;
  no: number;
  nisn: string;
  namaSiswa: string;
  hadir: number;
  sakitIzin: number;
  alpha: number;
  pulang: number;
  status: 'aktif' | 'non-aktif';
}

interface RekapKehadiranSiswaProps {
  user: { name: string; role: string };
  onLogout: () => void;
  currentPage: string;
  onMenuClick: (page: string) => void;
}

export function RekapKehadiranSiswa({
  user,
  onLogout,
  currentPage,
  onMenuClick,
}: RekapKehadiranSiswaProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchTerm, setSearchTerm] = useState('');

  // Data periode
  const [periodeMulai, setPeriodeMulai] = useState('25-01-2025');
  const [periodeSelesai, setPeriodeSelesai] = useState('25-01-2025');

  // Data kelas
  const kelasInfo = {
    namaKelas: 'X Mekatronika 1',
    waliKelas: 'Ewiti Erniyah S.pd',
  };

  // Data dummy berdasarkan gambar
  const [rows] = useState<RekapRow[]>([
    { id: '1', no: 1, nisn: '1348576392', namaSiswa: 'Wito Suherman Suhermin', hadir: 23, sakitIzin: 5, alpha: 2, pulang: 2, status: 'aktif' },
    { id: '2', no: 2, nisn: '1348576393', namaSiswa: 'Ahmad Fauzi', hadir: 25, sakitIzin: 3, alpha: 0, pulang: 1, status: 'aktif' },
    { id: '3', no: 3, nisn: '1348576394', namaSiswa: 'Siti Nurhaliza', hadir: 20, sakitIzin: 7, alpha: 1, pulang: 0, status: 'aktif' },
    { id: '4', no: 4, nisn: '1348576395', namaSiswa: 'Budi Santoso', hadir: 22, sakitIzin: 4, alpha: 2, pulang: 3, status: 'aktif' },
    { id: '5', no: 5, nisn: '1348576396', namaSiswa: 'Dewi Sartika', hadir: 24, sakitIzin: 3, alpha: 1, pulang: 1, status: 'aktif' },
    { id: '6', no: 6, nisn: '1348576397', namaSiswa: 'Rizki Ramadhan', hadir: 21, sakitIzin: 5, alpha: 2, pulang: 2, status: 'aktif' },
    { id: '7', no: 7, nisn: '1348576398', namaSiswa: 'Fitri Handayani', hadir: 26, sakitIzin: 2, alpha: 0, pulang: 0, status: 'aktif' },
    { id: '8', no: 8, nisn: '1348576399', namaSiswa: 'Andi Wijaya', hadir: 19, sakitIzin: 8, alpha: 1, pulang: 1, status: 'aktif' },
    { id: '9', no: 9, nisn: '1348576400', namaSiswa: 'Rina Pratiwi', hadir: 23, sakitIzin: 4, alpha: 1, pulang: 2, status: 'aktif' },
  ]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter rows berdasarkan pencarian
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rows;

    const term = searchTerm.toLowerCase();
    return rows.filter(row =>
      row.nisn.toLowerCase().includes(term) ||
      row.namaSiswa.toLowerCase().includes(term)
    );
  }, [rows, searchTerm]);

  // Hitung total
  const totalHadir = useMemo(() => filteredRows.reduce((sum, row) => sum + row.hadir, 0), [filteredRows]);
  const totalSakitIzin = useMemo(() => filteredRows.reduce((sum, row) => sum + row.sakitIzin, 0), [filteredRows]);
  const totalAlpha = useMemo(() => filteredRows.reduce((sum, row) => sum + row.alpha, 0), [filteredRows]);
  const totalPulang = useMemo(() => filteredRows.reduce((sum, row) => sum + row.pulang, 0), [filteredRows]);

  const handleBack = () => {
    onMenuClick('kehadiran-siswa');
  };



  const handleDateChange = (type: 'mulai' | 'selesai', value: string) => {
    if (type === 'mulai') {
      setPeriodeMulai(value);
    } else {
      setPeriodeSelesai(value);
    }
  };

  return (
    <WalikelasLayout
      pageTitle="Rekap Kehadiran"
      currentPage={currentPage as any}
      onMenuClick={onMenuClick}
      user={user}
      onLogout={onLogout}
    >
      <div style={{
        position: 'relative',
        minHeight: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        overflow: 'hidden',
        padding: isMobile ? '16px' : '24px',
        border: '1px solid #E5E7EB',
      }}>
        {/* Header dengan tombol kembali */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <button
            onClick={handleBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'transparent',
              color: '#1E40AF',
              border: 'none',
              padding: '8px 0',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            <ChevronLeft size={16} />
            Kembali
          </button>

          {/* Search bar */}
          <div style={{
            position: 'relative',
            width: isMobile ? '100%' : '300px',
          }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9CA3AF',
            }} />
            <input
              type="text"
              placeholder="Cari NISN atau nama siswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 10px 10px 40px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#FFFFFF',
                color: '#111827',
              }}
            />
          </div>
        </div>

        {/* Informasi Kelas dan Wali Kelas */}
        <div style={{
          marginBottom: '24px',
        }}>
          <div style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '4px',
          }}>
            {kelasInfo.namaKelas}
          </div>
          <div style={{
            fontSize: '14px',
            color: '#6B7280',
          }}>
            {kelasInfo.waliKelas}
          </div>
        </div>

        {/* Periode */}
        <div style={{
          backgroundColor: '#F9FAFB',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          border: '1px solid #E5E7EB',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
          }}>
            <Calendar size={18} color="#374151" />
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
            }}>
              Periode:
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}>
            <input
              type="text"
              value={periodeMulai}
              onChange={(e) => handleDateChange('mulai', e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                width: '120px',
                textAlign: 'center',
                backgroundColor: '#FFFFFF',
                color: '#111827',
              }}
            />
            <span style={{
              fontSize: '14px',
              color: '#6B7280',
              fontWeight: '500',
            }}>
              ---
            </span>
            <input
              type="text"
              value={periodeSelesai}
              onChange={(e) => handleDateChange('selesai', e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                width: '120px',
                textAlign: 'center',
                backgroundColor: '#FFFFFF',
                color: '#111827',
              }}
            />
          </div>
        </div>

        {/* Garis pemisah */}
        <div style={{
          height: '1px',
          backgroundColor: '#E5E7EB',
          marginBottom: '24px',
        }}></div>

        {/* Tabel Rekap Kehadiran */}
        <div style={{
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '24px',
        }}>
          {/* Header Tabel */}
          <div style={{
            backgroundColor: '#F9FAFB',
            padding: '12px 16px',
            borderBottom: '1px solid #E5E7EB',
          }}>
            <div style={{
              display: isMobile ? 'flex' : 'grid',
              flexDirection: isMobile ? 'column' : 'row',
              gridTemplateColumns: isMobile ? '1fr' : '40px 120px minmax(200px, 1fr) 80px 100px 80px 80px 60px',
              gap: '12px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#374151',
            }}>
              <div>No</div>
              <div>NISN</div>
              <div>Nama Siswa</div>
              <div style={{ textAlign: 'center' }}>Hadir</div>
              <div style={{ textAlign: 'center' }}>Sakit/Izin</div>
              <div style={{ textAlign: 'center' }}>Alpha</div>
              <div style={{ textAlign: 'center' }}>Pulang</div>
              <div style={{ textAlign: 'center' }}>Status</div>
            </div>
          </div>

          {/* Body Tabel */}
          <div>
            {filteredRows.length === 0 ? (
              <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: '#6B7280',
                fontSize: '14px',
              }}>
                Tidak ada data yang ditemukan
              </div>
            ) : (
              filteredRows.map((row) => (
                <div
                  key={row.id}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #F3F4F6',
                    display: isMobile ? 'flex' : 'grid',
                    flexDirection: isMobile ? 'column' : 'row',
                    gridTemplateColumns: isMobile ? '1fr' : '40px 120px minmax(200px, 1fr) 80px 100px 80px 80px 60px',
                    gap: '12px',
                    alignItems: 'center',
                    fontSize: '14px',
                    color: '#111827',
                  }}
                >
                  <span style={{ fontWeight: '500' }}>{row.no}.</span>
                  <span>{row.nisn}</span>
                  <span>{row.namaSiswa}</span>
                  <span style={{ textAlign: 'center', fontWeight: '600' }}>{row.hadir}</span>
                  <span style={{ textAlign: 'center', fontWeight: '600' }}>{row.sakitIzin}</span>
                  <span style={{ textAlign: 'center', fontWeight: '600' }}>{row.alpha}</span>
                  <span style={{ textAlign: 'center', fontWeight: '600' }}>{row.pulang}</span>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: row.status === 'aktif' ? '#D1FAE5' : '#FEE2E2',
                      color: row.status === 'aktif' ? '#059669' : '#DC2626',
                    }}>
                      {row.status === 'aktif' ? (
                        <CheckCircle size={14} />
                      ) : (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#DC2626',
                        }}></div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Garis pemisah */}
        <div style={{
          height: '1px',
          backgroundColor: '#E5E7EB',
          marginBottom: '24px',
        }}></div>

        {/* Tombol Ekspor */}
        {/* Tombol Ekspor */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
        }}>
          {/* Export PDF Button */}
          <button
            onClick={() => {
              try {
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                  printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <title>Rekap Kehadiran Siswa</title>
                        <style>
                          body { font-family: Arial, sans-serif; padding: 20px; }
                          h1 { color: #0B2948; }
                          h2, h3 { color: #374151; }
                          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
                          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                          th { background-color: #2563EB; color: white; }
                          tr:nth-child(even) { background-color: #f2f2f2; }
                          .summary { margin-top: 20px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
                          .summary-item { padding: 10px; background: #f3f4f6; border-radius: 6px; text-align: center; }
                        </style>
                      </head>
                      <body>
                        <h1>Rekap Kehadiran Siswa</h1>
                        <h2>${kelasInfo.namaKelas}</h2>
                        <p><strong>Periode:</strong> ${periodeMulai} - ${periodeSelesai}</p>
                        <p><strong>Wali Kelas:</strong> ${kelasInfo.waliKelas}</p>
                        
                        <div class="summary">
                          <div class="summary-item"><strong>Hadir:</strong> ${totalHadir}</div>
                          <div class="summary-item"><strong>Sakit/Izin:</strong> ${totalSakitIzin}</div>
                          <div class="summary-item"><strong>Alpha:</strong> ${totalAlpha}</div>
                          <div class="summary-item"><strong>Pulang:</strong> ${totalPulang}</div>
                        </div>

                        <table>
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>NISN</th>
                              <th>Nama Siswa</th>
                              <th>Hadir</th>
                              <th>Sakit/Izin</th>
                              <th>Alpha</th>
                              <th>Pulang</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${filteredRows.map(row => `
                              <tr>
                                <td>${row.no}</td>
                                <td>${row.nisn}</td>
                                <td>${row.namaSiswa}</td>
                                <td>${row.hadir}</td>
                                <td>${row.sakitIzin}</td>
                                <td>${row.alpha}</td>
                                <td>${row.pulang}</td>
                                <td>${row.status}</td>
                              </tr>
                            `).join('')}
                          </tbody>
                        </table>
                        <p style="margin-top: 20px; font-size: 12px; color: #6B7280;">
                          Dicetak pada: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}
                        </p>
                      </body>
                    </html>
                  `);
                  printWindow.document.close();
                  printWindow.print();
                }
              } catch (error) {
                console.error('Error exporting PDF:', error);
                alert('Terjadi kesalahan saat mengekspor PDF.');
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FFFFFF',
              color: '#DC2626',
              border: '1px solid #DC2626',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FEF2F2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            <Download size={16} />
            Export PDF
          </button>

          {/* Export CSV Button */}
          <button
            onClick={() => {
              let csvContent = 'data:text/csv;charset=utf-8,';
              csvContent += 'REKAP KEHADIRAN SISWA\n';
              csvContent += `Kelas: ${kelasInfo.namaKelas},Wali Kelas: ${kelasInfo.waliKelas}\n`;
              csvContent += `Periode: ${periodeMulai} - ${periodeSelesai}\n\n`;
              csvContent += 'Mo,NISN,Nama Siswa,Hadir,Sakit/Izin,Alpha,Pulang,Status\n';

              filteredRows.forEach((row) => {
                csvContent += `${row.no},${row.nisn},"${row.namaSiswa}",${row.hadir},${row.sakitIzin},${row.alpha},${row.pulang},${row.status}\n`;
              });

              csvContent += `\nTotal,,,${totalHadir},${totalSakitIzin},${totalAlpha},${totalPulang},\n`;

              const encodedUri = encodeURI(csvContent);
              const link = document.createElement('a');
              link.setAttribute('href', encodedUri);
              link.setAttribute('download', `Rekap_Kehadiran_${kelasInfo.namaKelas}_${periodeMulai}_${periodeSelesai}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* Total Rekap (opsional) */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#F9FAFB',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '12px',
          }}>
            Total Rekap Kelas
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '16px',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Hadir</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>{totalHadir}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Sakit/Izin</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>{totalSakitIzin}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Alpha</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>{totalAlpha}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Pulang</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>{totalPulang}</div>
            </div>
          </div>
        </div>
      </div>
    </WalikelasLayout>
  );
}