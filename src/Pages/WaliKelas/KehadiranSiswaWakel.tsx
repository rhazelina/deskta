import { useState, useEffect, useMemo } from 'react';
import WalikelasLayout from '../../component/Walikelas/layoutwakel';
import { Button } from '../../component/Shared/Button';
import { FormModal } from '../../component/Shared/FormModal';
import { Select } from '../../component/Shared/Select';
import { Table } from '../../component/Shared/Table';
import { usePopup } from "../../component/Shared/Popup/PopupProvider";
import { Calendar, BookOpen, FileText, ClipboardPlus, Edit, ChevronDown, X, Upload } from 'lucide-react';

// STATUS COLOR PALETTE - High Contrast for Accessibility
const STATUS_COLORS = {
  hadir: '#1FA83D',   // HIJAU - Hadir
  izin: '#ACA40D',    // KUNING - Izin
  sakit: '#520C8F',   // UNGU - Sakit
  'tidak-hadir': '#D90000',   // MERAH - Tidak Hadir
  pulang: '#2F85EB',  // BIRU - Pulang
};

type StatusType = 'hadir' | 'izin' | 'sakit' | 'tidak-hadir' | 'pulang';

interface KehadiranRow {
  id: string;
  nisn: string;
  namaSiswa: string;
  mataPelajaran: string;
  namaGuru: string;
  tanggal: string;
  status: StatusType;
  keterangan?: string;
  jamPelajaran?: string;
  waktuHadir?: string;
}

interface Perizinan {
  id: string;
  nisn: string;
  namaSiswa: string;
  alasan: string;
  alasanDetail?: string;
  mapel?: string;
  namaGuru?: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  file1?: File;
  file2?: File;
}

interface KehadiranSiswaWakelProps {
  user: { name: string; role: string };
  onLogout: () => void;
  currentPage: string;
  onMenuClick: (page: string) => void;
}

