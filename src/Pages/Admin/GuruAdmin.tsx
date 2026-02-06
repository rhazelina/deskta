import { useState, useRef, useEffect } from 'react';
import AdminLayout from '../../component/Admin/AdminLayout';
import { Button } from '../../component/Shared/Button';
import { Select } from '../../component/Shared/Select';
import { Table } from '../../component/Shared/Table';
import { TambahGuruForm } from '../../component/Shared/Form/TambahGuruForm';
import AWANKIRI from '../../assets/Icon/AWANKIRI.png';
import AwanBawahkanan from '../../assets/Icon/AwanBawahkanan.png';
import { MoreVertical, Edit, Trash2, Eye, Grid, FileDown, Upload, FileText, Download, Search } from 'lucide-react';
import { saveAs } from "file-saver";
import { usePopup } from "../../component/Shared/Popup/PopupProvider";

interface User {
  role: string;
  name: string;
}

interface Guru {
  id: string;
  kodeGuru: string;
  namaGuru: string;
  mataPelajaran: string;
  role: string;
  password?: string;
  noTelp?: string;
  waliKelasDari?: string;
}

interface GuruAdminProps {
  user: User;
  onLogout: () => void;
  currentPage: string;
  onMenuClick: (page: string) => void;
  onNavigateToDetail?: (guruId: string) => void;
}



