import { Employee, WorkingSchedule } from "@/types/hr";

export const initialSchedules: WorkingSchedule[] = [
  { id: 1, name: "Standard 40h Schedule", schedule_type: "FULL_TIME", weekly_hours: 40.0 },
  { id: 2, name: "Flexible 35h Schedule", schedule_type: "PART_TIME", weekly_hours: 35.0 },
  { id: 3, name: "Executive 45h Schedule", schedule_type: "EXECUTIVE", weekly_hours: 45.0 }
];

export const initialEmployees: Employee[] = [
  {
    id: 1,
    user_id: 4,
    first_name: "Alex",
    last_name: "Vance",
    email: "alex@peoplepay.com",
    phone: "+1 (555) 010-1234",
    department: "Engineering",
    job_position: "Senior Software Engineer",
    manager_id: null,
    manager_name: "System Admin",
    schedule_id: 1,
    schedule_name: "Standard 40h Schedule",
    status: "ACTIVE",
    bank_account_no: "1234567890",
    bank_name: "Chase Bank",
    ifsc_code: "CHAS0001234",
    tax_id: "TX-ALEX-9988",
    joining_date: "2024-01-15",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    contracts: [
      {
        id: 101,
        name: "Alex Vance - Senior Engineer Contract",
        employee_id: 1,
        start_date: "2026-01-01",
        end_date: null,
        wage: 6000.0,
        salary_structure_id: 1,
        salary_structure_name: "Standard Corporate Executive 2026",
        status: "ACTIVE"
      }
    ],
    attendances: [
      { id: 201, employee_id: 1, date: "2026-08-03", check_in: "09:00 AM", check_out: "06:30 PM", worked_hours: 8.0, overtime_hours: 1.5, status: "OVERTIME", notes: "Sprint release overtime" },
      { id: 202, employee_id: 1, date: "2026-08-04", check_in: "09:00 AM", check_out: "06:30 PM", worked_hours: 8.0, overtime_hours: 1.5, status: "OVERTIME", notes: "Sprint release overtime" },
      { id: 203, employee_id: 1, date: "2026-08-05", check_in: "09:00 AM", check_out: "06:30 PM", worked_hours: 8.0, overtime_hours: 1.5, status: "OVERTIME", notes: "Sprint release overtime" },
      { id: 204, employee_id: 1, date: "2026-08-06", check_in: "09:00 AM", check_out: "06:30 PM", worked_hours: 8.0, overtime_hours: 1.5, status: "OVERTIME", notes: "Sprint release overtime" },
      { id: 205, employee_id: 1, date: "2026-08-07", check_in: "09:00 AM", check_out: "06:30 PM", worked_hours: 8.0, overtime_hours: 1.5, status: "OVERTIME", notes: "Sprint release overtime" }
    ],
    leave_allocations: [
      { id: 301, employee_id: 1, time_off_type_id: 1, time_off_type_name: "Paid Annual Leave", time_off_code: "VACATION", allocated_days: 20.0, taken_days: 2.0, year: 2026 },
      { id: 302, employee_id: 1, time_off_type_id: 2, time_off_type_name: "Sick Leave", time_off_code: "SICK", allocated_days: 10.0, taken_days: 0.0, year: 2026 },
      { id: 303, employee_id: 1, time_off_type_id: 3, time_off_type_name: "Unpaid Leave", time_off_code: "UNPAID", allocated_days: 0.0, taken_days: 0.0, year: 2026 }
    ],
    leave_requests: [
      { id: 401, employee_id: 1, time_off_type_id: 1, time_off_type_name: "Paid Annual Leave", time_off_code: "VACATION", start_date: "2026-08-10", end_date: "2026-08-11", days: 2.0, reason: "Summer Vacation with family", status: "APPROVED" }
    ],
    payslips: [
      { id: 501, payrun_id: 1, payrun_name: "August 2026 Regular Payrun", period_start: "2026-08-01", period_end: "2026-08-31", basic_wage: 3000.0, gross_wage: 4800.0, total_deductions: 360.0, net_wage: 4440.0, status: "COMPUTED" }
    ]
  },
  {
    id: 2,
    user_id: 5,
    first_name: "Bob",
    last_name: "Miller",
    email: "bob@peoplepay.com",
    phone: "+1 (555) 010-5678",
    department: "Sales",
    job_position: "Sales Representative",
    manager_id: null,
    manager_name: "HR Manager",
    schedule_id: 1,
    schedule_name: "Standard 40h Schedule",
    status: "ACTIVE",
    bank_account_no: null, // Intentionally missing to demonstrate preflight validation warning
    bank_name: null,
    ifsc_code: null,
    tax_id: null,
    joining_date: "2025-06-01",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    contracts: [
      {
        id: 102,
        name: "Bob Miller - Sales Contract",
        employee_id: 2,
        start_date: "2026-01-01",
        end_date: null,
        wage: 4000.0,
        salary_structure_id: 1,
        salary_structure_name: "Standard Corporate Executive 2026",
        status: "ACTIVE"
      }
    ],
    attendances: [
      { id: 206, employee_id: 2, date: "2026-08-03", check_in: "09:05 AM", check_out: "05:00 PM", worked_hours: 8.0, overtime_hours: 0.0, status: "NORMAL", notes: null }
    ],
    leave_allocations: [
      { id: 304, employee_id: 2, time_off_type_id: 1, time_off_type_name: "Paid Annual Leave", time_off_code: "VACATION", allocated_days: 15.0, taken_days: 0.0, year: 2026 }
    ],
    leave_requests: [],
    payslips: [
      { id: 502, payrun_id: 1, payrun_name: "August 2026 Regular Payrun", period_start: "2026-08-01", period_end: "2026-08-31", basic_wage: 2000.0, gross_wage: 3200.0, total_deductions: 240.0, net_wage: 2960.0, status: "DRAFT", warnings: ["Missing Bank Account Number", "Missing Tax ID for statutory compliance"] }
    ]
  },
  {
    id: 3,
    user_id: null,
    first_name: "Aarav",
    last_name: "Mehta",
    email: "aarav.mehta@peoplepay.com",
    phone: "+91 98765 43210",
    department: "Engineering",
    job_position: "Staff Architect",
    manager_id: null,
    manager_name: "System Admin",
    schedule_id: 3,
    schedule_name: "Executive 45h Schedule",
    status: "ACTIVE",
    bank_account_no: "987654321000",
    bank_name: "HDFC Bank",
    ifsc_code: "HDFC0001234",
    tax_id: "PAN-ARVM8899K",
    joining_date: "2023-11-10",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    contracts: [
      {
        id: 103,
        name: "Aarav Mehta - Staff Architect Contract",
        employee_id: 3,
        start_date: "2026-01-01",
        end_date: null,
        wage: 7500.0,
        salary_structure_id: 1,
        salary_structure_name: "Standard Corporate Executive 2026",
        status: "ACTIVE"
      }
    ],
    attendances: [
      { id: 207, employee_id: 3, date: "2026-08-03", check_in: "08:45 AM", check_out: "07:00 PM", worked_hours: 9.0, overtime_hours: 2.0, status: "OVERTIME", notes: "Architecture review" },
      { id: 208, employee_id: 3, date: "2026-08-04", check_in: "08:50 AM", check_out: "07:15 PM", worked_hours: 9.0, overtime_hours: 2.25, status: "OVERTIME", notes: "Core engine optimization" }
    ],
    leave_allocations: [
      { id: 305, employee_id: 3, time_off_type_id: 1, time_off_type_name: "Paid Annual Leave", time_off_code: "VACATION", allocated_days: 25.0, taken_days: 3.0, year: 2026 }
    ],
    leave_requests: [
      { id: 402, employee_id: 3, time_off_type_id: 1, time_off_type_name: "Paid Annual Leave", time_off_code: "VACATION", start_date: "2026-09-01", end_date: "2026-09-03", days: 3.0, reason: "Tech conference attendance", status: "APPROVED" }
    ],
    payslips: []
  },
  {
    id: 4,
    user_id: null,
    first_name: "Sarah",
    last_name: "Jenkins",
    email: "sarah.j@peoplepay.com",
    phone: "+1 (555) 345-6789",
    department: "Human Resources",
    job_position: "HR Operations Lead",
    manager_id: null,
    manager_name: "System Admin",
    schedule_id: 1,
    schedule_name: "Standard 40h Schedule",
    status: "ON_LEAVE",
    bank_account_no: "4455667788",
    bank_name: "Wells Fargo",
    ifsc_code: "WFAG0009876",
    tax_id: "TX-SARAH-4411",
    joining_date: "2024-03-01",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    contracts: [
      {
        id: 104,
        name: "Sarah Jenkins - HR Lead Contract",
        employee_id: 4,
        start_date: "2026-01-01",
        end_date: null,
        wage: 5200.0,
        salary_structure_id: 1,
        salary_structure_name: "Standard Corporate Executive 2026",
        status: "ACTIVE"
      }
    ],
    attendances: [],
    leave_allocations: [
      { id: 306, employee_id: 4, time_off_type_id: 1, time_off_type_name: "Paid Annual Leave", time_off_code: "VACATION", allocated_days: 20.0, taken_days: 5.0, year: 2026 }
    ],
    leave_requests: [
      { id: 403, employee_id: 4, time_off_type_id: 1, time_off_type_name: "Paid Annual Leave", time_off_code: "VACATION", start_date: "2026-08-20", end_date: "2026-08-25", days: 5.0, reason: "Annual leave", status: "APPROVED" }
    ],
    payslips: []
  },
  {
    id: 5,
    user_id: null,
    first_name: "Priya",
    last_name: "Sharma",
    email: "priya.sharma@peoplepay.com",
    phone: "+91 99887 76655",
    department: "Finance",
    job_position: "Payroll Specialist",
    manager_id: null,
    manager_name: "HR Manager",
    schedule_id: 1,
    schedule_name: "Standard 40h Schedule",
    status: "ACTIVE",
    bank_account_no: "554433221100",
    bank_name: "Citibank",
    ifsc_code: "CITI0004567",
    tax_id: "PAN-PRIY3322M",
    joining_date: "2025-01-10",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    contracts: [
      {
        id: 105,
        name: "Priya Sharma - Payroll Specialist",
        employee_id: 5,
        start_date: "2026-01-01",
        end_date: null,
        wage: 4800.0,
        salary_structure_id: 1,
        salary_structure_name: "Standard Corporate Executive 2026",
        status: "ACTIVE"
      }
    ],
    attendances: [
      { id: 209, employee_id: 5, date: "2026-08-03", check_in: "09:00 AM", check_out: "05:00 PM", worked_hours: 8.0, overtime_hours: 0.0, status: "NORMAL", notes: null }
    ],
    leave_allocations: [
      { id: 307, employee_id: 5, time_off_type_id: 1, time_off_type_name: "Paid Annual Leave", time_off_code: "VACATION", allocated_days: 18.0, taken_days: 0.0, year: 2026 }
    ],
    leave_requests: [
      { id: 404, employee_id: 5, time_off_type_id: 1, time_off_type_name: "Paid Annual Leave", time_off_code: "VACATION", start_date: "2026-09-15", end_date: "2026-09-16", days: 2.0, reason: "Family event", status: "PENDING" }
    ],
    payslips: []
  }
];
