import React, { useState } from "react";
import AdminLayout from "../../component/Admin/AdminLayout";
import { Button } from "../../component/Shared/Button";
import { Table } from "../../component/Shared/Table";
import { TambahKelasForm } from "../../component/Shared/Form/KelasForm";
import AWANKIRI from "../../assets/Icon/AWANKIRI.png";
import AwanBawahkanan from "../../assets/Icon/AwanBawahkanan.png";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { usePopup } from "../../component/Shared/Popup/PopupProvider";

/* ===================== INTERFACE ===================== */
interface User {
  role: string;
  name: string;
}

interface Kelas {
  id: string;
  konsentrasiKeahlian: string;
  tingkatKelas: string;
  namaKelas: string;
  waliKelas: string;
}

interface KelasAdminProps {
  user: User;
  onLogout: () => void;
  currentPage: string;
  onMenuClick: (page: string) => void;
}

/* ===================== DUMMY DATA ===================== */


// Data dummy untuk dropdown filter
const konsentrasiKeahlianOptions = [
  "Semua Konsentrasi Keahlian",
  "Rekayasa Perangkat Lunak",
  "Mekatronika",
  "Animasi",
  "Desain Komunikasi Visual",
  "Elektronika Industri"
];

const tingkatKelasOptions = [
  "Semua Tingkat",
  "10",
  "11",
  "12"
];



const waliKelasList = [
  { id: "Alifah Diantebes Aindra S.pd", nama: "Alifah Diantebes Aindra S.pd" },
  { id: "Siti Nurhaliza", nama: "Siti Nurhaliza" },
];

