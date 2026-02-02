import React, { useState } from "react";
import AdminLayout from "../../component/Admin/AdminLayout";
import { Button } from "../../component/Shared/Button";
import { Table } from "../../component/Shared/Table";
import { TambahKelasForm } from "../../component/Shared/Form/KelasForm";
import AWANKIRI from "../../assets/Icon/AWANKIRI.png";
import AwanBawahkanan from "../../assets/Icon/AwanBawahkanan.png";
import { MoreVertical, Edit, Trash2 } from "lucide-react";

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
const dummyData: Kelas[] = [
  { id: "1", konsentrasiKeahlian: "Rekayasa Perangkat Lunak", tingkatKelas: "10", namaKelas: "RPL 1", waliKelas: "Alifah Diantebes Aindra S.pd" },
  { id: "2", konsentrasiKeahlian: "Rekayasa Perangkat Lunak", tingkatKelas: "10", namaKelas: "RPL 2", waliKelas: "Siti Nurhaliza" },
  { id: "3", konsentrasiKeahlian: "Mekatronika", tingkatKelas: "11", namaKelas: "Meka 1", waliKelas: "Alifah Diantebes Aindra S.pd" },
  { id: "4", konsentrasiKeahlian: "Mekatronika", tingkatKelas: "11", namaKelas: "Meka 2", waliKelas: "Siti Nurhaliza" },
  { id: "5", konsentrasiKeahlian: "Animasi", tingkatKelas: "12", namaKelas: "Anim 1", waliKelas: "Alifah Diantebes Aindra S.pd" },
  { id: "6", konsentrasiKeahlian: "Desain Komunikasi Visual", tingkatKelas: "10", namaKelas: "DKV 1", waliKelas: "Siti Nurhaliza" },
  { id: "7", konsentrasiKeahlian: "Elektronika Industri", tingkatKelas: "11", namaKelas: "EI 1", waliKelas: "Alifah Diantebes Aindra S.pd" },
];

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

// Data dummy untuk dropdown form
const jurusanList = [
  { id: "1", nama: "Rekayasa Perangkat Lunak" },
  { id: "2", nama: "Mekatronika" },
  { id: "3", nama: "Animasi" },
  { id: "4", nama: "Desain Komunikasi Visual" },
  { id: "5", nama: "Elektronika Industri" },
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kelasList, setKelasList] = useState<Kelas[]>(dummyData);
  const [editingKelas, setEditingKelas] = useState<Kelas | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [selectedKonsentrasi, setSelectedKonsentrasi] = useState("Semua Konsentrasi Keahlian");
  const [selectedTingkat, setSelectedTingkat] = useState("Semua Tingkat");

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

  const handleDelete = (row: Kelas) => {
    if (confirm(`Hapus kelas "${row.namaKelas}"?`)) {
      setKelasList((prev) => prev.filter((k) => k.id !== row.id));
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
                zIndex: 10,
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
            position: "relative",
            right: "-10px" 
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
                namaKelas: editingKelas.namaKelas,
                jurusanId: editingKelas.konsentrasiKeahlian,
                kelasId: editingKelas.tingkatKelas,
                waliKelasId: editingKelas.waliKelas,
              }
            : undefined
        }
        jurusanList={jurusanList}
        waliKelasList={waliKelasList}
        takenWaliKelasIds={kelasList.map(k => k.waliKelas).filter(id => id !== editingKelas?.waliKelas)}
        onSubmit={(data) => {
          if (editingKelas) {
            setKelasList((prev) =>
              prev.map((k) =>
                k.id === editingKelas.id
                  ? { 
                      ...k, 
                      namaKelas: data.namaKelas,
                      konsentrasiKeahlian: data.jurusanId,
                      tingkatKelas: data.kelasId,
                      waliKelas: data.waliKelasId
                    }
                  : k
              )
            );
          } else {
            setKelasList((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                namaKelas: data.namaKelas,
                konsentrasiKeahlian: data.jurusanId,
                tingkatKelas: data.kelasId,
                waliKelas: data.waliKelasId,
              },
            ]);
          }
          setIsModalOpen(false);
          setEditingKelas(null);
        }}
      />
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