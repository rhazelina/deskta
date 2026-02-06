import { useEffect, useMemo, useState } from "react";
import GuruLayout from "../../component/Guru/GuruLayout";
import type { Schedule } from "../../types/api";

interface LihatJadwalGuruProps {
  user: { name: string; role: string };
  currentPage: string;
  onMenuClick: (page: string) => void;
  onLogout: () => void;
}

type Cell = { label: string; sub?: string; room?: string };
type ScheduleGrid = Cell[][];

const SUBJECT_COLORS: Record<string, string> = {
  MTK: "#bbf7d0",
  FISIKA: "#fecaca",
  KIMIA: "#e9d5ff",
  BIOLOGI: "#bfdbfe",
  "B.IND": "#fef3c7",
  "B.ING": "#fed7aa",
  // Default color will be handled in code
};

export default function LihatJadwalGuru({
  user,
  currentPage,
  onMenuClick,
  onLogout,
}: LihatJadwalGuruProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Fetch Schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const { dashboardService } = await import('../../services/dashboard');
        // Fetch all schedules for this teacher
        const data = await dashboardService.getTeacherSchedules();
        setSchedules(data);

        // Default to first class found if any
        if (data.length > 0 && !selectedClassId) {
          // Sort by day or something if needed, but for now just pick the first one's class
          const firstClassParams = data.find((s: any) => s.class_id)?.class_id;
          if (firstClassParams) setSelectedClassId(firstClassParams.toString());
        }
      } catch (error) {
        console.error("Failed to fetch schedules", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  // Extract unique classes from schedules
  const availableClasses = useMemo(() => {
    const classes = new Map();
    schedules.forEach(s => {
      if (s.class && s.class.id) {
        classes.set(s.class.id.toString(), s.class.name);
      }
    });
    return Array.from(classes.entries()).map(([id, name]) => ({ id, name }));
  }, [schedules]);

  // Filter schedules for selected class
  const classSchedules = useMemo(() => {
    return schedules.filter(s => s.class_id?.toString() === selectedClassId);
  }, [schedules, selectedClassId]);

  // Get selected class name
  const selectedClassName = useMemo(() => {
    return availableClasses.find(c => c.id === selectedClassId)?.name || "Pilih Kelas";
  }, [availableClasses, selectedClassId]);

  // Generate Grid Data
  // Standard time slots 07:00 - 15:00 (approximate for display)
  const timeSlots = [
    "07.00-08.00", "08.00-09.00", "09.00-10.00", "10.00-11.00",
    "11.00-12.00", "12.00-13.00", "13.00-14.00", "14.00-15.00"
  ];
  const rows = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const dayLabels = { "Monday": "Senin", "Tuesday": "Selasa", "Wednesday": "Rabu", "Thursday": "Kamis", "Friday": "Jumat" };

  const grid: ScheduleGrid = useMemo(() => {
    const newGrid: ScheduleGrid = [];

    rows.forEach((day, rowIndex) => {
      newGrid[rowIndex] = new Array(timeSlots.length).fill({ label: "", sub: "" });

      // Find schedules for this day
      const daySchedules = classSchedules.filter(s => s.day === day);

      daySchedules.forEach(sch => {
        // Simple mapping: parse hour to find approximate slot index
        // Start time format is HH:MM:SS
        const startHour = parseInt(sch.start_time.split(':')[0]);
        const slotIndex = startHour - 7; // 07:00 is index 0

        if (slotIndex >= 0 && slotIndex < timeSlots.length) {
          newGrid[rowIndex][slotIndex] = {
            label: sch.subject_name || sch.title || 'Mapel',
            sub: sch.teacher?.user?.name || user.name, // Usually user.name since it's teacher dashboard
            room: sch.room
          };
        }
      });
    });

    return newGrid;
  }, [classSchedules, user.name]);

  return (
    <GuruLayout
      pageTitle="Jadwal Kelas"
      currentPage={currentPage}
      onMenuClick={onMenuClick}
      user={user}
      onLogout={onLogout}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            background: "#0B2948",
            borderRadius: 12,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: "rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 21H21M5 21V7L13 2L21 7V21M5 21H9M21 21H17M9 21V13H15V21M9 21H15"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div>
              <div style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: 700, marginBottom: 4 }}>
                {selectedClassName}
              </div>
              <div style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "14px", fontWeight: 500 }}>
                {/* Wali kelas info not readily available in schedule object, omitted for now or fetch if crucial */}
                Tahun Ajaran Aktif
              </div>
            </div>
            <div>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                style={{
                  background: "white",
                  color: "#0F172A",
                  borderRadius: 8,
                  border: "1px solid #E2E8F0",
                  padding: "8px 12px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {availableClasses.length === 0 && <option value="">Tidak ada jadwal</option>}
                {availableClasses.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            overflow: "hidden",
            minHeight: '400px'
          }}
        >
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Memuat jadwal...</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  minWidth: 160 + timeSlots.length * 120,
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        border: "1px solid #E2E8F0",
                        padding: "12px 16px",
                        background: "#F8FAFC",
                        fontWeight: 700,
                        fontSize: "14px",
                        color: "#0F172A",
                        textAlign: "left",
                      }}
                    >
                      Hari
                    </th>
                    {timeSlots.map((h, i) => (
                      <th
                        key={i}
                        style={{
                          border: "1px solid #E2E8F0",
                          padding: "12px 8px",
                          background: "#F8FAFC",
                          fontWeight: 700,
                          fontSize: "14px",
                          color: "#0F172A",
                          textAlign: "center",
                          minWidth: 100,
                        }}
                      >
                        <div>{i + 1}</div>
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            color: "#64748B",
                            marginTop: 4,
                          }}
                        >
                          ({h})
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((day, ri) => (
                    <tr key={ri}>
                      <td
                        style={{
                          border: "1px solid #E2E8F0",
                          padding: "12px 16px",
                          fontWeight: 600,
                          fontSize: "14px",
                          color: "#0F172A",
                          background: "#FFFFFF",
                        }}
                      >
                        {dayLabels[day as keyof typeof dayLabels] || day}
                      </td>
                      {grid[ri].map((cell, ci) => (
                        <td
                          key={ci}
                          style={{
                            border: "1px solid #E2E8F0",
                            padding: "8px",
                            background: cell.label
                              ? SUBJECT_COLORS[cell.label.split(' ')[0]] || "#E2E8F0" // Try to match color by first word or default
                              : "#FFFFFF",
                            textAlign: "center",
                            verticalAlign: "middle",
                            height: '80px'
                          }}
                        >
                          {cell.label && (
                            <>
                              <div
                                style={{
                                  fontWeight: 700,
                                  fontSize: "13px",
                                  color: "#0F172A",
                                  marginBottom: 2,
                                  lineHeight: 1.2
                                }}
                              >
                                {cell.label}
                              </div>
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "#475569",
                                  fontWeight: 500,
                                }}
                              >
                                {cell.sub}
                              </div>
                              {cell.room && (
                                <div style={{ fontSize: '10px', color: '#64748B', marginTop: 2 }}>{cell.room}</div>
                              )}
                            </>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </GuruLayout>
  );
}