import { useState, useEffect } from 'react';
import AdminLayout from '../../component/Admin/AdminLayout';
import { EditSiswaForm } from '../../component/Shared/EditSiswa';
import { Edit, User as UserIcon, ArrowLeft } from 'lucide-react';
import { usePopup } from "../../component/Shared/Popup/PopupProvider";

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

interface DetailSiswaProps {
  user: User;
  onLogout: () => void;
  currentPage: string;
  onMenuClick: (page: string) => void;
  siswaId: string;
  onUpdateSiswa?: (updatedSiswa: Siswa) => void; // Tambah prop ini
}

// Data untuk dropdown di form
const jurusanListForForm = [
  { id: 'MT', nama: 'Mekatronika' },
  { id: 'AN', nama: 'Animasi' },
  { id: 'EI', nama: 'Elektronika Industri' },
  { id: 'RPL', nama: 'Rekayasa Perangkat Lunak' },
];

const kelasListForForm = [
  { id: 'X-MT-1', nama: 'X Mekatronika 1' },
  { id: 'X-AN-2', nama: 'X Animasi 2' },
  { id: 'XI-EI-1', nama: 'XI Elektronika Industri 1' },
  { id: 'XII-RPL-1', nama: 'XII Rekayasa Perangkat Lunak 1' },
  { id: 'XII-RPL-2', nama: 'XII Rekayasa Perangkat Lunak 2' },
];

// Data default jika tidak ditemukan
const defaultSiswaData: Siswa = {
  id: '1',
  namaSiswa: 'Muhammad Wito Suherman',
  nisn: '0918415784',
  jenisKelamin: 'Laki-Laki',
  noTelp: '08218374859',
  jurusan: 'Mekatronika',
  jurusanId: 'MTK',
  tahunAngkatan: '2023 - 2026',
  kelas: 'XII Mekatronika 1',
  kelasId: 'XII-MTK-1',
  password: 'ABC123',
};

