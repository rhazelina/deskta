import React, { useState, useRef } from 'react';
import { Modal } from '../../Shared/Modal';
import QRCodeIcon from '../../../assets/Icon/qr_code.png';

interface MetodeGuruProps {
  isOpen: boolean;
  onClose: () => void;
  onPilihQR: () => void;
  onPilihManual: () => void;
  onTidakBisaMengajar?: () => void;
  onSubmitDispensasi?: (data: { alasan: string; tanggal?: string; jamMulai?: string; jamSelesai?: string; keterangan?: string; bukti?: File; }) => void;
}

export function MetodeGuru({
  isOpen,
  onClose,
  onPilihQR,
  onPilihManual,
  onTidakBisaMengajar,
  onSubmitDispensasi,
}: MetodeGuruProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDispensasi, setShowDispensasi] = useState(false);  const [liveMode, setLiveMode] = useState(true);
  const [dispAlasan, setDispAlasan] = useState("");
  const [dispTanggal, setDispTanggal] = useState<string>("");
  const [dispMulai, setDispMulai] = useState<string>("");
  const [dispSelesai, setDispSelesai] = useState<string>("");
  const [dispKeterangan, setDispKeterangan] = useState("");
  const [dispBukti, setDispBukti] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleTidakBisaMengajar = () => {
    if (onTidakBisaMengajar) {
      onTidakBisaMengajar();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setIsDragging(false);
    onClose();
  };

  const handleContinue = () => {
    if (!selectedFile) return;
    onPilihQR();
    handleClose();
  };

  const openDispensasi = () => setShowDispensasi(true);
  const closeDispensasi = () => setShowDispensasi(false);
  const handleDispBuktiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setDispBukti(e.target.files[0]);
  };
  const handleSubmitDispensasi = () => {
    if (!dispAlasan) { alert("Isi alasan terlebih dahulu"); return; }
    const payload = { alasan: dispAlasan, tanggal: dispTanggal, jamMulai: dispMulai, jamSelesai: dispSelesai, keterangan: dispKeterangan, bukti: dispBukti || undefined };
    if (onSubmitDispensasi) onSubmitDispensasi(payload); else alert("Pengajuan dispensasi dikirim ke Waka/Pengurus Kelas untuk validasi.");
    setDispAlasan(""); setDispTanggal(""); setDispMulai(""); setDispSelesai(""); setDispKeterangan(""); setDispBukti(null);
    closeDispensasi();
  };

  const simpleScanMode = true;

  const handleScan = () => {
    onPilihQR();
  };

  return (
    <>
      {simpleScanMode && (
        <Modal isOpen={isOpen} onClose={handleClose}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 24,
              padding: 28,
              maxWidth: 420,
              width: "100%",
              margin: "0 auto",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <button
                type="button"
                onClick={handleClose}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: 22,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {"<"}
              </button>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                Scan
              </span>
              <span style={{ width: 24 }} />
            </div>

            <div
              style={{
                border: "1px dashed #D1D5DB",
                borderRadius: 24,
                padding: 24,
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={handleScan}
            >
              <img
                src={QRCodeIcon}
                alt="QR Code"
                style={{ width: 200, height: 200, objectFit: "contain" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 14, color: "#4B5563" }}>Live Mode</span>
              <button
                type="button"
                onClick={() => setLiveMode(!liveMode)}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 26,
                    borderRadius: 9999,
                    backgroundColor: liveMode ? "#2563EB" : "#D1D5DB",
                    padding: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: liveMode ? "flex-end" : "flex-start",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: "#FFFFFF",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {false && (
        <>
    <Modal isOpen={isOpen} onClose={handleClose}>
      <style>
        {`
          .btn-3d {
            transition: all 0.1s;
            position: relative;
            top: 0;
          }
          .btn-3d:active {
            top: 4px;
            box-shadow: 0 0 0 0 !important;
          }
          .pulse-animation {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: .5; }
          }
        `}
      </style>
      <div style={{
        backgroundColor: '#F3F4F6',
        borderRadius: '24px',
        padding: '28px',
        maxWidth: '420px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        margin: '0 auto',
        border: '1px solid #E5E7EB',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Background Blob */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          backgroundColor: '#DBEAFE',
          borderRadius: '50%',
          opacity: 0.5,
          zIndex: 0
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Header Title */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              color: '#1F2937', 
              margin: '0 0 8px 0',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              Metode Absensi
            </h2>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
              Pilih metode atau generate QR code baru
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
            border: '2px solid #E5E7EB',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <p style={{ fontSize: '14px', color: '#4B5563', margin: 0 }}>
              Unggah QR Code yang diberikan oleh Pengurus Kelas.
            </p>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${isDragging ? '#2563EB' : '#D1D5DB'}`,
                borderRadius: '16px',
                padding: '32px 24px',
                backgroundColor: isDragging ? '#EFF6FF' : '#F9FAFB',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              {selectedFile ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#E5E7EB' }}>
                    <img src={URL.createObjectURL(selectedFile)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{selectedFile.name}</span>
                  <span style={{ fontSize: '12px', color: '#2563EB', fontWeight: '500' }}>Klik untuk ganti file</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#2563EB">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div>
                    <span style={{ color: '#2563EB', fontWeight: '600' }}>Klik untuk upload</span>
                    <span style={{ color: '#6B7280' }}> atau drag & drop</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#9CA3AF' }}>PNG, JPG hingga 5MB</span>
                </div>
              )}
            </div>
            <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FEF3C7', borderRadius: '12px', padding: '12px', color: '#92400E' }}>
              Silahkan Upload Kode QR yang telah diberikan.
            </div>
          </div>

          {/* Action Buttons Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <button
              onClick={handleContinue}
              disabled={!selectedFile}
              className="btn-3d"
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: selectedFile ? '#2563EB' : '#9CA3AF',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontWeight: '700',
                fontSize: '16px',
                cursor: selectedFile ? 'pointer' : 'not-allowed',
                boxShadow: selectedFile ? '0 6px 0 #1D4ED8' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Lanjutkan
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
              <div style={{ flex: 1, height: '2px', backgroundColor: '#E5E7EB' }} />
              <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '600', textTransform: 'uppercase' }}>Atau</span>
              <div style={{ flex: 1, height: '2px', backgroundColor: '#E5E7EB' }} />
            </div>

            {/* Secondary Actions: Manual & Scan */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={openDispensasi}
                className="btn-3d"
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: '#10B981', // Emerald
                  color: 'white',
                  border: 'none',
                  borderRadius: '14px',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 5px 0 #059669',
                }}
              >
                Dispensasi
              </button>

              <button
                onClick={handleTidakBisaMengajar}
                className="btn-3d"
                title="Laporkan Tidak Bisa Mengajar"
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: '#EF4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '14px',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 5px 0 #DC2626',
                  transition: 'background-color 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#DC2626';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 5px 0 #B91C1C';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#EF4444';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 5px 0 #DC2626';
                }}
              >
                Tidak Bisa Mengajar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>

    <Modal isOpen={showDispensasi} onClose={closeDispensasi}>
      <div style={{
        backgroundColor: '#F3F4F6',
        borderRadius: '24px',
        padding: '28px',
        maxWidth: '420px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        margin: '0 auto',
        border: '1px solid #E5E7EB',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Background Blob */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          backgroundColor: '#DBEAFE',
          borderRadius: '50%',
          opacity: 0.5,
          zIndex: 0
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Header Title */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              color: '#1F2937', 
              margin: '0 0 8px 0',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              Pengajuan Dispensasi
            </h2>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
              Isi form untuk mengajukan dispensasi ke Waka/Pengurus Kelas.
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
            border: '2px solid #E5E7EB',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <input 
              value={dispAlasan} 
              onChange={(e) => setDispAlasan(e.target.value)} 
              placeholder="Alasan" 
              style={{ padding: '12px', borderRadius: '12px', border: '1px solid #D1D5DB', width: '100%', boxSizing: 'border-box' }} 
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              <input 
                type="date" 
                value={dispTanggal} 
                onChange={(e) => setDispTanggal(e.target.value)} 
                style={{ padding: '12px', borderRadius: '12px', border: '1px solid #D1D5DB', width: '100%', boxSizing: 'border-box' }} 
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input 
                  type="time" 
                  value={dispMulai} 
                  onChange={(e) => setDispMulai(e.target.value)} 
                  style={{ padding: '12px', borderRadius: '12px', border: '1px solid #D1D5DB', width: '100%', boxSizing: 'border-box' }} 
                />
                <input 
                  type="time" 
                  value={dispSelesai} 
                  onChange={(e) => setDispSelesai(e.target.value)} 
                  style={{ padding: '12px', borderRadius: '12px', border: '1px solid #D1D5DB', width: '100%', boxSizing: 'border-box' }} 
                />
              </div>
            </div>
            <textarea 
              value={dispKeterangan} 
              onChange={(e) => setDispKeterangan(e.target.value)} 
              placeholder="Keterangan (opsional)" 
              rows={3} 
              style={{ padding: '12px', borderRadius: '12px', border: '1px solid #D1D5DB', width: '100%', boxSizing: 'border-box', resize: 'none' }} 
            />
            <div style={{ textAlign: 'left' }}>
               <label style={{ fontSize: '12px', color: '#4B5563', marginBottom: '4px', display: 'block' }}>Bukti Pendukung (Opsional)</label>
               <input type="file" onChange={handleDispBuktiChange} style={{ fontSize: '12px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleSubmitDispensasi} className="btn-3d" style={{
              flex: 1,
              padding: '14px',
              backgroundColor: '#2563EB',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 5px 0 #1D4ED8'
            }}>
              Kirim
            </button>
            <button onClick={closeDispensasi} className="btn-3d" style={{
              flex: 1,
              padding: '14px',
              backgroundColor: '#9CA3AF',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 5px 0 #6B7280'
            }}>
              Batal
            </button>
          </div>
        </div>
      </div>
    </Modal>
        </>
      )}
    </>
  );
}