
export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  joiningDate: string;
  salary: number;
  status: "active" | "inactive" | "on-leave";
  contactNumber?: string;
  address?: string;
  profileImage?: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "present" | "absent" | "late" | "half-day";
  hoursWorked: number;
  notes?: string;
}

export interface SalaryRecord {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  baseSalary: number;
  overtimePay: number;
  deductions: number;
  bonus: number;
  totalSalary: number;
  status: "pending" | "paid";
  paymentDate?: string;
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  employeeCount: number;
}

export interface AttendanceStats {
  date: string;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
}

export interface ExportOptions {
  startDate: string;
  endDate: string;
  employees: string[] | "all";
  format: "excel" | "pdf" | "csv";
  includeDetails: boolean;
}
