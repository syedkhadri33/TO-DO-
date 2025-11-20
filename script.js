document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  const emptyImage = document.querySelector(".empty-image");
  const progress = document.getElementById("progress");
  const progressNumbers = document.getElementById("numbers");

  function toggleEmptyState() {
    emptyImage.style.display = taskList.children.length === 0 ? "block" : "none";
  }

  function updateProgress(checkCompletion = true) {
    const totalTasks = taskList.children.length;
    const completedTasks = taskList.querySelectorAll(".checkbox:checked").length;

    const percentage = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    progress.style.width = `${percentage}%`;
    progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;

    if (checkCompletion && totalTasks > 0 && completedTasks === totalTasks) {
      Confetti();
    }
  }

  function saveTaskToLocalStorage() {
    const tasks = Array.from(taskList.querySelectorAll("li")).map((li) => ({
      text: li.querySelector("span").textContent,
      completed: li.querySelector(".checkbox").checked,
    }));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasksFromLocalStorage() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(({ text, completed }) => addTask(text, completed, false));
    toggleEmptyState();
    updateProgress(false);
  }

  function addTask(text, completed = false, checkCompletion = true) {
    const taskText = text || taskInput.value.trim();
    if (!taskText) return;

    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${completed ? "checked" : ""}/>
      <span>${taskText}</span>
      <div class="task-buttons">
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    const checkbox = li.querySelector(".checkbox");
    const editBtn = li.querySelector(".edit-btn");
    const deleteBtn = li.querySelector(".delete-btn");

    if (completed) li.classList.add("completed");

    checkbox.addEventListener("change", () => {
      li.classList.toggle("completed", checkbox.checked);
      updateProgress();
      saveTaskToLocalStorage();
    });

    editBtn.addEventListener("click", () => {
      if (!checkbox.checked) {
        const newText = prompt("Edit task:", li.querySelector("span").textContent);
        if (newText && newText.trim() !== "") {
          li.querySelector("span").textContent = newText.trim();
          saveTaskToLocalStorage();
        }
      }
    });

    deleteBtn.addEventListener("click", () => {
      li.remove();
      toggleEmptyState();
      updateProgress();
      saveTaskToLocalStorage();
    });

    taskList.appendChild(li);
    taskInput.value = "";
    toggleEmptyState();
    updateProgress(checkCompletion);
    saveTaskToLocalStorage();
  }

  addTaskBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addTask();
  });

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTask();
    }
  });

  loadTasksFromLocalStorage();
});

function Confetti() {
  confetti({
    spread: 360,
    ticks: 200,
    gravity: 1,
    decay: 0.94,
    startVelocity: 30,
    particleCount: 100,
    scalar: 2,
  });
}
