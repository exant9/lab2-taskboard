const tasks = [];
let nextTaskId = 1;

const todoList = document.getElementById("todoList");
const inprogressList = document.getElementById("inprogressList");
const doneList = document.getElementById("doneList");

const taskCount = document.getElementById("taskCount");
const filterPriority = document.getElementById("filterPriority");

const taskModal = document.getElementById("taskModal");
const modalTitle = document.getElementById("modalTitle");

const editingTaskId = document.getElementById("editingTaskId");
const currentColumn = document.getElementById("currentColumn");

const taskTitleInput = document.getElementById("taskTitle");
const taskDescriptionInput = document.getElementById("taskDescription");
const taskPriorityInput = document.getElementById("taskPriority");
const taskDueDateInput = document.getElementById("taskDueDate");

const saveTaskBtn = document.getElementById("saveTaskBtn");
const cancelTaskBtn = document.getElementById("cancelTaskBtn");
const clearDoneBtn = document.getElementById("clearDoneBtn");

const addTaskButtons = document.querySelectorAll(".add-task-btn");
const columnLists = [todoList, inprogressList, doneList];

/* helpers */
function getListByColumn(columnId) {
  if (columnId === "todo") {
    return todoList;
  }

  if (columnId === "inprogress") {
    return inprogressList;
  }

  return doneList;
}

function findTaskById(taskId) {
  return tasks.find(function (task) {
    return task.id === taskId;
  });
}

function getPriorityText(priority) {
  if (priority === "high") {
    return "High";
  }

  if (priority === "medium") {
    return "Medium";
  }

  return "Low";
}

function updateTaskCounter() {
  const total = tasks.length;
  const text = total === 1 ? "1 Task" : String(total) + " Tasks";
  taskCount.textContent = text;
}

function applyPriorityFilter() {
  const selectedPriority = filterPriority.value;
  const allCards = document.querySelectorAll(".task-card");

  allCards.forEach(function (card) {
    const cardPriority = card.getAttribute("data-priority");
    const shouldHide =
      selectedPriority !== "all" && cardPriority !== selectedPriority;

    card.classList.toggle("is-hidden", shouldHide);
  });
}

function clearModalFields() {
  editingTaskId.value = "";
  currentColumn.value = "";
  taskTitleInput.value = "";
  taskDescriptionInput.value = "";
  taskPriorityInput.value = "medium";
  taskDueDateInput.value = "";
}

function openModal(columnId, taskObj) {
  taskModal.classList.remove("hidden");

  if (taskObj) {
    modalTitle.textContent = "Edit Task";
    editingTaskId.value = String(taskObj.id);
    currentColumn.value = taskObj.columnId;
    taskTitleInput.value = taskObj.title;
    taskDescriptionInput.value = taskObj.description;
    taskPriorityInput.value = taskObj.priority;
    taskDueDateInput.value = taskObj.dueDate;
  } else {
    modalTitle.textContent = "Add New Task";
    editingTaskId.value = "";
    currentColumn.value = columnId;
    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
    taskPriorityInput.value = "medium";
    taskDueDateInput.value = "";
  }

  taskTitleInput.focus();
}

function closeModal() {
  taskModal.classList.add("hidden");
  clearModalFields();
}

/* required function */
function createTaskCard(taskObj) {
  const card = document.createElement("li");
  card.classList.add("task-card");
  card.setAttribute("data-id", String(taskObj.id));
  card.setAttribute("data-priority", taskObj.priority);

  const title = document.createElement("h3");
  title.classList.add("task-title");
  title.textContent = taskObj.title;

  const description = document.createElement("p");
  description.classList.add("task-description");
  description.textContent = taskObj.description ? taskObj.description : "No description";

  const meta = document.createElement("div");
  meta.classList.add("task-meta");

  const badge = document.createElement("span");
  badge.classList.add("priority-badge");
  badge.classList.add("priority-" + taskObj.priority);
  badge.textContent = getPriorityText(taskObj.priority);

  const dueDate = document.createElement("span");
  dueDate.classList.add("task-date");

  if (taskObj.dueDate) {
    dueDate.textContent = "Due: " + taskObj.dueDate;
  } else {
    dueDate.textContent = "Due: -";
  }

  meta.appendChild(badge);
  meta.appendChild(dueDate);

  const actions = document.createElement("div");
  actions.classList.add("task-actions");

  const editButton = document.createElement("button");
    editButton.classList.add("edit-btn");
    editButton.setAttribute("type", "button");
    editButton.setAttribute("data-action", "edit");
    editButton.setAttribute("data-id", String(taskObj.id));
    editButton.textContent = "Edit";

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("data-action", "delete");
    deleteButton.setAttribute("data-id", String(taskObj.id));
    deleteButton.textContent = "Delete";

  actions.appendChild(editButton);
  actions.appendChild(deleteButton);

  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(meta);
  card.appendChild(actions);

  return card;
}

/* required function */
function addTask(columnId, taskObj) {
  const taskData = {
    id: nextTaskId,
    title: taskObj.title,
    description: taskObj.description,
    priority: taskObj.priority,
    dueDate: taskObj.dueDate,
    columnId: columnId
  };

  nextTaskId += 1;
  tasks.push(taskData);

  const list = getListByColumn(columnId);
  const card = createTaskCard(taskData);
  list.appendChild(card);

  updateTaskCounter();
  applyPriorityFilter();
}

