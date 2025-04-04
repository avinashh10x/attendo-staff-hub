
import { Employee, Attendance, SalaryRecord, Department, AttendanceStats } from "@/types";

// Generate a random ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

// Generate random employees
export const generateEmployees = (count: number): Employee[] => {
  const departments = ["Engineering", "HR", "Finance", "Marketing", "Operations"];
  const positions = ["Manager", "Senior", "Junior", "Intern", "Director", "VP", "Associate"];
  const statuses = ["active", "inactive", "on-leave"] as const;
  
  return Array.from({ length: count }).map((_, index) => {
    const firstName = ["John", "Jane", "Mike", "Sarah", "David", "Emma", "Chris", "Alex", "Robert", "Lisa"][Math.floor(Math.random() * 10)];
    const lastName = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson"][Math.floor(Math.random() * 10)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`;
    
    return {
      id: `EMP-${1000 + index}`,
      name,
      email,
      position: `${positions[Math.floor(Math.random() * positions.length)]}`,
      department: departments[Math.floor(Math.random() * departments.length)],
      joiningDate: new Date(2020 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      salary: Math.floor(30000 + Math.random() * 70000),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      contactNumber: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      address: `${Math.floor(Math.random() * 9000) + 1000} Main St, City, State`,
    };
  });
};

// Generate random attendance records
export const generateAttendance = (employees: Employee[], days: number): Attendance[] => {
  const attendance: Attendance[] = [];
  const statuses = ["present", "absent", "late", "half-day"] as const;
  
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    for (const employee of employees) {
      if (employee.status !== "inactive") {
        const status = statuses[Math.floor(Math.random() * (employee.status === "on-leave" ? 2 : 4))];
        const checkInHour = 8 + Math.floor(Math.random() * 2);
        const checkInMin = Math.floor(Math.random() * 60);
        const checkIn = `${checkInHour.toString().padStart(2, '0')}:${checkInMin.toString().padStart(2, '0')}`;
        
        const workHours = status === "present" ? 8 + Math.random() : status === "half-day" ? 4 + Math.random() : status === "late" ? 6 + Math.random() : 0;
        const checkOutHour = Math.min(19, checkInHour + Math.floor(workHours));
        const checkOutMin = Math.floor(Math.random() * 60);
        const checkOut = status === "absent" ? "" : `${checkOutHour.toString().padStart(2, '0')}:${checkOutMin.toString().padStart(2, '0')}`;
        
        attendance.push({
          id: generateId(),
          employeeId: employee.id,
          date: dateStr,
          checkIn: status === "absent" ? "" : checkIn,
          checkOut,
          status,
          hoursWorked: Number(workHours.toFixed(2)),
          notes: status === "absent" ? "No show" : status === "late" ? "Arrived late" : "",
        });
      }
    }
  }
  
  return attendance;
};

// Generate salary records
export const generateSalaryRecords = (employees: Employee[]): SalaryRecord[] => {
  const records: SalaryRecord[] = [];
  const months = ["January", "February", "March", "April", "May", "June"];
  
  for (const employee of employees) {
    for (let i = 0; i < months.length; i++) {
      const baseSalary = employee.salary / 12;
      const overtimePay = Math.random() < 0.3 ? Math.floor(Math.random() * 500) : 0;
      const deductions = Math.floor(baseSalary * (Math.random() * 0.1));
      const bonus = Math.random() < 0.2 ? Math.floor(Math.random() * 1000) : 0;
      const totalSalary = baseSalary + overtimePay + bonus - deductions;
      
      records.push({
        id: generateId(),
        employeeId: employee.id,
        month: months[i],
        year: 2023,
        baseSalary: Number(baseSalary.toFixed(2)),
        overtimePay,
        deductions,
        bonus,
        totalSalary: Number(totalSalary.toFixed(2)),
        status: i < 5 ? "paid" : "pending",
        paymentDate: i < 5 ? `2023-0${i+1}-15` : undefined,
      });
    }
  }
  
  return records;
};

// Generate departments
export const generateDepartments = (): Department[] => {
  return [
    { id: "dept-1", name: "Engineering", manager: "David Miller", employeeCount: 12 },
    { id: "dept-2", name: "HR", manager: "Sarah Johnson", employeeCount: 5 },
    { id: "dept-3", name: "Finance", manager: "Robert Wilson", employeeCount: 8 },
    { id: "dept-4", name: "Marketing", manager: "Emma Davis", employeeCount: 7 },
    { id: "dept-5", name: "Operations", manager: "Chris Brown", employeeCount: 10 },
  ];
};

// Generate attendance stats
export const generateAttendanceStats = (days: number): AttendanceStats[] => {
  const stats: AttendanceStats[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    stats.push({
      date: dateStr,
      present: 30 + Math.floor(Math.random() * 10),
      absent: Math.floor(Math.random() * 5),
      late: Math.floor(Math.random() * 8),
      onLeave: Math.floor(Math.random() * 3),
    });
  }
  
  return stats;
};

// Initialize mock data
export const initializeMockData = () => {
  const employees = generateEmployees(30);
  const attendance = generateAttendance(employees, 30);
  const salaryRecords = generateSalaryRecords(employees);
  const departments = generateDepartments();
  const attendanceStats = generateAttendanceStats(14);
  
  return {
    employees,
    attendance,
    salaryRecords,
    departments,
    attendanceStats,
  };
};
