import { useState } from 'react';
import AdminLayout from '../../component/Admin/AdminLayout';
import { EditGuruForm } from '../../component/Shared/EditGuru';
import { Edit, User as UserIcon, ArrowLeft } from 'lucide-react';

interface User {
  role: string;
  name: string;
}

interface Guru {
  id: string;
  nama: string;
  nip: string;
  jenisKelamin: string;
  peran: string;
  noTelp: string;
  password: string;
}

interface DetailGuruProps {
  user: User;
  onLogout: () => void;
  currentPage: string;
  onMenuClick: (page: string) => void;
  guruId: string;
  onUpdateGuru?: (updatedGuru: Guru) => void;
}

// Dummy data guru
const defaultGuruData: Guru = {
  id: '1',
  nama: 'Ewit Erniyah S.pd',
  nip: '0918415784',
  jenisKelamin: 'Perempuan',
  peran: 'Wali Kelas',
  noTelp: '08218374859',
  password: 'ABC123',
};

export default function DetailGuru({
  user,
  onLogout,
  currentPage,
  onMenuClick,
  guruId: _guruId,
  onUpdateGuru,
}: DetailGuruProps) {
  const [guruData, setGuruData] = useState<Guru>(defaultGuruData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(false);

  // Handler untuk submit edit
  const handleEditSubmit = (data: {
    jenisKelamin: string;
    peran: string;
    noTelp: string;
    password: string;
  }) => {
    const updatedGuru = {
      ...guruData,
      jenisKelamin: data.jenisKelamin,
      peran: data.peran,
      noTelp: data.noTelp,
      password: data.password,
    };

    setGuruData(updatedGuru);
    setIsEditModalOpen(false);
    setDataUpdated(true);

    // Panggil callback untuk update data di parent
    if (onUpdateGuru) {
      onUpdateGuru(updatedGuru);
    }

    alert('✓ Data guru berhasil diperbarui!');
  };

  // Handler untuk tombol kembali
  const handleBack = () => {
    if (dataUpdated) {
      alert('✅ Data telah diperbarui! Kembali ke halaman daftar guru.');
    }
    onMenuClick('guru');
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
      pageTitle="Detail Guru"
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
                  {guruData.nama}
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
                  {guruData.nip}
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
                    jenisKelamin: guruData.jenisKelamin,
                    peran: guruData.peran,
                    noTelp: guruData.noTelp,
                    password: guruData.password,
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
              {/* Row 1: Jenis Kelamin & Peran */}
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
                  value={guruData.jenisKelamin}
                />
                <FieldItem
                  label="Peran :"
                  value={guruData.peran}
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
                  value={guruData.noTelp}
                />
                <PasswordField
                  label="Kata Sandi :"
                  value={guruData.password}
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

      {/* Modal Edit Guru */}
      <EditGuruForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={{
          jenisKelamin: guruData.jenisKelamin,
          peran: guruData.peran,
          noTelp: guruData.noTelp,
          password: guruData.password,
        }}
      />
    </AdminLayout>
  );
}