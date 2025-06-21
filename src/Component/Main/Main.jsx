import React, { useState } from "react";

const Main = () => {
  // State for view toggle
  const [isTableView, setIsTableView] = useState(true);

  // Show/hide search input
  const [showSearch, setShowSearch] = useState(false);

  // Show/hide add task modal
  const [showModal, setShowModal] = useState(false);

  // New task input values
  const [newTask, setNewTask] = useState({ name: "", date: "" });

  // Task list
  const [tasks, setTasks] = useState([]);

  // Format date like "Jun 22, 2025"
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Handle adding a new task
  const handleAddTask = (e) => {
    e.preventDefault();
    const formattedDate = formatDate(newTask.date);

    const newEntry = {
      name: newTask.name,
      date: formattedDate,
      completed: false,
    };

    setTasks([...tasks, newEntry]);
    setNewTask({ name: "", date: "" });
    setShowModal(false);
  };


  return (
    <div className="bg-[#191919] text-[#D4D4D4] min-h-screen px-4 py-6">
      {/* Top Action Bar */}
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center border-b border-[#838383] pb-2">
          {/* Left: View Toggle */}
          <div className="flex gap-4">
            <button
              className={`pb-1 border-b-2 ${
                isTableView ? "border-[#838383]" : "border-transparent"
              }`}
              onClick={() => setIsTableView(true)}
            >
              Task
            </button>
            <button
              className={`pb-1 border-b-2 ${
                !isTableView ? "border-[#838383]" : "border-transparent"
              }`}
              onClick={() => setIsTableView(false)}
            >
              Board
            </button>
          </div>

          {/* Right: Sort + Search */}
          <div className="flex items-center gap-3">
            <button className="text-sm border border-[#838383] px-2 py-1 rounded">
              Sort by Date
            </button>
            <div className="relative">
              <button onClick={() => setShowSearch(!showSearch)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-[#838383]"
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
              {showSearch && (
                <input
                  type="text"
                  placeholder="Search..."
                  className="absolute right-0 top-full mt-2 bg-[#2F2F2F] text-[#D4D4D4] border border-[#838383] rounded px-2 py-1 text-sm w-48"
                />
              )}
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
                      <tr key={index}>
                        <td>
                          <input
                            type="checkbox"
                            checked={task.completed}
                            readOnly
                          />
                        </td>
                        <td>{task.name}</td>
                        <td>{task.date}</td>
                        <td className="flex gap-2">
                          <button>Edit</button>
                          <button>Delete</button>
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
                        <input
                          type="checkbox"
                          checked={task.completed}
                          readOnly
                        />
                        <h3 className="text-base">{task.name}</h3>
                      </div>
                      <span className="text-sm text-[#838383]">
                        {task.date}
                      </span>
                    </div>
                    <div className="flex justify-end gap-2 text-sm">
                      <button>Edit</button>
                      <button>Delete</button>
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
                className="input input-bordered bg-[#191919] border-[#838383] placeholder-[#838383] text-[#D4D4D4]"
                required
                value={newTask.name}
                onChange={(e) =>
                  setNewTask({ ...newTask, name: e.target.value })
                }
              />
              <input
                type="date"
                className="input input-bordered bg-[#191919] border-[#838383] text-[#D4D4D4]"
                required
                value={newTask.date}
                onChange={(e) =>
                  setNewTask({ ...newTask, date: e.target.value })
                }
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
