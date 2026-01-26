import { useState, useEffect, useMemo } from 'react';
import WalikelasLayout from '../../component/Walikelas/layoutwakel';
import { StatusBadge } from '../../component/Shared/StatusBadge';
import { Button } from '../../component/Shared/Button';
import { FormModal } from '../../component/Shared/FormModal';
import { Select } from '../../component/Shared/Select';
import { Table } from '../../component/Shared/Table';
import calendarIcon from '../../assets/Icon/calender.png';

type StatusType = 'hadir' | 'terlambat' | 'tidak-hadir' | 'sakit' | 'izin' | 'alpha' | 'pulang';

interface KehadiranRow {
  id: string;
  nisn: string;
  namaSiswa: string;
  mataPelajaran: string;
  status: StatusType;
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

  const [rows, setRows] = useState<KehadiranRow[]>([
    { id: '1', nisn: '1348576392', namaSiswa: 'Wito Suherman Suhermin', mataPelajaran: 'Matematika', status: 'hadir' },
    { id: '2', nisn: '1348576393', namaSiswa: 'Ahmad Fauzi', mataPelajaran: 'Matematika', status: 'hadir' },
    { id: '3', nisn: '1348576394', namaSiswa: 'Siti Nurhaliza', mataPelajaran: 'Matematika', status: 'izin' },
    { id: '4', nisn: '1348576395', namaSiswa: 'Budi Santoso', mataPelajaran: 'Matematika', status: 'sakit' },
    { id: '5', nisn: '1348576396', namaSiswa: 'Dewi Sartika', mataPelajaran: 'Matematika', status: 'tidak-hadir' },
    { id: '6', nisn: '1348576397', namaSiswa: 'Rizki Ramadhan', mataPelajaran: 'Matematika', status: 'alpha' },
    { id: '7', nisn: '1348576398', namaSiswa: 'Budi Raharjo', mataPelajaran: '-', status: 'pulang' },
  ]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalIzin = rows.filter((r) => r.status === 'izin').length;
  const totalSakit = rows.filter((r) => r.status === 'sakit').length;
  const totalAlpha = rows.filter((r) => r.status === 'alpha' || r.status === 'tidak-hadir').length;

  const columns = useMemo(() => [
    { key: 'nisn', label: 'NISN' },
    { key: 'namaSiswa', label: 'Nama Siswa' },
    { key: 'mataPelajaran', label: 'Mata Pelajaran' },
    {
      key: 'status',
      label: 'Status',
      render: (value: StatusType) => {
        // Filter out 'pulang' status for StatusBadge
        const displayStatus = value === 'pulang' ? 'hadir' : value;
        return <StatusBadge status={displayStatus as 'hadir' | 'terlambat' | 'tidak-hadir' | 'sakit' | 'izin' | 'alpha'} />;
      },
    },
  ], []);

  // Modal State
  const [editingRow, setEditingRow] = useState<KehadiranRow | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<StatusType>('hadir');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = [
    { label: 'Hadir', value: 'hadir' as StatusType },
    { label: 'Sakit', value: 'sakit' as StatusType },
    { label: 'Izin', value: 'izin' as StatusType },
    { label: 'Alpha', value: 'alpha' as StatusType },
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

  // fitur otewe
  const handleViewRekap = () => {
    alert('Lihat rekap kehadiran (belum diimplementasikan)');
  };

   // fitur otewe
  const handleBuatDispensasi = () => {
    alert('Buat dispensasi (belum diimplementasikan)');
  };
  
  
  const handleBack = () => {
      onMenuClick("dashboard");
  }

  const handleTableEdit = (row: KehadiranRow) => {
    handleOpenEdit(row);
  };

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
    dateInputWrapper: {
      position: 'relative' as const,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      background: '#F9FAFB',
      color: '#1F2937',
      border: '1px solid #E5E7EB',
      borderRadius: 8,
      padding: '0 16px',
      height: '48px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      minWidth: '200px',
    },
    dateInput: {
      position: 'absolute' as const,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      opacity: 0,
      cursor: 'pointer',
      zIndex: 10,
    },
    rightActions: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: 8,
      justifyContent: 'flex-end',
    },
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile
        ? 'repeat(2, minmax(0, 1fr))'
        : 'repeat(4, minmax(0, 1fr))',
      gap: 16,
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
          {/* Period Filter Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 20px',
              backgroundColor: '#1E3A8A',
              borderRadius: '12px',
              flexWrap: 'wrap',
              marginBottom: '24px',
            }}
          >
            <span
              style={{
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600',
                letterSpacing: '0.5px',
              }}
            >
              Periode :
            </span>

            {/* Start Date */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                padding: '10px 14px',
                border: '1px solid #E5E7EB',
              }}
            >
              <img
                src={calendarIcon}
                alt="Calendar"
                style={{ width: 18, height: 18 }}
              />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer',
                }}
              />
            </div>

            {/* Separator */}
            <span
              style={{
                color: '#FFFFFF',
                fontSize: '18px',
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
                gap: '8px',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                padding: '10px 14px',
                border: '1px solid #E5E7EB',
              }}
            >
              <img
                src={calendarIcon}
                alt="Calendar"
                style={{ width: 18, height: 18 }}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer',
                }}
              />
            </div>

            {/* Summary Cards in Header */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginLeft: 'auto',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  minWidth: '80px',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6B7280',
                  }}
                >
                  Pulang
                </span>
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#111827',
                  }}
                >
                  {rows.filter((r) => r.status === 'pulang').length}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  minWidth: '80px',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6B7280',
                  }}
                >
                  Izin
                </span>
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#111827',
                  }}
                >
                  {totalIzin}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  minWidth: '80px',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6B7280',
                  }}
                >
                  Sakit
                </span>
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#111827',
                  }}
                >
                  {totalSakit}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  minWidth: '80px',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6B7280',
                  }}
                >
                  Alpha
                </span>
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#111827',
                  }}
                >
                  {totalAlpha}
                </span>
              </div>
            </div>
          </div>

          {/* Bar atas: tombol aksi */}
          <div style={styles.topBar}>
            <div style={styles.leftActions}></div>

            {/* Tombol aksi kanan */}
            <div style={styles.rightActions}>
              <Button label="Lihat Rekap" onClick={handleViewRekap} />
              <Button
                label="Buat Dispensasi"
                variant="secondary"
                onClick={handleBuatDispensasi}
              />
               <Button
                  label="Kembali"
                  variant="secondary"
                  onClick={handleBack}
                />
            </div>
          </div>

          {/* Tabel kehadiran */}
          <Table
            columns={columns}
            data={rows}
            onEdit={handleTableEdit}
            keyField="id"
            emptyMessage="Belum ada data kehadiran siswa."
          />
        </div>
      </div>

      {/* Modal Edit Kehadiran (pakai FormModal + Select) */}
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
    </WalikelasLayout>
  );
}

