import apiClient from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type {
    AdminSummary,
    AttendanceSummary,
    Schedule,
    ScheduleQueryParams,
    AttendanceQueryParams,
    Class,
    Student,
    Teacher,
} from '../types/api';

export const dashboardService = {
    /**
     * Get admin dashboard summary
     */
    async getAdminSummary(): Promise<AdminSummary> {
        const response = await apiClient.get<AdminSummary>(API_ENDPOINTS.ADMIN_SUMMARY);
        return response.data;
    },

    /**
     * Get attendance summary (for admin/waka)
     */
    async getAttendanceSummary(params?: AttendanceQueryParams): Promise<AttendanceSummary> {
        const response = await apiClient.get<AttendanceSummary>(
            API_ENDPOINTS.ATTENDANCE_SUMMARY,
            { params }
        );
        return response.data;
    },

    /**
     * Get my schedules (for students/teachers)
     */
    async getMySchedules(params?: ScheduleQueryParams): Promise<Schedule[]> {
        const response = await apiClient.get<Schedule[]>(
            API_ENDPOINTS.ME_SCHEDULES,
            { params }
        );
        return response.data;
    },

    /**
     * Get my attendance summary (for students)
     */
    async getMyAttendanceSummary(params?: AttendanceQueryParams): Promise<AttendanceSummary> {
        const response = await apiClient.get<AttendanceSummary>(
            API_ENDPOINTS.ME_ATTENDANCE_SUMMARY,
            { params }
        );
        return response.data;
    },

    /**
     * Get homeroom class info (for wali kelas)
     */
    async getMyHomeroom(): Promise<Class> {
        const response = await apiClient.get<Class>(API_ENDPOINTS.ME_HOMEROOM);
        return response.data;
    },

    /**
     * Get homeroom schedules (for wali kelas)
     */
    async getMyHomeroomSchedules(params?: ScheduleQueryParams): Promise<Schedule[]> {
        const response = await apiClient.get<Schedule[]>(
            API_ENDPOINTS.ME_HOMEROOM_SCHEDULES,
            { params }
        );
        return response.data;
    },

    /**
     * Get homeroom attendance summary (for wali kelas)
     */
    async getMyHomeroomAttendanceSummary(params?: AttendanceQueryParams): Promise<AttendanceSummary> {
        const response = await apiClient.get<AttendanceSummary>(
            API_ENDPOINTS.ME_HOMEROOM_ATTENDANCE_SUMMARY,
            { params }
        );
        return response.data;
    },

    /**
     * Get homeroom students (for wali kelas)
     */
    async getMyHomeroomStudents(): Promise<Student[]> {
        const response = await apiClient.get<Student[]>(API_ENDPOINTS.ME_HOMEROOM_STUDENTS);
        return response.data;
    },

    /**
     * Get my class info (for pengurus kelas)
     */
    async getMyClass(): Promise<Class> {
        const response = await apiClient.get<Class>(API_ENDPOINTS.ME_CLASS);
        return response.data;
    },

    /**
     * Get my class schedules (for pengurus kelas)
     */
    async getMyClassSchedules(params?: ScheduleQueryParams): Promise<Schedule[]> {
        const response = await apiClient.get<Schedule[]>(
            API_ENDPOINTS.ME_CLASS_SCHEDULES,
            { params }
        );
        return response.data;
    },

    /**
     * Get waka attendance summary
     */
    async getWakaAttendanceSummary(params?: AttendanceQueryParams): Promise<AttendanceSummary> {
        const response = await apiClient.get<AttendanceSummary>(
            API_ENDPOINTS.WAKA_ATTENDANCE_SUMMARY,
            { params }
        );
        return response.data;
    },

    /**
     * Get teachers daily attendance (for waka)
     */
    async getTeachersDailyAttendance(params?: { date?: string }): Promise<Teacher[]> {
        const response = await apiClient.get<Teacher[]>(
            API_ENDPOINTS.TEACHERS_DAILY_ATTENDANCE,
            { params }
        );
        return response.data;
    },

    /**
     * Get students absences (for waka)
     */
    async getStudentsAbsences(params?: { from?: string; to?: string }): Promise<any[]> {
        const response = await apiClient.get<any[]>(
            API_ENDPOINTS.STUDENTS_ABSENCES,
            { params }
        );
        return response.data;
    },

    /**
     * Get absence requests (for waka)
     */
    async getAbsenceRequests(): Promise<any[]> {
        const response = await apiClient.get<any[]>(API_ENDPOINTS.ABSENCE_REQUESTS);
        return response.data;
    },

    /**
     * Get my class attendance (for pengurus kelas)
     */
    async getMyClassAttendance(params?: { date?: string }): Promise<any[]> {
        const response = await apiClient.get<any[]>(
            API_ENDPOINTS.ME_CLASS_ATTENDANCE,
            { params }
        );
        return response.data;
    },

    /**
     * Generate QR code (for pengurus kelas)
     */
    async generateQRCode(data: { schedule_id: number; duration?: number }): Promise<any> {
        const response = await apiClient.post<any>(API_ENDPOINTS.QR_GENERATE, data);
        return response.data;
    },

    /**
     * Get active QR codes (for pengurus kelas)
     */
    async getActiveQRCodes(): Promise<any[]> {
        const response = await apiClient.get<any[]>(API_ENDPOINTS.QR_ACTIVE);
        return response.data;
    },

    /**
     * Revoke QR code (for pengurus kelas)
     */
    async revokeQRCode(token: string): Promise<void> {
        await apiClient.post(`/qrcodes/${token}/revoke`);
    },
};