export default function DetailSiswa({
  user,
  onLogout,
  currentPage,
  onMenuClick,
  siswaId,
  onUpdateSiswa,
}: DetailSiswaProps) {
  const { alert: popupAlert } = usePopup();
  const [siswaData, setSiswaData] = useState<Siswa>(defaultSiswaData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(false);

  // Load data siswa berdasarkan ID
  useEffect(() => {
    // Coba ambil data dari localStorage (simulasi data dari SiswaAdmin)
    const savedSiswa = localStorage.getItem('selectedSiswa');
    if (savedSiswa) {
      try {
        const parsedSiswa = JSON.parse(savedSiswa);
        if (parsedSiswa.id === siswaId) {
          setSiswaData(parsedSiswa);
          return;
        }
      } catch (error) {
        console.error('Error parsing saved siswa:', error);
      }
    }

    // Jika tidak ada data di localStorage, coba ambil dari dummy data berdasarkan ID
    // Di aplikasi nyata, ini akan diambil dari API
    const dummyData = [
      { 
        id: '1', 
        namaSiswa: 'Muhammad Wito Suherman', 
        nisn: '0918415784', 
        jenisKelamin: 'Laki-Laki', 
        noTelp: '08218374859',
        jurusan: 'Mekatronika', 
        jurusanId: 'MTK', 
        tahunAngkatan: '2023 - 2026',
        kelas: 'XII Mekatronika 1', 
        kelasId: 'XII-MTK-1',
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
    ];

    const foundSiswa = dummyData.find(s => s.id === siswaId);
    if (foundSiswa) {
      setSiswaData(foundSiswa);
    }
  }, [siswaId]);

  // Handler untuk submit edit
  const handleEditSubmit = async (data: {
    jenisKelamin: string;
    noTelp: string;
    jurusanId: string;
    tahunAngkatan: string;
    kelasId: string;
    password: string;
  }) => {
    const jurusanNama = jurusanListForForm.find(j => j.id === data.jurusanId)?.nama || data.jurusanId;
    const kelasNama = kelasListForForm.find(k => k.id === data.kelasId)?.nama || data.kelasId;
    
    const updatedSiswa = {
      ...siswaData,
      jenisKelamin: data.jenisKelamin,
      noTelp: data.noTelp,
      jurusan: jurusanNama,
      jurusanId: data.jurusanId,
      tahunAngkatan: data.tahunAngkatan,
      kelas: kelasNama,
      kelasId: data.kelasId,
      password: data.password,
    };
    
    setSiswaData(updatedSiswa);
    setIsEditModalOpen(false);
    setDataUpdated(true);

    // Simpan ke localStorage (sementara)
    localStorage.setItem('selectedSiswa', JSON.stringify(updatedSiswa));
    
    // Panggil callback untuk update data di parent (SiswaAdmin)
    if (onUpdateSiswa) {
      onUpdateSiswa(updatedSiswa);
    }
    
    await popupAlert('✓ Data siswa berhasil diperbarui!');
  };

  // Handler untuk tombol kembali
  const handleBack = async () => {
    if (dataUpdated) {
      await popupAlert('✅ Data telah diperbarui! Kembali ke halaman daftar siswa.');
    }
    onMenuClick('siswa');
  };

  // Field item component untuk reusability
  const FieldItem = ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => (
    <div style={{ marginBottom: '24px' }}>
      <label
        style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          color: '#FFFFFF',
          marginBottom: '8px',
        }}
      >
        {label}
      </label>
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: '14px',
            color: '#1F2937',
            display: 'block',
            width: '100%',
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );

  // Password field component khusus untuk password
  const PasswordField = ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => (
    <div style={{ marginBottom: '24px' }}>
      <label
        style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          color: '#FFFFFF',
          marginBottom: '8px',
        }}
      >
        {label}
      </label>
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: '14px',
            color: '#1F2937',
            fontFamily: 'monospace',
            letterSpacing: '1px',
            display: 'block',
            width: '100%',
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );

  return (
    <AdminLayout
      pageTitle="Detail Siswa"
      currentPage={currentPage}
      onMenuClick={onMenuClick}
      user={user}
      onLogout={onLogout}
    >
      <div
        style={{
          backgroundImage: 'url(../src/assets/Background/bgdetailgurusiswa.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: 'calc(100vh - 64px)',
          padding: window.innerWidth < 768 ? '16px' : '32px',
        }}
      >
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          {/* Card Container - Navy solid */}
          <div
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Header with Profile */}
            <div
              style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                padding: '32px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                position: 'relative',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  border: '4px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <UserIcon size={36} />
              </div>
              
              {/* Info */}
              <div style={{ flex: 1 }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '4px',
                  }}
                >
                  {siswaData.namaSiswa}
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: '16px',
                    color: '#cbd5e1',
                    fontFamily: 'monospace',
                    letterSpacing: '1px',
                  }}
                >
                  {siswaData.nisn}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  style={{
                    backgroundColor: '#60A5FA',
                    border: 'none',
                    color: 'white',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#3B82F6';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#60A5FA';
                  }}
                >
                  <Edit size={18} />
                  Ubah
                </button>
                <button
                  onClick={() => handleEditSubmit({
                    jenisKelamin: siswaData.jenisKelamin,
                    noTelp: siswaData.noTelp,
                    jurusanId: siswaData.jurusanId,
                    tahunAngkatan: siswaData.tahunAngkatan,
                    kelasId: siswaData.kelasId,
                    password: siswaData.password,
                  })}
                  style={{
                    backgroundColor: '#10B981',
                    border: 'none',
                    color: 'white',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#059669';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#10B981';
                  }}
                >
                  Simpan
                </button>
              </div>
            </div>

            {/* Content - Fields */}
            <div style={{ padding: '32px' }}>
              {/* Row 1: Jenis Kelamin & Tahun Angkatan */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px',
                  marginBottom: '24px',
                }}
              >
                <FieldItem
                  label="Jenis Kelamin :"
                  value={siswaData.jenisKelamin}
                />
                <FieldItem
                  label="Tahun Angkatan :"
                  value={siswaData.tahunAngkatan}
                />
              </div>

              {/* Row 2: No. Telp & Kata Sandi */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px',
                  marginBottom: '24px',
                }}
              >
                <FieldItem
                  label="No. Telp :"
                  value={siswaData.noTelp}
                />
                <PasswordField
                  label="Kata Sandi:"
                  value={siswaData.password}
                />
              </div>

              {/* Tombol Kembali - DI KIRI BAWAH */}
              <div
                style={{
                  marginTop: '40px',
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
              >
                <button
                  onClick={handleBack}
                  style={{
                    backgroundColor: '#9CA3AF',
                    border: 'none',
                    color: 'black',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#6B7280';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#9CA3AF';
                  }}
                >
                  <ArrowLeft size={18} />
                  Kembali
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit Siswa */}
      <EditSiswaForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={{
          jenisKelamin: siswaData.jenisKelamin,
          noTelp: siswaData.noTelp,
          jurusanId: siswaData.jurusanId,
          tahunAngkatan: siswaData.tahunAngkatan,
          kelasId: siswaData.kelasId,
          password: siswaData.password,
        }}
        jurusanList={jurusanListForForm}
        kelasList={kelasListForForm}
      />
    </AdminLayout>
  );
}

