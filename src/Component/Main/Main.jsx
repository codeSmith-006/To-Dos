import React, { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { Square, CheckSquare, Axis3D } from "lucide-react";
import AuthContext from "../../Context/AuthContext";
import axios from "axios";

const Main = () => {
  // State for view toggle
  const [isTableView, setIsTableView] = useState(true);

  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const [isFinished, setIsFinished] = useState(false);

  // Show/hide search input
  const [showSearch, setShowSearch] = useState(false);

  // Show/hide add task modal
  const [showModal, setShowModal] = useState(false);

  // Task list
  const [tasks, setTasks] = useState([]);

  // current user 
  const {currentUser} = use(AuthContext);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tasks');
        setTasks(response?.data)
      } catch (error) {
        console.log("Error while getting tasks: ", error)
      }
    }

    getTasks();
  }, [])

  // all tasks
  console.log("tasks: ", tasks)

  // Format date like "Jun 22, 2025"
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Handle adding a new task
  const handleAddTask = async (event) => {
    event.preventDefault();

    // getting the task 
    const task = event.target.task.value;
    const date = event.target.date.value;

    // task object data
    const taskDetails = {
      Task: task,
      Date: date,
      User: currentUser?.email,
      isFinishedBool: isFinished
    }

    console.log("Task details: ", taskDetails)
    setShowModal(false);

    // send task details to database
    try {
      const response = await axios.post('http://localhost:5000/tasks', taskDetails);
      console.log("Response: ", response.data)
    } catch (error) {
      console.log("Error while post task details to database: ", error)
    }
  };

  // handle edit
  const handleEdit = () => {
    console.log("Edit");
  };

  // handle check task
  const handleTick = async (id) => {
    console.log("Clicked id: ", id);
    const updatedTask = tasks.map(task => id === task._id ? {...task, isFinished:true} : task);
    setTasks(updatedTask);
    const targetId = id;
    console.log("Targeted id: ", id)

    // updating in the database
    try {
      const response = await axios.patch("http://localhost:5000/tasks", {targetId});
      console.log("Response for patch: ", response.data)
    } catch (error) {
      console.log("Error while patching in the database: ", error)
    }
  }

  return (
    <div className="bg-[#191919] text-[#D4D4D4] min-h-screen py-6">
      {/* Top Action Bar */}
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center border-b border-[#838383] pb-2">
          {/* Left: View Toggle */}
          <div className="flex gap-4">
            <button
              className={`pb-1 border-b-2 cursor-pointer ${
                isTableView ? "border-[#838383]" : "border-transparent"
              }`}
              onClick={() => setIsTableView(true)}
            >
              Task
            </button>
            <button
              className={`pb-1 border-b-2 cursor-pointer ${
                !isTableView ? "border-[#838383]" : "border-transparent"
              }`}
              onClick={() => setIsTableView(false)}
            >
              Board
            </button>
          </div>

          {/* Right: Sort + Search */}
          <div className="flex items-center gap-3">
            <>
              <button
                data-tooltip-id="sort-tooltip"
                className="border cursor-pointer border-[#838383] p-1 rounded hover:text-[#D4D4D4] text-[#838383]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
                content="Sort"
                className="z-50"
              />
            </>
            <div className="relative flex items-center gap-2">
              <button onClick={() => setShowSearch(!showSearch)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 cursor-pointer text-[#838383]"
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
                    className="bg-[#2F2F2F] text-[#D4D4D4] border border-[#838383] rounded-2xl px-2 py-1 text-sm overflow-hidden"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Content: Table or Board */}
        <div className="mt-6">
          {isTableView ? (
            // Table View
            <div className="overflow-x-auto">
              {tasks.length === 0 ? (
                <div className="text-center text-[#838383] py-10">
                  ✨ No tasks found. Click{" "}
                  <span className="text-[#D4D4D4] font-semibold">+</span> to add
                  one!
                </div>
              ) : (
                <table className="table w-full bg-[#2F2F2F] rounded-lg">
                  <thead>
                    <tr className="text-[#838383]">
                      <th></th>
                      <th>Task</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task, index) => (
                      <tr
                        className={`text-[#838383] ${
                          task?.isFinished ? "text-[#838383]/30 line-through" : ""
                        }`}
                        key={index}
                      >
                        <td>
                          <button onClick={() => handleTick(task?._id)}>
                            {task?.isFinished ? (
                              <CheckSquare className="w-5 h-5 text-white bg-green-600 rounded" />
                            ) : (
                              <Square className="w-5 h-5 text-[#838383] hover:text-[#D4D4D4]" />
                            )}
                          </button>
                        </td>
                        <td>{task?.Task}</td>
                        <td>{task?.Date}</td>
                        <td className="flex gap-2">
                          <button
                            onClick={() => handleEdit(task?._id)}
                            disabled={task?.isFinished}
                            className={`text-[#838383] ${
                              task?.isFinished
                                ? "text-[#838383]/30 cursor-not-allowed"
                                : "hover:text-[#D4D4D4]"
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3zM16 16h2a2 2 0 012 2v2H6v-2a2 2 0 012-2h8z"
                              />
                            </svg>
                          </button>
                          <button
                            className={`text-[#838383] cursor-pointer hover:text-[#D4D4D4] ${
                              task?.isFinished ? "" : ""
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowModal(true)}
                  className="btn btn-circle bg-[#838383] text-[#191919]"
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            // Grid View
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {tasks.length === 0 ? (
                <div className="text-center text-[#838383] py-10 col-span-full">
                  ✨ No tasks found. Click{" "}
                  <span className="text-[#D4D4D4] font-semibold">+</span> to add
                  one!
                </div>
              ) : (
                tasks.map((task, index) => (
                  <div
                    key={index}
                    className="bg-[#2F2F2F] p-4 rounded-lg flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleTick(task?._id)}>
                          {task?.isFinished ? (
                            <CheckSquare className="w-5 h-5 text-white bg-green-600 rounded" />
                          ) : (
                            <Square className="w-5 h-5 text-[#838383] hover:text-[#D4D4D4]" />
                          )}
                        </button>
                        <h3
                          className={`text-[#838383] ${
                            task?.isFinished ? "text-[#838383]/30 line-through" : ""
                          }`}
                        >
                          {task.name}
                        </h3>
                      </div>
                      <span
                        className={`text-[#838383] ${
                          task?.isFinished ? "text-[#838383]/30 line-through" : ""
                        }`}
                      >
                        {task.date}
                      </span>
                    </div>
                    <div className="flex justify-end gap-2 text-sm">
                      <button
                        className={`text-[#838383] ${
                          isFinished
                            ? "text-[#838383]/30 cursor-not-allowed"
                            : "hover:text-[#D4D4D4]"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3zM16 16h2a2 2 0 012 2v2H6v-2a2 2 0 012-2h8z"
                          />
                        </svg>
                      </button>
                      <button
                        className={`text-[#838383] cursor-pointer hover:text-[#D4D4D4] ${
                          task?.isFinished ? "" : ""
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
              {/* Add Task Button for Grid */}
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-circle bg-[#838383] text-[#191919] self-center"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <dialog className="modal modal-open">
          <div className="modal-box bg-[#2F2F2F] text-[#D4D4D4]">
            <h3 className="font-bold text-lg mb-4">Add New Task</h3>

            <form onSubmit={handleAddTask} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Task name"
                name="task"
                className="input input-bordered bg-[#191919] border-[#838383] placeholder-[#838383] text-[#D4D4D4]"
                required
                // onChange={(e) =>
                //   setNewTask({ ...newTask, name: e.target.value })
                // }
              />
              <input
                type="date"
                name="date"
                className="input input-bordered bg-[#191919] border-[#838383] text-[#D4D4D4]"
                required
                defaultValue={date}
                // onChange={(e) =>
                //   setNewTask({ ...newTask, date: e.target.value })
                // }
              />
              <div className="modal-action">
                <button
                  type="submit"
                  className="btn bg-[#838383] text-[#191919]"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