/// ====== LEGACY CODE - DO NOT DELETE ======
// import { useState, useEffect, useMemo } from 'react';
// import WalikelasLayout from '../../component/Walikelas/layoutwakel';
// import { FilterBar, FilterItem } from '../../component/Shared/FilterBar';
// import { StatusBadge } from '../../component/Shared/StatusBadge';
// import { Button } from '../../component/Shared/Button';
// import { FormModal } from '../../component/Shared/FormModal';
// import { Select } from '../../component/Shared/Select';
// import { Table } from '../../component/Shared/Table';
// import calendarIcon from '../../assets/Icon/calender.png';
// import chalkboardIcon from '../../assets/Icon/Chalkboard.png';

// type StatusType = 'hadir' | 'terlambat' | 'tidak-hadir' | 'sakit' | 'izin' | 'alpha' | 'pulang';

// interface KehadiranRow {
//   id: string;
//   nisn: string;
//   namaSiswa: string;
//   mataPelajaran: string;
//   status: StatusType;
// }

// interface KehadiranSiswaWakelProps {
//   user: { name: string; role: string };
//   onLogout: () => void;
//   currentPage: string;
//   onMenuClick: (page: string) => void;
// }

// export default function KehadiranSiswaWakel({
//   user,
//   onLogout,
//   currentPage,
//   onMenuClick,
// }: KehadiranSiswaWakelProps) {
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

//   const formattedDate = useMemo(() => {
//     return new Date(selectedDate).toLocaleDateString('id-ID', {
//       weekday: 'long',
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric',
//     });
//   }, [selectedDate]);

//   // Info kelas dummy
//   const kelasInfo = {
//     namaKelas: 'X Mekatronika 1',
//     mapel: 'Matematika (1-4)',
//   };

//   const [rows, setRows] = useState<KehadiranRow[]>([
//     { id: '1', nisn: '1348576392', namaSiswa: 'Wito Suherman Suhermin', mataPelajaran: 'Matematika', status: 'hadir' },
//     { id: '2', nisn: '1348576393', namaSiswa: 'Ahmad Fauzi', mataPelajaran: 'Matematika', status: 'hadir' },
//     { id: '3', nisn: '1348576394', namaSiswa: 'Siti Nurhaliza', mataPelajaran: 'Matematika', status: 'izin' },
//     { id: '4', nisn: '1348576395', namaSiswa: 'Budi Santoso', mataPelajaran: 'Matematika', status: 'sakit' },
//     { id: '5', nisn: '1348576396', namaSiswa: 'Dewi Sartika', mataPelajaran: 'Matematika', status: 'tidak-hadir' },
//     { id: '6', nisn: '1348576397', namaSiswa: 'Rizki Ramadhan', mataPelajaran: 'Matematika', status: 'alpha' },
//     { id: '7', nisn: '1348576398', namaSiswa: 'Budi Raharjo', mataPelajaran: '-', status: 'pulang' },
//   ]);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const totalHadir = rows.filter((r) => r.status === 'hadir').length;
//   const totalIzin = rows.filter((r) => r.status === 'izin').length;
//   const totalSakit = rows.filter((r) => r.status === 'sakit').length;
//   const totalAlpha = rows.filter((r) => r.status === 'alpha' || r.status === 'tidak-hadir').length;