/* required function */
function deleteTask(taskId) {
  const card = document.querySelector('.task-card[data-id="' + String(taskId) + '"]');

  if (!card) {
    const latestIndex = tasks.findIndex(function (task) {
      return task.id === taskId;
    });

    if (latestIndex !== -1) {
      tasks.splice(latestIndex, 1);
      updateTaskCounter();
      applyPriorityFilter();
    }

    return;
  }

  card.classList.add("fade-out");

  card.addEventListener(
    "animationend",
    function () {
      card.remove();

      const latestIndex = tasks.findIndex(function (task) {
        return task.id === taskId;
      });

      if (latestIndex !== -1) {
        tasks.splice(latestIndex, 1);
      }

      updateTaskCounter();
      applyPriorityFilter();
    },
    { once: true }
  );
}

/* required function */
function editTask(taskId) {
  const taskObj = findTaskById(taskId);

  if (!taskObj) {
    return;
  }

  openModal(taskObj.columnId, taskObj);
}

/* required function */
function updateTask(taskId, updatedData) {
  const taskObj = findTaskById(taskId);

  if (!taskObj) {
    return;
  }

  if (updatedData.title !== undefined) {
    taskObj.title = updatedData.title;
  }

  if (updatedData.description !== undefined) {
    taskObj.description = updatedData.description;
  }

  if (updatedData.priority !== undefined) {
    taskObj.priority = updatedData.priority;
  }

  if (updatedData.dueDate !== undefined) {
    taskObj.dueDate = updatedData.dueDate;
  }

  if (updatedData.columnId !== undefined) {
    taskObj.columnId = updatedData.columnId;
  }

  const oldCard = document.querySelector('.task-card[data-id="' + String(taskId) + '"]');
  const newCard = createTaskCard(taskObj);

  if (oldCard) {
    if (oldCard.parentElement === getListByColumn(taskObj.columnId)) {
      oldCard.replaceWith(newCard);
    } else {
      oldCard.remove();
      getListByColumn(taskObj.columnId).appendChild(newCard);
    }
  } else {
    getListByColumn(taskObj.columnId).appendChild(newCard);
  }

  updateTaskCounter();
  applyPriorityFilter();
}

function saveTaskFromModal() {
  const titleValue = taskTitleInput.value.trim();
  const descriptionValue = taskDescriptionInput.value.trim();
  const priorityValue = taskPriorityInput.value;
  const dueDateValue = taskDueDateInput.value;
  const editIdValue = editingTaskId.value;

  if (titleValue === "") {
    alert("Please enter a task title.");
    taskTitleInput.focus();
    return;
  }

  if (editIdValue !== "") {
    updateTask(parseInt(editIdValue, 10), {
      title: titleValue,
      description: descriptionValue,
      priority: priorityValue,
      dueDate: dueDateValue,
      columnId: currentColumn.value
    });
  } else {
    addTask(currentColumn.value, {
      title: titleValue,
      description: descriptionValue,
      priority: priorityValue,
      dueDate: dueDateValue
    });
  }

  closeModal();
}

function startInlineTitleEdit(titleElement) {
  const card = titleElement.closest(".task-card");
  const taskId = parseInt(card.getAttribute("data-id"), 10);
  const oldTitle = titleElement.textContent;

  const input = document.createElement("input");
  input.classList.add("inline-edit-input");
  input.setAttribute("type", "text");
  input.value = oldTitle;

  titleElement.replaceWith(input);
  input.focus();
  input.select();

  let finished = false;

  function finishEdit(shouldSave) {
    if (finished) {
      return;
    }

    finished = true;

    if (shouldSave) {
      const newTitle = input.value.trim();

      if (newTitle !== "") {
        updateTask(taskId, { title: newTitle });
        return;
      }
    }

    const newTitleElement = document.createElement("h3");
    newTitleElement.classList.add("task-title");
    newTitleElement.textContent = oldTitle;
    input.replaceWith(newTitleElement);
  }

  input.addEventListener("blur", function () {
    finishEdit(true);
  });

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      finishEdit(true);
    }

    if (event.key === "Escape") {
      event.preventDefault();
      finishEdit(false);
    }
  });
}

function clearDoneTasks() {
  const doneTasks = tasks.filter(function (task) {
    return task.columnId === "done";
  });

  doneTasks.forEach(function (task, index) {
    setTimeout(function () {
      deleteTask(task.id);
    }, index * 180);
  });
}

/* add task buttons */
addTaskButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const columnId = button.getAttribute("data-column");
    openModal(columnId, null);
  });
});

/* save and cancel */
saveTaskBtn.addEventListener("click", saveTaskFromModal);

cancelTaskBtn.addEventListener("click", function () {
  closeModal();
});

taskModal.addEventListener("click", function (event) {
  if (event.target === taskModal) {
    closeModal();
  }
});

/* filter */
filterPriority.addEventListener("change", function () {
  applyPriorityFilter();
});

/* clear done */
clearDoneBtn.addEventListener("click", function () {
  clearDoneTasks();
});

/* event delegation for edit/delete */
columnLists.forEach(function (list) {
  list.addEventListener("click", function (event) {
    const actionButton = event.target.closest("button[data-action]");

    if (!actionButton) {
      return;
    }

    const card = actionButton.closest(".task-card");

    if (!card) {
      return;
    }

    const taskId = parseInt(card.getAttribute("data-id"), 10);
    const action = actionButton.getAttribute("data-action");

    if (action === "edit") {
      editTask(taskId);
    }

    if (action === "delete") {
      deleteTask(taskId);
    }
  });

  list.addEventListener("dblclick", function (event) {
    const titleElement = event.target.closest(".task-title");

    if (!titleElement) {
      return;
    }

    startInlineTitleEdit(titleElement);
  });
});

/* first load */
updateTaskCounter();
applyPriorityFilter();