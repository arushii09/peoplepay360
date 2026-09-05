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

export type PayrunStatus = "DRAFT" | "COMPUTED" | "VALIDATED" | "PAID" | string;
export type PayslipStatus = "DRAFT" | "COMPUTED" | "VALIDATED" | "PAID" | string;

export interface PayslipLine {
  id: number;
  payslip_id: number;
  rule_code: string;
  rule_name: string;
  category: RuleCategory;
  sequence: number;
  rate: number;
  amount: number;
  calculation_trace?: string | null;
}

export interface Payslip {
  id: number;
  payrun_id: number;
  payrun_name?: string;
  employee_id?: number;
  employee_name?: string;
  employee_avatar?: string;
  employee_department?: string;
  employee_job?: string;
  contract_id?: number;
  contract_wage?: number;
  period_start: string;
  period_end: string;
  worked_days?: number;
  total_hours?: number;
  overtime_hours?: number;
  unpaid_leave_days?: number;
  basic_wage: number;
  gross_wage: number;
  total_deductions: number;
  net_wage: number;
  status: PayslipStatus;
  warnings?: string[] | null;
  blocking_errors?: string[] | null;
  lines?: PayslipLine[];
}

export interface Payrun {
  id: number;
  name: string;
  period_start: string;
  period_end: string;
  salary_structure_id: number;
  salary_structure_name?: string;
  status: PayrunStatus;
  total_gross: number;
  total_deductions: number;
  total_net: number;
  employee_count: number;
  warnings_count?: number;
  blocking_errors_count?: number;
  created_at: string;
  payslips?: Payslip[];
}

export type ComputationType =
  | "FIXED"
  | "PERCENTAGE"
  | "OVERTIME"
  | "LEAVE_DEDUCTION"
  | "PYTHON_EXPRESSION"
  | string;

export type RuleCategory =
  | "BASIC"
  | "ALLOWANCE"
  | "GROSS"
  | "DEDUCTION"
  | "NET"
  | "STATUTORY"
  | string;

export interface SalaryRule {
  id: number;
  structure_id: number;
  name: string;
  code: string;
  category: RuleCategory;
  sequence: number;
  computation_type: ComputationType;
  fixed_amount?: number | null;
  percentage_value?: number | null;
  formula?: string | null;
  is_active: boolean;
  description?: string | null;
}

export interface SalaryStructure {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  is_active: boolean;
  rules?: SalaryRule[];
  assigned_contracts_count?: number;
  created_at?: string;
  updated_at?: string;
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
