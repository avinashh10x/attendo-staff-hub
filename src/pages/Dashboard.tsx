
import { PageLayout } from "@/components/PageLayout";
import { StatCard } from "@/components/StatCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useData } from "@/context/DataContext";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  UserPlus 
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

const Dashboard = () => {
  const { 
    employees, 
    attendance,
    salaryRecords,
    attendanceStats,
    isLoading,
    getTodayAttendance
  } = useData();
  
  const todayStats = getTodayAttendance();
  const activeEmployees = employees.filter(e => e.status === "active").length;
  const onLeaveEmployees = employees.filter(e => e.status === "on-leave").length;
  
  // Calculate total salary pending
  const pendingSalaryAmount = salaryRecords
    .filter(s => s.status === "pending")
    .reduce((total, record) => total + record.totalSalary, 0);
  
  // Calculate attendance percentage
  const attendancePercentage = Math.floor((todayStats.present / todayStats.total) * 100) || 0;
  
  // Prepare chart data
  const chartData = attendanceStats.slice(0, 7).reverse().map(day => {
    const total = day.present + day.absent + day.late + day.onLeave;
    return {
      date: day.date.split('-').slice(1).join('/'), // Format as MM/DD
      Present: day.present,
      Absent: day.absent,
      Late: day.late,
      "On Leave": day.onLeave,
      "Present %": Math.floor((day.present / total) * 100) || 0
    };
  });

  // Recent employees
  const recentEmployees = [...employees]
    .sort((a, b) => new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime())
    .slice(0, 5);

  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Welcome to the attendance management system</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Staff"
          value={activeEmployees}
          description={`${onLeaveEmployees} on leave`}
          icon={Users}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Today's Attendance"
          value={`${attendancePercentage}%`}
          description={`${todayStats.present} present / ${todayStats.absent} absent`}
          icon={Calendar}
          trend={{ value: 2, isPositive: true }}
          iconClassName="bg-green-100 text-green-600"
        />
        <StatCard
          title="Late Arrivals"
          value={todayStats.late}
          description="Today's late check-ins"
          icon={Clock}
          trend={{ value: 8, isPositive: false }}
          iconClassName="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          title="Pending Salary"
          value={`$${Math.floor(pendingSalaryAmount).toLocaleString()}`}
          description="For current month"
          icon={DollarSign}
          iconClassName="bg-blue-100 text-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Attendance Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
            <CardDescription>Last 7 days attendance statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" unit="%" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="Present" stroke="#3b82f6" />
                  <Line yAxisId="left" type="monotone" dataKey="Absent" stroke="#ef4444" />
                  <Line yAxisId="left" type="monotone" dataKey="Late" stroke="#f59e0b" />
                  <Line yAxisId="right" type="monotone" dataKey="Present %" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Employees */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Employees</CardTitle>
            <CardDescription>Newly added staff members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEmployees.map(employee => (
                <div key={employee.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserPlus size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{employee.name}</h4>
                    <p className="text-xs text-gray-500">{employee.position} • {employee.department}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(employee.joiningDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Stats and Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Stats</CardTitle>
            <CardDescription>Staff distribution by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: "Engineering", count: 12 },
                  { name: "HR", count: 5 },
                  { name: "Finance", count: 8 },
                  { name: "Marketing", count: 7 },
                  { name: "Operations", count: 10 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts & Notifications</CardTitle>
            <CardDescription>Staff requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle size={18} className="text-red-500" />
                <div>
                  <h5 className="font-medium">Consecutive Absence Alert</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">3 employees have been absent for 3+ consecutive days</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <Clock size={18} className="text-yellow-500" />
                <div>
                  <h5 className="font-medium">Frequent Late Arrivals</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">5 employees have been late more than 3 times this week</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <DollarSign size={18} className="text-blue-500" />
                <div>
                  <h5 className="font-medium">Salary Processing Due</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">End of month salary processing is due in 3 days</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
