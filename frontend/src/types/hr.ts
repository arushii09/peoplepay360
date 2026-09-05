export type EmployeeStatus = "ACTIVE" | "ON_LEAVE" | "TERMINATED" | "DRAFT";

export type ContractStatus = "DRAFT" | "ACTIVE" | "EXPIRED" | "CANCELLED";

export type AttendanceStatus = "NORMAL" | "LATE" | "OVERTIME" | "EXCEPTION" | "MANUALLY_CORRECTED";

export type LeaveStatus = "PENDING" | "APPROVED" | "REFUSED";

export interface WorkingSchedule {
  id: number;
  name: string;
  schedule_type: string;
  weekly_hours: number;
}

export interface Contract {
  id: number;
  name: string;
  employee_id: number;
  start_date: string;
  end_date?: string | null;
  wage: number;
  salary_structure_id: number;
  salary_structure_name?: string;
  status: ContractStatus;
}

export interface AttendanceRecord {
  id: number;
  employee_id: number;
  date: string;
  check_in: string;
  check_out?: string | null;
  worked_hours: number;
  overtime_hours: number;
  status: AttendanceStatus;
  notes?: string | null;
}

export interface LeaveAllocation {
  id: number;
  employee_id: number;
  time_off_type_id: number;
  time_off_type_name: string;
  time_off_code: "VACATION" | "SICK" | "UNPAID";
  allocated_days: number;
  taken_days: number;
  year: number;
}

export interface TimeOffRequest {
  id: number;
  employee_id: number;
  time_off_type_id: number;
  time_off_type_name: string;
  time_off_code: "VACATION" | "SICK" | "UNPAID";
  start_date: string;
  end_date: string;
  days: number;
  reason?: string | null;
  status: LeaveStatus;
}

export interface PayslipSummary {
  id: number;
  payrun_id: number;
  payrun_name: string;
  period_start: string;
  period_end: string;
  basic_wage: number;
  gross_wage: number;
  total_deductions: number;
  net_wage: number;
  status: "DRAFT" | "COMPUTED" | "VALIDATED" | "PAID";
  warnings?: string[];
}

export interface Employee {
  id: number;
  user_id?: number | null;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  department: string;
  job_position: string;
  manager_id?: number | null;
  manager_name?: string | null;
  schedule_id?: number | null;
  schedule_name?: string;
  status: EmployeeStatus;
  bank_account_no?: string | null;
  bank_name?: string | null;
  ifsc_code?: string | null;
  tax_id?: string | null;
  joining_date?: string;
  avatar_url?: string;
  contracts?: Contract[];
  attendances?: AttendanceRecord[];
  leave_allocations?: LeaveAllocation[];
  leave_requests?: TimeOffRequest[];
  payslips?: PayslipSummary[];
}