export function KehadiranSiswaWakel({
  user,
  onLogout,
  currentPage,
  onMenuClick,
}: KehadiranSiswaWakelProps) {
  const { alert: popupAlert, confirm: popupConfirm } = usePopup();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedMapel, setSelectedMapel] = useState('all');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [tempDate, setTempDate] = useState('');
  const [selectedSiswa, setSelectedSiswa] = useState<KehadiranRow | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;
  
  const kelasInfo = {
    namaKelas: 'X Mekatronika 1',
    tanggal: selectedDate || formattedDate,
  };

  // Data dummy
  const [rows, setRows] = useState<KehadiranRow[]>([
    { id: '1', nisn: '1348576392', namaSiswa: 'Wito Suherman Suhermin', mataPelajaran: 'Matematika', namaGuru: 'Solikhah S.pd', tanggal: '25-01-2025', status: 'hadir', jamPelajaran: '1-4', waktuHadir: '07:30 WIB' },
    { id: '2', nisn: '1348576392', namaSiswa: 'Wito Suherman Suhermin', mataPelajaran: 'Matematika', namaGuru: 'Solikhah S.pd', tanggal: '25-01-2025', status: 'hadir', jamPelajaran: '1-4', waktuHadir: '07:25 WIB' },
    { id: '3', nisn: '1348576392', namaSiswa: 'Wito Suherman Suhermin', mataPelajaran: 'Matematika', namaGuru: 'Solikhah S.pd', tanggal: '25-01-2025', status: 'izin', jamPelajaran: '1-4', keterangan: 'Ijin tidak masuk karena ada keperluan keluarga' },
    { id: '4', nisn: '1348576392', namaSiswa: 'Wito Suherman Suhermin', mataPelajaran: 'Matematika', namaGuru: 'Solikhah S.pd', tanggal: '25-01-2025', status: 'sakit', jamPelajaran: '1-4', keterangan: 'Demam tinggi dan dokter menyarankan istirahat' },
    { id: '5', nisn: '1348576392', namaSiswa: 'Wito Suherman Suhermin', mataPelajaran: 'Matematika', namaGuru: 'Solikhah S.pd', tanggal: '25-01-2025', status: 'tidak-hadir', jamPelajaran: '1-4' },
    { id: '6', nisn: '1348576392', namaSiswa: 'Wito Suherman Suhermin', mataPelajaran: 'Matematika', namaGuru: 'Solikhah S.pd', tanggal: '25-01-2025', status: 'tidak-hadir', jamPelajaran: '1-4' },
    { id: '7', nisn: '1348576392', namaSiswa: 'Wito Suherman Suhermin', mataPelajaran: 'Matematika', namaGuru: 'Solikhah S.pd', tanggal: '25-01-2025', status: 'tidak-hadir', jamPelajaran: '1-4' },
    { id: '8', nisn: '1348576393', namaSiswa: 'Ahmad Fauzi', mataPelajaran: 'Matematika', namaGuru: 'Solikhah S.pd', tanggal: '25-01-2025', status: 'hadir', jamPelajaran: '1-4', waktuHadir: '07:28 WIB' },
    { id: '9', nisn: '1348576394', namaSiswa: 'Siti Nurhaliza', mataPelajaran: 'Matematika', namaGuru: 'Solikhah S.pd', tanggal: '25-01-2025', status: 'sakit', jamPelajaran: '1-4', keterangan: 'Batuk pilek dan demam' },
    { id: '10', nisn: '1348576395', namaSiswa: 'Budi Santoso', mataPelajaran: 'Matematika', namaGuru: 'Solikhah S.pd', tanggal: '25-01-2025', status: 'izin', jamPelajaran: '1-4', keterangan: 'Menghadiri acara keluarga' },
    { id: '11', nisn: '1348576396', namaSiswa: 'Dewi Sartika', mataPelajaran: 'Matematika', namaGuru: 'Solikhah S.pd', tanggal: '25-01-2025', status: 'hadir', jamPelajaran: '1-4', waktuHadir: '07:32 WIB' },
    { id: '12', nisn: '1348576397', namaSiswa: 'Rizki Ramadhan', mataPelajaran: 'Matematika', namaGuru: 'Solikhah S.pd', tanggal: '25-01-2025', status: 'tidak-hadir', jamPelajaran: '1-4' },
    { id: '13', nisn: '1348576398', namaSiswa: 'Fitri Handayani', mataPelajaran: 'Matematika', namaGuru: 'Solikhah S.pd', tanggal: '25-01-2025', status: 'hadir', jamPelajaran: '1-4', waktuHadir: '07:29 WIB' },
    { id: '14', nisn: '1348576399', namaSiswa: 'Andi Wijaya', mataPelajaran: 'Matematika', namaGuru: 'Solikhah S.pd', tanggal: '25-01-2025', status: 'sakit', jamPelajaran: '1-4', keterangan: 'Sakit perut' },
    { id: '15', nisn: '1348576400', namaSiswa: 'Rina Pratiwi', mataPelajaran: 'Matematika', namaGuru: 'Solikhah S.pd', tanggal: '25-01-2025', status: 'pulang', jamPelajaran: '1-4', keterangan: 'Pulang lebih awal karena sakit kepala' },
  ]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mapelOptions = useMemo(() => {
    const mapelSet = new Set(
      rows.map((r) => r.mataPelajaran).filter((v) => v && v !== '-')
    );
    return [
      { label: 'Semua Mata Pelajaran', value: 'all' },
      ...Array.from(mapelSet).map((mapel) => ({
        label: mapel,
        value: mapel,
      })),
    ];
  }, [rows]);

  const filteredRows = useMemo(() => {
    let filtered = selectedMapel === 'all' 
      ? rows 
      : rows.filter((r) => r.mataPelajaran === selectedMapel);
    
    if (selectedDate) {
      filtered = filtered.filter((r) => r.tanggal === selectedDate);
    }
    
    return filtered.map((row, index) => ({
      ...row,
    }));
  }, [rows, selectedMapel, selectedDate]);

  // Statistik
  const totalHadir = filteredRows.filter((r) => r.status === 'hadir').length;
  const totalIzin = filteredRows.filter((r) => r.status === 'izin').length;
  const totalSakit = filteredRows.filter((r) => r.status === 'sakit').length;
  const totalTidakHadir = filteredRows.filter((r) => r.status === 'tidak-hadir').length;
  const totalPulang = filteredRows.filter((r) => r.status === 'pulang').length;

  // Icon mata untuk lihat detail
  const EyeIcon = ({ size = 16 }: { size?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path
        d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Icon X untuk tombol close modal
  const XIcon = ({ size = 24 }: { size?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path
        d="M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 6L18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Icon check untuk status hadir
  const CheckIcon = ({ size = 24 }: { size?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path
        d="M20 6L9 17L4 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Icon time untuk waktu hadir
  const TimeIcon = ({ size = 16 }: { size?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 7V12L15 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  // Fungsi untuk membuka modal detail status
  const handleStatusClick = (siswa: KehadiranRow) => {
    setSelectedSiswa(siswa);
    setIsDetailModalOpen(true);
  };

  // Status Button dengan icon mata - SEMUA STATUS BISA DIKLIK
  const StatusButton = ({ status, siswa }: { status: StatusType; siswa: KehadiranRow }) => {
    const color = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#1FA83D';
    const label = status === 'tidak-hadir' ? 'Tidak Hadir' :
                  status === 'sakit' ? 'Sakit' :
                  status === 'izin' ? 'Izin' :
                  status === 'hadir' ? 'Hadir' :
                  'Pulang';
    
    return (
      <div
        onClick={() => handleStatusClick(siswa)}
        style={{
          backgroundColor: color,
          color: 'white',
          padding: '8px 20px',
          borderRadius: '50px',
          fontSize: '13px',
          fontWeight: '700',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          minWidth: '100px',
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255,255,255,0.2)',
          letterSpacing: '0.5px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.9';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.2)';
        }}
      >
        <EyeIcon size={14} />
        <span>{label}</span>
      </div>
    );
  };

  // Fungsi untuk mendapatkan teks status
  const getStatusText = (status: string, waktuHadir?: string) => {
    switch (status) {
      case "tidak-hadir":
        return "Siswa tidak hadir tanpa keterangan";
      case "izin":
        return "Siswa izin dengan keterangan";
      case "sakit":
        return "Siswa sakit dengan surat dokter";
      case "hadir":
        return waktuHadir ? `Siswa hadir tepat waktu pada ${waktuHadir}` : "Siswa hadir tepat waktu";
      case "pulang":
        return "Siswa pulang lebih awal karena ada kepentingan";
      default:
        return status;
    }
  };

  const columns = useMemo(() => [
    { 
      key: 'no', 
      label: 'No',
      render: (value: any, row: any, index: number) => index + 1,
      style: { textAlign: 'center' as const, width: '50px' }
    },
    { key: 'nisn', label: 'NISN', style: { width: '120px' } },
    { key: 'namaSiswa', label: 'Nama Siswa', style: { width: '200px' } },
    { key: 'mataPelajaran', label: 'Mata Pelajaran', style: { width: '150px' } },
    { key: 'namaGuru', label: 'Nama Guru', style: { width: '150px' } },
    { 
      key: 'status', 
      label: 'Status',
      style: { textAlign: 'center' as const, width: '150px' },
      render: (value: StatusType, row: KehadiranRow) => (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <StatusButton status={value} siswa={row} />
        </div>
      )
    },
    { 
      key: 'actions', 
      label: 'Aksi',
      style: { textAlign: 'center' as const, width: '80px' },
      render: (value: any, row: KehadiranRow) => (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <button
            onClick={() => handleOpenEdit(row)}
            style={{
              backgroundColor: 'white',
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
            <Edit size={18} color="#374151" />
          </button>
        </div>
      )
    },
  ], []);

  const [editingRow, setEditingRow] = useState<KehadiranRow | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<StatusType>('hadir');
  const [editKeterangan, setEditKeterangan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isPerizinanOpen, setIsPerizinanOpen] = useState(false);
  const [perizinanList, setPerizinanList] = useState<Perizinan[]>([]);
  const [perizinanData, setPerizinanData] = useState({
    nisn: '',
    namaSiswa: '',
    alasan: '',
    alasanDetail: '',
    mapel: '',
    namaGuru: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    file1: undefined as File | undefined,
    file2: undefined as File | undefined,
  });
  const [isPerizinanListOpen, setIsPerizinanListOpen] = useState(false);

  // Opsi status (5 status saja)
  const statusOptions = [
    { label: 'Hadir', value: 'hadir' as StatusType },
    { label: 'Sakit', value: 'sakit' as StatusType },
    { label: 'Izin', value: 'izin' as StatusType },
    { label: 'Tidak Hadir', value: 'tidak-hadir' as StatusType },
    { label: 'Pulang', value: 'pulang' as StatusType },
  ];

  const perizinanMapelOptions = useMemo(() => {
    const mapelSet = new Set(
      rows.map((r) => r.mataPelajaran).filter((v) => v && v !== '-')
    );
    return [
      { label: 'Pilih Mata Pelajaran', value: '' },
      ...Array.from(mapelSet).map((mapel) => ({
        label: mapel,
        value: mapel,
      })),
    ];
  }, [rows]);

  const handleOpenEdit = (row: KehadiranRow) => {
    setEditingRow(row);
    setEditStatus(row.status);
    setEditKeterangan(row.keterangan || '');
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setEditingRow(null);
    setEditKeterangan('');
    setIsSubmitting(false);
  };

  const handleSubmitEdit = async () => {
    if (!editingRow) return;
    
    setIsSubmitting(true);
    
    // Validasi untuk status yang memerlukan keterangan
    if ((editStatus === 'pulang' || editStatus === 'izin' || editStatus === 'sakit') && !editKeterangan.trim()) {
      await popupAlert(`⚠️ Mohon isi keterangan untuk status ${editStatus}`);
      setIsSubmitting(false);
      return;
    }
    
    setTimeout(async () => {
      setRows((prev) =>
        prev.map((r) =>
          r.id === editingRow.id 
            ? { 
                ...r, 
                status: editStatus,
                keterangan: editKeterangan.trim(),
                waktuHadir: editStatus === 'hadir' ? '07:30 WIB' : undefined
              } 
            : r
        )
      );
      setIsSubmitting(false);
      setIsEditOpen(false);
      setEditingRow(null);
      setEditKeterangan('');
      await popupAlert('✅ Status kehadiran berhasil diperbarui!');
    }, 300);
  };

  const handleBuatPerizinan = () => {
    setIsPerizinanOpen(true);
  };

  const handleLihatRekap = () => {
    onMenuClick('rekap-kehadiran-siswa');
  };

  const handleClosePerizinan = () => {
    setIsPerizinanOpen(false);
    setPerizinanData({
      nisn: '',
      namaSiswa: '',
      alasan: '',
      alasanDetail: '',
      mapel: '',
      namaGuru: '',
      tanggalMulai: '',
      tanggalSelesai: '',
      file1: undefined,
      file2: undefined,
    });
  };

  const handleSubmitPerizinan = async () => {
    if (!perizinanData.nisn || !perizinanData.alasan || !perizinanData.tanggalMulai) {
      await popupAlert('⚠️ Mohon isi semua field yang diperlukan');
      return;
    }
    
    let statusKehadiran: StatusType = 'izin';
    
    if (perizinanData.alasan === 'pulang') {
      statusKehadiran = 'pulang';
    } else if (perizinanData.alasan === 'sakit') {
      statusKehadiran = 'sakit';
    } else if (perizinanData.alasan === 'izin') {
      statusKehadiran = 'izin';
    }
    
    const newPerizinan: Perizinan = {
      id: Date.now().toString(),
      nisn: perizinanData.nisn,
      namaSiswa: perizinanData.namaSiswa,
      alasan: perizinanData.alasan,
      alasanDetail: perizinanData.alasanDetail,
      mapel: perizinanData.mapel,
      namaGuru: perizinanData.namaGuru,
      tanggalMulai: perizinanData.tanggalMulai,
      tanggalSelesai: perizinanData.tanggalSelesai || perizinanData.tanggalMulai,
      status: 'pending',
      createdAt: new Date().toLocaleDateString('id-ID'),
      file1: perizinanData.file1,
      file2: perizinanData.file2,
    };
    
    setRows(prevRows => 
      prevRows.map(row => {
        if (row.nisn === perizinanData.nisn) {
          return {
            ...row,
            status: statusKehadiran,
            keterangan: perizinanData.alasanDetail || `Perizinan: ${perizinanData.alasan}`,
            mataPelajaran: perizinanData.mapel || row.mataPelajaran,
            namaGuru: perizinanData.namaGuru || row.namaGuru
          };
        }
        return row;
      })
    );
    
    setTimeout(async () => {
      setPerizinanList([...perizinanList, newPerizinan]);
      
      const fileInfo = [];
      if (perizinanData.file1) fileInfo.push(`File 1: ${perizinanData.file1.name}`);
      if (perizinanData.file2) fileInfo.push(`File 2: ${perizinanData.file2?.name}`);
      
      await popupAlert(`✅ Perizinan berhasil dibuat!\n\n` +
            `Siswa: ${perizinanData.namaSiswa}\n` +
            `Alasan: ${perizinanData.alasan}\n` +
            `Status Kehadiran: ${statusKehadiran}\n` +
            `Periode: ${perizinanData.tanggalMulai} - ${perizinanData.tanggalSelesai || perizinanData.tanggalMulai}\n` +
            (fileInfo.length > 0 ? 'File: ' + fileInfo.join(', ') : ''));
      
      handleClosePerizinan();
    }, 300);
  };

  const handleDeletePerizinan = async (id: string) => {
    if (await popupConfirm('Apakah Anda yakin ingin menghapus perizinan ini?')) {
      setPerizinanList(perizinanList.filter((d) => d.id !== id));
      await popupAlert('✅ Perizinan berhasil dihapus');
    }
  };

  const handleUpdatePerizinanStatus = (id: string, status: Perizinan['status']) => {
    setPerizinanList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d))
    );
  };

  const handleOpenDatePicker = () => {
    setTempDate(selectedDate || formattedDate);
    setShowDatePicker(true);
  };

  const handleCloseDatePicker = () => {
    setShowDatePicker(false);
    setTempDate('');
  };

  const handleApplyDate = () => {
    if (tempDate) {
      setSelectedDate(tempDate);
    }
    setShowDatePicker(false);
  };

  const handleClearDate = () => {
    setSelectedDate('');
    setShowDatePicker(false);
  };

  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return formattedDate;
    return dateStr;
  };

  const parseDateToInput = (dateStr: string) => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  };

  const formatInputToDate = (inputStr: string) => {
    if (!inputStr) return '';
    const [year, month, day] = inputStr.split('-');
    return `${day}-${month}-${year}`;
  };

  // Fungsi helper untuk DetailRow di modal
  const DetailRow = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 16,
      paddingBottom: 12,
      borderBottom: '1px solid #E5E7EB',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon}
        <div style={{ fontWeight: 600, color: '#374151' }}>{label} :</div>
      </div>
      <div style={{ fontWeight: 500, color: '#1F2937', textAlign: 'right' }}>
        {value}
      </div>
    </div>
  );

  return (
    <WalikelasLayout
      pageTitle="Kehadiran Siswa"
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
        padding: isMobile ? '16px' : '32px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}>
        {/* Top Info Section */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '20px',
          paddingBottom: '20px',
          borderBottom: '1px solid #E5E7EB',
          marginBottom: '20px',
        }}>
          {/* Left Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            flex: 1,
          }}>
            {/* Date Badge */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={handleOpenDatePicker}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#0F172A',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minWidth: '180px',
                  justifyContent: 'space-between',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1E293B'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0F172A'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} color="#FFFFFF" />
                  <span>
                    {formatDateForDisplay(selectedDate)}
                  </span>
                </div>
                <ChevronDown size={14} color="#FFFFFF" />
              </button>
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

              <BookOpen size={24} color="#FFFFFF" />
              <div style={{ zIndex: 1 }}>
                <div style={{ fontSize: '16px', fontWeight: '700' }}>{kelasInfo.namaKelas}</div>
                <div style={{ fontSize: '13px', opacity: 0.8 }}>Semua Mata Pelajaran</div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            flex: 1,
            minWidth: isMobile ? '100%' : 'auto',
          }}>
            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              flexWrap: 'wrap',
              justifyContent: isMobile ? 'flex-start' : 'flex-end',
            }}>
              <button
                onClick={handleLihatRekap}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#3B82F6',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.4)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}
              >
                <FileText size={15} />
                <span>Lihat Rekap</span>
              </button>
              
              <button
                onClick={handleBuatPerizinan}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.4)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10B981'}
              >
                <ClipboardPlus size={15} />
                <span>Buat Perizinan</span>
              </button>
            </div>

            {/* Statistics */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isMobile ? 'flex-start' : 'flex-end',
              gap: '20px',
              backgroundColor: '#F9FAFB',
              padding: '12px 20px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              maxWidth: 'fit-content',
              marginLeft: isMobile ? '0' : 'auto',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '50px',
              }}>
                <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '500', marginBottom: '2px' }}>Hadir</span>
                <span style={{ fontSize: '20px', color: '#1FA83D', fontWeight: '700' }}>{totalHadir}</span>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '50px',
              }}>
                <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '500', marginBottom: '2px' }}>Izin</span>
                <span style={{ fontSize: '20px', color: '#ACA40D', fontWeight: '700' }}>{totalIzin}</span>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '50px',
              }}>
                <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '500', marginBottom: '2px' }}>Sakit</span>
                <span style={{ fontSize: '20px', color: '#520C8F', fontWeight: '700' }}>{totalSakit}</span>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '50px',
              }}>
                <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '500', marginBottom: '2px' }}>Tidak Hadir</span>
                <span style={{ fontSize: '20px', color: '#D90000', fontWeight: '700' }}>{totalTidakHadir}</span>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '50px',
              }}>
                <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '500', marginBottom: '2px' }}>Pulang</span>
                <span style={{ fontSize: '20px', color: '#2F85EB', fontWeight: '700' }}>{totalPulang}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
          padding: '12px',
          backgroundColor: '#F9FAFB',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#3B82F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <BookOpen size={18} color="#FFFFFF" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>
              Filter Mata Pelajaran
            </span>
            <div style={{ width: '200px' }}>
              <Select
                value={selectedMapel}
                onChange={(val) => setSelectedMapel(val)}
                options={mapelOptions}
                placeholder="Pilih mata pelajaran"
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div style={{
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          backgroundColor: 'white',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F1F5F9' }}>
                <th style={{ ...styles.th, color: 'black' }}>No</th>
                <th style={{ ...styles.th, color: 'black' }}>NISN</th>
                <th style={{ ...styles.th, color: 'black' }}>Nama Siswa</th>
                <th style={{ ...styles.th, color: 'black' }}>Mata Pelajaran</th>
                <th style={{ ...styles.th, color: 'black' }}>Guru</th>
                <th style={{ ...styles.th, textAlign: 'center' as const, color: 'black' }}>Status</th>
                <th style={{ ...styles.th, textAlign: 'center' as const, color: 'black' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => (
                <tr key={row.id} style={{
                  borderBottom: '1px solid #E5E7EB',
                  backgroundColor: index % 2 === 0 ? '#F8FAFC' : 'white'
                }}>
                  <td style={styles.td}>{index + 1}.</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '15px' }}>{row.nisn}</td>
                  <td style={{ ...styles.td, fontWeight: '700', color: '#111827' }}>{row.namaSiswa}</td>
                  <td style={styles.td}>{row.mataPelajaran}</td>
                  <td style={styles.td}>{row.namaGuru}</td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <StatusButton status={row.status} siswa={row} />
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <button
                      onClick={() => handleOpenEdit(row)}
                      style={{
                        backgroundColor: 'white',
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
                      <Edit size={18} color="#374151" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredRows.length === 0 && (
            <div style={{ 
              padding: '40px 20px', 
              textAlign: 'center', 
              backgroundColor: '#F9FAFB', 
              borderRadius: '8px',
              borderTop: '1px solid #E5E7EB'
            }}>
              <p style={{ margin: 0, color: '#6B7280', fontSize: '14px' }}>
                📝 Belum ada data kehadiran siswa.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Date Picker */}
      {showDatePicker && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '24px',
              width: '90%',
              maxWidth: '400px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#111827' }}>
                Pilih Tanggal
              </h2>
              <button
                onClick={handleCloseDatePicker}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#6B7280',
                  padding: '4px',
                  borderRadius: '4px',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#111827',
              }}>
                Pilih Tanggal
              </label>
              <input
                type="date"
                value={parseDateToInput(tempDate)}
                onChange={(e) => setTempDate(formatInputToDate(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  backgroundColor: '#FFFFFF',
                }}
              />
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '20px',
            }}>
              {selectedDate && (
                <button
                  onClick={handleClearDate}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#FEE2E2',
                    color: '#991B1B',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                >
                  Hapus Tanggal
                </button>
              )}
              <button
                onClick={handleApplyDate}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3B82F6',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Kehadiran */}
      <FormModal
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        title="Edit Status Kehadiran"
        onSubmit={handleSubmitEdit}
        submitLabel="Simpan"
        isSubmitting={isSubmitting}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {editingRow && (
            <>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6B7280' }}>
                  Nama Siswa
                </p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                  {editingRow.namaSiswa}
                </p>
              </div>
              
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6B7280' }}>
                  Mata Pelajaran
                </p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                  {editingRow.mataPelajaran}
                </p>
              </div>
              
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6B7280' }}>
                  Tanggal
                </p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                  {editingRow.tanggal}
                </p>
              </div>
            </>
          )}
          
          <div>
            <p
              style={{
                margin: 0,
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 600,
                color: '#111827',
              }}
            >
              Ubah Status Kehadiran
            </p>
            <Select
              value={editStatus}
              onChange={(val) => setEditStatus(val as StatusType)}
              options={statusOptions}
              placeholder="Pilih status kehadiran"
            />
          </div>
          
          {(editStatus === 'pulang' || editStatus === 'izin' || editStatus === 'sakit') && (
            <div>
              <p
                style={{
                  margin: 0,
                  marginBottom: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#111827',
                }}
              >
                Keterangan
              </p>
              <textarea
                value={editKeterangan}
                onChange={(e) => setEditKeterangan(e.target.value)}
                placeholder={`Masukkan keterangan untuk status ${editStatus}`}
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  backgroundColor: '#FFFFFF',
                }}
                required
              />
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#6B7280', fontStyle: 'italic' }}>
                *Keterangan wajib diisi untuk status ini
              </p>
            </div>
          )}
        </div>
      </FormModal>

      {/* Modal Detail Status - SAMA DENGAN KehadiranSiswaGuru */}
      {isDetailModalOpen && selectedSiswa && (
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
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '420px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Header Modal */}
            <div style={{
              backgroundColor: '#0B2948',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#FFFFFF',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <EyeIcon size={24} />
                <h3 style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 700,
                }}>
                  Detail Kehadiran
                </h3>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0,
                }}
              >
                <XIcon size={24} />
              </button>
            </div>

            {/* Content Modal */}
            <div style={{ 
              padding: 24,
              overflowY: 'auto',
              flex: 1,
            }}>
              {/* Row Tanggal */}
              <DetailRow 
                label="Tanggal" 
                value={selectedSiswa.tanggal || formattedDate} 
                icon={<Calendar size={16} color="#6B7280" />}
              />

              {/* Row Jam Pelajaran */}
              <DetailRow 
                label="Jam Pelajaran" 
                value={selectedSiswa.jamPelajaran || '1-4'} 
              />

              {/* Row Nama Siswa */}
              <DetailRow 
                label="Nama Siswa" 
                value={selectedSiswa.namaSiswa} 
              />

              {/* Row NISN */}
              <DetailRow 
                label="NISN" 
                value={selectedSiswa.nisn} 
              />

              {/* Row Mata Pelajaran */}
              <DetailRow 
                label="Mata Pelajaran" 
                value={selectedSiswa.mataPelajaran} 
              />

              {/* Row Guru */}
              <DetailRow 
                label="Guru" 
                value={selectedSiswa.namaGuru} 
              />

              {/* Row Waktu Hadir (khusus untuk status hadir) */}
              {selectedSiswa.status === 'hadir' && selectedSiswa.waktuHadir && (
                <DetailRow 
                  label="Waktu Hadir" 
                  value={selectedSiswa.waktuHadir} 
                  icon={<TimeIcon size={16} />}
                />
              )}

              {/* Row Status */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 24,
                paddingBottom: 12,
                borderBottom: '1px solid #E5E7EB',
              }}>
                <div style={{ fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {selectedSiswa.status === 'hadir' && <CheckIcon size={18} color="#1FA83D" />}
                  Status :
                </div>
                <div>
                  <span style={{
                    backgroundColor: STATUS_COLORS[selectedSiswa.status],
                    color: '#FFFFFF',
                    padding: '4px 16px',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                  }}>
                    {selectedSiswa.status === 'tidak-hadir' ? 'Tidak Hadir' :
                     selectedSiswa.status === 'sakit' ? 'Sakit' :
                     selectedSiswa.status === 'izin' ? 'Izin' :
                     selectedSiswa.status === 'hadir' ? 'Hadir' :
                     'Pulang'}
                  </span>
                </div>
              </div>

              {/* Info Box - Ditampilkan untuk SEMUA status */}
              <div style={{
                backgroundColor: selectedSiswa.status === 'hadir' ? '#F0FDF4' : '#EFF6FF',
                border: `1px solid ${selectedSiswa.status === 'hadir' ? '#BBF7D0' : '#BFDBFE'}`,
                borderRadius: 8,
                padding: 16,
                textAlign: 'center',
                marginBottom: (selectedSiswa.status === 'izin' || selectedSiswa.status === 'sakit' || selectedSiswa.status === 'pulang') && selectedSiswa.keterangan ? 24 : 0,
              }}>
                <div style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: selectedSiswa.status === 'hadir' ? '#166534' : '#1E40AF',
                }}>
                  {getStatusText(selectedSiswa.status, selectedSiswa.waktuHadir)}
                </div>
              </div>

              {/* Keterangan untuk izin, sakit, dan pulang */}
              {(selectedSiswa.status === 'izin' || selectedSiswa.status === 'sakit' || selectedSiswa.status === 'pulang') && selectedSiswa.keterangan && (
                <div>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: 12,
                  }}>
                    Keterangan :
                  </div>
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: 8,
                    border: '1px solid #E5E7EB',
                  }}>
                    <p style={{
                      margin: 0,
                      fontSize: 14,
                      color: '#6B7280',
                      lineHeight: 1.5,
                    }}>
                      {selectedSiswa.keterangan}
                    </p>
                  </div>
                </div>
              )}

              {/* Area Bukti Foto untuk izin, sakit, dan pulang */}
              {(selectedSiswa.status === 'izin' || selectedSiswa.status === 'sakit' || selectedSiswa.status === 'pulang') && (
                <div style={{ marginTop: selectedSiswa.keterangan ? 24 : 0 }}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: 12,
                  }}>
                    Bukti Foto :
                  </div>
                  <div style={{
                    padding: '40px 16px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: 8,
                    border: '1px solid #E5E7EB',
                    minHeight: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <p style={{
                      margin: 0,
                      fontSize: 14,
                      color: '#9CA3AF',
                      textAlign: 'center',
                    }}>
                      [Area untuk menampilkan bukti foto]
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Input Perizinan - DENGAN SCROLL DAN WARNA AWAL */}
      {isPerizinanOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Header Modal - WARNA NAVY */}
            <div
              style={{
                backgroundColor: '#0F172A',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
                color: '#FFFFFF',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <ClipboardPlus size={20} color="#FFFFFF" />
                <h2 style={{ 
                  margin: 0, 
                  fontSize: '18px', 
                  fontWeight: '700',
                  color: '#FFFFFF'
                }}>
                  Buat Perizinan
                </h2>
              </div>
              <button
                onClick={handleClosePerizinan}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#FFFFFF',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Modal with Scroll */}
            <div
              style={{
                padding: '24px',
                overflowY: 'auto',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              {/* Form Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <p
                    style={{
                      margin: 0,
                      marginBottom: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#111827',
                    }}
                  >
                    Pilih Siswa
                  </p>
                  <Select
                    value={perizinanData.nisn}
                    onChange={(val) => {
                      const selectedStudent = rows.find((r) => r.nisn === val);
                      setPerizinanData((prev) => ({
                        ...prev,
                        nisn: val,
                        namaSiswa: selectedStudent?.namaSiswa || '',
                      }));
                    }}
                    options={rows.map((r) => ({
                      label: `${r.namaSiswa} (${r.nisn})`,
                      value: r.nisn,
                    }))}
                    placeholder="Pilih siswa"
                  />
                </div>

                <div>
                  <p
                    style={{
                      margin: 0,
                      marginBottom: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#111827',
                    }}
                  >
                    Pilih Alasan
                  </p>
                  <Select
                    value={perizinanData.alasan}
                    onChange={(val) =>
                      setPerizinanData((prev) => ({
                        ...prev,
                        alasan: val,
                      }))
                    }
                    options={[
                      { label: 'Izin', value: 'izin' },
                      { label: 'Sakit', value: 'sakit' },
                      { label: 'Pulang', value: 'pulang' },
                    ]}
                    placeholder="Pilih alasan"
                  />
                </div>

                <div>
                  <p
                    style={{
                      margin: 0,
                      marginBottom: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#111827',
                    }}
                  >
                    Pilih Mata Pelajaran
                  </p>
                  <Select
                    value={perizinanData.mapel}
                    onChange={(val) =>
                      setPerizinanData((prev) => ({
                        ...prev,
                        mapel: val,
                      }))
                    }
                    options={perizinanMapelOptions}
                    placeholder="Pilih mata pelajaran"
                  />
                </div>

                <div>
                  <p
                    style={{
                      margin: 0,
                      marginBottom: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#111827',
                    }}
                  >
                    Nama Guru
                  </p>
                  <input
                    type="text"
                    value={perizinanData.namaGuru}
                    onChange={(e) =>
                      setPerizinanData((prev) => ({
                        ...prev,
                        namaGuru: e.target.value,
                      }))
                    }
                    placeholder="Masukkan nama guru"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      backgroundColor: '#FFFFFF',
                      color: '#1F2937',
                    }}
                  />
                </div>

                <div>
                  <p
                    style={{
                      margin: 0,
                      marginBottom: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#111827',
                    }}
                  >
                    Tanggal Berlaku
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <p style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: 13, 
                        color: '#6B7280', 
                        fontWeight: 500 
                      }}>
                        Tanggal mulai
                      </p>
                      <input
                        type="date"
                        value={perizinanData.tanggalMulai}
                        onChange={(e) =>
                          setPerizinanData((prev) => ({
                            ...prev,
                            tanggalMulai: e.target.value,
                          }))
                        }
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                          backgroundColor: '#FFFFFF',
                          color: '#1F2937',
                        }}
                      />
                    </div>

                    <div>
                      <p style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: 13, 
                        color: '#6B7280', 
                        fontWeight: 500 
                      }}>
                        Tanggal selesai (opsional)
                      </p>
                      <input
                        type="date"
                        value={perizinanData.tanggalSelesai}
                        onChange={(e) =>
                          setPerizinanData((prev) => ({
                            ...prev,
                            tanggalSelesai: e.target.value,
                          }))
                        }
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                          backgroundColor: '#FFFFFF',
                          color: '#1F2937',
                        }}
                      />
                    </div>

                    <div>
                      <p style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: 13, 
                        color: '#6B7280', 
                        fontWeight: 500 
                      }}>
                        Keterangan
                      </p>
                      <textarea
                        value={perizinanData.alasanDetail}
                        onChange={(e) =>
                          setPerizinanData((prev) => ({
                            ...prev,
                            alasanDetail: e.target.value,
                          }))
                        }
                        placeholder="Masukan keterangan"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontFamily: 'inherit',
                          resize: 'vertical',
                          minHeight: '80px',
                          backgroundColor: '#FFFFFF',
                          color: '#1F2937',
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p
                    style={{
                      margin: 0,
                      marginBottom: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#111827',
                    }}
                  >
                    Tambahkan foto
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '2px dashed #D1D5DB',
                        borderRadius: '8px',
                        backgroundColor: '#F9FAFB',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*,.pdf,.doc,.docx';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            setPerizinanData((prev) => ({
                              ...prev,
                              file1: file,
                            }));
                          }
                        };
                        input.click();
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#F3F4F6';
                        e.currentTarget.style.borderColor = '#9CA3AF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#F9FAFB';
                        e.currentTarget.style.borderColor = '#D1D5DB';
                      }}
                    >
                      <Upload size={24} color="#6B7280" />
                      <span style={{ 
                        fontSize: '14px', 
                        color: '#6B7280', 
                        fontWeight: 500 
                      }}>
                        {perizinanData.file1 ? perizinanData.file1.name : 'Upload file pertama'}
                      </span>
                    </div>

                    <div
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '2px dashed #D1D5DB',
                        borderRadius: '8px',
                        backgroundColor: '#F9FAFB',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*,.pdf,.doc,.docx';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            setPerizinanData((prev) => ({
                              ...prev,
                              file2: file,
                            }));
                          }
                        };
                        input.click();
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#F3F4F6';
                        e.currentTarget.style.borderColor = '#9CA3AF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#F9FAFB';
                        e.currentTarget.style.borderColor = '#D1D5DB';
                      }}
                    >
                      <Upload size={24} color="#6B7280" />
                      <span style={{ 
                        fontSize: '14px', 
                        color: '#6B7280', 
                        fontWeight: 500 
                      }}>
                        {perizinanData.file2 ? perizinanData.file2.name : 'Upload file kedua (opsional)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div
              style={{
                padding: '20px 24px',
                borderTop: '1px solid #E5E7EB',
                backgroundColor: '#F9FAFB',
                flexShrink: 0,
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={handleClosePerizinan}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#FFFFFF',
                  color: '#374151',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  minWidth: '100px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                  e.currentTarget.style.borderColor = '#9CA3AF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#D1D5DB';
                }}
              >
                Batal
              </button>
              <button
                onClick={handleSubmitPerizinan}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#3B82F6',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  minWidth: '100px',
                  boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.4)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                  e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(37, 99, 235, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3B82F6';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(37, 99, 235, 0.4)';
                }}
              >
                Buat
              </button>
            </div>
          </div>
        </div>
      )}
    </WalikelasLayout>
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

