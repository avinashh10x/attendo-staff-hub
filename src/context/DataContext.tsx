
import React, { createContext, useContext, useState, useEffect } from "react";
import { Employee, Attendance, SalaryRecord, Department, AttendanceStats } from "@/types";
import { initializeMockData } from "@/lib/mock-data";
import { toast } from "sonner";

type DataContextType = {
  employees: Employee[];
  attendance: Attendance[];
  salaryRecords: SalaryRecord[];
  departments: Department[];
  attendanceStats: AttendanceStats[];
  isLoading: boolean;
  // Employee CRUD
  addEmployee: (employee: Omit<Employee, "id">) => Promise<Employee>;
  updateEmployee: (id: string, data: Partial<Employee>) => Promise<Employee>;
  deleteEmployee: (id: string) => Promise<boolean>;
  getEmployee: (id: string) => Employee | undefined;
  // Attendance functions
  getEmployeeAttendance: (employeeId: string) => Attendance[];
  getAttendanceByDate: (date: string) => Attendance[];
  // Salary functions
  getEmployeeSalaryRecords: (employeeId: string) => SalaryRecord[];
  updateSalaryRecord: (id: string, data: Partial<SalaryRecord>) => Promise<SalaryRecord>;
  // Filtering
  getFilteredEmployees: (filter: Partial<Employee>) => Employee[];
  // Stats
  getTodayAttendance: () => { present: number; absent: number; late: number; total: number };
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<{
    employees: Employee[];
    attendance: Attendance[];
    salaryRecords: SalaryRecord[];
    departments: Department[];
    attendanceStats: AttendanceStats[];
  }>({ employees: [], attendance: [], salaryRecords: [], departments: [], attendanceStats: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading with a slight delay
    const loadData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be API calls
        const mockData = initializeMockData();
        setData(mockData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Employee CRUD operations
  const addEmployee = async (employeeData: Omit<Employee, "id">): Promise<Employee> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = `EMP-${1000 + data.employees.length + 1}`;
        const newEmployee: Employee = { id: newId, ...employeeData };
        
        setData(prevData => ({
          ...prevData,
          employees: [...prevData.employees, newEmployee]
        }));
        
        toast.success(`Added employee: ${employeeData.name}`);
        resolve(newEmployee);
      }, 500); // Simulating API delay
    });
  };

  const updateEmployee = async (id: string, employeeData: Partial<Employee>): Promise<Employee> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const employeeIndex = data.employees.findIndex(e => e.id === id);
        
        if (employeeIndex === -1) {
          toast.error(`Employee not found: ${id}`);
          reject(new Error(`Employee not found: ${id}`));
          return;
        }
        
        const updatedEmployee = {
          ...data.employees[employeeIndex],
          ...employeeData
        };
        
        const updatedEmployees = [...data.employees];
        updatedEmployees[employeeIndex] = updatedEmployee;
        
        setData(prevData => ({
          ...prevData,
          employees: updatedEmployees
        }));
        
        toast.success(`Updated employee: ${updatedEmployee.name}`);
        resolve(updatedEmployee);
      }, 500);
    });
  };

  const deleteEmployee = async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const employee = data.employees.find(e => e.id === id);
        
        if (!employee) {
          toast.error(`Employee not found: ${id}`);
          resolve(false);
          return;
        }
        
        setData(prevData => ({
          ...prevData,
          employees: prevData.employees.filter(e => e.id !== id)
        }));
        
        toast.success(`Deleted employee: ${employee.name}`);
        resolve(true);
      }, 500);
    });
  };

  const getEmployee = (id: string): Employee | undefined => {
    return data.employees.find(e => e.id === id);
  };

  // Attendance functions
  const getEmployeeAttendance = (employeeId: string): Attendance[] => {
    return data.attendance.filter(a => a.employeeId === employeeId);
  };

  const getAttendanceByDate = (date: string): Attendance[] => {
    return data.attendance.filter(a => a.date === date);
  };

  // Salary functions
  const getEmployeeSalaryRecords = (employeeId: string): SalaryRecord[] => {
    return data.salaryRecords.filter(s => s.employeeId === employeeId);
  };

  const updateSalaryRecord = async (id: string, recordData: Partial<SalaryRecord>): Promise<SalaryRecord> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const recordIndex = data.salaryRecords.findIndex(s => s.id === id);
        
        if (recordIndex === -1) {
          toast.error(`Salary record not found: ${id}`);
          reject(new Error(`Salary record not found: ${id}`));
          return;
        }
        
        const updatedRecord = {
          ...data.salaryRecords[recordIndex],
          ...recordData
        };
        
        const updatedRecords = [...data.salaryRecords];
        updatedRecords[recordIndex] = updatedRecord;
        
        setData(prevData => ({
          ...prevData,
          salaryRecords: updatedRecords
        }));
        
        toast.success("Salary record updated");
        resolve(updatedRecord);
      }, 500);
    });
  };

  // Filtering
  const getFilteredEmployees = (filter: Partial<Employee>): Employee[] => {
    return data.employees.filter(employee => {
      return Object.entries(filter).every(([key, value]) => {
        if (value === undefined || value === "") return true;
        const employeeValue = employee[key as keyof Employee];
        return employeeValue !== undefined && String(employeeValue).toLowerCase().includes(String(value).toLowerCase());
      });
    });
  };

  // Stats
  const getTodayAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = getAttendanceByDate(today);
    
    return {
      present: todayAttendance.filter(a => a.status === "present").length,
      absent: todayAttendance.filter(a => a.status === "absent").length,
      late: todayAttendance.filter(a => a.status === "late").length,
      total: data.employees.filter(e => e.status === "active").length
    };
  };

  const value = {
    ...data,
    isLoading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
    getEmployeeAttendance,
    getAttendanceByDate,
    getEmployeeSalaryRecords,
    updateSalaryRecord,
    getFilteredEmployees,
    getTodayAttendance
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