export default function GuruAdmin({
  user,
  onLogout,
  currentPage,
  onMenuClick,
  onNavigateToDetail,
}: GuruAdminProps) {
  const { alert: popupAlert, confirm: popupConfirm } = usePopup();
  const [searchValue, setSearchValue] = useState('');
  const [selectedMapel, setSelectedMapel] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isEksporDropdownOpen, setIsEksporDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { teacherService } = await import('../../services/teacher');
        const teachers = await teacherService.getTeachers();

        // Map API data to UI format
        const mappedTeachers: Guru[] = teachers.map((t: any) => ({
          id: String(t.id),
          kodeGuru: t.nip || t.code || '-',
          namaGuru: t.name,
          mataPelajaran: t.subject || '-',
          role: t.homeroom_class ? 'Wali Kelas' : 'Guru',
          password: '', // Password not returned by API for security
          noTelp: t.phone || '',
          waliKelasDari: t.homeroom_class ? t.homeroom_class.name : '',
          originalData: t
        }));

        setGuruList(mappedTeachers);
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
        void popupAlert("Gagal mengambil data guru dari server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [popupAlert]);
  const [editingGuru, setEditingGuru] = useState<Guru | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mapelOptions = Array.from(new Set(guruList.map((g) => g.mataPelajaran)))
    .filter(Boolean)
    .sort()
    .map((m) => ({ value: m, label: m }));

  const roleOptions = Array.from(new Set(guruList.map((g) => g.role)))
    .filter(Boolean)
    .sort()
    .map((r) => ({ value: r, label: r }));

  const filteredData = guruList.filter((item) => {
    const matchSearch =
      item.kodeGuru.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.namaGuru.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.mataPelajaran.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.role.toLowerCase().includes(searchValue.toLowerCase());

    const matchMapel = selectedMapel ? item.mataPelajaran === selectedMapel : true;
    const matchRole = selectedRole ? item.role === selectedRole : true;

    return matchSearch && matchMapel && matchRole;
  });

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

  const columns = [
    { key: 'kodeGuru', label: 'Kode Guru' },
    { key: 'namaGuru', label: 'Nama Guru' },
    { key: 'mataPelajaran', label: 'Mata Pelajaran' },
    { key: 'role', label: 'Peran' },
    {
      key: 'aksi',
      label: 'Aksi',
      render: (_value: any, row: Guru) => (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            type="button"
            onClick={() =>
              setOpenActionId((prev) => (prev === row.id ? null : row.id))
            }
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Aksi"
          >
            <MoreVertical size={22} strokeWidth={1.5} />
          </button>

          {openActionId === row.id && (
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
                zIndex: 10,
                minWidth: 160,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setOpenActionId(null);
                  handleEditClick(row);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  border: 'none',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: 14,
                  color: '#111827',
                }}
              >
                <Edit size={18} strokeWidth={2} color="#64748B" />
                <span>Ubah</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpenActionId(null);
                  handleDeleteClick(row);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  border: 'none',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: 14,
                  color: '#B91C1C',
                  borderTop: '1px solid #E5E7EB',
                }}
              >
                <Trash2 size={18} strokeWidth={2} color="#64748B" />
                <span>Hapus</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpenActionId(null);
                  handleViewDetail(row);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  border: 'none',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: 14,
                  color: '#111827',
                  borderTop: '1px solid #E5E7EB',
                }}
              >
                <Eye size={18} strokeWidth={2} color="#64748B" />
                <span>Lihat</span>
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  const handleTambahGuru = async (data: {
    kodeGuru: string;
    namaGuru: string;
    mataPelajaran: string;
    role: string;
  }) => {
    try {
      const { teacherService } = await import('../../services/teacher');

      const payload = {
        name: data.namaGuru,
        nip: data.kodeGuru,
        username: data.kodeGuru, // Use NIP as username default
        email: `${data.kodeGuru}@school.id`, // Dummy email if not provided
        password: 'password123',
        subject: data.mataPelajaran,
        // phone: default
        // homeroom_class_id would need lookup logic
      };

      await teacherService.createTeacher(payload);

      // Refresh list
      const teachers = await teacherService.getTeachers();
      const mappedTeachers: Guru[] = teachers.map((t: any) => ({
        id: String(t.id),
        kodeGuru: t.nip || t.code || '-',
        namaGuru: t.name,
        mataPelajaran: t.subject || '-',
        role: t.homeroom_class ? 'Wali Kelas' : 'Guru',
        password: '',
        noTelp: t.phone || '',
        waliKelasDari: t.homeroom_class ? t.homeroom_class.name : '',
        originalData: t
      }));
      setGuruList(mappedTeachers);

      setIsModalOpen(false);
      setEditingGuru(null);
      await popupAlert(`✅ Guru "${data.namaGuru}" berhasil ditambahkan!`);
    } catch (error: any) {
      console.error(error);
      await popupAlert(`Gagal menambahkan: ${error.response?.data?.message || 'Error tidak diketahui'}`);
    }
  };

  const handleEditGuru = async (data: {
    kodeGuru: string;
    namaGuru: string;
    mataPelajaran: string;
    role: string;
  }) => {
    if (editingGuru) {
      try {
        const { teacherService } = await import('../../services/teacher');

        const payload = {
          name: data.namaGuru,
          nip: data.kodeGuru,
          subject: data.mataPelajaran,
        };

        await teacherService.updateTeacher(editingGuru.id, payload);

        // Refresh list
        const teachers = await teacherService.getTeachers();
        const mappedTeachers: Guru[] = teachers.map((t: any) => ({
          id: String(t.id),
          kodeGuru: t.nip || t.code || '-',
          namaGuru: t.name,
          mataPelajaran: t.subject || '-',
          role: t.homeroom_class ? 'Wali Kelas' : 'Guru',
          password: '',
          noTelp: t.phone || '',
          waliKelasDari: t.homeroom_class ? t.homeroom_class.name : '',
          originalData: t
        }));
        setGuruList(mappedTeachers);

        setEditingGuru(null);
        setIsModalOpen(false);
        await popupAlert(`✅ Data guru "${data.namaGuru}" berhasil diperbarui!`);
      } catch (error: any) {
        console.error(error);
        await popupAlert(`Gagal update: ${error.response?.data?.message || 'Error'}`);
      }
    }
  };

  const handleEditClick = (row: Guru) => {
    setEditingGuru(row);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (row: Guru) => {
    const confirmDelete = await popupConfirm(
      `Apakah Anda yakin ingin menghapus guru "${row.namaGuru}"?`
    );
    if (confirmDelete) {
      try {
        const { teacherService } = await import('../../services/teacher');
        await teacherService.deleteTeacher(row.id);

        const updatedList = guruList.filter((item) => item.id !== row.id);
        setGuruList(updatedList);
        await popupAlert(`✅ Guru "${row.namaGuru}" berhasil dihapus!`);
      } catch (error) {
        console.error(error);
        await popupAlert("Gagal menghapus data guru.");
      }
    }
  };

  const handleViewDetail = async (row: Guru) => {
    if (onNavigateToDetail) {
      onNavigateToDetail(row.id);
    } else {
      await popupAlert(`Navigasi ke detail guru: ${row.namaGuru} (ID: ${row.id})`);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGuru(null);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

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

        const headers = lines[0]
          .split(',')
          .map((header, index) =>
            (index === 0 ? header.replace(/^\uFEFF/, '') : header)
              .trim()
              .toLowerCase()
          );
        const kodeGuruIdx = headers.indexOf('kode guru');
        const namaGuruIdx = headers.indexOf('nama guru');
        const mataPelajaranIdx = headers.indexOf('mata pelajaran');
        const roleIdx = headers.indexOf('role');
        const noTelpIdx = headers.indexOf('no telp');
        const passwordIdx = headers.indexOf('password');
        const waliKelasIdx = headers.indexOf('wali kelas dari');

        if (kodeGuruIdx === -1 || namaGuruIdx === -1) {
          await popupAlert('File CSV harus memiliki kolom "Kode Guru" dan "Nama Guru".');
          return;
        }

        const newGuru: Guru[] = [];
        const lastId = guruList.reduce(
          (max, guru) => Math.max(max, Number.parseInt(guru.id, 10) || 0),
          0
        );

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const kodeGuru = values[kodeGuruIdx];
          const namaGuru = values[namaGuruIdx];

          if (!kodeGuru || !namaGuru) {
            await popupAlert(`Baris ${i + 1} harus memiliki "Kode Guru" dan "Nama Guru".`);
            return;
          }

          const newRecord: Guru = {
            id: String(lastId + newGuru.length + 1),
            kodeGuru,
            namaGuru,
            mataPelajaran: mataPelajaranIdx !== -1 ? values[mataPelajaranIdx] : '',
            role: roleIdx !== -1 ? values[roleIdx] : '',
            noTelp: noTelpIdx !== -1 ? values[noTelpIdx] : '',
            password: passwordIdx !== -1 ? values[passwordIdx] : '',
            waliKelasDari: waliKelasIdx !== -1 ? values[waliKelasIdx] : '',
          };
          newGuru.push(newRecord);
        }

        if (newGuru.length === 0) {
          await popupAlert("Tidak ada data guru yang valid untuk diimpor.");
          return;
        }

        setGuruList([...guruList, ...newGuru]);
        await popupAlert(`${newGuru.length} data guru berhasil diimpor`);
      } catch (error) {
        await popupAlert('Error: Format file CSV tidak sesuai');
        console.error(error);
      }
    };

    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportPDF = async () => {
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Data Guru</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #0B2948; }
                table { border-collapse: collapse; width: 100%; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #2563EB; color: white; }
                tr:nth-child(even) { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              <h1>Data Guru</h1>
              <p>Tanggal: ${new Date().toLocaleDateString('id-ID')}</p>
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Kode Guru</th>
                    <th>Nama Guru</th>
                    <th>Mata Pelajaran</th>
                    <th>Role</th>
                  </tr>
                </thead>
        <tbody>
          {isLoading ? (
            <tr className="border-b last:border-b-0 border-[#E2E8F0]">
               <td colSpan={columns.length} style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>
                 Memuat data...
               </td>
            </tr>
          ) : filteredData.length > 0 ? (
            filteredData.map((row, index) => (
              <tr
                key={row.id || index}
                className="border-b last:border-b-0 border-[#E2E8F0] hover:bg-gray-50 transition-colors"
               >
                 {columns.map((col) => (
                   <td
                     key={col.key}
                     style={{
                       padding: '16px 24px',
                       fontSize: '14px',
                       color: '#334155',
                     }}
                   >
                     {col.render
                       ? col.render(row[col.key as keyof Guru], row)
                       : row[col.key as keyof Guru]}
                   </td>
                 ))}
               </tr>
             ))
           ) : (
             <tr className="border-b last:border-b-0 border-[#E2E8F0]">
               <td
                 colSpan={columns.length}
                 style={{
                   padding: '24px',
                   textAlign: 'center',
                   color: '#64748B',
                 }}
               >
                 Tidak ada data guru yang ditemukan
               </td>
             </tr>
           )}
        </tbody>
              </table>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      await popupAlert('Terjadi kesalahan saat mengekspor PDF. Silakan coba lagi.');
    }
  };

  const handleExportCSV = async () => {
    if (filteredData.length === 0) {
      await popupAlert("Tidak ada data guru untuk diekspor.");
      return;
    }

    // Prepare CSV header
    const headers = ['Kode Guru', 'Nama Guru', 'Mata Pelajaran', 'Role'];
    const rows = filteredData.map(guru => [
      (guru.kodeGuru || '').replace(/[\r\n]+/g, ' '),
      (guru.namaGuru || '').replace(/[\r\n]+/g, ' '),
      (guru.mataPelajaran || '').replace(/[\r\n]+/g, ' '),
      (guru.role || '').replace(/[\r\n]+/g, ' '),
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    // Create and download file
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `Data_Guru_${new Date().getTime()}.csv`);
  };

  return (
    <AdminLayout
      pageTitle="Data Guru"
      currentPage={currentPage}
      onMenuClick={onMenuClick}
      user={user}
      onLogout={onLogout}
      hideBackground={true}
    >
      {/* Layer bg fixed (awan) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <img
          src={AWANKIRI}
          alt="Awan kiri atas"
          style={{ position: 'fixed', top: 0, left: 0, width: 220, height: 'auto' }}
        />
        <img
          src={AwanBawahkanan}
          alt="Awan kanan bawah"
          style={{ position: 'fixed', bottom: 0, right: 0, width: 220, height: 'auto' }}
        />
      </div>

      {/* Kontainer utama */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: 'clamp(16px, 3vw, 32px)',
          border: '1px solid #E2E8F0',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* ===================== MODIFIED SECTION ===================== */}
        {/* Controls Container - MIRIP DENGAN DATA SISWA */}
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
            {/* Mata Pelajaran */}
            <div style={{ minWidth: '200px', width: '200px' }}>
              <Select
                label="Mata Pelajaran"
                value={selectedMapel}
                onChange={setSelectedMapel}
                options={mapelOptions}
                placeholder="Semua Mata Pelajaran"
              />
            </div>

            {/* Peran*/}
            <div style={{ minWidth: '200px', width: '200px' }}>
              <Select
                label="Peran"
                value={selectedRole}
                onChange={setSelectedRole}
                options={roleOptions}
                placeholder="Semua Peran"
              />
            </div>

            {/* Search Box - ABU-ABU */}
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
                  color: '#374151',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Cari guru
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
                  placeholder="Cari guru"
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

          {/* Bagian kanan: Tambahkan Guru, Impor, dan Ekspor (SEMUA BIRU) */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-end',
              height: '64px'
            }}
          >
            {/* Tombol Tambahkan Guru - BIRU */}
            <div style={{
              alignSelf: 'flex-end',
              height: '40px'
            }}>
              <Button
                label="Tambahkan"
                onClick={() => setIsModalOpen(true)}
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
          {isLoading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>
              Memuat data...
            </div>
          ) : (
            <Table columns={columns} data={filteredData} keyField="id" />
          )}
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        accept=".csv"
      />

      <TambahGuruForm
        key={editingGuru?.id || 'new'}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingGuru ? handleEditGuru : handleTambahGuru}
        initialData={
          editingGuru
            ? {
              kodeGuru: editingGuru.kodeGuru,
              namaGuru: editingGuru.namaGuru,
              mataPelajaran: editingGuru.mataPelajaran,
              role: editingGuru.role,
            }
            : undefined
        }
        isEdit={!!editingGuru}
      />
    </AdminLayout>
  );
}

