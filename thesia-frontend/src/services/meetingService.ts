import { apiService } from './api';
import type {
  AvailabilityByDay,
  GeneratedSlot,
  MeetingReservePayload,
  MeetingApprovePayload,
  MeetingRejectPayload,
  StudentMeeting,
  PendingAdvisorMeeting,
  ReserveResponse,
  AdvisorHistoryStudent,
  AdvisorHistoryMeeting
} from '../types/meeting.types';

// Servicio centralizado para reuniones
export const meetingService = {
  async getAdvisorAvailability(advisorId: number): Promise<{ success: boolean; availability: AvailabilityByDay; message?: string; advisor?: any; }> {
    const res = await apiService.get(`/schedules/advisor/${advisorId}`) as any;
    return {
      success: !!res.success,
      availability: (res.availability || {}) as AvailabilityByDay,
      message: res.message,
      advisor: res.advisor
    };
  },

  async getAdvisorSlots(advisorId: number, date: string): Promise<{ success: boolean; available_slots: GeneratedSlot[]; message?: string; }> {
    const res = await apiService.get(`/schedules/advisor/${advisorId}/slots/${date}`) as any;
    return {
      success: !!res.success,
      available_slots: (res.available_slots || []) as GeneratedSlot[],
      message: res.message
    };
  },

  async reserveMeeting(advisorId: number, payload: MeetingReservePayload): Promise<ReserveResponse> {
    const res = await apiService.post(`/schedules/advisor/${advisorId}/reserve`, payload) as any;
    return {
      success: !!res.success,
      meeting_id: res.meeting_id,
      status: res.status,
      message: res.message
    };
  },

  async getPendingMeetings(advisorId: number): Promise<{ success: boolean; pending_meetings: PendingAdvisorMeeting[]; total: number; }> {
    const res = await apiService.get(`/schedules/advisor/${advisorId}/pending-meetings`) as any;
    return {
      success: !!res.success,
      pending_meetings: (res.pending_meetings || []) as PendingAdvisorMeeting[],
      total: res.total || 0
    };
  },

  async approveMeeting(meetingId: number, payload: MeetingApprovePayload): Promise<{ success: boolean; meeting_id?: number; message?: string; }> {
    const res = await apiService.put(`/schedules/meeting/${meetingId}/approve`, payload) as any;
    return {
      success: !!res.success,
      meeting_id: meetingId,
      message: res.message
    };
  },

  async rejectMeeting(meetingId: number, payload: MeetingRejectPayload): Promise<{ success: boolean; meeting_id?: number; message?: string; }> {
    const res = await apiService.put(`/schedules/meeting/${meetingId}/reject`, payload) as any;
    return {
      success: !!res.success,
      meeting_id: meetingId,
      message: res.message
    };
  },

  async getStudentMeetings(): Promise<{ success: boolean; meetings: StudentMeeting[]; total: number; }> {
    const res = await apiService.get('/schedules/student/my-meetings') as any;
    return {
      success: !!res.success,
      meetings: (res.meetings || []) as StudentMeeting[],
      total: res.total || (res.meetings?.length || 0)
    };
  },

  async getAdvisorHistoryStudents(advisorId: number): Promise<{ success: boolean; students: AdvisorHistoryStudent[]; }> {
    const res = await apiService.get(`/schedules/advisor/${advisorId}/history/students`) as any;
    return {
      success: !!res.success,
      students: (res.students || []) as AdvisorHistoryStudent[]
    };
  },

  async getAdvisorStudentHistory(advisorId: number, studentId: number): Promise<{ success: boolean; history: AdvisorHistoryMeeting[]; }> {
    const res = await apiService.get(`/schedules/advisor/${advisorId}/history/student/${studentId}`) as any;
    return {
      success: !!res.success,
      history: (res.history || []) as AdvisorHistoryMeeting[]
    };
  }
};

export default meetingService;
