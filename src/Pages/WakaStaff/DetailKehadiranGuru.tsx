import { useMemo, useState } from "react";
import { User, SquarePen, ArrowLeft } from "lucide-react";
import StaffLayout from "../../component/WakaStaff/StaffLayout";
import { FormModal } from "../../component/Shared/FormModal";
import { Select } from "../../component/Shared/Select";
import { StatusBadge } from "../../component/Shared/StatusBadge";

type StatusKehadiran = "Hadir" | "Izin" | "Sakit" | "Alfa";

type RowKehadiran = {
  no: number;
  tanggal: string;
  jam: string;
  mapel: string;
  kelas: string;
  status: StatusKehadiran;
};

export default function DetailKehadiranGuru({
  user = { name: "Admin", role: "waka" },
  currentPage = "detail-kehadiran-guru",
  onMenuClick = () => {},
  onLogout = () => {},
  onBack = () => {},
}) {
  const [rows, setRows] = useState<RowKehadiran[]>([
    {
      no: 1,
      tanggal: "25-05-2025",
      jam: "1-4",
      mapel: "Matematika",
      kelas: "XII Mekatronika 2",
      status: "Hadir",
    },
    {
      no: 2,
      tanggal: "24-05-2025",
      jam: "5-8",
      mapel: "Matematika",
      kelas: "XII Mekatronika 2",
      status: "Hadir",
    },
    {
      no: 3,
      tanggal: "25-05-2025",
      jam: "9-10",
      mapel: "Matematika",
      kelas: "XII Mekatronika 2",
      status: "Izin",
    },
  ]);

  const guruInfo = {
    name: "Ewit Erniyah S.pd",
    phone: "0918415784",
  };

  const statusOptions = useMemo(
    () => [
      { label: "Hadir", value: "Hadir" },
      { label: "Sakit", value: "Sakit" },
      { label: "Izin", value: "Izin" },
      { label: "Tidak Hadir", value: "Alfa" },
    ],
    []
  );

  const [editingRow, setEditingRow] = useState<RowKehadiran | null>(null);
  const [editStatus, setEditStatus] = useState<StatusKehadiran>("Hadir");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenEdit = (row: RowKehadiran) => {
    setEditingRow(row);
    setEditStatus(row.status);
    setIsEditOpen(true);
  };

  const handleSubmitEdit = () => {
    if (!editingRow) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setRows((prev) =>
        prev.map((r) =>
          r === editingRow ? { ...r, status: editStatus } : r
        )
      );
      setIsSubmitting(false);
      setIsEditOpen(false);
      setEditingRow(null);
    }, 300);
  };

  const mapStatusToBadge = (status: StatusKehadiran) => {
    switch (status) {
      case "Hadir":
        return "hadir";
      case "Izin":
        return "izin";
      case "Sakit":
        return "sakit";
      default:
        return "tidak-hadir";
    }
  };

  return (
    <StaffLayout
      pageTitle="Detail Kehadiran Guru"
      currentPage={currentPage}
      onMenuClick={onMenuClick}
      user={user}
      onLogout={onLogout}
    >
      {/* CARD GURU */}
      <div
        style={{
          width: 420,
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
        <div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>
            {guruInfo.name}
          </div>
          <div style={{ fontSize: 15, opacity: 0.9 }}>
            {guruInfo.phone}
          </div>
        </div>
      </div>

      {/* BUTTON KEMBALI */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 10,
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 8,
            backgroundColor: "#494a4b",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} />
          Kembali
        </button>
      </div>

      {/* TABLE */}
      <div
        style={{
          border: "1px solid #E5E7EB",
          borderRadius: 10,
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "70px 140px 140px 220px 200px 150px 90px",
            backgroundColor: "#E5E7EB",
            padding: "12px 0",
            fontWeight: 700,
            fontSize: 14,
            textAlign: "center",
          }}
        >
          <div>No</div>
          <div>Tanggal</div>
          <div>Jam</div>
          <div>Mapel</div>
          <div>Kelas</div>
          <div>Status</div>
          <div style={{ textAlign: "right", paddingRight: 16 }}>
            Aksi
          </div>
        </div>

        {/* ROW */}
        {rows.map((r, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns:
                "70px 140px 140px 220px 200px 150px 90px",
              padding: "12px 0",
              fontSize: 14,
              alignItems: "center",
              textAlign: "center",
              borderTop: "1px solid #E5E7EB",
              backgroundColor: "#fff",
            }}
          >
            <div>{r.no}</div>
            <div>{r.tanggal}</div>
            <div>{r.jam}</div>
            <div>{r.mapel}</div>
            <div>{r.kelas}</div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <StatusBadge status={mapStatusToBadge(r.status)} />
            </div>

            {/* AKSI */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingRight: 16,
              }}
            >
              <button
                onClick={() => handleOpenEdit(r)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <SquarePen size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <FormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Ubah Kehadiran"
        onSubmit={handleSubmitEdit}
        submitLabel="Simpan"
        isSubmitting={isSubmitting}
      >
        <Select
          value={editStatus}
          onChange={(v) => setEditStatus(v as StatusKehadiran)}
          options={statusOptions}
        />
      </FormModal>
    </StaffLayout>
  );
}
