import React, { useMemo, useState, useCallback } from "react";
import axios from "axios";
import TaskItem from "../components/TaskItem";
import {
  WRAPPER,
  HEADER,
  ADD_BUTTON,
  STATS_GRID,
  STATS,
  STAT_CARD,
  ICON_WRAPPER,
  VALUE_CLASS,
  LABEL_CLASS,
  FILTER_WRAPPER,
  FILTER_LABELS,
  SELECT_CLASSES,
  FILTER_OPTIONS,
  TABS_WRAPPER,
  TAB_BASE,
  TAB_ACTIVE,
  TAB_INACTIVE,
  EMPTY_STATE,
} from "../assets/dummy";
import { Home as HomeIcon, Plus, Filter, CalendarIcon } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import TaskModal from "../components/TaskModal";

// If you need it later for fetches:
const API_BASE = "https://tasktopia-backend-5fn7.onrender.com/api/tasks";

const Dashboard = () => {
  /* data provided by the parent layout */
  const { tasks = [], refreshTasks } = useOutletContext();

  /* local ui state */
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState("all");

  /* ─────────────────────────
     1.  aggregate statistics
     ───────────────────────── */
  const stats = useMemo(
    () => ({
      total: tasks.length,

      lowPriority: tasks.filter((t) => t.priority?.toLowerCase() === "low")
        .length,

      mediumPriority: tasks.filter(
        (t) => t.priority?.toLowerCase() === "medium"
      ).length,

      highPriority: tasks.filter((t) => t.priority?.toLowerCase() === "high")
        .length,

      completed: tasks.filter((t) =>
        /* allow both boolean true and string "yes" */
        typeof t.completed === "string"
          ? t.completed.toLowerCase() === "yes"
          : !!t.completed
      ).length,
    }),
    [tasks]
  );

  /* ─────────────────────────
     2.  filtered‑task list
     ───────────────────────── */
  const filteredTasks = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);

      switch (filter) {
        case "today":
          return dueDate.toDateString() === today.toDateString();

        case "week":
          return dueDate >= today && dueDate <= nextWeek;

        case "high":
        case "medium":
        case "low":
          return task.priority?.toLowerCase() === filter;

        default:
          return true; // "all"
      }
    });
  }, [tasks, filter]);

  // SAVING TASKS
  const handleTaskSave = useCallback(
    async (taskData) => {
      try {
        if (taskData.id)
          await axios.put(`${API_BASE}/${taskData.id}/gp`, taskData);
        refreshTasks();
        setShowModal(false);
        setSelectTask(null);
      } catch (error) {
        console.error("Error saving tasks:", error);
      }
    },
    [refreshTasks]
  );

  /* ─────────────────────────
     3.  render
     ───────────────────────── */
  return (
    <div className={WRAPPER}>
      {/* HEADER */}
      <div className={HEADER}>
        <div className="min-w-0">
          <h1 className="text-xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <HomeIcon className="text-violet-500 w-5 h-5 md:w-6 md:h-6 shrink-0" />
            <span className="truncate">Task Overview</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-7 truncate">
            Manage your tasks efficiently
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className={ADD_BUTTON}>
          <Plus size={18} />
          Add New Task
        </button>
      </div>

      {/* STAT CARDS */}
      <div className={STATS_GRID}>
        {STATS.map(
          ({
            key,
            label,
            icon: Icon,
            iconColor,
            borderColor = "border-purple-100",
            valueKey,
            textColor,
            gradient,
          }) => (
            <div key={key} className={`${STAT_CARD} ${borderColor}`}>
              <div className="flex items-center gap-2 md:gap-3">
                <div className={`${ICON_WRAPPER} ${iconColor}`}>
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>

                <div className="min-w-0">
                  <p
                    className={`${VALUE_CLASS} ${
                      gradient
                        ? "bg-gradient-to-r from-violet-500 to-indigo-600 bg-clip-text text-transparent"
                        : textColor
                    }`}
                  >
                    {stats[valueKey]}
                  </p>
                  <p className={LABEL_CLASS}>{label}</p>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* You can render `filteredTasks` in a list below if needed */}

      {/* CONTENTS */}
      <div className="space-y-6">
        {/* FILTER */}
        <div className={FILTER_WRAPPER}>
          <div className="flex items-center gap-2 min-w-0">
            <Filter className="w-5 h-5 text-violet-500 shrink-0" />
            <h2 className="text-base md:text-lg font-semibold text-gray-800 truncate">
              {FILTER_LABELS[filter]}
            </h2>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={SELECT_CLASSES}
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>

          <div className={TABS_WRAPPER}>
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`${TAB_BASE} ${
                  filter === opt ? TAB_ACTIVE : TAB_INACTIVE
                }`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* TASK LIST */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className={EMPTY_STATE.wrapper}>
              <div className={EMPTY_STATE.iconWrapper}>
                <CalendarIcon className="w-8 h-8 text-indigo-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No tasks found
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {filter === "all"
                  ? "Create your first task to get started"
                  : "No tasks match this filter"}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className={EMPTY_STATE.btn}
              >
                Add New Task
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task._id || task.id}
                task={task}
                onRefresh={refreshTasks}
                showCompleteCheckbox
                onEdit={() => {
                  setSelectedTask(task);
                  setShowModal(true);
                }}
              />
            ))
          )}
        </div>

        {/* ADD TASK DESKTOP */}
        <div
          onClick={() => setShowModal(true)}
          className="hidden md:flex items-center justify-center p-4 border-2 border-dashed border-purple-200 rounded-xl hover:border-indigo-400 bg-purple-50/50 cursor-pointer transition-colors "
        >
          <Plus className="w-5 h-5 text-indigo-600 mr-2" />
          <span className="text-gray-600 font-medium">Add New Task</span>
        </div>
      </div>

      {/* MODAL */}
      <TaskModal
        isOpen={showModal || !!selectedTask}
        onClose={() => {
          setShowModal(false);
          selectedTask(null);
        }}
        taskToEdit={selectedTask}
        onSave={handleTaskSave}
      />
    </div>
  );
};

export default Dashboard;
