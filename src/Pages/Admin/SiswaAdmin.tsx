import { useState, useRef, useEffect } from 'react';
import AdminLayout from '../../component/Admin/AdminLayout';
import { Button } from '../../component/Shared/Button';
import { SearchBox } from '../../component/Shared/Search';
import { Select } from '../../component/Shared/Select';
import { Table } from '../../component/Shared/Table';
import { SiswaForm } from '../../component/Shared/Form/SiswaForm';
import { MoreVertical, Edit, Trash2, Eye, Grid, FileDown, Upload, FileText, Download, Search } from 'lucide-react';
import { saveAs } from "file-saver";
import { usePopup } from "../../component/Shared/Popup/PopupProvider";

/* ===================== INTERFACE ===================== */
interface User {
  role: string;
  name: string;
}

interface Siswa {
  id: string;
  namaSiswa: string;
  nisn: string;
  jenisKelamin: string;
  noTelp: string;
  jurusan: string;
  jurusanId: string;
  tahunAngkatan: string;
  kelas: string;
  kelasId: string;
  password: string;
}

interface SiswaAdminProps {
  user: User;
  onLogout: () => void;
  currentPage: string;
  onMenuClick: (page: string) => void;
  onNavigateToDetail?: (siswaId: string) => void;
}

/* ===================== OPTIONS ===================== */
const jurusanOptions = [
  { label: 'Mekatronika', value: 'MEK' },
  { label: 'Rekayasa Perangkat Lunak', value: 'RPL' },
  { label: 'Animasi', value: 'ANI' },
  { label: 'Broadcasting', value: 'BC' },
  { label: 'Elektronika Industri', value: 'EI' },
  { label: 'Teknik Komputer dan Jaringan', value: 'TKJ' },
  { label: 'Audio Video', value: 'AV' },
  { label: 'Desain Komunikasi Visual', value: 'DKV' },
];

const kelasOptions = [
  { label: 'Kelas 10', value: '10' },
  { label: 'Kelas 11', value: '11' },
  { label: 'Kelas 12', value: '12' },
];

/* ===================== DUMMY DATA ===================== */
const initialSiswaData: Siswa[] = [
  { 
    id: '1', 
    namaSiswa: 'M. Wito Suherman', 
    nisn: '2347839283', 
    jenisKelamin: 'Laki-Laki', 
    noTelp: '08218374859',
    jurusan: 'Mekatronika', 
    jurusanId: 'MEK', 
    tahunAngkatan: '2023 - 2026',
    kelas: '10', 
    kelasId: '10-MEK-1',
    password: 'ABC123'
  },
  { 
    id: '2', 
    namaSiswa: 'Siti Nurhaliza', 
    nisn: '2347839284', 
    jenisKelamin: 'Perempuan', 
    noTelp: '08123456789',
    jurusan: 'Rekayasa Perangkat Lunak', 
    jurusanId: 'RPL', 
    tahunAngkatan: '2023 - 2026',
    kelas: '10', 
    kelasId: '10-RPL-1',
    password: 'password123'
  },
  { 
    id: '3', 
    namaSiswa: 'Ahmad Rizki', 
    nisn: '2347839285', 
    jenisKelamin: 'Laki-Laki', 
    noTelp: '08134567890',
    jurusan: 'Teknik Komputer dan Jaringan', 
    jurusanId: 'TKJ', 
    tahunAngkatan: '2023 - 2026',
    kelas: '11', 
    kelasId: '11-TKJ-1',
    password: 'password123'
  },
  { 
    id: '4', 
    namaSiswa: 'Dewi Lestari', 
    nisn: '2347839286', 
    jenisKelamin: 'Perempuan', 
    noTelp: '08145678901',
    jurusan: 'Desain Komunikasi Visual', 
    jurusanId: 'DKV', 
    tahunAngkatan: '2023 - 2026',
    kelas: '12', 
    kelasId: '12-DKV-1',
    password: 'password123'
  },
];

