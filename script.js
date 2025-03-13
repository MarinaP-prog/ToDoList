const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");
const selectAllCheckboxes = document.getElementById("select-all");
const deleteBtn = document.getElementById("delete-task");

const taskData = JSON.parse(localStorage.getItem('data'))|| []; // store all the data in the local storage, 
let currentTask = {}; // to track the state when editing and discarding tasks

// if there is a task with spec char, remove them
const removeSpecialChars =(string)=>{
  return string.replace(/[^a-zA-Z0-9 ]/g, "");
  }
const addOrUpdateTask = () => {
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
  const taskObj = {
    id: `${Date.now()}`,
    date: dateInput.value,
    description: removeSpecialChars(descriptionInput.value),
  };
  // add object if not exists
  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } else {
    taskData[dataArrIndex] = taskObj; // save changes after editing
  }

  localStorage.setItem("data", JSON.stringify(taskData)); // save tasks to localstorage when user adds, updates or removes tasks
  updateTaskContainer();
};

const updateTaskContainer = () => {
  // prevent task from duplicate
  tasksContainer.innerHTML = "";

  // create element
  taskData.forEach(({ id, date, description }) => {
    let taskRow = document.createElement("div");
    taskRow.classList.add("task");

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("checkboxes");
    checkbox.id = `select-one-${id}`;

    // event listener for checkbox change
    checkbox.addEventListener("change", updateDeleteButtonVisibility);

    // date
    const dateSpan = document.createElement("span");
    dateSpan.classList.add("task-date");
    dateSpan.textContent = date ? date : "No date provided";

    // description
    const descSpan = document.createElement("span");
    descSpan.classList.add("task-desc");
    descSpan.textContent = description ? description : "No description";

    // add elements
    taskRow.appendChild(checkbox);
    taskRow.appendChild(dateSpan);
    taskRow.appendChild(descSpan);

    // add element to the DOM
    tasksContainer.appendChild(taskRow);
    // Kliknutí na wrapper otevře editTask
    taskRow.addEventListener("click", (event) => {
      if (event.target !== checkbox) {
      editTask(id);
      // new Event( editTask(event));
      console.log("dyn el");
      }
    });
  });
};

// show delete btn
const updateDeleteButtonVisibility = () => {
  const checkboxes = document.querySelectorAll(".checkboxes");
  const anyChecked = Array.from(checkboxes).some(
    (checkbox) => checkbox.checked
  );
  deleteBtn.classList.toggle("hidden", !anyChecked);
};

// select/deselect all
selectAllCheckboxes.addEventListener("change", function () {
  let checkboxes = document.querySelectorAll(".checkboxes");
  checkboxes.forEach(function (checkbox) {
    checkbox.checked = this.checked;
  }, this);
  updateDeleteButtonVisibility();
});

// delete task
const deleteTask = () => {
  const checkboxes = document.querySelectorAll(".checkboxes:checked");

  if (checkboxes.length === 0) return; // if nothing checked do not do

  checkboxes.forEach((checkbox) => {
    const taskRow = checkbox.closest(".task"); //find closest div with task
    const taskId = checkbox.id.replace("select-one-", ""); // retrive task ID

    // delete task from DOM
    if (taskRow) taskRow.remove();

    // delete task from `taskData` via ID
    const taskIndex = taskData.findIndex((task) => task.id == taskId);
    if (taskIndex !== -1) {
      taskData.splice(taskIndex, 1);
    }

    const remainingCheckboxes = document.querySelectorAll(".chceckboxes");
    if (remainingCheckboxes.length === 0) {
      document.getElementById("select-all").checked = false; // checked/unchecked checkbox
    }
  });

  // hide Delete btn, if checkboxes does not checked
  updateDeleteButtonVisibility();

  // remove deleted tasks from localstorage
  localStorage.setItem("data", JSON.stringify(taskData))

};

// edit task

const editTask = (taskId) => {
  // const taskId = document.getElementById("select-one-", ""); // retrive task ID
  console.log("taskd " + taskId);

  // find task ID
  const taskIndex = taskData.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    console.log("Task not found");
    return;
  }
  currentTask = taskData[taskIndex]; // keep trak of edited task
  console.log("currenttask " + currentTask);
  console.log("taskindex " + taskIndex);
  // stage for editing inside input fields
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;

  // display the form modal with the values
  taskForm.classList.toggle("hidden");
  openTaskFormBtn.classList.toggle("hidden");
};

const reset = () => {
  dateInput.value = "";
  descriptionInput.value = "";
  taskForm.classList.toggle("hidden");
  openTaskFormBtn.classList.toggle("hidden");

  currentTask = {};
};
// show data if there are any

if (taskData.length) {
  updateTaskContainer();
}

openTaskFormBtn.addEventListener("click", () => {
  taskForm.classList.toggle("hidden");
  openTaskFormBtn.classList.toggle("hidden");
});

// display Modal
closeTaskFormBtn.addEventListener("click", () => {
  const formInputsContainValues = dateInput.value || descriptionInput.value; // if there is a text in the inputs, display modal with cancel/discard

  // edit task, but decides to close, don't show modal

  const formInputValuesUpdated = dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;

  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    reset();
  }
});

// close Modal

cancelBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
});

// discard Modal

discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset();
});

// get the values from inputs

taskForm.addEventListener("submit", (e) => {
  e.preventDefault(); // stops the browser from refreshing the page after the submitting form
  addOrUpdateTask();
  reset();
});




