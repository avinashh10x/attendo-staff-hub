
import { Attendance, Employee } from "@/types";
import * as XLSX from "xlsx";
import { format } from "date-fns";

type ExportPeriod = "daily" | "weekly" | "monthly" | "custom";
type ExportType = "attendance" | "salary";

interface ExportAttendanceOptions {
  period: ExportPeriod;
  startDate?: Date;
  endDate?: Date;
  employeeIds?: string[];
  includeDetails?: boolean;
}

export const exportAttendanceToExcel = (
  employees: Employee[],
  attendance: Attendance[],
  options: ExportAttendanceOptions
) => {
  // Filter attendance data based on options
  let filteredAttendance = [...attendance];
  
  // Apply date filter
  if (options.period === "custom" && options.startDate && options.endDate) {
    const startDateStr = options.startDate.toISOString().split("T")[0];
    const endDateStr = options.endDate.toISOString().split("T")[0];
    filteredAttendance = filteredAttendance.filter(
      (a) => a.date >= startDateStr && a.date <= endDateStr
    );
  } else if (options.period === "daily") {
    const today = new Date().toISOString().split("T")[0];
    filteredAttendance = filteredAttendance.filter((a) => a.date === today);
  } else if (options.period === "weekly") {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    const lastWeekStr = lastWeek.toISOString().split("T")[0];
    const todayStr = today.toISOString().split("T")[0];
    filteredAttendance = filteredAttendance.filter(
      (a) => a.date >= lastWeekStr && a.date <= todayStr
    );
  } else if (options.period === "monthly") {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    const lastMonthStr = lastMonth.toISOString().split("T")[0];
    const todayStr = today.toISOString().split("T")[0];
    filteredAttendance = filteredAttendance.filter(
      (a) => a.date >= lastMonthStr && a.date <= todayStr
    );
  }
  
  // Apply employee filter
  if (options.employeeIds && options.employeeIds.length > 0) {
    filteredAttendance = filteredAttendance.filter((a) =>
      options.employeeIds?.includes(a.employeeId)
    );
  }
  
  // Create employee map for quick lookup
  const employeeMap = new Map<string, Employee>();
  employees.forEach((emp) => employeeMap.set(emp.id, emp));
  
  // Create data for export
  let data: any[] = [];
  
  if (options.includeDetails) {
    // Detailed report with all records
    data = filteredAttendance.map((record) => {
      const employee = employeeMap.get(record.employeeId);
      return {
        "Date": record.date,
        "Employee ID": record.employeeId,
        "Employee Name": employee?.name || "Unknown",
        "Department": employee?.department || "Unknown",
        "Position": employee?.position || "Unknown",
        "Status": record.status,
        "Check In": record.checkIn,
        "Check Out": record.checkOut,
        "Hours Worked": record.hoursWorked,
        "Notes": record.notes || ""
      };
    });
  } else {
    // Summary report grouped by employee
    const summaryByEmployee = new Map<string, {
      employeeId: string;
      employeeName: string;
      department: string;
      position: string;
      totalDays: number;
      present: number;
      absent: number;
      late: number;
      halfDay: number;
      totalHours: number;
      averageHours: number;
    }>();
    
    filteredAttendance.forEach((record) => {
      const employee = employeeMap.get(record.employeeId);
      if (!employee) return;
      
      const summary = summaryByEmployee.get(record.employeeId) || {
        employeeId: record.employeeId,
        employeeName: employee.name,
        department: employee.department,
        position: employee.position,
        totalDays: 0,
        present: 0,
        absent: 0,
        late: 0,
        halfDay: 0,
        totalHours: 0,
        averageHours: 0
      };
      
      summary.totalDays++;
      if (record.status === "present") summary.present++;
      if (record.status === "absent") summary.absent++;
      if (record.status === "late") summary.late++;
      if (record.status === "half-day") summary.halfDay++;
      summary.totalHours += record.hoursWorked;
      
      summaryByEmployee.set(record.employeeId, summary);
    });
    
    // Calculate averages and convert to array
    data = Array.from(summaryByEmployee.values()).map((summary) => {
      return {
        "Employee ID": summary.employeeId,
        "Employee Name": summary.employeeName,
        "Department": summary.department,
        "Position": summary.position,
        "Total Days": summary.totalDays,
        "Present": summary.present,
        "Absent": summary.absent,
        "Late": summary.late,
        "Half Day": summary.halfDay,
        "Total Hours": summary.totalHours.toFixed(2),
        "Average Hours/Day": (summary.totalHours / (summary.totalDays || 1)).toFixed(2)
      };
    });
  }
  
  // Get period string for filename
  let periodStr = "";
  if (options.period === "daily") {
    periodStr = format(new Date(), "yyyy-MM-dd");
  } else if (options.period === "weekly") {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    periodStr = `${format(lastWeek, "yyyy-MM-dd")}_to_${format(today, "yyyy-MM-dd")}`;
  } else if (options.period === "monthly") {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    periodStr = `${format(lastMonth, "yyyy-MM")}_to_${format(today, "yyyy-MM")}`;
  } else if (options.period === "custom" && options.startDate && options.endDate) {
    periodStr = `${format(options.startDate, "yyyy-MM-dd")}_to_${format(options.endDate, "yyyy-MM-dd")}`;
  }
  
  // Create workbook & worksheet
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Attendance");
  
  // Generate Excel file
  const reportType = options.includeDetails ? "Detailed" : "Summary";
  const filename = `Attendance_${reportType}_${periodStr}.xlsx`;
  XLSX.writeFile(wb, filename);
  
  return { success: true, filename };
};
