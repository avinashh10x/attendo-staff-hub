
import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { useData } from "@/context/DataContext";
import { Attendance } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, FileDown, Filter, Search, X } from "lucide-react";
import { exportAttendanceToExcel } from "@/lib/export-utils";
import { toast } from "sonner";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const AttendancePage = () => {
  const { employees, attendance, isLoading } = useData();
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [employeeFilter, setEmployeeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Export options
  const [exportPeriod, setExportPeriod] = useState<string>("daily");
  const [exportStartDate, setExportStartDate] = useState<string>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [exportEndDate, setExportEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [exportEmployeeFilter, setExportEmployeeFilter] = useState<string>("all");
  const [exportIncludeDetails, setExportIncludeDetails] = useState<boolean>(true);

  // Filter attendance records
  const filteredAttendance = attendance.filter((record) => {
    const matchesDate = record.date === date;
    const matchesEmployee = employeeFilter === "all" || record.employeeId === employeeFilter;
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    
    const employee = employees.find(e => e.id === record.employeeId);
    const employeeName = employee ? employee.name.toLowerCase() : "";
    
    const matchesSearch = 
      searchQuery === "" || 
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employeeName.includes(searchQuery.toLowerCase());
    
    return matchesDate && matchesEmployee && matchesStatus && matchesSearch;
  });

  // Get attendance stats for the selected date
  const attendanceStats = {
    present: filteredAttendance.filter(a => a.status === "present").length,
    absent: filteredAttendance.filter(a => a.status === "absent").length,
    late: filteredAttendance.filter(a => a.status === "late").length,
    halfDay: filteredAttendance.filter(a => a.status === "half-day").length,
    total: filteredAttendance.length
  };

  const pieChartData = [
    { name: "Present", value: attendanceStats.present, color: "#22c55e" },
    { name: "Absent", value: attendanceStats.absent, color: "#ef4444" },
    { name: "Late", value: attendanceStats.late, color: "#f59e0b" },
    { name: "Half Day", value: attendanceStats.halfDay, color: "#3b82f6" },
  ];

  // Get employee name by ID
  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name : "Unknown";
  };

  // Handle export
  const handleExport = () => {
    try {
      const options = {
        period: exportPeriod as "daily" | "weekly" | "monthly" | "custom",
        startDate: exportPeriod === "custom" ? new Date(exportStartDate) : undefined,
        endDate: exportPeriod === "custom" ? new Date(exportEndDate) : undefined,
        employeeIds: exportEmployeeFilter === "all" ? undefined : [exportEmployeeFilter],
        includeDetails: exportIncludeDetails
      };
      
      const result = exportAttendanceToExcel(employees, attendance, options);
      
      if (result.success) {
        toast.success(`Successfully exported attendance data to ${result.filename}`);
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export attendance data");
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Attendance Management</h1>
          <p className="text-gray-500">Track and manage employee attendance records</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar size={16} />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-[140px] border-0 p-0 focus-visible:ring-0"
            />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Attendance Summary</CardTitle>
            <CardDescription>
              Overview for {new Date(date).toLocaleDateString("en-US", { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg p-4">
                <div className="text-green-600 dark:text-green-400 text-sm font-medium">Present</div>
                <div className="text-2xl font-bold">{attendanceStats.present}</div>
                <div className="text-green-600 dark:text-green-400 text-xs">
                  {attendanceStats.total > 0 ? 
                    `${Math.round((attendanceStats.present / attendanceStats.total) * 100)}%` : 
                    '0%'}
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg p-4">
                <div className="text-red-600 dark:text-red-400 text-sm font-medium">Absent</div>
                <div className="text-2xl font-bold">{attendanceStats.absent}</div>
                <div className="text-red-600 dark:text-red-400 text-xs">
                  {attendanceStats.total > 0 ? 
                    `${Math.round((attendanceStats.absent / attendanceStats.total) * 100)}%` : 
                    '0%'}
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-lg p-4">
                <div className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">Late</div>
                <div className="text-2xl font-bold">{attendanceStats.late}</div>
                <div className="text-yellow-600 dark:text-yellow-400 text-xs">
                  {attendanceStats.total > 0 ? 
                    `${Math.round((attendanceStats.late / attendanceStats.total) * 100)}%` : 
                    '0%'}
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4">
                <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">Half Day</div>
                <div className="text-2xl font-bold">{attendanceStats.halfDay}</div>
                <div className="text-blue-600 dark:text-blue-400 text-xs">
                  {attendanceStats.total > 0 ? 
                    `${Math.round((attendanceStats.halfDay / attendanceStats.total) * 100)}%` : 
                    '0%'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Attendance Distribution</CardTitle>
            <CardDescription>
              Status breakdown for selected date
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  labelLine={false}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="records">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="records">Attendance Records</TabsTrigger>
            <TabsTrigger value="export">Export Data</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search employee..."
                className="pl-8 w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="absolute right-2.5 top-2.5"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>
            
            <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="half-day">Half Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="records">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Hours Worked</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Loading attendance data...
                        </TableCell>
                      </TableRow>
                    ) : filteredAttendance.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No attendance records found for the selected date and filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAttendance.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.employeeId}</TableCell>
                          <TableCell>{getEmployeeName(record.employeeId)}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                record.status === "present"
                                  ? "bg-green-100 text-green-800"
                                  : record.status === "absent"
                                  ? "bg-red-100 text-red-800"
                                  : record.status === "late"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {record.status}
                            </span>
                          </TableCell>
                          <TableCell>{record.checkIn || "N/A"}</TableCell>
                          <TableCell>{record.checkOut || "N/A"}</TableCell>
                          <TableCell>{record.hoursWorked}</TableCell>
                          <TableCell>{record.notes || "-"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between py-4">
              <div className="text-sm text-gray-500">
                Showing {filteredAttendance.length} records for {date}
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Export Attendance Data</CardTitle>
              <CardDescription>
                Generate Excel reports of attendance data for selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Select Time Period</label>
                    <Select value={exportPeriod} onValueChange={setExportPeriod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily (Today)</SelectItem>
                        <SelectItem value="weekly">Weekly (Last 7 days)</SelectItem>
                        <SelectItem value="monthly">Monthly (Last 30 days)</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {exportPeriod === "custom" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Start Date</label>
                        <Input
                          type="date"
                          value={exportStartDate}
                          onChange={(e) => setExportStartDate(e.target.value)}
                          max={exportEndDate}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">End Date</label>
                        <Input
                          type="date"
                          value={exportEndDate}
                          onChange={(e) => setExportEndDate(e.target.value)}
                          min={exportStartDate}
                          max={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium mb-1 block">Employee Filter</label>
                    <Select value={exportEmployeeFilter} onValueChange={setExportEmployeeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Employees</SelectItem>
                        {employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Report Type</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <input 
                        type="checkbox" 
                        id="include-details" 
                        checked={exportIncludeDetails}
                        onChange={() => setExportIncludeDetails(!exportIncludeDetails)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="include-details">Include detailed records</label>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {exportIncludeDetails 
                        ? "Exports all individual attendance records" 
                        : "Exports summarized data per employee"}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg mt-4">
                    <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Export Information</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      {exportPeriod === "daily"
                        ? "Daily report for today's attendance records"
                        : exportPeriod === "weekly"
                        ? "Weekly report for the last 7 days of attendance"
                        : exportPeriod === "monthly"
                        ? "Monthly report for the last 30 days of attendance"
                        : "Custom report for selected date range"}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                      Format: Excel (.xlsx)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleExport} 
                className="w-full sm:w-auto flex gap-2"
              >
                <FileDown size={16} />
                Export Attendance Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default AttendancePage;
