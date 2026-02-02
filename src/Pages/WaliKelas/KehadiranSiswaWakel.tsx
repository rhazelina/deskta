import { useState, useEffect, useMemo } from 'react';
import WalikelasLayout from '../../component/Walikelas/layoutwakel';
import { StatusBadge } from '../../component/Shared/StatusBadge';
import { Button } from '../../component/Shared/Button';
import { FormModal } from '../../component/Shared/FormModal';
import { Select } from '../../component/Shared/Select';
import { Table } from '../../component/Shared/Table';
import { Calendar, BookOpen, FileText, ClipboardList, ClipboardPlus } from 'lucide-react';

type StatusType = 'hadir' | 'terlambat' | 'tidak-hadir' | 'sakit' | 'izin' | 'tanpa-keterangan' | 'pulang';

interface KehadiranRow {
  id: string;
  nisn: string;
  namaSiswa: string;
  mataPelajaran: string;
  tanggal: string;
  status: StatusType;
}

interface Dispensasi {
  id: string;
  nisn: string;
  namaSiswa: string;
  alasan: string;
  alasanDetail?: string;
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMapel, setSelectedMapel] = useState('all');


  const kelasInfo = {
    namaKelas: 'X Mekatronika 1',
  };

  const [rows, setRows] = useState<KehadiranRow[]>([
    { id: '1', nisn: '1348576392', namaSiswa: 'Wito Suherman Suhermin', mataPelajaran: 'Matematika', tanggal: '2026-01-25', status: 'hadir' },
    { id: '2', nisn: '1348576393', namaSiswa: 'Ahmad Fauzi', mataPelajaran: 'Matematika', tanggal: '2026-01-25', status: 'hadir' },
    { id: '3', nisn: '1348576394', namaSiswa: 'Siti Nurhaliza', mataPelajaran: 'Fisika', tanggal: '2026-01-26', status: 'izin' },
    { id: '4', nisn: '1348576395', namaSiswa: 'Budi Santoso', mataPelajaran: 'Fisika', tanggal: '2026-01-26', status: 'sakit' },
    { id: '5', nisn: '1348576396', namaSiswa: 'Dewi Sartika', mataPelajaran: 'Bahasa Indonesia', tanggal: '2026-01-27', status: 'tanpa-keterangan' },
    { id: '6', nisn: '1348576397', namaSiswa: 'Rizki Ramadhan', mataPelajaran: 'Bahasa Indonesia', tanggal: '2026-01-27', status: 'tanpa-keterangan' },
    { id: '7', nisn: '1348576398', namaSiswa: 'Fitri Handayani', mataPelajaran: 'Matematika', tanggal: '2026-01-28', status: 'sakit' },
    { id: '8', nisn: '1348576399', namaSiswa: 'Andi Wijaya', mataPelajaran: 'Fisika', tanggal: '2026-01-28', status: 'hadir' },
    { id: '9', nisn: '1348576400', namaSiswa: 'Rina Pratiwi', mataPelajaran: 'Matematika', tanggal: '2026-01-29', status: 'izin' },
    { id: '10', nisn: '1348576401', namaSiswa: 'Joko Susilo', mataPelajaran: 'Bahasa Indonesia', tanggal: '2026-01-29', status: 'hadir' },
    { id: '11', nisn: '1348576402', namaSiswa: 'Maya Sari', mataPelajaran: 'Matematika', tanggal: '2026-01-30', status: 'hadir' },
    { id: '12', nisn: '1348576403', namaSiswa: 'Dian Purnama', mataPelajaran: 'Fisika', tanggal: '2026-01-30', status: 'sakit' },
    { id: '13', nisn: '1348576404', namaSiswa: 'Hendra Gunawan', mataPelajaran: '-', tanggal: '2026-01-30', status: 'pulang' },
    { id: '14', nisn: '1348576405', namaSiswa: 'Lina Marlina', mataPelajaran: 'Matematika', tanggal: '2026-01-30', status: 'hadir' },
    { id: '15', nisn: '1348576406', namaSiswa: 'Budi Hartono', mataPelajaran: 'Bahasa Indonesia', tanggal: '2026-01-30', status: 'izin' },
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
      { label: 'Semua Mapel', value: 'all' },
      ...Array.from(mapelSet).map((mapel) => ({
        label: mapel,
        value: mapel,
      })),
    ];
  }, [rows]);

  const filteredRows = useMemo(() => {
    if (!startDate || !endDate) return rows;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return rows;
    const startTime = Math.min(start.getTime(), end.getTime());
    const endTime = Math.max(start.getTime(), end.getTime());
    return rows.filter((r) => {
      const rowDate = new Date(r.tanggal);
      if (Number.isNaN(rowDate.getTime())) return false;
      const time = rowDate.getTime();
      const matchDate = time >= startTime && time <= endTime;
      const matchMapel =
        selectedMapel === 'all' || r.mataPelajaran === selectedMapel;
      return matchDate && matchMapel;
    });
  }, [rows, startDate, endDate, selectedMapel]);

  const totalPulang = filteredRows.filter((r) => r.status === 'pulang').length;
  const totalIzin = filteredRows.filter((r) => r.status === 'izin').length;
  const totalSakit = filteredRows.filter((r) => r.status === 'sakit').length;
  const totalTanpaKeterangan = filteredRows.filter((r) => r.status === 'tanpa-keterangan' || r.status === 'tidak-hadir').length;

  const columns = useMemo(() => [
    { key: 'nisn', label: 'NISN' },
    { key: 'namaSiswa', label: 'Nama Siswa' },
    { key: 'mataPelajaran', label: 'Mata Pelajaran' },
    { key: 'tanggal', label: 'Tanggal' },
    {
      key: 'status',
      label: 'Status',
      render: (value: StatusType) => {
        const displayStatus = value === 'pulang' ? 'hadir' : value;
        return <StatusBadge status={displayStatus as 'hadir' | 'terlambat' | 'tidak-hadir' | 'sakit' | 'izin' | 'tanpa-keterangan'} />;
      },
    },
  ], []);

  const [editingRow, setEditingRow] = useState<KehadiranRow | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<StatusType>('hadir');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isPerizinanOpen, setIsPerizinanOpen] = useState(false);
  const [dispensasiList, setDispensasiList] = useState<Dispensasi[]>([]);
  const [perizinanData, setPerizinanData] = useState({
    nisn: '',
    namaSiswa: '',
    alasan: '',
    mapel: '',
    namaGuru: '',
    tanggalBerlaku: '',
    keterangan: '',
    file: undefined as File | undefined,
  });
  const [isDispensasiListOpen, setIsDispensasiListOpen] = useState(false);

  const statusOptions = [
    { label: 'Hadir', value: 'hadir' as StatusType },
    { label: 'Sakit', value: 'sakit' as StatusType },
    { label: 'Izin', value: 'izin' as StatusType },
    { label: 'Tanpa Keterangan', value: 'tanpa-keterangan' as StatusType },
    { label: 'Pulang', value: 'pulang' as StatusType },
  ];

  const handleOpenEdit = (row: KehadiranRow) => {
    setEditingRow(row);
    setEditStatus(row.status);
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setEditingRow(null);
    setIsSubmitting(false);
  };

  const handleSubmitEdit = () => {
    if (!editingRow) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setRows((prev) =>
        prev.map((r) =>
          r.id === editingRow.id ? { ...r, status: editStatus } : r
        )
      );
      setIsSubmitting(false);
      setIsEditOpen(false);
      setEditingRow(null);
      alert('✅ Status kehadiran berhasil diperbarui!');
    }, 300);
  };

  const handleBuatPerizinan = () => {
    setIsPerizinanOpen(true);
  };

  const handleTableEdit = (row: KehadiranRow) => {
    handleOpenEdit(row);
  };

  const handleClosePerizinan = () => {
    setIsPerizinanOpen(false);
    setPerizinanData({
      nisn: '',
      namaSiswa: '',
      alasan: '',
      mapel: '',
      namaGuru: '',
      tanggalBerlaku: '',
      keterangan: '',
      file: undefined,
    });
  };

  const handleSubmitPerizinan = () => {
    if (!perizinanData.nisn || !perizinanData.alasan || !perizinanData.tanggalBerlaku) {
      alert('⚠️ Mohon isi semua field yang diperlukan');
      return;
    }

    const newDispensasi: Dispensasi = {
      id: Date.now().toString(),
      nisn: perizinanData.nisn,
      namaSiswa: perizinanData.namaSiswa,
      alasan: perizinanData.alasan,
      alasanDetail: perizinanData.keterangan,
      tanggalMulai: perizinanData.tanggalBerlaku,
      tanggalSelesai: perizinanData.tanggalBerlaku,
      status: 'pending',
      createdAt: new Date().toLocaleDateString('id-ID'),
      file1: perizinanData.file,
    };

    setTimeout(() => {
      setDispensasiList([...dispensasiList, newDispensasi]);

      const fileInfo = perizinanData.file ? `File: ${perizinanData.file.name}` : '';

      alert(`✅ Perizinan untuk ${perizinanData.namaSiswa} berhasil dibuat!\n\nAlasan: ${perizinanData.alasan}\nTanggal: ${perizinanData.tanggalBerlaku}\nMata Pelajaran: ${perizinanData.mapel}\n${fileInfo}`);
      handleClosePerizinan();
    }, 300);
  };

  const handleDeleteDispensasi = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus perizinan ini?')) {
      setDispensasiList(dispensasiList.filter((d) => d.id !== id));
      alert('✅ Perizinan berhasil dihapus');
    }
  };

  const handleUpdateDispensasiStatus = (id: string, status: Dispensasi['status']) => {
    setDispensasiList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d))
    );
  };


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

  const styles = {
    container: {
      position: 'relative' as const,
      minHeight: '100%',
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      overflow: 'hidden',
      padding: isMobile ? '16px' : '32px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    },
    headerWrapper: {
      position: 'relative' as const,
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 24,
    },
    topBar: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: 16,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    leftActions: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: 12,
      alignItems: 'center',
    },
    rightActions: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: 12,
      justifyContent: 'flex-end',
    },
  };

  return (
    <WalikelasLayout
      pageTitle="Kehadiran Siswa"
      currentPage={currentPage as any}
      onMenuClick={onMenuClick}
      user={user}
      onLogout={onLogout}
    >
      <div style={styles.container}>
        <div style={styles.headerWrapper}>
          {/* ========== BARIS ATAS: PERIODE SEJAJAR DENGAN 4 CARD STATISTIK ========== */}
          <div
            style={{
              display: 'flex',
              alignItems: 'stretch',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            {/* PERIODE TANGGAL (lebih kecil, kiri) */}
            <div
              style={{
                backgroundColor: '#06254D',
                borderRadius: '8px',
                padding: '14px 18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minWidth: isMobile ? '100%' : '300px',
                flex: 1,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px',
                }}
              >
                <Calendar size={16} color="#FFFFFF" />
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                  }}
                >
                  Periode
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                {/* Start Date */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    border: '1px solid #E5E7EB',
                    flex: '1',
                    minWidth: '120px',
                  }}
                >
                  <Calendar size={14} color="#1F2937" strokeWidth={1.5} />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#374151',
                      cursor: 'pointer',
                      width: '100%',
                      backgroundColor: 'transparent',
                    }}
                  />
                </div>

                {/* Separator */}
                <span
                  style={{
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: '300',
                  }}
                >
                  --
                </span>

                {/* End Date */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    border: '1px solid #E5E7EB',
                    flex: '1',
                    minWidth: '120px',
                  }}
                >
                  <Calendar size={14} color="#1F2937" strokeWidth={1.5} />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#374151',
                      cursor: 'pointer',
                      width: '100%',
                      backgroundColor: 'transparent',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 4 CARD STATISTIK (kanan) */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                flex: 2,
                justifyContent: isMobile ? 'center' : 'flex-end',
              }}
            >
              {/* Card 1: Pulang */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  minWidth: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #E5E7EB',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6B7280',
                    textAlign: 'center',
                    marginBottom: '4px',
                  }}
                >
                  Pulang
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#111827',
                    textAlign: 'center',
                  }}
                >
                  {totalPulang}
                </div>
              </div>

              {/* Card 2: Izin */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  minWidth: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #E5E7EB',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6B7280',
                    textAlign: 'center',
                    marginBottom: '4px',
                  }}
                >
                  Izin
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#111827',
                    textAlign: 'center',
                  }}
                >
                  {totalIzin}
                </div>
              </div>

              {/* Card 3: Sakit */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  minWidth: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #E5E7EB',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6B7280',
                    textAlign: 'center',
                    marginBottom: '4px',
                  }}
                >
                  Sakit
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#111827',
                    textAlign: 'center',
                  }}
                >
                  {totalSakit}
                </div>
              </div>

              {/* Card 4: Tanpa Ket. */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  minWidth: '110px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #E5E7EB',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6B7280',
                    textAlign: 'center',
                    marginBottom: '4px',
                  }}
                >
                  Tanpa Ket.
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#111827',
                    textAlign: 'center',
                  }}
                >
                  {totalTanpaKeterangan}
                </div>
              </div>
            </div>
          </div>

          {/* Bar atas: tombol aksi */}
          <div style={styles.topBar}>
            <div style={styles.leftActions}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 12,
                  backgroundColor: '#06254D',
                  color: '#FFFFFF',
                  minWidth: isMobile ? '100%' : '320px',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: 'rgba(255, 255, 255, 0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <BookOpen size={18} color="#FFFFFF" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>
                    {kelasInfo.namaKelas}
                  </span>
                  <span style={{ fontSize: 12, opacity: 0.9 }}>
                    Pilih Mapel
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <Select
                    value={selectedMapel}
                    onChange={(val) => setSelectedMapel(val)}
                    options={mapelOptions}
                    placeholder="Pilih mapel"
                  />
                </div>
              </div>
            </div>

            {/* Bagian kanan: Button actions */}
            <div style={styles.rightActions}>
              {/* Tombol Lihat Rekap (Navigasi) */}
              <button
                onClick={() => onMenuClick('rekap-kehadiran-siswa')}
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
                <FileText size={16} color="#FFFFFF" />
                Lihat Rekap
              </button>

              {/* Tombol-tombol lain */}
              {dispensasiList.length > 0 && (
                <Button
                  label={`Daftar Dispensasi (${dispensasiList.length})`}
                  onClick={() => setIsDispensasiListOpen(true)}
                  icon={<ClipboardList size={16} />}
                />
              )}
              <Button
                label="Input Perizinan"
                variant="secondary"
                onClick={handleBuatPerizinan}
                icon={<ClipboardPlus size={16} />}
              />
            </div>
          </div>

          {/* Tabel kehadiran */}
          <Table
            columns={columns}
            data={filteredRows}
            onEdit={handleTableEdit}
            keyField="id"
            emptyMessage="Belum ada data kehadiran siswa."
          />
        </div>
      </div>

      {/* Modal Edit Kehadiran */}
      <FormModal
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        title="Edit Kehadiran"
        onSubmit={handleSubmitEdit}
        submitLabel="Simpan"
        isSubmitting={isSubmitting}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
              Pilih Kehadiran
            </p>
            <Select
              value={editStatus}
              onChange={(val) => setEditStatus(val as StatusType)}
              options={statusOptions}
              placeholder="Pilih status kehadiran"
            />
          </div>
        </div>
      </FormModal>

      {/* Modal Input Perizinan - SESUAI GAMBAR */}
      <FormModal
        isOpen={isPerizinanOpen}
        onClose={handleClosePerizinan}
        title="Input Perizinan"
        onSubmit={handleSubmitPerizinan}
        submitLabel="Buat"
        style={{ maxWidth: '500px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Pilih Siswa */}
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

          {/* Pilih Alasan */}
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
              Pilih alasan
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
                { label: 'Pulang', value: 'pulang' },
                { label: 'Dispenser', value: 'dispenser' },
              ]}
              placeholder="Izin/Pulang/Dispen"
            />
          </div>

          {/* Pilih Mapel */}
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
              Pilih mapel
            </p>
            <Select
              value={perizinanData.mapel}
              onChange={(val) =>
                setPerizinanData((prev) => ({
                  ...prev,
                  mapel: val,
                }))
              }
              options={[
                { label: 'Matematika (1-4)', value: 'Matematika (1-4)' },
                { label: 'Fisika (1-4)', value: 'Fisika (1-4)' },
                { label: 'Bahasa Indonesia (1-4)', value: 'Bahasa Indonesia (1-4)' },
                { label: 'Bahasa Inggris (1-4)', value: 'Bahasa Inggris (1-4)' },
                { label: 'Kimia (1-4)', value: 'Kimia (1-4)' },
              ]}
              placeholder="Matematika (1-4)"
            />
          </div>

          {/* Nama Guru */}
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
                padding: '10px',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                backgroundColor: '#FFFFFF',
              }}
            />
          </div>

          {/* Tanggal Berlaku */}
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
              Tanggal berlaku
            </p>
            <input
              type="date"
              value={perizinanData.tanggalBerlaku}
              onChange={(e) =>
                setPerizinanData((prev) => ({
                  ...prev,
                  tanggalBerlaku: e.target.value,
                }))
              }
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

          {/* Keterangan */}
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
              value={perizinanData.keterangan}
              onChange={(e) =>
                setPerizinanData((prev) => ({
                  ...prev,
                  keterangan: e.target.value,
                }))
              }
              placeholder="Masukan keterangan"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                minHeight: '80px',
                backgroundColor: '#FFFFFF',
              }}
            />
          </div>

          {/* Tambahkan Foto */}
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
            <button
              type="button"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*,.pdf,.doc,.docx';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    setPerizinanData((prev) => ({
                      ...prev,
                      file: file,
                    }));
                  }
                };
                input.click();
              }}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px dashed #D1D5DB',
                borderRadius: '8px',
                backgroundColor: '#F9FAFB',
                color: '#6B7280',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
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
              {perizinanData.file ? `File: ${perizinanData.file.name}` : 'Upload file'}
            </button>
          </div>
        </div>
      </FormModal>

      {/* Modal Daftar Dispensasi */}
      {isDispensasiListOpen && (
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
              maxWidth: '600px',
              maxHeight: '80vh',
              overflow: 'hidden',
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
                Daftar Dispensasi
              </h2>
              <button
                onClick={() => setIsDispensasiListOpen(false)}
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
                ✕
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
              {dispensasiList.length === 0 ? (
                <div style={{
                  padding: '30px 20px',
                  textAlign: 'center',
                  backgroundColor: '#F3F4F6',
                  borderRadius: '8px'
                }}>
                  <p style={{ margin: 0, color: '#6B7280', fontSize: '14px' }}>
                    📝 Belum ada dispensasi yang dibuat
                  </p>
                </div>
              ) : (
                <div>
                  {dispensasiList.map((dispensasi) => (
                    <div
                      key={dispensasi.id}
                      style={{
                        padding: '14px',
                        backgroundColor: '#F9FAFB',
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        marginBottom: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                            {dispensasi.namaSiswa} ({dispensasi.nisn})
                          </p>
                          <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#6B7280' }}>
                            <strong>Alasan:</strong> {dispensasi.alasan}
                          </p>
                          <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#6B7280' }}>
                            <strong>Detail:</strong> {dispensasi.alasanDetail || '-'}
                          </p>
                          <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#6B7280' }}>
                            <strong>Periode:</strong> {dispensasi.tanggalMulai} - {dispensasi.tanggalSelesai}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                            <span
                              style={{
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 600,
                                backgroundColor:
                                  dispensasi.status === 'approved' ? '#ECFDF5' :
                                    dispensasi.status === 'rejected' ? '#FEE2E2' : '#FFFBEB',
                                color:
                                  dispensasi.status === 'approved' ? '#047857' :
                                    dispensasi.status === 'rejected' ? '#991B1B' : '#B45309',
                              }}
                            >
                              {dispensasi.status === 'pending' ? '⏳ Menunggu' :
                                dispensasi.status === 'approved' ? '✅ Disetujui' : '❌ Ditolak'}
                            </span>
                            <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                              {dispensasi.createdAt}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <button
                            onClick={() => handleUpdateDispensasiStatus(dispensasi.id, 'approved')}
                            disabled={dispensasi.status !== 'pending'}
                            style={{
                              padding: '6px 10px',
                              backgroundColor: dispensasi.status === 'pending' ? '#ECFDF5' : '#F3F4F6',
                              color: '#047857',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: dispensasi.status === 'pending' ? 'pointer' : 'not-allowed',
                              fontSize: '12px',
                              fontWeight: 600,
                              transition: 'all 0.2s',
                            }}
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => handleUpdateDispensasiStatus(dispensasi.id, 'rejected')}
                            disabled={dispensasi.status !== 'pending'}
                            style={{
                              padding: '6px 10px',
                              backgroundColor: dispensasi.status === 'pending' ? '#FEE2E2' : '#F3F4F6',
                              color: '#991B1B',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: dispensasi.status === 'pending' ? 'pointer' : 'not-allowed',
                              fontSize: '12px',
                              fontWeight: 600,
                              transition: 'all 0.2s',
                            }}
                          >
                            Tolak
                          </button>
                          <button
                            onClick={() => handleDeleteDispensasi(dispensasi.id)}
                            style={{
                              padding: '6px 10px',
                              backgroundColor: '#FEE2E2',
                              color: '#991B1B',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 600,
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{
              paddingTop: '16px',
              borderTop: '1px solid #E5E7EB',
              marginTop: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
                Total dispensasi: <strong>{dispensasiList.length}</strong>
              </p>
              <button
                onClick={() => setIsDispensasiListOpen(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#06254D',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </WalikelasLayout>
  );
}