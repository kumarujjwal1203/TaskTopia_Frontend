import React, { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { Circle, Clock, TrendingUp, Zap } from "lucide-react";

const Layout = ({ onLogout, user }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ───── Fetch tasks ───── */
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const { data } = await axios.get(
        "https://tasktopia-backend-5fn7.onrender.com/api/tasks/gp",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const arr = Array.isArray(data)
        ? data
        : Array.isArray(data?.tasks)
        ? data.tasks
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setTasks(arr);
    } catch (error) {
      console.error(error);
      setError(error.message || "Could not load tasks.");
      if (error.response?.status === 401) onLogout();
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  /* ───── Stats ───── */
  const stats = useMemo(() => {
    const completedTasks = tasks.filter(
      (t) =>
        t.completed === true ||
        t.completed === 1 ||
        (typeof t.completed === "string" && t.completed.toLowerCase() === "yes")
    ).length;

    const totalCount = tasks.length;
    const pendingCount = totalCount - completedTasks;
    const completionPercentage = totalCount
      ? Math.round((completedTasks / totalCount) * 100)
      : 0;

    return { totalCount, completedTasks, pendingCount, completionPercentage };
  }, [tasks]);

  /* ───── Tiny stat card ───── */
  const StatCard = ({ title, value, icon }) => (
    <div className="p-2 sm:p-3 rounded-xl bg-white shadow-sm border-purple-100 hover:shadow-md transition-all duration-300 hover:border-purple-100 group">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-fuchsia-500/10 to-purple-500/10 group-hover:from-fuchsia-500/20 group-hover:to-purple-500/20">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-violet-500 via-indigo-400 bg-clip-text text-transparent">
            {value}
          </p>
          <p className="text-xs text-gray-500 font-medium">{title}</p>
        </div>
      </div>
    </div>
  );

  /* ───── Loading ───── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-800" />
      </div>
    );
  }

  /* ───── Error ───── */
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 max-w-md">
          <p className="font-medium mb-2">Error loading tasks</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchTasks}
            className="mt-4 py-2 px-4 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* ───── Main layout ───── */
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar user={user} tasks={tasks} />

      <div className="ml-0 xl:ml-64 lg:ml-64 md:ml-16 pt-16 p-3 sm:p-4 md:p-4 transition-all duration-300">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Main outlet */}
          <div className="xl:col-span-2 space-y-3 sm:space-y-4">
            <Outlet context={{ tasks, refreshTasks: fetchTasks }} />
          </div>

          {/* Right‑hand sidebar */}
          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-indigo-100">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500" />
                Task Statistics
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <StatCard
                  title="Total Tasks"
                  value={stats.totalCount}
                  icon={<Circle className="w-4 h-4 text-violet-500" />}
                />
                <StatCard
                  title="Completed"
                  value={stats.completedTasks}
                  icon={<Circle className="w-4 h-4 text-indigo-400" />}
                />
                <StatCard
                  title="Pending"
                  value={stats.pendingCount}
                  icon={<Circle className="w-4 h-4 text-teal-400" />}
                />
                <StatCard
                  title="Completion Rate"
                  value={stats.completionPercentage + "%"}
                  icon={<Circle className="w-4 h-4 text-violet-500" />}
                />
              </div>

              <hr className="my-3 sm:my-4 border-indigo-100" />

              {/* Progress bar */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between text-gray-700">
                  <span className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                    <Circle className="w-3 h-3 text-violet-500 fill-violet-500" />
                    Task Progress
                  </span>
                  <span className="text-xs bg-indigo-100 text-violet-700 px-1.5 py-0.5 sm:px-2 rounded-full">
                    {stats.completedTasks}/{stats.totalCount}
                  </span>
                </div>

                <div className="relative pt-1">
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-2 sm:h-3 bg-indigo-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all duration-500"
                        style={{ width: `${stats.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent activity */}
              <div className="bg-white rounded-xl p-4 sm:p-5 mt-6 shadow-sm border border-indigo-100">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500" />
                  Recent Activity
                </h3>

                <div className="space-y-2 sm:space-y-3">
                  {tasks.slice(0, 3).map((task) => (
                    <div
                      key={task._id || task.id}
                      className="flex items-center justify-between p-2 sm:p-3 hover:bg-indigo-50/50 rounded-lg transition-colors duration-200 border border-transparent hover:border-indigo-100"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 break-words whitespace-normal">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {task.createdAt
                            ? new Date(task.createdAt).toLocaleDateString()
                            : "No date"}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full shrink-0 ml-2 ${
                          task.completed
                            ? "bg-green-100 text-green-700"
                            : "bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        {task.completed ? "Done" : "Pending"}
                      </span>
                    </div>
                  ))}

                  {tasks.length === 0 && (
                    <div className="text-center py-4 sm:py-6 px-2">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Clock className="w-6 h-6 sm:h-8 text-violet-500" />
                      </div>
                      <p className="text-sm text-gray-500">
                        No recent activity
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Tasks will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* end card */}
          </div>
          {/* end right col */}
        </div>
        {/* end grid */}
      </div>
      {/* end content wrapper */}
    </div>
  );
};

export default Layout;
