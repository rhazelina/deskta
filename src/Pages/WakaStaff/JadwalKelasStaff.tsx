// src/Pages/WakaStaff/JadwalKelasStaff.tsx
import { useMemo, useState } from 'react';
import StaffLayout from '../../component/WakaStaff/StaffLayout';
import { Select } from '../../component/Shared/Select';
import { Table } from '../../component/Shared/Table';
import { Eye, Upload } from "lucide-react";

interface JadwalKelasStaffProps {
  user: {
    name: string;
    role: string;
  };
  onLogout: () => void;
  currentPage: string;
  onMenuClick: (page: string, payload?: any) => void;
  onselectKelas?: (namaKelas: string) => void;
}

interface KelasItem {
  id: string;
  namaKelas: string;
  tingkat: string;
  jurusan: string;
  waliKelas: string;
}

const dummyKelas: KelasItem[] = [
  {
    id: '1',
    namaKelas: 'XII Mekatronika 1',
    tingkat: 'XII',
    jurusan: 'Mekatronika',
    waliKelas: 'Ewit Ernlyah',
  },
  {
    id: '2',
    namaKelas: 'XII Mekatronika 2',
    tingkat: 'XII',
    jurusan: 'Mekatronika',
    waliKelas: 'Ewit Ernlyah',
  },
  {
    id: '3',
    namaKelas: 'XI RPL 1',
    tingkat: 'XI',
    jurusan: 'Rekayasa Perangkat Lunak',
    waliKelas: 'Budi Santoso',
  },
  {
    id: '4',
    namaKelas: 'X TKJ 1',
    tingkat: 'X',
    jurusan: 'Teknik Komputer Jaringan',
    waliKelas: 'Siti Nurhaliza',
  },
];

export default function JadwalKelasStaff({
  user,
  onLogout,
  currentPage,
  onMenuClick,
  onselectKelas,
}: JadwalKelasStaffProps) {
  const [selectedJurusan, setSelectedJurusan] = useState('');
  const [selectedTingkat, setSelectedTingkat] = useState('');
  const [jadwalImages, setJadwalImages] = useState<Record<string, string>>({});

  const jurusanOptions = useMemo(
    () =>
      [...new Set(dummyKelas.map((item) => item.jurusan))].map((jrs) => ({
        label: jrs,
        value: jrs,
      })),
    []
  );

  const tingkatOptions = [
    { label: 'Kelas X', value: 'X' },
    { label: 'Kelas XI', value: 'XI' },
    { label: 'Kelas XII', value: 'XII' },
  ];

  const filteredData = dummyKelas.filter((item) => {
    const matchJurusan = selectedJurusan ? item.jurusan === selectedJurusan : true;
    const matchTingkat = selectedTingkat ? item.tingkat === selectedTingkat : true;
    return matchJurusan && matchTingkat;
  });

  const handleUpload = (row: KelasItem) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png, image/jpeg, image/jpg";

    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setJadwalImages((prev) => ({
          ...prev,
          [row.id]: imageUrl,
        }));
      }
    };

    input.click();
  };

  const handleViewDetail = (row: KelasItem) => {
    if (onselectKelas) {
      onselectKelas(row.namaKelas);
    }

    onMenuClick('lihat-kelas', {
      kelas: row.namaKelas,
      jadwalImage: jadwalImages[row.id],
    });
  };

  const columns = [
    { key: 'namaKelas', label: 'Nama Kelas' },
    { key: 'jurusan', label: 'Nama Konsentrasi Keahlian' },
    { key: 'waliKelas', label: 'Wali Kelas' },
    {
      key: 'aksi',
      label: 'Aksi',
      align: 'center', // 🔥 INI KUNCI UTAMANYA
      render: (_: any, row: KelasItem) => (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <button
            onClick={() => handleViewDetail(row)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Eye size={18} />
          </button>

          <button
            onClick={() => handleUpload(row)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Upload size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <StaffLayout
      pageTitle="Jadwal Kelas"
      currentPage={currentPage}
      onMenuClick={onMenuClick}
      user={user}
      onLogout={onLogout}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 32,
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <Select
            label="Pilih Konsentrasi Keahlian"
            value={selectedJurusan}
            onChange={setSelectedJurusan}
            options={jurusanOptions}
            placeholder="Semua Konsentrasi Keahlian"
          />
          <Select
            label="Pilih Tingkat Kelas"
            value={selectedTingkat}
            onChange={setSelectedTingkat}
            options={tingkatOptions}
            placeholder="Semua Tingkat Kelas"
          />
        </div>

        <Table
          columns={columns}
          data={filteredData}
          keyField="id"
          emptyMessage="Belum ada data jadwal kelas."
        />
      </div>
    </StaffLayout>
  );
}
