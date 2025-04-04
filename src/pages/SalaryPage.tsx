
import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { useData } from "@/context/DataContext";
import { SalaryRecord } from "@/types";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  DollarSign, 
  Download, 
  FileText, 
  Search,
  User
} from "lucide-react";
import { toast } from "sonner";
import { ResponsiveBar } from "@nivo/bar";

interface SalaryDetailDialogProps {
  record: SalaryRecord;
  employeeName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, data: Partial<SalaryRecord>) => Promise<void>;
}

const SalaryDetailDialog = ({ 
  record, 
  employeeName, 
  open, 
  onOpenChange,
  onSave 
}: SalaryDetailDialogProps) => {
  const [formData, setFormData] = useState({
    baseSalary: record.baseSalary,
    overtimePay: record.overtimePay,
    deductions: record.deductions,
    bonus: record.bonus,
    status: record.status,
    paymentDate: record.paymentDate || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === "paymentDate" ? value : Number(value) 
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotalSalary = () => {
    return (
      formData.baseSalary +
      formData.overtimePay +
      formData.bonus -
      formData.deductions
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await onSave(record.id, {
        ...formData,
        totalSalary: calculateTotalSalary(),
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating salary record:", error);
      toast.error("Failed to update salary record");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Salary Details</DialogTitle>
          <DialogDescription>
            Salary information for {employeeName} - {record.month} {record.year}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">{employeeName}</p>
                  <p className="text-sm text-gray-500">ID: {record.employeeId}</p>
                </div>
              </div>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  record.status === "paid"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {record.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="baseSalary">Base Salary ($)</Label>
                <Input
                  id="baseSalary"
                  name="baseSalary"
                  type="number"
                  value={formData.baseSalary}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="overtimePay">Overtime Pay ($)</Label>
                <Input
                  id="overtimePay"
                  name="overtimePay"
                  type="number"
                  value={formData.overtimePay}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="bonus">Bonus ($)</Label>
                <Input
                  id="bonus"
                  name="bonus"
                  type="number"
                  value={formData.bonus}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="deductions">Deductions ($)</Label>
                <Input
                  id="deductions"
                  name="deductions"
                  type="number"
                  value={formData.deductions}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="status">Payment Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="paymentDate">Payment Date</Label>
                <Input
                  id="paymentDate"
                  name="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  disabled={formData.status !== "paid"}
                />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Total Salary:</span>
                <span className="text-lg font-bold">${calculateTotalSalary().toFixed(2)}</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Base Salary</span>
                  <span>${formData.baseSalary.toFixed(2)}</span>
                </div>
                <Progress value={(formData.baseSalary / calculateTotalSalary()) * 100} className="h-2" />

                {formData.overtimePay > 0 && (
                  <>
                    <div className="flex justify-between text-xs">
                      <span>Overtime</span>
                      <span>${formData.overtimePay.toFixed(2)}</span>
                    </div>
                    <Progress value={(formData.overtimePay / calculateTotalSalary()) * 100} className="h-2 bg-muted" />
                  </>
                )}

                {formData.bonus > 0 && (
                  <>
                    <div className="flex justify-between text-xs">
                      <span>Bonus</span>
                      <span>${formData.bonus.toFixed(2)}</span>
                    </div>
                    <Progress value={(formData.bonus / calculateTotalSalary()) * 100} className="h-2 bg-muted" />
                  </>
                )}

                {formData.deductions > 0 && (
                  <>
                    <div className="flex justify-between text-xs">
                      <span>Deductions</span>
                      <span>-${formData.deductions.toFixed(2)}</span>
                    </div>
                    <Progress value={(formData.deductions / calculateTotalSalary()) * 100} className="h-2 bg-red-200" />
                  </>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const SalaryPage = () => {
  const { employees, salaryRecords, updateSalaryRecord, isLoading } = useData();
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<SalaryRecord | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Filter salary records
  const filteredRecords = salaryRecords.filter((record) => {
    const matchesMonth = selectedMonth === "all" || record.month === selectedMonth;
    const matchesStatus = selectedStatus === "all" || record.status === selectedStatus;
    
    const employee = employees.find(e => e.id === record.employeeId);
    const employeeName = employee ? employee.name.toLowerCase() : "";
    
    const matchesSearch = 
      searchQuery === "" || 
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employeeName.includes(searchQuery.toLowerCase());
    
    return matchesMonth && matchesStatus && matchesSearch;
  });
  
  // Sort records by amount
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    return sortOrder === "asc" ? a.totalSalary - b.totalSalary : b.totalSalary - a.totalSalary;
  });
  
  // Get employee name by ID
  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name : "Unknown";
  };
  
  // Prepare chart data
  const chartData = selectedMonth === "all" 
    ? [] 
    : employees.slice(0, 10).map(emp => {
        const record = salaryRecords.find(r => r.employeeId === emp.id && r.month === selectedMonth);
        return {
          employee: emp.name.split(' ')[0], // Just first name for clarity
          baseSalary: record?.baseSalary || 0,
          overtime: record?.overtimePay || 0,
          bonus: record?.bonus || 0,
          deductions: record?.deductions || 0,
        };
      });
  
  // Calculate stats
  const totalPending = filteredRecords.filter(r => r.status === "pending").reduce((acc, r) => acc + r.totalSalary, 0);
  const totalPaid = filteredRecords.filter(r => r.status === "paid").reduce((acc, r) => acc + r.totalSalary, 0);
  const averageSalary = filteredRecords.length > 0 ? filteredRecords.reduce((acc, r) => acc + r.totalSalary, 0) / filteredRecords.length : 0;
  
  // Handle status update
  const handleSalaryUpdate = async (id: string, data: Partial<SalaryRecord>) => {
    try {
      await updateSalaryRecord(id, data);
      toast.success("Salary record updated successfully");
    } catch (error) {
      console.error("Error updating salary record:", error);
      toast.error("Failed to update salary record");
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Salary Management</h1>
          <p className="text-gray-500">Track and manage employee salaries</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <DollarSign className="text-yellow-500 mr-1" size={20} />
              <span className="text-2xl font-bold">${totalPending.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {filteredRecords.filter(r => r.status === "pending").length} pending payments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <DollarSign className="text-green-500 mr-1" size={20} />
              <span className="text-2xl font-bold">${totalPaid.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {filteredRecords.filter(r => r.status === "paid").length} completed payments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <DollarSign className="text-blue-500 mr-1" size={20} />
              <span className="text-2xl font-bold">${averageSalary.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Based on {filteredRecords.length} records
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col space-y-6">
        {selectedMonth !== "all" && (
          <Card>
            <CardHeader>
              <CardTitle>Salary Distribution - {selectedMonth}</CardTitle>
              <CardDescription>Comparison of employee salaries for selected month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {chartData.length > 0 ? (
                  <ResponsiveBar
                    data={chartData}
                    keys={["baseSalary", "overtime", "bonus", "deductions"]}
                    indexBy="employee"
                    margin={{ top: 10, right: 130, bottom: 50, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: "linear" }}
                    indexScale={{ type: "band", round: true }}
                    colors={{ scheme: "nivo" }}
                    borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Employee",
                      legendPosition: "middle",
                      legendOffset: 32,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Amount ($)",
                      legendPosition: "middle",
                      legendOffset: -40,
                    }}
                    legends={[
                      {
                        dataFrom: "keys",
                        anchor: "bottom-right",
                        direction: "column",
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: "left-to-right",
                        itemOpacity: 0.85,
                        symbolSize: 20,
                      },
                    ]}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">Select a specific month to view salary distribution</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Salary Records</CardTitle>
            <CardDescription>View and manage employee salary records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by employee..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter by month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    <SelectItem value="January">January</SelectItem>
                    <SelectItem value="February">February</SelectItem>
                    <SelectItem value="March">March</SelectItem>
                    <SelectItem value="April">April</SelectItem>
                    <SelectItem value="May">May</SelectItem>
                    <SelectItem value="June">June</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading salary data...
                      </TableCell>
                    </TableRow>
                  ) : sortedRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No salary records found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="font-medium">{getEmployeeName(record.employeeId)}</div>
                          <div className="text-xs text-gray-500">{record.employeeId}</div>
                        </TableCell>
                        <TableCell>
                          {record.month} {record.year}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">${record.totalSalary.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">
                            Base: ${record.baseSalary.toFixed(2)}
                            {record.overtimePay > 0 && ` + OT: $${record.overtimePay.toFixed(2)}`}
                            {record.bonus > 0 && ` + Bonus: $${record.bonus.toFixed(2)}`}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              record.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {record.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {record.paymentDate ? new Date(record.paymentDate).toLocaleDateString() : "Pending"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRecord(record);
                              setDetailDialogOpen(true);
                            }}
                          >
                            <DollarSign className="h-4 w-4 mr-1" />
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-gray-500">
              Showing {sortedRecords.length} of {salaryRecords.length} salary records
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                Sort by {sortOrder === "asc" ? "Highest" : "Lowest"} Amount
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-1" />
                Export to Excel
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Salary Detail Dialog */}
      {selectedRecord && (
        <SalaryDetailDialog
          record={selectedRecord}
          employeeName={getEmployeeName(selectedRecord.employeeId)}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          onSave={handleSalaryUpdate}
        />
      )}
    </PageLayout>
  );
};

export default SalaryPage;