//   const columns = useMemo(() => [
//     { key: 'nisn', label: 'NISN' },
//     { key: 'namaSiswa', label: 'Nama Siswa' },
//     { key: 'mataPelajaran', label: 'Mata Pelajaran' },
//     {
//       key: 'status',
//       label: 'Status',
//       render: (value: StatusType) => <StatusBadge status={value} />,
//     },
//   ], []);

//   // Modal State
//   const [editingRow, setEditingRow] = useState<KehadiranRow | null>(null);
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [editStatus, setEditStatus] = useState<StatusType>('hadir');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const statusOptions = [
//     { label: 'Hadir', value: 'hadir' as StatusType },
//     { label: 'Sakit', value: 'sakit' as StatusType },
//     { label: 'Izin', value: 'izin' as StatusType },
//     { label: 'Alpha', value: 'alpha' as StatusType },
//     { label: 'Pulang', value: 'pulang' as StatusType },
//   ];

//   const handleOpenEdit = (row: KehadiranRow) => {
//     setEditingRow(row);
//     setEditStatus(row.status);
//     setIsEditOpen(true);
//   };

//   const handleCloseEdit = () => {
//     setIsEditOpen(false);
//     setEditingRow(null);
//     setIsSubmitting(false);
//   };

//   const handleSubmitEdit = () => {
//     if (!editingRow) return;
//     setIsSubmitting(true);
//     setTimeout(() => {
//       setRows((prev) =>
//         prev.map((r) =>
//           r.id === editingRow.id ? { ...r, status: editStatus } : r
//         )
//       );
//       setIsSubmitting(false);
//       setIsEditOpen(false);
//       setEditingRow(null);
//       alert('✅ Status kehadiran berhasil diperbarui!');
//     }, 300);
//   };

//   const handleViewRekap = () => {
//     alert('Lihat rekap kehadiran (belum diimplementasikan)');
//   };

//   const handleBuatDispensasi = () => {
//     alert('Buat dispensasi (belum diimplementasikan)');
//   };
  
//   const handleBack = () => {
//       onMenuClick("dashboard");
//   }

//   const handleTableEdit = (row: KehadiranRow) => {
//     handleOpenEdit(row);
//   };

//   const styles = {
//     container: {
//       position: 'relative' as const,
//       minHeight: '100%',
//       backgroundColor: '#FFFFFF',
//       borderRadius: '12px',
//       overflow: 'hidden',
//       padding: isMobile ? '16px' : '32px',
//       border: '1px solid #E5E7EB',
//       boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
//     },
//     headerWrapper: {
//       position: 'relative' as const,
//       zIndex: 1,
//       display: 'flex',
//       flexDirection: 'column' as const,
//       gap: 24,
//     },
//     topBar: {
//       display: 'flex',
//       flexWrap: 'wrap' as const,
//       gap: 16,
//       alignItems: 'center',
//       justifyContent: 'space-between',
//     },
//     leftActions: {
//       display: 'flex',
//       flexWrap: 'wrap' as const,
//       gap: 12,
//       alignItems: 'center',
//     },
//     dateInputWrapper: {
//       position: 'relative' as const,
//       display: 'inline-flex',
//       alignItems: 'center',
//       gap: 10,
//       background: '#F9FAFB',
//       color: '#1F2937',
//       border: '1px solid #E5E7EB',
//       borderRadius: 8,
//       padding: '0 16px',
//       height: '48px',
//       cursor: 'pointer',
//       transition: 'all 0.2s',
//       minWidth: '200px',
//     },
//     dateInput: {
//       position: 'absolute' as const,
//       left: 0,
//       top: 0,
//       width: '100%',
//       height: '100%',
//       opacity: 0,
//       cursor: 'pointer',
//       zIndex: 10,
//     },
//     rightActions: {
//       display: 'flex',
//       flexWrap: 'wrap' as const,
//       gap: 8,
//       justifyContent: 'flex-end',
//     },
//     summaryGrid: {
//       display: 'grid',
//       gridTemplateColumns: isMobile
//         ? 'repeat(2, minmax(0, 1fr))'
//         : 'repeat(4, minmax(0, 1fr))',
//       gap: 16,
//     },
//   };

//   return (
//     <WalikelasLayout
//       pageTitle="Kehadiran Siswa"
//       currentPage={currentPage as any}
//       onMenuClick={onMenuClick}
//       user={user}
//       onLogout={onLogout}
//     >
//       <div style={styles.container}>
//         <div style={styles.headerWrapper}>
//           {/* Bar atas: tanggal + kelas + tombol aksi */}
//           <div style={styles.topBar}>
//             <div style={styles.leftActions}>
//               {/* Custom Date Picker */}
//               <div style={styles.dateInputWrapper}>
//                 <img
//                   src={calendarIcon}
//                   alt="Calendar"
//                   style={{ width: 20, height: 20, opacity: 0.8 }}
//                 />
//                 <span style={{ fontSize: '14px', fontWeight: 600 }}>
//                   {formattedDate}
//                 </span>
//                 <input
//                   type="date"
//                   value={selectedDate}
//                   onChange={(e) => setSelectedDate(e.target.value)}
//                   style={styles.dateInput}
//                 />
//               </div>

//               {/* Kelas + Mapel */}
//               <div style={{ display: 'flex', alignItems: 'center' }}>
//                 <FilterItem
//                   icon=""
//                   iconComponent={
//                     <img
//                       src={chalkboardIcon}
//                       alt="Class"
//                       style={{ width: 24, height: 24, objectFit: 'contain' }}
//                     />
//                   }
//                   label={kelasInfo.namaKelas}
//                   value={kelasInfo.mapel}
//                 />
//               </div>
//             </div>

//             {/* Tombol aksi kanan */}
//             <div style={styles.rightActions}>
//               <Button label="Lihat Rekap" onClick={handleViewRekap} />
//               <Button
//                 label="Buat Dispensasi"
//                 variant="secondary"
//                 onClick={handleBuatDispensasi}
//               />
//                <Button
//                   label="Kembali"
//                   variant="secondary"
//                   onClick={handleBack}
//                 />
//             </div>
//           </div>

//           {/* Kartu ringkasan Hadir / Izin / Sakit / Alpha */}
//           <div style={styles.summaryGrid}>
//             <SummaryCard
//               label="Hadir"
//               value={totalHadir.toString()}
//               color="#10B981"
//               bgColor="#ECFDF5"
//             />
//             <SummaryCard
//               label="Izin"
//               value={totalIzin.toString()}
//               color="#F59E0B"
//               bgColor="#FFFBEB"
//             />
//             <SummaryCard
//               label="Sakit"
//               value={totalSakit.toString()}
//               color="#3B82F6"
//               bgColor="#EFF6FF"
//             />
//             <SummaryCard
//               label="Alpha / Tdk Hadir"
//               value={totalAlpha.toString()}
//               color="#EF4444"
//               bgColor="#FEF2F2"
//             />
//           </div>

//           {/* Tabel kehadiran */}
//           <Table
//             columns={columns}
//             data={rows}
//             onEdit={handleTableEdit}
//             keyField="id"
//             emptyMessage="Belum ada data kehadiran siswa."
//           />
//         </div>
//       </div>

//       {/* Modal Edit Kehadiran (pakai FormModal + Select) */}
//       <FormModal
//         isOpen={isEditOpen}
//         onClose={handleCloseEdit}
//         title="Edit Kehadiran"
//         onSubmit={handleSubmitEdit}
//         submitLabel="Simpan"
//         isSubmitting={isSubmitting}
//       >
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//           <div>
//             <p
//               style={{
//                 margin: 0,
//                 marginBottom: 8,
//                 fontSize: 14,
//                 fontWeight: 600,
//                 color: '#111827',
//               }}
//             >
//               Pilih Kehadiran
//             </p>
//             <Select
//               value={editStatus}
//               onChange={(val) => setEditStatus(val as StatusType)}
//               options={statusOptions}
//               placeholder="Pilih status kehadiran"
//             />
//           </div>
//         </div>
//       </FormModal>
//     </WalikelasLayout>
//   );
// }

// function SummaryCard({
//   label,
//   value,
//   color,
//   bgColor,
// }: {
//   label: string;
//   value: string;
//   color: string;
//   bgColor?: string;
// }) {
//   return (
//     <div
//       style={{
//         backgroundColor: bgColor || '#FFFFFF',
//         borderRadius: 12,
//         padding: '16px 20px',
//         border: `1px solid ${color}30`, 
//         boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//       }}
//     >
//       <div
//         style={{
//           fontSize: 13,
//           color: '#4B5563',
//           marginBottom: 4,
//           fontWeight: 600,
//           textTransform: 'uppercase',
//           letterSpacing: '0.5px',
//         }}
//       >
//         {label}
//       </div>
//       <div
//         style={{
//           fontSize: 24,
//           fontWeight: 800,
//           color,
//           lineHeight: 1.2,
//         }}
//       >
//         {value}
//       </div>
//     </div>
//   );
// }