/* ===================== COMPONENT ===================== */
export default function SiswaAdmin({
  user,
  onLogout,
  currentPage,
  onMenuClick,
  onNavigateToDetail,
}: SiswaAdminProps) {
  const { alert: popupAlert, confirm: popupConfirm } = usePopup();
  const [searchValue, setSearchValue] = useState('');
  const [selectedJurusan, setSelectedJurusan] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('');
  const [isEksporDropdownOpen, setIsEksporDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [siswaList, setSiswaList] = useState<Siswa[]>(initialSiswaData);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State untuk edit
  const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fungsi untuk update data siswa (untuk dipanggil dari DetailSiswa)
  const updateSiswaData = (updatedSiswa: Siswa) => {
    setSiswaList(prevList => 
      prevList.map(siswa => 
        siswa.id === updatedSiswa.id ? updatedSiswa : siswa
      )
    );
  };

  // Handler untuk navigasi ke detail siswa
  const handleNavigateToDetail = (siswaId: string) => {
    if (onNavigateToDetail) {
      onNavigateToDetail(siswaId);
    } else {
      // Simpan data ke localStorage untuk diakses oleh DetailSiswa
      const siswa = siswaList.find(s => s.id === siswaId);
      if (siswa) {
        localStorage.setItem('selectedSiswa', JSON.stringify(siswa));
      }
      onMenuClick('detail-siswa');
    }
  };

  /* ===================== FILTER ===================== */
  const filteredData = siswaList.filter((item) => {
    const matchSearch =
      item.namaSiswa.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.nisn.includes(searchValue);

    const matchJurusan = selectedJurusan ? item.jurusanId === selectedJurusan : true;
    const matchKelas = selectedKelas ? item.kelas === selectedKelas : true;

    return matchSearch && matchJurusan && matchKelas;
  });

  /* ===================== HANDLER ===================== */
  const handleImport = () => fileInputRef.current?.click();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isCsvFile =
      file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv");
    if (!isCsvFile) {
      void popupAlert("Format file harus CSV.");
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean);

        if (lines.length < 2) {
          await popupAlert("File CSV tidak memiliki data.");
          return;
        }

        // Parse CSV header
        const headers = lines[0]
          .split(',')
          .map((header, index) =>
            (index === 0 ? header.replace(/^\uFEFF/, '') : header)
              .trim()
              .toLowerCase()
          );
        const namaSiswaIdx = headers.indexOf('nama siswa');
        const nisnIdx = headers.indexOf('nisn');
        const jenisKelaminIdx = headers.indexOf('jenis kelamin');
        const jurusanIdx = headers.indexOf('jurusan');
        const kelasIdx = headers.indexOf('kelas');
        const noTelpIdx = headers.indexOf('no telp');
        const passwordIdx = headers.indexOf('password');

        if (namaSiswaIdx === -1 || nisnIdx === -1) {
          await popupAlert('File CSV harus memiliki kolom "Nama Siswa" dan "NISN"');
          return;
        }

        const newSiswa: Siswa[] = [];
        const lastId = siswaList.reduce(
          (max, siswa) => Math.max(max, Number.parseInt(siswa.id, 10) || 0),
          0
        );
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const namaSiswa = values[namaSiswaIdx];
          const nisn = values[nisnIdx];

          if (!namaSiswa || !nisn) {
            await popupAlert(`Baris ${i + 1} harus memiliki "Nama Siswa" dan "NISN".`);
            return;
          }

          const jurusanValue = jurusanIdx !== -1 ? values[jurusanIdx] : '';
          const jurusanId = jurusanOptions.find(j => j.label.toLowerCase() === jurusanValue.toLowerCase())?.value || '';

          const newRecord: Siswa = {
            id: String(lastId + newSiswa.length + 1),
            namaSiswa,
            nisn,
            jenisKelamin: jenisKelaminIdx !== -1 ? values[jenisKelaminIdx] : 'Laki-Laki',
            noTelp: noTelpIdx !== -1 ? values[noTelpIdx] : '',
            jurusan: jurusanValue,
            jurusanId: jurusanId,
            tahunAngkatan: '2023 - 2026',
            kelas: kelasIdx !== -1 ? values[kelasIdx] : '',
            kelasId: `${kelasIdx !== -1 ? values[kelasIdx] : ''}-${jurusanId}-1`,
            password: passwordIdx !== -1 ? values[passwordIdx] : 'password123',
          };
          newSiswa.push(newRecord);
        }

        if (newSiswa.length === 0) {
          await popupAlert("Tidak ada data siswa yang valid untuk diimpor.");
          return;
        }

        setSiswaList([...siswaList, ...newSiswa]);
        await popupAlert(`${newSiswa.length} data siswa berhasil diimpor`);
      } catch (error) {
        await popupAlert('Error: Format file CSV tidak sesuai');
        console.error(error);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportPDF = () => {
    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Data Siswa Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; color: #1E3A8A; }
          .date { text-align: center; color: #666; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #2563EB; color: white; padding: 10px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #ddd; }
          tr:nth-child(even) { background-color: #f5f7fa; }
          .footer { margin-top: 20px; text-align: right; color: #666; }
        </style>
      </head>
      <body>
        <h1>Laporan Data Siswa</h1>
        <div class="date">Tanggal: ${new Date().toLocaleDateString('id-ID')}</div>
        <table>
          <thead>
            <tr>
              <th>Nama Siswa</th>
              <th>NISN</th>
              <th>Konsentrasi Keahlian</th>
              <th>Kelas</th>
              <th>Jenis Kelamin</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData.map(siswa => `
              <tr>
                <td>${siswa.namaSiswa}</td>
                <td>${siswa.nisn}</td>
                <td>${siswa.jurusan}</td>
                <td>${siswa.kelas}</td>
                <td>${siswa.jenisKelamin}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>Total Siswa: ${filteredData.length}</p>
          <p>Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}</p>
        </div>
      </body>
      </html>
    `;

    // Open print dialog
    const newWindow = window.open('', '', 'width=900,height=600');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
      setTimeout(() => {
        newWindow.print();
      }, 250);
    }
  };

  const handleExportCSV = async () => {
    if (filteredData.length === 0) {
      await popupAlert("Tidak ada data siswa untuk diekspor.");
      return;
    }

    // Prepare CSV header
    const headers = ['Nama Siswa', 'NISN', 'Jenis Kelamin', 'Jurusan', 'Kelas'];
    const rows = filteredData.map(siswa => [
      (siswa.namaSiswa || '').replace(/[\r\n]+/g, ' '),
      (siswa.nisn || '').replace(/[\r\n]+/g, ' '),
      (siswa.jenisKelamin || '').replace(/[\r\n]+/g, ' '),
      (siswa.jurusan || '').replace(/[\r\n]+/g, ' '),
      (siswa.kelas || '').replace(/[\r\n]+/g, ' '),
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    // Create and download file
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `Data_Siswa_${new Date().getTime()}.csv`);
  };

  // Handler edit siswa
  const handleEditSiswa = (siswa: Siswa) => {
    setEditingSiswa(siswa);
    setIsEditMode(true);
    setIsModalOpen(true);
    setOpenActionId(null);
  };

  // Handler tambah siswa baru
  const handleTambahSiswa = () => {
    setEditingSiswa(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  // Handler submit siswa
  const handleSubmitSiswa = async (data: {
    namaSiswa: string;
    nisn: string;
    jurusanId: string;
    kelasId: string;
  }) => {
    if (isEditMode && editingSiswa) {
      // Mode edit: update data siswa
      const updatedSiswaList = siswaList.map(siswa => {
        if (siswa.id === editingSiswa.id) {
          return {
            ...siswa,
            namaSiswa: data.namaSiswa,
            nisn: data.nisn,
            jurusan: jurusanOptions.find(j => j.value === data.jurusanId)?.label || '',
            jurusanId: data.jurusanId,
            kelas: data.kelasId.split('-')[0],
            kelasId: data.kelasId,
          };
        }
        return siswa;
      });
      setSiswaList(updatedSiswaList);
      await popupAlert(`Data siswa "${data.namaSiswa}" berhasil diperbarui!`);
    } else {
      // Mode tambah: tambah siswa baru
      const newSiswa: Siswa = {
        id: String(Math.max(...siswaList.map(s => parseInt(s.id) || 0)) + 1),
        namaSiswa: data.namaSiswa,
        nisn: data.nisn,
        jenisKelamin: 'Laki-Laki',
        noTelp: '',
        jurusan: jurusanOptions.find(j => j.value === data.jurusanId)?.label || '',
        jurusanId: data.jurusanId,
        tahunAngkatan: '2023 - 2026',
        kelas: data.kelasId.split('-')[0],
        kelasId: data.kelasId,
        password: 'password123',
      };
      setSiswaList([...siswaList, newSiswa]);
      await popupAlert(`Siswa "${data.namaSiswa}" berhasil ditambahkan!`);
    }
    
    setIsModalOpen(false);
    setEditingSiswa(null);
    setIsEditMode(false);
  };

  // Handler close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSiswa(null);
    setIsEditMode(false);
  };

  // Handler delete siswa
  const handleDeleteSiswa = async (id: string) => {
    if (await popupConfirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
      setSiswaList(prevList => prevList.filter(siswa => siswa.id !== id));
      await popupAlert('Data siswa berhasil dihapus!');
      setOpenActionId(null);
    }
  };

  /* ===================== BUTTON STYLE ===================== */
  const buttonBaseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    height: '40px',
    border: 'none',
  } as const;

  /* ===================== TABLE ===================== */
  const columns = [
    { key: 'namaSiswa', label: 'Nama Siswa' },
    { key: 'nisn', label: 'NISN' },
    { key: 'jurusan', label: 'Konsentrasi Keahlian' },
    { key: 'kelas', label: 'Tingkatan Kelas' },
    { 
      key: 'jenisKelamin', 
      label: 'Jenis Kelamin',
      render: (value: string) => value === 'Laki-Laki' ? 'L' : 'P'
    },
    {
      key: 'aksi',
      label: 'Aksi',
      render: (_: any, row: Siswa) => (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setOpenActionId(openActionId === row.id ? null : row.id)}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            <MoreVertical size={22} strokeWidth={1.5} />
          </button>

          {openActionId === row.id && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 6,
                background: '#FFFFFF',
                borderRadius: 8,
                boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
                minWidth: 180,
                zIndex: 10,
                overflow: 'hidden',
                border: '1px solid #E2E8F0',
              }}
            >
              <button
                onClick={() => handleEditSiswa(row)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#0F172A',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  borderBottom: '1px solid #F1F5F9',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F0F4FF';
                  (e.currentTarget as HTMLButtonElement).style.color = '#2563EB';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFFFFF';
                  (e.currentTarget as HTMLButtonElement).style.color = '#0F172A';
                }}
              >
                <Edit size={16} color="#64748B" strokeWidth={2} />
                Ubah
              </button>
              <button
                onClick={() => handleDeleteSiswa(row.id)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#0F172A',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  borderBottom: '1px solid #F1F5F9',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FEF2F2';
                  (e.currentTarget as HTMLButtonElement).style.color = '#DC2626';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFFFFF';
                  (e.currentTarget as HTMLButtonElement).style.color = '#0F172A';
                }}
              >
                <Trash2 size={16} color="#64748B" strokeWidth={2} />
                Hapus
              </button>
              <button
                onClick={() => handleNavigateToDetail(row.id)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#0F172A',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F0F4FF';
                  (e.currentTarget as HTMLButtonElement).style.color = '#059669';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFFFFF';
                  (e.currentTarget as HTMLButtonElement).style.color = '#0F172A';
                }}
              >
                <Eye size={16} color="#64748B" strokeWidth={2} />
                Lihat
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      pageTitle="Data Siswa"
      currentPage={currentPage}
      onMenuClick={onMenuClick}
      user={user}
      onLogout={onLogout}
      hideBackground
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: 'clamp(16px, 3vw, 32px)',
          border: '1px solid #E2E8F0',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {/* ===================== MODIFIED SECTION ===================== */}
        {/* Controls Container - SEMUA TOMBOL BIRU */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          {/* Bagian kiri: Filter dan Search */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              gap: '16px',
              flex: 1,
            }}
          >
            {/* Konsentrasi Keahlian */}
            <div style={{ minWidth: '200px', width: '200px' }}>
              <Select
                label="Konsentrasi Keahlian"
                value={selectedJurusan}
                onChange={setSelectedJurusan}
                options={jurusanOptions}
                placeholder="Semua"
              />
            </div>

            {/* Kelas */}
            <div style={{ minWidth: '200px', width: '200px' }}>
              <Select
                label="Kelas"
                value={selectedKelas}
                onChange={setSelectedKelas}
                options={kelasOptions}
                placeholder="Semua"
              />
            </div>

            {/* Search Box */}
            <div style={{
              minWidth: '250px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              height: '64px'
            }}>
              <label
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#252525',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Cari siswa
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Search
                  size={18}
                  color="#9CA3AF"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="text"
                  placeholder="Cari siswa"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: '#D9D9D9',
                    height: '40px',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3B82F6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#D1D5DB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bagian kanan: Tambahkan, Impor, dan Ekspor (SEMUA BIRU) */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-end',
              height: '64px'
            }}
          >
            {/* Tombol Tambahkan - BIRU */}
            <div style={{ 
              alignSelf: 'flex-end',
              height: '40px'
            }}>
              <Button
                label="Tambahkan"
                onClick={handleTambahSiswa}
                variant="primary"
              />
            </div>
            
            {/* Tombol Impor - BIRU */}
            <div style={{ alignSelf: 'flex-end' }}>
              <button
                onClick={handleImport}
                style={{
                  ...buttonBaseStyle,
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  minWidth: '100px',
                  border: '1px solid #2563EB',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1D4ED8';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2563EB';
                }}
              >
                <Upload size={16} color="#FFFFFF" />
                Impor
              </button>
            </div>

            {/* Tombol Ekspor dengan dropdown - BIRU */}
            <div style={{ position: 'relative', alignSelf: 'flex-end' }}>
              <button
                onClick={() => setIsEksporDropdownOpen(!isEksporDropdownOpen)}
                style={{
                  ...buttonBaseStyle,
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  minWidth: '100px',
                  border: '1px solid #2563EB',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1D4ED8';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2563EB';
                }}
              >
                <FileDown size={16} color="#FFFFFF" />
                Ekspor
                <Grid size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
              </button>

              {isEksporDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 4,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 8,
                    boxShadow:
                      '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                    overflow: 'hidden',
                    zIndex: 20,
                    minWidth: 120,
                    border: '1px solid #E5E7EB',
                  }}
                >
                  <button
                    onClick={() => {
                      setIsEksporDropdownOpen(false);
                      handleExportPDF();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 16px',
                      border: 'none',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: 14,
                      color: '#111827',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                  >
                    <FileText size={16} />
                    PDF
                  </button>
                  <button
                    onClick={() => {
                      setIsEksporDropdownOpen(false);
                      handleExportCSV();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 16px',
                      border: 'none',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: 14,
                      color: '#111827',
                      textAlign: 'left',
                      borderTop: '1px solid #F1F5F9',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                  >
                    <Download size={16} />
                    CSV
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 0 0 1px #E5E7EB' }}>
          <Table columns={columns} data={filteredData} keyField="id" />
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileSelect} 
        accept=".csv" 
      />

      {/* Modal Form */}
      <SiswaForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitSiswa}
        initialData={
          editingSiswa 
            ? {
                namaSiswa: editingSiswa.namaSiswa,
                nisn: editingSiswa.nisn,
                jurusanId: editingSiswa.jurusanId,
                kelasId: editingSiswa.kelasId,
              }
            : undefined
        }
        isEdit={isEditMode}
      />
    </AdminLayout>
  );
}

