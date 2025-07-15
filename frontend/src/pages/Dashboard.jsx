import { useEffect, useState } from "react";
import API from "../api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  LogOut, 
  Search, 
  Filter,
  BarChart3,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  });

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks/");
      setTasks(res.data.results || res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/tasks/stats/");
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [refresh]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Tasks</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-800" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{stats.total_tasks || 0}</div>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-gray-800" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{stats.completed_tasks || 0}</div>
              <p className="text-xs text-black">
                {stats.completion_rate || 0}% completion rate
              </p>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-gray-800" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{stats.in_progress_tasks || 0}</div>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-gray-800" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{stats.overdue_tasks || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <Card className="lg:col-span-1 dashboard-card">
            <CardHeader>
              <CardTitle className="text-lg text-white">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Search</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-black" />
                  <Input
                    placeholder="Search tasks..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-white text-black"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-white text-black"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Create New Task */}
              <div className="pt-4">
                <TaskForm refresh={setRefresh} />
              </div>
            </CardContent>
          </Card>

          {/* Tasks List */}
          <div className="lg:col-span-3">
            <Card className="dashboard-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">My Tasks</CardTitle>
                    <CardDescription className="text-gray-200">
                      Manage your tasks with drag-and-drop ordering
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-black border-gray-800">
                    {tasks.filter(task => {
                      if (filters.status !== 'all' && task.status !== filters.status) return false;
                      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
                      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) && 
                          !task.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
                      return true;
                    }).length} tasks
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <TaskList tasks={tasks} refresh={setRefresh} filters={filters} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
