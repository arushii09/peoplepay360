export interface WorkingSchedule {
  id: number;
  name: string;
  schedule_type: "FULL_TIME" | "PART_TIME" | "FLEXIBLE" | "FIXED" | string;
  weekly_hours: number;
  pattern_json?: Record<string, any> | null;
}

export type ContractStatus = "DRAFT" | "ACTIVE" | "EXPIRED" | "CANCELLED" | string;

export interface Contract {
  id: number;
  name: string;
  employee_id: number;
  start_date: string;
  end_date: string | null;
  wage: number;
  salary_structure_id: number;
  salary_structure_name?: string;
  status: ContractStatus;
}

export type AttendanceStatus =
  | "NORMAL"
  | "LATE"
  | "OVERTIME"
  | "EXCEPTION"
  | "MANUALLY_CORRECTED"
  | string;

export interface AttendanceRecord {
  id: number;
  employee_id: number;
  date: string;
  check_in: string;
  check_out: string | null;
  worked_hours: number;
  overtime_hours: number;
  status: AttendanceStatus;
  notes?: string | null;
}

export type Attendance = AttendanceRecord;

export interface LeaveAllocation {
  id: number;
  employee_id: number;
  time_off_type_id: number;
  time_off_type_name?: string;
  time_off_code?: string;
  allocated_days: number;
  taken_days: number;
  year: number;
}

export type LeaveStatus = "PENDING" | "APPROVED" | "REFUSED" | string;

export interface TimeOffRequest {
  id: number;
  employee_id: number;
  time_off_type_id: number;
  time_off_type_name?: string;
  time_off_code?: string;
  start_date: string;
  end_date: string;
  days: number;
  reason?: string | null;
  status: LeaveStatus;
}

export type LeaveRequest = TimeOffRequest;

export interface TimeOffType {
  id: number;
  name: string;
  code: string;
  is_paid: boolean;
  requires_allocation: boolean;
}

export type PayslipStatus = "DRAFT" | "COMPUTED" | "VALIDATED" | "PAID" | string;

export interface Payslip {
  id: number;
  payrun_id: number;
  payrun_name?: string;
  period_start: string;
  period_end: string;
  basic_wage: number;
  gross_wage: number;
  total_deductions: number;
  net_wage: number;
  status: PayslipStatus;
  warnings?: string[] | null;
}

export interface SalaryRule {
  id: number;
  structure_id: number;
  name: string;
  code: string;
  category: "BASIC" | "ALLOWANCE" | "GROSS" | "DEDUCTION" | "NET" | string;
  sequence: number;
  computation_type: "FIXED" | "PERCENTAGE" | "PYTHON_EXPRESSION" | string;
  fixed_amount?: number | null;
  percentage_value?: number | null;
  formula?: string | null;
  is_active: boolean;
}

export interface SalaryStructure {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  is_active: boolean;
  rules?: SalaryRule[];
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
  schedule_name?: string | null;
  status: "ACTIVE" | "ON_LEAVE" | "INACTIVE" | "TERMINATED" | string;
  bank_account_no?: string | null;
  bank_name?: string | null;
  ifsc_code?: string | null;
  tax_id?: string | null;
  joining_date: string;
  avatar_url?: string | null;
  contracts?: Contract[];
  attendances?: AttendanceRecord[];
  leave_allocations?: LeaveAllocation[];
  leave_requests?: TimeOffRequest[];
  payslips?: Payslip[];
}
