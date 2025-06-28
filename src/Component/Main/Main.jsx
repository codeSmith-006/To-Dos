import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { Square, CheckSquare, Edit3, Trash2 } from "lucide-react";
import AuthContext from "../../Context/AuthContext";
import axios from "axios";
import Loading from "../Loading/Loading";
import toast, { Toaster } from "react-hot-toast";
import confirmDialog from "../confirmDialog/confirmDialog";
import AxiosX from "../../Auth/AxiosX/AxiosX";

const Main = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isFinished, setIsFinished] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortMode, setSortMode] = useState("default");
  const [taskForEdit, setTaskForEdit] = useState(null);
  const [action, setAction] = useState("Add");
  const [tableNameInput, setTableNameInput] = useState("");
  const [isTableView, setIsTableView] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { currentUser, loading } = useContext(AuthContext);
  const [dataFetchLoading, setDataFetchLoading] = useState(true);

  // handling layout view
  useEffect(() => {
    const savedView = localStorage.getItem("preferredView");
    if (savedView === "table" || savedView === "board") {
      setIsTableView(savedView === "table");
    }
  }, []);

  const handleViewChangeLayout = (view) => {
    setIsTableView(view === "table");
    localStorage.setItem("preferredView", view);
  };

  // console.log("layout", isTableView)

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await AxiosX.get(
          "https://to-dos-server.vercel.app/tasks"
        );
        setTasks(response?.data);
        setDataFetchLoading(false);
      } catch (error) {
        console.log("Error while getting tasks: ", error);
      }
    };
    getTasks();
  }, []);

  // Handle window resize
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // View toggle handler
  const handleViewChange = (view) => {
    setIsTableView(view === "table");
  };

  const uniqueTableNames = [
    ...new Set(tasks.map((task) => task.tableName).filter(Boolean)),
  ];

  if (!currentUser) {
    return (
      <div className="text-center text-white h-screen py-10">
        ⚠️ Please{" "}
        <span className="text-[#D4D4D4] font-semibold">log in first</span> to
        use your To-Dos.
      </div>
    );
  }

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSubmitTask = async (event) => {
    event.preventDefault();
    const taskName = event.target.task.value;
    const taskDate = event.target.date.value;
    const time = formatTime();
    const tableName = tableNameInput.trim();

    const taskDetails = {
      Task: taskName,
      Date: taskDate,
      Time: time,
      User: currentUser?.email,
      isFinished: false,
      tableName: tableName || "Untitled",
    };

    setShowModal(false);

    if (action === "Edit" && taskForEdit) {
      try {
        await AxiosX.patch(`https://to-dos-server.vercel.app/tasks`, {
          ...taskDetails,
          targetId: taskForEdit._id,
          action: "edit",
        });
        setTasks((prev) =>
          prev.map((t) =>
            t._id === taskForEdit._id ? { ...t, ...taskDetails } : t
          )
        );
        toast.success("Task updated successfully");
      } catch (error) {
        console.log("Error updating task:", error);
      } finally {
        setTaskForEdit(null);
      }
    } else {
      try {
        const response = await AxiosX.post(
          "https://to-dos-server.vercel.app/tasks",
          taskDetails
        );
        if (response.data?.insertedId) {
          setTasks((prevTasks) => [
            ...prevTasks,
            { ...taskDetails, _id: response.data.insertedId },
          ]);
          toast.success("Task added successfully");
        }
      } catch (error) {
        console.log("Error while posting task details: ", error);
      }
    }
    setTableNameInput("");
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDialog({
      confirmButtonText: "Yes, delete it!",
      successTitle: "Deleted!",
      successText: "Your task has been deleted",
    });

    if (confirmed) {
      const remainingTasks = tasks.filter((task) => task._id !== id);
      setTasks(remainingTasks);
      try {
        const response = await AxiosX.delete(
          `https://to-dos-server.vercel.app/tasks/${id}`
        );
        setTasks((prev) => prev.filter((task) => task._id !== id));
      } catch (error) {
        console.log("Error deleting task:", error);
      }
    }
  };

  const handleTick = async (id) => {
    // ask before mark as tick
    const confirmed = await confirmDialog({
      confirmButtonText: "Yes, Mark as Finished!",
      successTitle: "Congratulation 🎉",
      successText: "You finished the task!",
    });

    if (confirmed) {
      const updatedTask = tasks.map((task) =>
        id === task._id ? { ...task, isFinished: true } : task
      );

      // console.log("Confirmed: ", confirmed);
      setTasks(updatedTask);

      try {
        const response = await AxiosX.patch(
          "https://to-dos-server.vercel.app/tasks",
          {
            targetId: id,
            action: "mark-finished",
          }
        );
      } catch (error) {
        console.log("Error while patching in the database: ", error);
      }
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task?.Task?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#191919] text-[#D4D4D4] min-h-screen py-6">
      <Toaster />
      <div className="max-w-5xl mx-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center border-b border-[#838383] pb-2">
          {/* Toggle only on md+ */}
          <div className="hidden md:flex gap-4">
            <button
              className={`pb-1 border-b-2 cursor-pointer ${
                isTableView ? "border-[#838383]" : "border-transparent"
              }`}
              onClick={() => handleViewChangeLayout("table")}
            >
              Task
            </button>
            <button
              className={`pb-1 border-b-2 cursor-pointer ${
                !isTableView ? "border-[#838383]" : "border-transparent"
              }`}
              onClick={() => handleViewChangeLayout("board")}
            >
              Board
            </button>
          </div>

          {/* Sort & Search */}
          <div className="flex items-center gap-3">
            <button
              data-tooltip-id="sort-tooltip"
              className="border cursor-pointer border-[#838383] p-1 rounded text-white hover:text-[#D4D4D4]"
              onClick={() =>
                setSortMode((prev) =>
                  prev === "default"
                    ? "in-progress"
                    : prev === "in-progress"
                    ? "finished"
                    : "default"
                )
              }
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 9l6-6 6 6M18 15l-6 6-6-6"
                />
              </svg>
            </button>
            <Tooltip
              id="sort-tooltip"
              place="bottom"
              content={
                sortMode === "default"
                  ? "Sort: Normal"
                  : sortMode === "in-progress"
                  ? "Sort: In Progress First"
                  : "Sort: Finished First"
              }
            />

            <div className="relative flex items-center gap-2">
              <button onClick={() => setShowSearch((prev) => !prev)}>
                <svg
                  className="w-5 h-5 text-white hover:text-[#D4D4D4]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
              </button>
              <AnimatePresence>
                {showSearch && (
                  <motion.input
                    key="search"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "8rem", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-[#2F2F2F] text-[#D4D4D4] border border-[#838383] rounded-2xl px-2 py-1 text-sm"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Task View */}
        {dataFetchLoading ? (
          <div className="mt-6 text-center text-white">Loading...</div>
        ) : (
          <div className="mt-6 space-y-8">
            {/* Top Add Button */}
            <div className="flex justify-center mb-4">
              <button
                onClick={() => {
                  setShowModal(true);
                  setAction("Add");
                  setTableNameInput("");
                }}
                className="btn btn-circle bg-[#838383] text-[#191919]"
              >
                +
              </button>
            </div>

            {uniqueTableNames.length === 0 ? (
              <div className="text-center text-white py-10">
                ✨ No tasks found. Click{" "}
                <span className="text-[#D4D4D4] font-semibold">+</span> to add
                one!
              </div>
            ) : (
              uniqueTableNames.map((table, i) => {
                const tasks = filteredTasks.filter(
                  (t) => t.tableName === table
                );
                if (!tasks.length) return null;
                return (
                  <div key={i}>
                    <h2 className="text-xl font-semibold mb-2 border-b border-[#838383] pb-1">
                      {table}
                    </h2>

                    {/* Table on md+ */}
                    {!isMobile && isTableView && (
                      <div className="overflow-x-auto">
                        <table className="table w-full bg-[#2F2F2F] rounded-lg">
                          <thead className="text-white">
                            <tr>
                              <th className="w-10">#</th>
                              <th className="text-left">Task</th>
                              <th className="text-left">Date</th>
                              <th className="text-left">Time</th>
                              <th className="text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tasks.map((task, idx) => (
                              <tr
                                key={task._id || idx}
                                className={`align-top ${
                                  task.isFinished
                                    ? "text-white/30"
                                    : "text-white"
                                }`}
                              >
                                <td className="pt-3 font-semibold">
                                  {idx + 1}
                                </td>
                                <td className="max-w-sm break-words pt-3 align-top">
                                  {task.Task}
                                </td>
                                <td className="pt-3 align-top">{task.Date}</td>
                                <td className="pt-3 align-top">
                                  {task.Time || "--:--"}
                                </td>
                                <td className="pt-3 align-top">
                                  <div className="flex items-start gap-3">
                                    <button
                                      onClick={() => {
                                        setShowModal(true);
                                        setAction("Edit");
                                        setTaskForEdit(task);
                                        setTableNameInput(task.tableName || "");
                                      }}
                                      disabled={task.isFinished}
                                      className={`${
                                        task.isFinished
                                          ? "text-white/30 cursor-not-allowed"
                                          : "text-white hover:text-[#D4D4D4]"
                                      }`}
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(task._id)}
                                      className="text-white hover:text-[#D4D4D4]"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Board/Card on mobile or board view */}
                    {(isMobile || !isTableView) && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {tasks.map((task, idx) => (
                          <div
                            key={task._id || idx}
                            className="bg-[#2F2F2F] p-4 rounded-lg flex flex-col justify-between min-h-[120px]"
                          >
                            <div className="flex items-start gap-2">
                              <button onClick={() => handleTick(task._id)}>
                                {task.isFinished ? (
                                  <CheckSquare className="w-5 h-5 cursor-not-allowed text-white bg-green-600 rounded" />
                                ) : (
                                  <Square className="w-5 h-5 cursor-progress text-white hover:text-[#D4D4D4]" />
                                )}
                              </button>
                              <h3
                                className={`break-words text-left flex-1 ${
                                  task.isFinished
                                    ? "text-white/30"
                                    : "text-white"
                                }`}
                              >
                                {task.Task}
                              </h3>
                            </div>
                            <div
                              className={`text-sm mt-2 ${
                                task.isFinished ? "text-white/30" : "text-white"
                              } text-right`}
                            >
                              {task.Date} — {task.Time || "--:--"}
                            </div>
                            <div className="flex justify-end gap-3 mt-2">
                              <button
                                onClick={() => {
                                  setShowModal(true);
                                  setAction("Edit");
                                  setTaskForEdit(task);
                                  setTableNameInput(task.tableName || "");
                                }}
                                disabled={task.isFinished}
                                className={`${
                                  task.isFinished
                                    ? "cursor-not-allowed text-white/30"
                                    : "text-white hover:text-[#D4D4D4]"
                                }`}
                              >
                                <Edit3 size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(task._id)}
                                className="text-white hover:text-[#D4D4D4]"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Bottom Add Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => {
                  setShowModal(true);
                  setAction("Add");
                  setTableNameInput("");
                }}
                className="btn btn-circle bg-[#838383] text-[#191919]"
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <dialog className="modal modal-open overflow-hidden">
          <div className="modal-box max-h-[95vh] overflow-y-auto bg-[#2F2F2F] text-[#D4D4D4]">
            <h3 className="font-bold text-lg mb-4">
              {action === "Edit" ? "Edit Task" : "Add New Task"}
            </h3>
            <form onSubmit={handleSubmitTask} className="flex flex-col gap-3">
              <input
                type="text"
                name="task"
                placeholder="Task name"
                defaultValue={taskForEdit?.Task || ""}
                className="input input-bordered bg-[#191919] border-[#838383] placeholder-[#838383] text-[#D4D4D4]"
                required
              />
              <input
                type="date"
                name="date"
                defaultValue={taskForEdit?.Date || date}
                className="input input-bordered bg-[#191919] border-[#838383] text-[#D4D4D4]"
                required
              />
              <select
                onChange={(e) => setTableNameInput(e.target.value)}
                value={tableNameInput}
                className="select select-bordered bg-[#191919] border-[#838383] text-[#D4D4D4]"
              >
                <option value="">-- Select Board/Table --</option>
                {uniqueTableNames.map((name, idx) => (
                  <option key={idx} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Or create new board/table"
                value={tableNameInput}
                onChange={(e) => setTableNameInput(e.target.value)}
                className="input input-bordered bg-[#191919] border-[#838383] text-[#D4D4D4] placeholder-[#838383]"
              />
              <div className="modal-action">
                <button
                  type="submit"
                  className="btn bg-[#838383] text-[#191919]"
                >
                  {action === "Edit" ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setTaskForEdit(null);
                    setAction("Add");
                    setTableNameInput("");
                  }}
                  className="btn btn-outline border-[#838383] text-[#D4D4D4]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Main;
