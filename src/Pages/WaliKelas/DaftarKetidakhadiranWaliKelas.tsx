import { useState, useMemo } from "react";
import WalikelasLayout from "../../component/Walikelas/layoutwakel";
import { User, ArrowLeft, Eye } from "lucide-react";
import { Modal } from "../../component/Shared/Modal";

type StatusKehadiran = "Hadir" | "Izin" | "Sakit" | "Alfa";

type RowKehadiran = {
  no: number;
  tanggal: string;
  jam: string;
  mapel: string;
  guru: string;
  status: StatusKehadiran;
  keterangan?: string;
  bukti?: string;
};

interface DaftarKetidakhadiranWaliKelasProps {
  user?: { name: string; role: string };
  currentPage?: string;
  onMenuClick?: (page: string, payload?: any) => void;
  onLogout?: () => void;
  siswaName?: string;
  siswaIdentitas?: string;
}

export default function DaftarKetidakhadiranWaliKelas({
  user = { name: "Wali Kelas", role: "walikelas" },
  currentPage = "daftar-ketidakhadiran-walikelas",
  onMenuClick = () => {},
  onLogout = () => {},
  siswaName = "Muhammad Wito S.",
  siswaIdentitas = "0918415784",
}: DaftarKetidakhadiranWaliKelasProps) {
  // Data dummy dengan keterangan dan bukti
  const [rows] = useState<RowKehadiran[]>([
    {
      no: 1,
      tanggal: "20-05-2025",
      jam: "1-2",
      mapel: "Matematika",
      guru: "Alifah Diantebes Aindra S.pd",
      status: "Hadir",
    },
    {
      no: 2,
      tanggal: "20-05-2025",
      jam: "3-4",
      mapel: "Bahasa Indonesia",
      guru: "Siti Nurhaliza S.pd",
      status: "Hadir",
    },
    {
      no: 3,
      tanggal: "21-05-2025",
      jam: "1-2",
      mapel: "Matematika",
      guru: "Alifah Diantebes Aindra S.pd",
      status: "Hadir",
    },
    {
      no: 4,
      tanggal: "21-05-2025",
      jam: "5-6",
      mapel: "Fisika",
      guru: "Budi Santoso S.pd",
      status: "Izin",
      keterangan: "Ijin tidak masuk karena ada keperluan keluarga",
      bukti: "surat_izin.jpg",
    },
    {
      no: 5,
      tanggal: "22-05-2025",
      jam: "3-4",
      mapel: "Kimia",
      guru: "Dewi Lestari S.pd",
      status: "Sakit",
      keterangan: "Demam tinggi dan dokter menyarankan istirahat",
      bukti: "surat_dokter.jpg",
    },
    {
      no: 6,
      tanggal: "23-05-2025",
      jam: "1-2",
      mapel: "Matematika",
      guru: "Alifah Diantebes Aindra S.pd",
      status: "Alfa",
    },
    {
      no: 7,
      tanggal: "23-05-2025",
      jam: "7-8",
      mapel: "Bahasa Inggris",
      guru: "Ahmad Fauzi S.pd",
      status: "Alfa",
    },
  ]);

  const [selectedRecord, setSelectedRecord] = useState<RowKehadiran | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hitung statistik menggunakan useMemo untuk optimasi
  const stats = useMemo(() => ({
    hadir: rows.filter((r) => r.status === "Hadir").length,
    izin: rows.filter((r) => r.status === "Izin").length,
    sakit: rows.filter((r) => r.status === "Sakit").length,
    alfa: rows.filter((r) => r.status === "Alfa").length,
  }), [rows]);

  const handleBack = () => {
    onMenuClick("rekap-kehadiran-siswa");
  };

  // Warna sesuai revisi dari AbsensiSiswa.tsx
  const COLORS = {
    HADIR: "#1FA83D",    // REVISI: Hadir > #1FA83D
    IZIN: "#ACA40D",     // REVISI: Izin > #ACA40D
    SAKIT: "#520C8F",    // REVISI: Sakit > #520C8F
    ALFA: "#D90000"      // REVISI: Alfa/Tidak Hadir > #D90000
  };

  // Fungsi untuk membuka modal detail
  const handleStatusClick = (record: RowKehadiran, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  // Komponen Status Button yang bisa diklik
  const StatusButton = ({ status, row }: { status: StatusKehadiran; row: RowKehadiran }) => {
    let bgColor = COLORS.ALFA;
    let label = "Alfa";
    let textColor = "#FFFFFF";

    if (status === "Hadir") {
      bgColor = COLORS.HADIR;
      label = "Hadir";
    } else if (status === "Izin") {
      bgColor = COLORS.IZIN;
      label = "Izin";
    } else if (status === "Sakit") {
      bgColor = COLORS.SAKIT;
      label = "Sakit";
    }

    return (
      <div
        onClick={(e) => handleStatusClick(row, e)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          minWidth: "100px",
          padding: "8px 14px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 800, // Diperkuat
          color: textColor,
          backgroundColor: bgColor,
          cursor: "pointer",
          transition: "all 0.2s ease",
          border: "none",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          minHeight: "36px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.9";
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
        }}
      >
        <Eye size={14} />
        <span style={{ fontWeight: 700 }}>{label}</span> {/* Diperkuat */}
      </div>
    );
  };

  // Fungsi untuk mendapatkan teks status
  const getStatusText = (status: StatusKehadiran) => {
    switch (status) {
      case "Hadir":
        return "Siswa hadir tepat waktu";
      case "Izin":
        return "Siswa izin dengan keterangan";
      case "Sakit":
        return "Siswa sakit dengan surat dokter";
      case "Alfa":
        return "Siswa tidak hadir tanpa keterangan";
      default:
        return status;
    }
  };

  // Fungsi untuk mendapatkan warna status
  const getStatusColor = (status: StatusKehadiran) => {
    switch (status) {
      case "Hadir": return COLORS.HADIR;
      case "Izin": return COLORS.IZIN;
      case "Sakit": return COLORS.SAKIT;
      case "Alfa": return COLORS.ALFA;
      default: return "#6B7280";
    }
  };

  return (
    <>
      <WalikelasLayout
        pageTitle="Daftar Ketidakhadiran"
        currentPage={currentPage as any}
        onMenuClick={onMenuClick}
        user={user}
        onLogout={onLogout}
      >
        {/* CARD SISWA */}
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            backgroundColor: "#062A4A",
            borderRadius: 10,
            padding: 18,
            display: "flex",
            gap: 16,
            color: "#fff",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.15)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <User size={30} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 900 }}>{siswaName}</div> {/* Diperkuat */}
            <div style={{ fontSize: 15, opacity: 0.9, fontWeight: 600 }}>NISN: {siswaIdentitas}</div> {/* Diperkuat */}
          </div>
        </div>

        {/* STATISTIK KEHADIRAN */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: `2px solid ${COLORS.HADIR}`,
              borderRadius: 10,
              padding: "12px 24px",
              textAlign: "center",
              minWidth: 100,
              flex: 1,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: "#6B7280" }}> {/* Diperkuat */}
              Hadir
            </div>
            <div
              style={{
                fontSize: 32, // Diperbesar
                fontWeight: 900, // Diperkuat
                color: COLORS.HADIR,
                marginTop: 4,
              }}
            >
              {stats.hadir}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: `2px solid ${COLORS.IZIN}`,
              borderRadius: 10,
              padding: "12px 24px",
              textAlign: "center",
              minWidth: 100,
              flex: 1,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: "#6B7280" }}> {/* Diperkuat */}
              Izin
            </div>
            <div
              style={{
                fontSize: 32, // Diperbesar
                fontWeight: 900, // Diperkuat
                color: COLORS.IZIN,
                marginTop: 4,
              }}
            >
              {stats.izin}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: `2px solid ${COLORS.SAKIT}`,
              borderRadius: 10,
              padding: "12px 24px",
              textAlign: "center",
              minWidth: 100,
              flex: 1,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: "#6B7280" }}> {/* Diperkuat */}
              Sakit
            </div>
            <div
              style={{
                fontSize: 32, // Diperbesar
                fontWeight: 900, // Diperkuat
                color: COLORS.SAKIT,
                marginTop: 4,
              }}
            >
              {stats.sakit}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: `2px solid ${COLORS.ALFA}`,
              borderRadius: 10,
              padding: "12px 24px",
              textAlign: "center",
              minWidth: 100,
              flex: 1,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: "#6B7280" }}> {/* Diperkuat */}
              Alfa
            </div>
            <div
              style={{
                fontSize: 32, // Diperbesar
                fontWeight: 900, // Diperkuat
                color: COLORS.ALFA,
                marginTop: 4,
              }}
            >
              {stats.alfa}
            </div>
          </div>
        </div>

        {/* BUTTON KEMBALI */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 16, // Ditambah
          }}
        >
          <button
            onClick={handleBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 20px",
              borderRadius: 8,
              backgroundColor: "#062A4A",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700, // Diperkuat
              transition: "all 0.2s",
              boxShadow: "0 2px 4px rgba(6, 42, 74, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#051A2F";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(6, 42, 74, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#062A4A";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(6, 42, 74, 0.2)";
            }}
          >
            <ArrowLeft size={18} />
            Kembali ke Rekap
          </button>
        </div>

        {/* TABLE */}
        <div
          style={{
            border: "1px solid #E5E7EB",
            borderRadius: 10,
            overflow: "hidden",
            backgroundColor: "#fff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "70px 140px 140px 1fr 1fr 150px",
              backgroundColor: "#F3F4F6",
              padding: "16px 20px",
              fontWeight: 800, // Diperkuat
              fontSize: 14,
              color: "#374151",
              borderBottom: "2px solid #E5E7EB",
            }}
          >
            <div style={{ textAlign: "center", fontWeight: 900 }}>No</div> {/* Diperkuat */}
            <div style={{ textAlign: "center", fontWeight: 900 }}>Tanggal</div> {/* Diperkuat */}
            <div style={{ textAlign: "center", fontWeight: 900 }}>Jam Pelajaran</div> {/* Diperkuat */}
            <div style={{ fontWeight: 900 }}>Mata Pelajaran</div> {/* Diperkuat */}
            <div style={{ fontWeight: 900 }}>Guru</div> {/* Diperkuat */}
            <div style={{ textAlign: "center", fontWeight: 900 }}>Status</div> {/* Diperkuat */}
          </div>

          {/* ROWS */}
          {rows.map((r, idx) => (
            <div
              key={r.no}
              style={{
                display: "grid",
                gridTemplateColumns: "70px 140px 140px 1fr 1fr 150px",
                padding: "16px 20px",
                fontSize: 14,
                alignItems: "center",
                borderBottom: idx < rows.length - 1 ? "1px solid #F3F4F6" : "none",
                backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#FAFBFC",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F3F4F6"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? "#FFFFFF" : "#FAFBFC"}
            >
              <div style={{ textAlign: "center", color: "#6B7280", fontWeight: "700" }}>{r.no}</div> {/* Diperkuat */}
              <div style={{ textAlign: "center", color: "#374151", fontWeight: "700" }}>{r.tanggal}</div> {/* Diperkuat */}
              <div style={{ textAlign: "center", color: "#374151", fontWeight: "700" }}>{r.jam}</div> {/* Diperkuat */}
              <div style={{ color: "#111827", fontWeight: "800" }}>{r.mapel}</div> {/* Diperkuat */}
              <div style={{ color: "#374151", fontWeight: "600" }}>{r.guru}</div> {/* Diperkuat */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <StatusButton status={r.status} row={r} />
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY FOOTER */}
        <div
          style={{
            marginTop: 24,
            padding: "20px",
            backgroundColor: "#F8FAFC",
            borderRadius: "10px",
            border: "2px solid #E2E8F0",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div style={{
            fontSize: "16px",
            fontWeight: 900, // Diperkuat
            color: "#6B7280",
            marginBottom: "8px",
          }}>
            Total Data Kehadiran
          </div>
          <div style={{
            fontSize: "36px", // Diperbesar
            fontWeight: 900, // Diperkuat
            color: "#062A4A",
          }}>
            {rows.length}
          </div>
        </div>
      </WalikelasLayout>

      {/* Modal Detail Kehadiran */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedRecord && (
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "420px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          }}>
            {/* Header Modal */}
            <div style={{
              backgroundColor: "#062A4A",
              padding: "18px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#FFFFFF",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Eye size={24} />
                <h3 style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: 900,
                }}>
                  Detail Kehadiran
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            {/* Content Modal */}
            <div style={{ 
              padding: 24,
              overflowY: "auto",
              flex: 1,
            }}>
              {/* Row Tanggal */}
              <DetailRow label="Tanggal" value={selectedRecord.tanggal} />

              {/* Row Jam Pelajaran */}
              <DetailRow label="Jam Pelajaran" value={selectedRecord.jam} />

              {/* Row Mata Pelajaran */}
              <DetailRow label="Mata pelajaran" value={selectedRecord.mapel} />

              {/* Row Nama Guru */}
              <DetailRow label="Nama guru" value={selectedRecord.guru} />

              {/* Row Status */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 24,
                paddingBottom: 12,
                borderBottom: "1px solid #E5E7EB",
              }}>
                <div style={{ fontWeight: 800, color: "#374151" }}>Status :</div>
                <div>
                  <span style={{
                    backgroundColor: getStatusColor(selectedRecord.status),
                    color: "#FFFFFF",
                    padding: "6px 18px",
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 800,
                  }}>
                    {selectedRecord.status}
                  </span>
                </div>
              </div>

              {/* Info Box */}
              <div style={{
                backgroundColor: "#EFF6FF",
                border: "2px solid #BFDBFE",
                borderRadius: 8,
                padding: 16,
                textAlign: "center",
                marginBottom: (selectedRecord.status === "Izin" || selectedRecord.status === "Sakit") && selectedRecord.keterangan ? 24 : 0,
              }}>
                <div style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#1E40AF",
                }}>
                  {getStatusText(selectedRecord.status)}
                </div>
              </div>

              {/* Keterangan untuk izin dan sakit */}
              {(selectedRecord.status === "Izin" || selectedRecord.status === "Sakit") && selectedRecord.keterangan && (
                <div>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#374151",
                    marginBottom: 12,
                  }}>
                    Keterangan :
                  </div>
                  <div style={{
                    padding: "14px 18px",
                    backgroundColor: "#F9FAFB",
                    borderRadius: 8,
                    border: "2px solid #E5E7EB",
                  }}>
                    <p style={{
                      margin: 0,
                      fontSize: 14,
                      color: "#6B7280",
                      lineHeight: 1.5,
                      fontWeight: 600,
                    }}>
                      {selectedRecord.keterangan}
                    </p>
                  </div>
                </div>
              )}

              {/* Area Bukti Foto untuk izin dan sakit */}
              {(selectedRecord.status === "Izin" || selectedRecord.status === "Sakit") && (
                <div style={{ marginTop: selectedRecord.keterangan ? 24 : 0 }}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#374151",
                    marginBottom: 12,
                  }}>
                    Bukti Foto :
                  </div>
                  <div style={{
                    padding: "40px 16px",
                    backgroundColor: "#F9FAFB",
                    borderRadius: 8,
                    border: "2px solid #E5E7EB",
                    minHeight: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <p style={{
                      margin: 0,
                      fontSize: 14,
                      color: "#9CA3AF",
                      textAlign: "center",
                      fontWeight: 600,
                    }}>
                      {selectedRecord.bukti || "[Area untuk menampilkan bukti foto]"}
                    </p>
                  </div>
                </div>
              )}

              {/* Catatan untuk status Hadir */}
              {selectedRecord.status === "Hadir" && (
                <div style={{ 
                  marginTop: 24,
                  padding: "14px 18px",
                  backgroundColor: "#F0FDF4",
                  borderRadius: 8,
                  border: "2px solid #BBF7D0",
                }}>
                  <p style={{
                    margin: 0,
                    fontSize: 14,
                    color: "#166534",
                    lineHeight: 1.5,
                    textAlign: "center",
                    fontWeight: 700,
                  }}>
                    ✓ Siswa hadir tepat waktu sesuai jadwal pelajaran
                  </p>
                </div>
              )}

              {/* Catatan untuk status Alfa */}
              {selectedRecord.status === "Alfa" && (
                <div style={{ 
                  marginTop: 24,
                  padding: "14px 18px",
                  backgroundColor: "#FEF2F2",
                  borderRadius: 8,
                  border: "2px solid #FECACA",
                }}>
                  <p style={{
                    margin: 0,
                    fontSize: 14,
                    color: "#991B1B",
                    lineHeight: 1.5,
                    textAlign: "center",
                    fontWeight: 700,
                  }}>
                    ⚠ Siswa tidak hadir tanpa keterangan
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

// Komponen DetailRow
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 16,
      paddingBottom: 12,
      borderBottom: "1px solid #E5E7EB",
    }}>
      <div style={{ fontWeight: 800, color: "#374151" }}>{label} :</div>
      <div style={{ fontWeight: 700, color: "#1F2937" }}>
        {value}
      </div>
    </div>
  );
}