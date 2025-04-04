
import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { useData } from "@/context/DataContext";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  FileDown, 
  FileText, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { exportAttendanceToExcel } from "@/lib/export-utils";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#6366f1", "#ec4899"];

const ReportsPage = () => {
  const { employees, attendance, attendanceStats, departments } = useData();
  
  // Report options
  const [reportType, setReportType] = useState<string>("attendance");
  const [period, setPeriod] = useState<string>("weekly");
  const [department, setDepartment] = useState<string>("all");
  
  // Export options
  const [exportPeriod, setExportPeriod] = useState<string>("weekly");
  const [exportStartDate, setExportStartDate] = useState<string>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [exportEndDate, setExportEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [exportEmployeeFilter, setExportEmployeeFilter] = useState<string>("all");
  
  // Get attendance trend data
  const attendanceTrendData = attendanceStats.slice(0, period === "weekly" ? 7 : 30).reverse();
  
  // Calculate department attendance stats
  const departmentStats = departments.map(dept => {
    const deptEmployees = employees.filter(e => e.department === dept.name && e.status === "active");
    const deptEmployeeIds = deptEmployees.map(e => e.id);
    
    const todayDate = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => 
      a.date === todayDate && 
      deptEmployeeIds.includes(a.employeeId)
    );
    
    const present = todayAttendance.filter(a => a.status === "present").length;
    const absent = todayAttendance.filter(a => a.status === "absent").length;
    const late = todayAttendance.filter(a => a.status === "late").length;
    const total = deptEmployees.length;
    
    return {
      name: dept.name,
      present,
      absent,
      late,
      onTime: present - late,
      total,
      attendanceRate: total > 0 ? (present / total) * 100 : 0,
    };
  });
  
  // Calculate working hours by department
  const workingHoursByDept = departments.map(dept => {
    const deptEmployees = employees.filter(e => e.department === dept.name);
    const deptEmployeeIds = deptEmployees.map(e => e.id);
    
    const last7Days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split('T')[0]);
    }
    
    let totalHours = 0;
    let recordCount = 0;
    
    last7Days.forEach(date => {
      const dayAttendance = attendance.filter(a => 
        a.date === date && 
        deptEmployeeIds.includes(a.employeeId)
      );
      
      dayAttendance.forEach(record => {
        totalHours += record.hoursWorked;
        recordCount++;
      });
    });
    
    const averageHours = recordCount > 0 ? totalHours / recordCount : 0;
    
    return {
      name: dept.name,
      averageHours: averageHours.toFixed(2),
      totalHours: totalHours.toFixed(2),
      employees: deptEmployees.length,
    };
  });
  
  // Calculate attendance status distribution
  const statusDistribution = [
    { name: "Present", value: attendanceStats.reduce((sum, day) => sum + day.present, 0) },
    { name: "Absent", value: attendanceStats.reduce((sum, day) => sum + day.absent, 0) },
    { name: "Late", value: attendanceStats.reduce((sum, day) => sum + day.late, 0) },
    { name: "On Leave", value: attendanceStats.reduce((sum, day) => sum + day.onLeave, 0) },
  ];
  
  // Export attendance data
  const handleExport = () => {
    try {
      const options = {
        period: exportPeriod as "daily" | "weekly" | "monthly" | "custom",
        startDate: exportPeriod === "custom" ? new Date(exportStartDate) : undefined,
        endDate: exportPeriod === "custom" ? new Date(exportEndDate) : undefined,
        employeeIds: exportEmployeeFilter === "all" ? undefined : [exportEmployeeFilter],
        includeDetails: true
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
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-500">Generate reports and analyze attendance data</p>
        </div>
        <Button onClick={handleExport} className="flex gap-2">
          <FileDown size={16} />
          Export Data
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>Customize the report parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attendance">Attendance Overview</SelectItem>
                  <SelectItem value="departments">Department Analysis</SelectItem>
                  <SelectItem value="trends">Attendance Trends</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-2">Time Period</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly (Last 7 Days)</SelectItem>
                  <SelectItem value="monthly">Monthly (Last 30 Days)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-2">Department</label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Report content based on selected type */}
      <div className="space-y-6">
        {reportType === "attendance" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Overview</CardTitle>
                  <CardDescription>
                    {period === "weekly" ? "Last 7 days" : "Last 30 days"} attendance statistics
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={attendanceTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="present" stroke="#3b82f6" name="Present" />
                      <Line type="monotone" dataKey="absent" stroke="#ef4444" name="Absent" />
                      <Line type="monotone" dataKey="late" stroke="#f59e0b" name="Late" />
                      <Line type="monotone" dataKey="onLeave" stroke="#6366f1" name="On Leave" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Distribution</CardTitle>
                  <CardDescription>Overall attendance status distribution</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Attendance Metrics</CardTitle>
                <CardDescription>Key attendance indicators and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
                    <div className="text-sm text-gray-500">Average Present</div>
                    <div className="text-2xl font-bold mt-1">
                      {(statusDistribution[0].value / attendanceTrendData.length).toFixed(0)}
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      {((statusDistribution[0].value / 
                        (statusDistribution.reduce((a, b) => a + b.value, 0) || 1)) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
                    <div className="text-sm text-gray-500">Average Absence</div>
                    <div className="text-2xl font-bold mt-1">
                      {(statusDistribution[1].value / attendanceTrendData.length).toFixed(0)}
                    </div>
                    <div className="text-xs text-red-600 mt-1">
                      {((statusDistribution[1].value / 
                        (statusDistribution.reduce((a, b) => a + b.value, 0) || 1)) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
                    <div className="text-sm text-gray-500">Average Late</div>
                    <div className="text-2xl font-bold mt-1">
                      {(statusDistribution[2].value / attendanceTrendData.length).toFixed(0)}
                    </div>
                    <div className="text-xs text-yellow-600 mt-1">
                      {((statusDistribution[2].value / 
                        (statusDistribution.reduce((a, b) => a + b.value, 0) || 1)) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
                    <div className="text-sm text-gray-500">Average On Leave</div>
                    <div className="text-2xl font-bold mt-1">
                      {(statusDistribution[3].value / attendanceTrendData.length).toFixed(0)}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      {((statusDistribution[3].value / 
                        (statusDistribution.reduce((a, b) => a + b.value, 0) || 1)) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
        
        {reportType === "departments" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Department Attendance Rate</CardTitle>
                  <CardDescription>
                    Attendance percentage by department
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, "Attendance Rate"]} />
                      <Bar dataKey="attendanceRate" fill="#3b82f6" name="Attendance Rate (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Average Working Hours</CardTitle>
                  <CardDescription>
                    Average hours worked by department (last 7 days)
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={workingHoursByDept}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="averageHours" fill="#10b981" name="Average Hours" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Detailed department metrics</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3">Department</th>
                        <th className="text-left p-3">Staff Count</th>
                        <th className="text-left p-3">Present</th>
                        <th className="text-left p-3">Absent</th>
                        <th className="text-left p-3">Late</th>
                        <th className="text-left p-3">On Time %</th>
                        <th className="text-left p-3">Total Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentStats.map((dept, index) => {
                        const workingHours = workingHoursByDept.find(d => d.name === dept.name);
                        const onTimePercentage = dept.total > 0 
                          ? ((dept.onTime / dept.total) * 100).toFixed(1)
                          : "0.0";
                        
                        return (
                          <tr key={index} className="border-t hover:bg-muted/30">
                            <td className="p-3 font-medium">{dept.name}</td>
                            <td className="p-3">{dept.total}</td>
                            <td className="p-3">{dept.present}</td>
                            <td className="p-3">{dept.absent}</td>
                            <td className="p-3">{dept.late}</td>
                            <td className="p-3">{onTimePercentage}%</td>
                            <td className="p-3">{workingHours?.totalHours || "0"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
        
        {reportType === "trends" && (
          <>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Trend Analysis</CardTitle>
                  <CardDescription>
                    {period === "weekly" ? "Last 7 days" : "Last 30 days"} attendance pattern
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={attendanceTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="present" 
                        stroke="#3b82f6" 
                        name="Present" 
                        strokeWidth={2} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="absent" 
                        stroke="#ef4444" 
                        name="Absent" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="late" 
                        stroke="#f59e0b" 
                        name="Late" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="onLeave" 
                        stroke="#6366f1" 
                        name="On Leave" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Day of Week Analysis</CardTitle>
                  <CardDescription>
                    Attendance patterns by day of week
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={[
                        { day: "Monday", present: 32, absent: 4, late: 6 },
                        { day: "Tuesday", present: 30, absent: 5, late: 7 },
                        { day: "Wednesday", present: 31, absent: 3, late: 8 },
                        { day: "Thursday", present: 29, absent: 6, late: 7 },
                        { day: "Friday", present: 27, absent: 8, late: 7 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" stackId="a" fill="#3b82f6" name="Present" />
                      <Bar dataKey="absent" stackId="a" fill="#ef4444" name="Absent" />
                      <Bar dataKey="late" stackId="a" fill="#f59e0b" name="Late" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Time-of-Day Analysis</CardTitle>
                  <CardDescription>
                    Check-in times distribution
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={[
                        { time: "08:00-08:30", count: 15 },
                        { time: "08:30-09:00", count: 22 },
                        { time: "09:00-09:30", count: 8 },
                        { time: "09:30-10:00", count: 5 },
                        { time: "After 10:00", count: 2 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#10b981" name="Employees" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
      
      {/* Report Export Configuration */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
          <CardDescription>Generate and download attendance reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="excel">
            <TabsList className="mb-4">
              <TabsTrigger value="excel">Excel Export</TabsTrigger>
              <TabsTrigger value="pdf">PDF Report</TabsTrigger>
            </TabsList>
            
            <TabsContent value="excel">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Time Period</label>
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
                  <>
                    <div>
                      <label className="text-sm font-medium block mb-2">Start Date</label>
                      <Input
                        type="date"
                        value={exportStartDate}
                        onChange={(e) => setExportStartDate(e.target.value)}
                        max={exportEndDate}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">End Date</label>
                      <Input
                        type="date"
                        value={exportEndDate}
                        onChange={(e) => setExportEndDate(e.target.value)}
                        min={exportStartDate}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </>
                )}
                
                <div>
                  <label className="text-sm font-medium block mb-2">Filter by Employee</label>
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
            </TabsContent>
            
            <TabsContent value="pdf">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Report Template</label>
                  <Select defaultValue="attendance">
                    <SelectTrigger>
                      <SelectValue placeholder="Select report template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="attendance">Attendance Summary</SelectItem>
                      <SelectItem value="department">Department Report</SelectItem>
                      <SelectItem value="individual">Individual Staff Report</SelectItem>
                      <SelectItem value="payroll">Payroll Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">Time Period</label>
                  <Select defaultValue="monthly">
                    <SelectTrigger>
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="text-sm font-medium block mb-2">Additional Options</label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="include-charts" defaultChecked className="rounded border-gray-300" />
                    <label htmlFor="include-charts">Include charts</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="include-summary" defaultChecked className="rounded border-gray-300" />
                    <label htmlFor="include-summary">Include summary</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="include-details" className="rounded border-gray-300" />
                    <label htmlFor="include-details">Include detailed records</label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" className="gap-2">
            <FileText size={16} />
            Preview Report
          </Button>
          <Button onClick={handleExport} className="gap-2">
            <FileDown size={16} />
            Export Report
          </Button>
        </CardFooter>
      </Card>
    </PageLayout>
  );
};

export default ReportsPage;
