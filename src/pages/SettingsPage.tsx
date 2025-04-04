
import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Bell, 
  UserCog, 
  Building, 
  Shield, 
  Clock, 
  Save 
} from "lucide-react";
import { toast } from "sonner";

const SettingsPage = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    dailySummary: true,
    absenceAlerts: true,
    staffUpdates: false,
  });

  const [timeSettings, setTimeSettings] = useState({
    workdayStart: "09:00",
    workdayEnd: "17:00",
    lunchDuration: "60",
    gracePeriod: "15",
    overtimeThreshold: "8",
    weekStartDay: "monday",
  });

  const handleNotificationChange = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTimeSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setTimeSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveSettings = () => {
    // In a real app, this would save to backend
    toast.success("Settings saved successfully");
  };

  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500">Configure application preferences and options</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general" className="flex gap-2">
            <Settings className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="time" className="flex gap-2">
            <Clock className="h-4 w-4" />
            <span>Time & Attendance</span>
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex gap-2">
            <Building className="h-4 w-4" />
            <span>Departments</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex gap-2">
            <Shield className="h-4 w-4" />
            <span>Permissions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage basic application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Organization Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" defaultValue="Attendo Inc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input id="admin-email" defaultValue="admin@attendo.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-address">Company Address</Label>
                  <Input id="company-address" defaultValue="123 Business Street, Suite 101, New York, NY 10001" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Display Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select defaultValue="mm-dd-yyyy">
                      <SelectTrigger id="date-format">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY/MM/DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time-format">Time Format</Label>
                    <Select defaultValue="12h">
                      <SelectTrigger id="time-format">
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                        <SelectItem value="24h">24 Hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-muted-foreground text-sm">
                      Enable dark mode for the interface
                    </p>
                  </div>
                  <Switch id="dark-mode" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">System Settings</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-backup">Automatic Backup</Label>
                    <p className="text-muted-foreground text-sm">
                      Enable daily automatic data backup
                    </p>
                  </div>
                  <Switch id="auto-backup" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-logout">Automatic Logout</Label>
                    <p className="text-muted-foreground text-sm">
                      Automatically log out after 30 minutes of inactivity
                    </p>
                  </div>
                  <Switch id="auto-logout" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} className="ml-auto">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-muted-foreground text-sm">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={() => handleNotificationChange("emailNotifications")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="daily-summary">Daily Summary</Label>
                    <p className="text-muted-foreground text-sm">
                      Receive a daily attendance summary report
                    </p>
                  </div>
                  <Switch 
                    id="daily-summary" 
                    checked={notificationSettings.dailySummary}
                    onCheckedChange={() => handleNotificationChange("dailySummary")}
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Alert Settings</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="absence-alerts">Absence Alerts</Label>
                    <p className="text-muted-foreground text-sm">
                      Get notified when staff members are absent
                    </p>
                  </div>
                  <Switch 
                    id="absence-alerts" 
                    checked={notificationSettings.absenceAlerts}
                    onCheckedChange={() => handleNotificationChange("absenceAlerts")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="staff-updates">Staff Updates</Label>
                    <p className="text-muted-foreground text-sm">
                      Receive alerts when staff details are updated
                    </p>
                  </div>
                  <Switch 
                    id="staff-updates" 
                    checked={notificationSettings.staffUpdates}
                    onCheckedChange={() => handleNotificationChange("staffUpdates")}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="notification-time">Daily Report Time</Label>
                    <Input 
                      id="notification-time" 
                      type="time" 
                      defaultValue="08:00" 
                      disabled={!notificationSettings.dailySummary || !notificationSettings.emailNotifications}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="report-days">Report Days</Label>
                    <Select defaultValue="weekdays" disabled={!notificationSettings.dailySummary || !notificationSettings.emailNotifications}>
                      <SelectTrigger id="report-days">
                        <SelectValue placeholder="Select days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Every day</SelectItem>
                        <SelectItem value="weekdays">Weekdays only</SelectItem>
                        <SelectItem value="custom">Custom schedule</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} className="ml-auto">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="time">
          <Card>
            <CardHeader>
              <CardTitle>Time & Attendance Settings</CardTitle>
              <CardDescription>Configure working hours and attendance policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Working Hours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workday-start">Workday Start Time</Label>
                    <Input 
                      id="workday-start" 
                      name="workdayStart"
                      type="time" 
                      value={timeSettings.workdayStart}
                      onChange={handleTimeChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workday-end">Workday End Time</Label>
                    <Input 
                      id="workday-end" 
                      name="workdayEnd"
                      type="time" 
                      value={timeSettings.workdayEnd}
                      onChange={handleTimeChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lunch-duration">Lunch Duration (minutes)</Label>
                    <Input 
                      id="lunch-duration" 
                      name="lunchDuration"
                      type="number" 
                      value={timeSettings.lunchDuration}
                      onChange={handleTimeChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="week-start">Week Starts On</Label>
                    <Select 
                      value={timeSettings.weekStartDay}
                      onValueChange={(value) => handleSelectChange("weekStartDay", value)}
                    >
                      <SelectTrigger id="week-start">
                        <SelectValue placeholder="Select start day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="sunday">Sunday</SelectItem>
                        <SelectItem value="saturday">Saturday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Attendance Rules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="grace-period">Late Arrival Grace Period (minutes)</Label>
                    <Input 
                      id="grace-period" 
                      name="gracePeriod"
                      type="number" 
                      value={timeSettings.gracePeriod}
                      onChange={handleTimeChange}
                    />
                    <p className="text-xs text-gray-500">
                      Employees arriving within this period after start time will not be marked late
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="overtime-threshold">Daily Overtime Threshold (hours)</Label>
                    <Input 
                      id="overtime-threshold" 
                      name="overtimeThreshold"
                      type="number" 
                      value={timeSettings.overtimeThreshold}
                      onChange={handleTimeChange}
                    />
                    <p className="text-xs text-gray-500">
                      Hours worked beyond this threshold qualify for overtime pay
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekend-overtime">Weekend Overtime</Label>
                    <p className="text-muted-foreground text-sm">
                      All weekend hours are calculated as overtime
                    </p>
                  </div>
                  <Switch id="weekend-overtime" defaultChecked />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Absence Management</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="require-approval">Require Leave Approval</Label>
                    <p className="text-muted-foreground text-sm">
                      All leave requests require management approval
                    </p>
                  </div>
                  <Switch id="require-approval" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="consecutive-absence">Consecutive Absence Alert</Label>
                    <p className="text-muted-foreground text-sm">
                      Alert when an employee is absent for 3 or more consecutive days
                    </p>
                  </div>
                  <Switch id="consecutive-absence" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} className="ml-auto">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Department Settings</CardTitle>
              <CardDescription>Manage departments and reporting structure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-md">
                  <div className="bg-muted/50 p-3 flex justify-between items-center">
                    <h3 className="font-medium">Departments</h3>
                    <Button size="sm" variant="outline">Add Department</Button>
                  </div>
                  <div className="p-3">
                    <table className="w-full">
                      <thead>
                        <tr className="text-sm text-gray-500">
                          <th className="text-left py-2">Department Name</th>
                          <th className="text-left py-2">Manager</th>
                          <th className="text-left py-2">Staff Count</th>
                          <th className="text-right py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="py-3">Engineering</td>
                          <td className="py-3">David Miller</td>
                          <td className="py-3">12</td>
                          <td className="py-3 text-right">
                            <Button size="sm" variant="ghost">Edit</Button>
                          </td>
                        </tr>
                        <tr className="border-t">
                          <td className="py-3">HR</td>
                          <td className="py-3">Sarah Johnson</td>
                          <td className="py-3">5</td>
                          <td className="py-3 text-right">
                            <Button size="sm" variant="ghost">Edit</Button>
                          </td>
                        </tr>
                        <tr className="border-t">
                          <td className="py-3">Finance</td>
                          <td className="py-3">Robert Wilson</td>
                          <td className="py-3">8</td>
                          <td className="py-3 text-right">
                            <Button size="sm" variant="ghost">Edit</Button>
                          </td>
                        </tr>
                        <tr className="border-t">
                          <td className="py-3">Marketing</td>
                          <td className="py-3">Emma Davis</td>
                          <td className="py-3">7</td>
                          <td className="py-3 text-right">
                            <Button size="sm" variant="ghost">Edit</Button>
                          </td>
                        </tr>
                        <tr className="border-t">
                          <td className="py-3">Operations</td>
                          <td className="py-3">Chris Brown</td>
                          <td className="py-3">10</td>
                          <td className="py-3 text-right">
                            <Button size="sm" variant="ghost">Edit</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Department Settings</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dept-reporting">Department-Based Reporting</Label>
                      <p className="text-muted-foreground text-sm">
                        Generate reports grouped by department
                      </p>
                    </div>
                    <Switch id="dept-reporting" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dept-managers">Department Manager Permissions</Label>
                      <p className="text-muted-foreground text-sm">
                        Allow managers to manage their department's attendance
                      </p>
                    </div>
                    <Switch id="dept-managers" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} className="ml-auto">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>User Permissions</CardTitle>
              <CardDescription>Manage access rights and user roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">User Roles</h3>
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-muted/50 p-3 flex justify-between items-center">
                    <h3 className="font-medium">Roles & Permissions</h3>
                    <Button size="sm" variant="outline">Add Role</Button>
                  </div>
                  <div className="p-3">
                    <table className="w-full">
                      <thead>
                        <tr className="text-sm text-gray-500">
                          <th className="text-left py-2">Role Name</th>
                          <th className="text-left py-2">Description</th>
                          <th className="text-right py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="py-3 font-medium">Admin</td>
                          <td className="py-3">Full access to all system features</td>
                          <td className="py-3 text-right">
                            <Button size="sm" variant="ghost">Edit</Button>
                          </td>
                        </tr>
                        <tr className="border-t">
                          <td className="py-3 font-medium">Manager</td>
                          <td className="py-3">Can manage staff and department data</td>
                          <td className="py-3 text-right">
                            <Button size="sm" variant="ghost">Edit</Button>
                          </td>
                        </tr>
                        <tr className="border-t">
                          <td className="py-3 font-medium">HR Staff</td>
                          <td className="py-3">Can view and manage attendance records</td>
                          <td className="py-3 text-right">
                            <Button size="sm" variant="ghost">Edit</Button>
                          </td>
                        </tr>
                        <tr className="border-t">
                          <td className="py-3 font-medium">User</td>
                          <td className="py-3">Can view own attendance record</td>
                          <td className="py-3 text-right">
                            <Button size="sm" variant="ghost">Edit</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Security Settings</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-muted-foreground text-sm">
                      Require two-factor authentication for admin users
                    </p>
                  </div>
                  <Switch id="two-factor" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="password-policy">Strong Password Policy</Label>
                    <p className="text-muted-foreground text-sm">
                      Require complex passwords for all users
                    </p>
                  </div>
                  <Switch id="password-policy" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="session-timeout">Session Timeout</Label>
                    <p className="text-muted-foreground text-sm">
                      Automatically log out inactive sessions after 30 minutes
                    </p>
                  </div>
                  <Switch id="session-timeout" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} className="ml-auto">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default SettingsPage;