/* ===================== COMPONENT ===================== */
export default function KelasAdmin({
  user,
  onLogout,
  currentPage,
  onMenuClick,
}: KelasAdminProps) {
  const { alert: popupAlert, confirm: popupConfirm } = usePopup();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [jurusanList, setJurusanList] = useState<{ id: string, nama: string }[]>([]); // Dynamic majors
  const [editingKelas, setEditingKelas] = useState<Kelas | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [selectedKonsentrasi, setSelectedKonsentrasi] = useState("Semua Konsentrasi Keahlian");
  const [selectedTingkat, setSelectedTingkat] = useState("Semua Tingkat");

  // Fetch Classes and Majors
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { classService } = await import('../../services/class');
        const { majorService } = await import('../../services/major');

        const [classesData, majorsData] = await Promise.all([
          classService.getClasses(),
          majorService.getMajors()
        ]);

        const mappedClasses: Kelas[] = classesData.map((c: any) => ({
          id: String(c.id),
          konsentrasiKeahlian: c.major ? c.major.name : '-',
          tingkatKelas: c.grade,
          namaKelas: c.name || `${c.grade} ${c.label}`,
          waliKelas: c.homeroom_teacher?.user?.name || '-'
        }));
        setKelasList(mappedClasses);

        const mappedMajors = majorsData.map((m: any) => ({
          id: String(m.id),
          nama: m.name
        }));
        setJurusanList(mappedMajors);

      } catch (e) {
        console.error(e);
        void popupAlert("Gagal mengambil data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [popupAlert]);

  /* ===================== FILTER ===================== */
  const filteredData = kelasList.filter((k) => {
    // Filter berdasarkan konsentrasi keahlian
    const konsentrasiMatch =
      selectedKonsentrasi === "Semua Konsentrasi Keahlian" ||
      k.konsentrasiKeahlian === selectedKonsentrasi;

    // Filter berdasarkan tingkat kelas
    const tingkatMatch =
      selectedTingkat === "Semua Tingkat" ||
      k.tingkatKelas === selectedTingkat;

    return konsentrasiMatch && tingkatMatch;
  });

  const handleDelete = async (row: Kelas) => {
    if (await popupConfirm(`Hapus kelas "${row.namaKelas}"?`)) {
      try {
        const { classService } = await import('../../services/class');
        await classService.deleteClass(row.id);
        setKelasList((prev) => prev.filter((k) => k.id !== row.id));
        void popupAlert("Kelas berhasil dihapus");
      } catch (e) {
        void popupAlert("Gagal menghapus kelas");
      }
    }
  };

  /* ===================== TABLE ===================== */
  const columns = [
    { key: "konsentrasiKeahlian", label: "Konsentrasi Keahlian" },
    { key: "tingkatKelas", label: "Tingkat Kelas" },
    { key: "namaKelas", label: "Kelas" },
    { key: "waliKelas", label: "Wali Kelas" },
    {
      key: "aksi",
      label: "Aksi",
      render: (_: any, row: Kelas) => (
        <div style={{ position: "relative" }}>
          <button
            onClick={() =>
              setOpenActionId(openActionId === row.id ? null : row.id)
            }
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <MoreVertical size={22} strokeWidth={1.5} />
          </button>

          {openActionId === row.id && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 6,
                background: "#FFFFFF",
                borderRadius: 8,
                boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
                minWidth: 180,
                zIndex: 1000, // Ditambah z-index tinggi
                overflow: "hidden",
                border: "1px solid #E2E8F0",
              }}
            >
              {/* EDIT */}
              <button
                onClick={() => {
                  setOpenActionId(null);
                  setEditingKelas(row);
                  setIsModalOpen(true);
                }}
                style={actionItemStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F0F4FF";
                  e.currentTarget.style.color = "#2563EB";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                  e.currentTarget.style.color = "#0F172A";
                }}
              >
                <Edit size={16} strokeWidth={2} />
                Ubah
              </button>

              {/* HAPUS */}
              <button
                onClick={() => handleDelete(row)}
                style={{ ...actionItemStyle, borderBottom: "none" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FEF2F2";
                  e.currentTarget.style.color = "#DC2626";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                  e.currentTarget.style.color = "#0F172A";
                }}
              >
                <Trash2 size={16} strokeWidth={2} />
                Hapus
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      pageTitle="Data Kelas"
      currentPage={currentPage}
      onMenuClick={onMenuClick}
      user={user}
      onLogout={onLogout}
      hideBackground
    >
      <img src={AWANKIRI} style={bgLeft} />
      <img src={AwanBawahkanan} style={bgRight} />

      <div
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(6px)",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          border: "1px solid rgba(255,255,255,0.6)",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          position: "relative", // Tambah ini
          zIndex: 1, // Tambah ini
        }}
      >
        {/* HEADER 2 DROPDOWN DAN TOMBOL TAMBAH */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* KIRI: 2 DROPDOWN */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            flex: 1,
          }}>
            {/* DROPDOWN KONSENTRASI KEAHLIAN */}
            <div style={{
              minWidth: "200px",
              maxWidth: "250px"
            }}>
              <select
                value={selectedKonsentrasi}
                onChange={(e) => setSelectedKonsentrasi(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 8,
                  border: "1px solid #D1D5DB",
                  fontSize: 14,
                  backgroundColor: "#FFFFFF",
                  color: "#1F2937",
                  outline: "none",
                  cursor: "pointer",
                  height: "48px",
                  boxSizing: "border-box",
                }}
              >
                {konsentrasiKeahlianOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* DROPDOWN TINGKAT KELAS */}
            <div style={{
              minWidth: "120px",
              maxWidth: "150px"
            }}>
              <select
                value={selectedTingkat}
                onChange={(e) => setSelectedTingkat(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 8,
                  border: "1px solid #D1D5DB",
                  fontSize: 14,
                  backgroundColor: "#FFFFFF",
                  color: "#1F2937",
                  outline: "none",
                  cursor: "pointer",
                  height: "48px",
                  boxSizing: "border-box",
                }}
              >
                {tingkatKelasOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* KANAN: TOMBOL TAMBAH - DIPOSISIKAN LEBIH KE KANAN */}
          <div style={{
            height: "48px",
            display: "flex",
            alignItems: "center",
          }}>
            <Button
              label="Tambahkan"
              onClick={() => setIsModalOpen(true)}
              style={{
                height: "100%",
                padding: "0 24px",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            />
          </div>
        </div>

        {/* TABLE WRAPPER */}
        <div
          style={{
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 0 0 1px #E5E7EB",
          }}
        >
          <Table columns={columns} data={filteredData} keyField="id" />
        </div>
      </div>

      {/* MODAL OVERLAY - Ditambah untuk handle popup */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: isModalOpen ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999, // Z-index sangat tinggi
      }}>
        <div style={{
          position: "relative",
          zIndex: 10000,
          maxWidth: "90vw",
          maxHeight: "90vh",
          overflow: "auto",
        }}>
          <TambahKelasForm
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingKelas(null);
            }}
            isEdit={!!editingKelas}
            initialData={
              editingKelas
                ? {
                  namaKelas: editingKelas.namaKelas.split(' ').slice(1).join(' '), // Try to extract label
                  jurusanId: editingKelas.konsentrasiKeahlian,
                  kelasId: editingKelas.tingkatKelas,
                  waliKelasId: editingKelas.waliKelas,
                }
                : undefined
            }
            jurusanList={jurusanList}
            waliKelasList={waliKelasList}
            takenWaliKelasIds={kelasList.map(k => k.waliKelas).filter(id => id !== editingKelas?.waliKelas)}
            onSubmit={async (data) => {
              try {
                const { classService } = await import('../../services/class');

                // Find major ID based on selected name/ID (form returns ID if passed as ID)
                // In TambahKelasForm, options value={jurusan.nama}, so we get name?
                // Actually, let's look at `DataKelas.jsx`'s input.
                // Assuming data.jurusanId matches `jurusanList` entry.
                // We'll try to find by Name OR ID.

                const selectedMajor = jurusanList.find(j => j.nama === data.jurusanId || j.id === data.jurusanId);
                const majorId = selectedMajor ? parseInt(selectedMajor.id) : 1;

                const payload = {
                  grade: data.kelasId,
                  label: data.namaKelas,
                  major_id: majorId,
                };

                if (editingKelas) {
                  await classService.updateClass(editingKelas.id, payload);
                  void popupAlert("Kelas berhasil diupdate");
                } else {
                  await classService.createClass(payload);
                  void popupAlert("Kelas berhasil dibuat");
                }

                // Refresh
                const newData = await classService.getClasses();
                const mappedData: Kelas[] = newData.map((c: any) => ({
                  id: String(c.id),
                  konsentrasiKeahlian: c.major ? c.major.name : '-',
                  tingkatKelas: c.grade,
                  namaKelas: c.name || `${c.grade} ${c.label}`,
                  waliKelas: c.homeroom_teacher?.user?.name || '-'
                }));
                setKelasList(mappedData);

              } catch (e) {
                console.error(e);
                void popupAlert("Gagal menyimpan data kelas");
              }
              setIsModalOpen(false);
              setEditingKelas(null);
            }}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

/* ===================== STYLE ===================== */
const actionItemStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  border: "none",
  background: "none",
  textAlign: "left",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 10,
  color: "#0F172A",
  fontSize: 14,
  fontWeight: 500,
  transition: "all 0.2s ease",
  borderBottom: "1px solid #F1F5F9",
};

const bgLeft: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: 220,
  zIndex: 0,
};

const bgRight: React.CSSProperties = {
  position: "fixed",
  bottom: 0,
  right: 0,
  width: 220,
  zIndex: 0,
};

