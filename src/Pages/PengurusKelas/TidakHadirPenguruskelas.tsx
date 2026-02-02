import { useState, useMemo } from "react";
import { Modal } from "../../component/Shared/Modal";
import { Select } from "../../component/Shared/Select";

interface AbsensiRecord {
  id: string;
  tanggal: string;
  jamPelajaran: string;
  mataPelajaran: string;
  guru: string;
  status: "alpha" | "izin" | "sakit" | "izin-sakit" | "pulang";
  keterangan?: string;
}

// Dummy data - nanti dari API
const dummyData: AbsensiRecord[] = [
  {
    id: "1",
    tanggal: "25-05-2025",
    jamPelajaran: "1-4",
    mataPelajaran: "Matematika",
    guru: "Alifah Diantebes Aindra S.pd",
    status: "alpha",
  },
  {
    id: "2",
    tanggal: "24-05-2025",
    jamPelajaran: "1-4",
    mataPelajaran: "Matematika",
    guru: "Alifah Diantebes Aindra S.pd",
    status: "alpha",
  },
  {
    id: "3",
    tanggal: "25-05-2025",
    jamPelajaran: "1-4",
    mataPelajaran: "Matematika",
    guru: "Alifah Diantebes Aindra S.pd",
    status: "izin-sakit",
    keterangan: "Sakit demam",
  },
  {
    id: "4",
    tanggal: "25-05-2025",
    jamPelajaran: "1-4",
    mataPelajaran: "Matematika",
    guru: "Alifah Diantebes Aindra S.pd",
    status: "izin-sakit",
    keterangan: "Sakit perut",
  },
  {
    id: "5",
    tanggal: "25-05-2025",
    jamPelajaran: "1-4",
    mataPelajaran: "Matematika",
    guru: "Alifah Diantebes Aindra S.pd",
    status: "alpha",
  },
  {
    id: "6",
    tanggal: "25-05-2025",
    jamPelajaran: "1-4",
    mataPelajaran: "Matematika",
    guru: "Alifah Diantebes Aindra S.pd",
    status: "alpha",
  },
  {
    id: "7",
    tanggal: "26-05-2025",
    jamPelajaran: "1-4",
    mataPelajaran: "Bahasa Indonesia",
    guru: "Budi Santoso S.Pd",
    status: "izin",
    keterangan: "Acara keluarga",
  },
  {
    id: "8",
    tanggal: "26-05-2025",
    jamPelajaran: "5-8",
    mataPelajaran: "Bahasa Inggris",
    guru: "Siti Nurhaliza S.Pd",
    status: "sakit",
    keterangan: "Flu berat",
  },
  {
    id: "9",
    tanggal: "26-05-2025",
    jamPelajaran: "5-8",
    mataPelajaran: "Bahasa Inggris",
    guru: "Siti Nurhaliza S.Pd",
    status: "pulang",
    keterangan: "Pulang lebih awal karena sakit perut",
  },
];

function CalendarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 2V5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 2V5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 9.09H20.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path
        d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function TidakHadirPenguruskelas() {
  const [startDate, setStartDate] = useState("2025-05-24");
  const [endDate, setEndDate] = useState("2025-05-26");
  const [statusFilter, setStatusFilter] = useState<string>("semua");
  const [selectedRecord, setSelectedRecord] = useState<AbsensiRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter data
  const filteredData = useMemo(() => {
    if (!startDate || !endDate) return dummyData;

    const start = new Date(startDate);
    const end = new Date(endDate);
    // Set end date to end of day to include the full day
    end.setHours(23, 59, 59, 999);

    return dummyData.filter((item) => {
      // Convert DD-MM-YYYY to Date object
      const [day, month, year] = item.tanggal.split("-").map(Number);
      const itemDate = new Date(year, month - 1, day);

      // Filter by date range
      const inDateRange = itemDate >= start && itemDate <= end;

      // Filter by status
      let statusMatch = true;
      if (statusFilter !== "semua") {
        if (statusFilter === "izin/sakit") {
          statusMatch = item.status === "izin" || item.status === "sakit" || item.status === "izin-sakit";
        } else if (statusFilter === "alpha") {
          statusMatch = item.status === "alpha";
        } else if (statusFilter === "pulang") {
          statusMatch = item.status === "pulang";
        }
      }

      return inDateRange && statusMatch;
    });
  }, [startDate, endDate, statusFilter]);

  // Hitung summary berdasarkan data filtered
  const summary = useMemo(() => {
    const pulang = filteredData.filter((d) => d.status === "pulang").length;
    const izin = filteredData.filter((d) => d.status === "izin").length;
    const sakit = filteredData.filter((d) => d.status === "sakit" || d.status === "izin-sakit").length;
    const alpha = filteredData.filter((d) => d.status === "alpha").length;

    return { pulang, izin, sakit, alpha, total: filteredData.length };
  }, [filteredData]);

  // Helper custom untuk warna status
  const getStatusColor = (status: string) => {
    if (status === "izin" || status === "izin-sakit") return "#F59E0B";
    if (status === "sakit") return "#3B82F6";
    if (status === "pulang") return "#10B981";
    return "#EF4444"; // Alpha
  };

  const getStatusText = (status: string) => {
    if (status === "izin" || status === "izin-sakit") return "Izin";
    if (status === "sakit") return "Sakit";
    if (status === "pulang") return "Pulang";
    return "Alpha";
  };

  const handleStatusClick = (record: AbsensiRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  // Custom Status Renderer
  const StatusButton = ({ status, row }: { status: string; row: AbsensiRecord }) => {
    const color = getStatusColor(status);
    const label = getStatusText(status);

    return (
      <div
        onClick={(e) => handleStatusClick(row, e)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "100px",
          padding: "6px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 600,
          color: "#FFFFFF",
          backgroundColor: color,
          textAlign: "center",
          cursor: "pointer",
          gap: "6px",
          transition: "all 0.2s ease",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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
        <EyeIcon size={14} />
        <span>{label}</span>
      </div>
    );
  };

  const columns = [
    {
      key: "tanggal",
      label: "Tanggal",
      width: "120px",
    },
    {
      key: "jamPelajaran",
      label: "Jam Pelajaran",
      width: "120px",
    },
    {
      key: "mataPelajaran",
      label: "Mata Pelajaran",
      width: "200px",
    },
    {
      key: "guru",
      label: "Guru",
      width: "250px",
    },
    {
      key: "status",
      label: "Status",
      render: (_: any, row: AbsensiRecord) => <StatusButton status={row.status} row={row} />,
      align: "center" as const,
      width: "100px",
    },
  ];

  // Status filter options
  const statusOptions = [
    { label: "Semua Status", value: "semua" },
    { label: "Alpha", value: "alpha" },
    { label: "Izin", value: "izin/sakit" },
    { label: "Sakit", value: "sakit" },
    { label: "Pulang", value: "pulang" },
  ];

  // Total Card
  const TotalCard = () => (
    <div
      style={{
        background: "#0B2948",
        borderRadius: "12px",
        padding: "12px 24px",
        border: "1px solid #0B2948",
        boxShadow: "0 2px 4px rgba(11, 41, 72, 0.1)",
        minWidth: "120px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: "#FFFFFF",
          marginBottom: "4px",
        }}
      >
        Total Data
      </div>
      <div
        style={{
          fontSize: "24px",
          fontWeight: 800,
          color: "#FFFFFF",
          lineHeight: 1,
        }}
      >
        {summary.total}
      </div>
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        padding: "20px",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          alignItems: "stretch", // Stretch height
        }}
      >
        {/* Date Range Picker - Compact */}
        <div
          style={{
            background: "#0B2948",
            borderRadius: "8px",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "white",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <CalendarIcon />
            {/* Removed the word "Periode :" to clear space, icon is enough */}
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "6px",
                padding: "6px 10px",
                color: "#0F172A",
                fontWeight: "600",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#0F172A",
                  fontWeight: "600",
                  fontSize: "13px",
                  outline: "none",
                  fontFamily: "inherit",
                  cursor: "pointer",
                  colorScheme: "light",
                }}
              />
            </div>

            <span style={{ fontWeight: "bold", color: "#FFFFFF", fontSize: "14px" }}>-</span>

            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "6px",
                padding: "6px 10px",
                color: "#0F172A",
                fontWeight: "600",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#0F172A",
                  fontWeight: "600",
                  fontSize: "13px",
                  outline: "none",
                  fontFamily: "inherit",
                  cursor: "pointer",
                  colorScheme: "light",
                }}
              />
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "8px",
            padding: "8px 12px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            minWidth: "180px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            placeholder="Filter Status"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TotalCard />
        <SummaryCard label="Alpha" value={summary.alpha} color="#EF4444" />
        <SummaryCard label="Izin" value={summary.izin} color="#F59E0B" />
        <SummaryCard label="Sakit" value={summary.sakit} color="#3B82F6" />
        <SummaryCard label="Pulang" value={summary.pulang} color="#10B981" />
      </div>

      {/* Tabel Absensi - MAIN CONTENT */}
      <div style={{
        position: "relative",
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
        border: "1px solid #E2E8F0",
      }}>
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid #E2E8F0",
          backgroundColor: "#F8FAFC",
        }}>
          <h3 style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: 700,
            color: "#0F172A",
          }}>
            Daftar Ketidakhadiran
          </h3>
        </div>

        <div style={{ overflowX: "auto" }}>
          {filteredData.length > 0 ? (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "800px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#F1F5F9" }}>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      style={{
                        padding: "16px 24px",
                        textAlign: "left",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#475569",
                        borderBottom: "2px solid #E2E8F0",
                        width: col.width || "auto",
                      }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => (
                  <tr
                    key={row.id}
                    style={{
                      borderBottom: "1px solid #E2E8F0",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#F8FAFC";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        style={{
                          padding: "16px 24px",
                          fontSize: "14px",
                          color: "#334155",
                          verticalAlign: "middle",
                          textAlign: col.align || "left",
                        }}
                      >
                        {col.render
                          ? col.render(row[col.key as keyof AbsensiRecord], row)
                          : row[col.key as keyof AbsensiRecord]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{
              padding: "60px 24px",
              textAlign: "center",
              color: "#64748B",
              fontSize: "16px",
            }}>
              Tidak ada data ketidakhadiran untuk periode yang dipilih
            </div>
          )}
        </div>

        {/* Footer with pagination info */}
        {filteredData.length > 0 && (
          <div style={{
            padding: "16px 24px",
            borderTop: "1px solid #E2E8F0",
            backgroundColor: "#F8FAFC",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "14px",
            color: "#64748B",
          }}>
            <span>Menampilkan {filteredData.length} dari {dummyData.length} data</span>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #CBD5E1",
                  background: "#FFFFFF",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#475569",
                }}
              >
                Sebelumnya
              </button>
              <span style={{ padding: "6px 12px" }}>1</span>
              <button
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #CBD5E1",
                  background: "#FFFFFF",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#475569",
                }}
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedRecord && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            overflow: "hidden",
            width: "100%",
            maxWidth: "500px",
            margin: "0 20px",
          }}>
            {/* Header Modal */}
            <div style={{
              backgroundColor: "#0B2948",
              padding: "20px 24px",
              textAlign: "center",
            }}>
              <h3 style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: 600,
                color: "white",
              }}>
                Detail Kehadiran
              </h3>
            </div>

            {/* Content Modal */}
            <div style={{
              padding: "24px",
              maxHeight: "calc(100vh - 200px)",
              overflowY: "auto"
            }}>
              {/* Info Detail */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
                <DetailRow label="Tanggal" value={selectedRecord.tanggal} />
                <DetailRow label="Jam Pelajaran" value={selectedRecord.jamPelajaran} />
                <DetailRow label="Mata Pelajaran" value={selectedRecord.mataPelajaran} />
                <DetailRow label="Nama guru" value={selectedRecord.guru} />

                {/* Status */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  backgroundColor: "#F9FAFB",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  marginBottom: "16px"
                }}>
                  <span style={{ fontWeight: "600", color: "#374151", fontSize: "14px" }}>
                    Status
                  </span>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    backgroundColor: getStatusColor(selectedRecord.status),
                  }}>
                    {getStatusText(selectedRecord.status)}
                  </div>
                </div>

                {/* Keterangan */}
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "8px"
                  }}>
                    Keterangan
                  </label>
                  <div style={{
                    padding: "12px 16px",
                    backgroundColor: "#F3F4F6",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    color: "#4B5563",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    minHeight: "60px"
                  }}>
                    {selectedRecord.keterangan || "Tidak ada keterangan tambahan."}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div style={{
              padding: "16px 24px",
              borderTop: "1px solid #E5E7EB",
              display: "flex",
              justifyContent: "flex-end",
              backgroundColor: "#F9FAFB"
            }}>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: "10px 24px",
                  backgroundColor: "#0B2948",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e40af"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0B2948"}
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function SummaryCard({ label, value, color = "#0B2948" }: { label: string; value: number; color?: string }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "12px",
        padding: "12px 24px",
        border: `1px solid ${color}20`,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
        minWidth: "100px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: color,
          marginBottom: "4px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "24px",
          fontWeight: 800,
          color: color,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: "12px",
      borderBottom: "1px dashed #E5E7EB",
    }}>
      <span style={{ fontSize: "14px", color: "#6B7280" }}>{label}</span>
      <span style={{ fontSize: "14px", fontWeight: 600, color: "#111827", textAlign: "right" }}>{value}</span>
    </div>
  );
}