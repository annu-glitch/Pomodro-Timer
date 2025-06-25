// Clear tasks if the date is not today
function clearOldTasks() {
    const storedDate = localStorage.getItem("taskDate");
    const today = new Date().toLocaleDateString();
  
    if (storedDate !== today) {
      localStorage.setItem("tasks", JSON.stringify([]));
      localStorage.setItem("taskDate", today);
    }
  }
  
  // Add task
  function addTask() {
    clearOldTasks();
  
    const name = document.getElementById("taskName").value.trim();
    const time = document.getElementById("taskTime").value.trim();
  
    if (!name || !time) return;
  
    const task = {
      name,
      time: parseInt(time),
      date: new Date().toLocaleDateString()
    };
  
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  
    document.getElementById("taskName").value = '';
    document.getElementById("taskTime").value = '';
    renderTaskList();
  }
  
  // Display today's task list on index.html
  function renderTaskList() {
    const taskList = document.getElementById("taskList");
    if (!taskList) return;
  
    clearOldTasks();
    taskList.innerHTML = "";
  
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
    tasks.forEach(task => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${task.name} (${task.time} min)</span>
        <button onclick="startTask('${task.name}', ${task.time})">Start</button>
      `;
      taskList.appendChild(li);
    });
  }
  
  // When a task is chosen
  function startTask(name, time) {
    localStorage.setItem("taskName", name);
    localStorage.setItem("taskTime", time);
    window.location.href = "timer.html";
  }
  
  // Show today’s tasks on timer.html
  function showTodayTasksOnTimerPage() {
    const list = document.getElementById("todayTasksList");
    if (!list) return;
  
    clearOldTasks();
    list.innerHTML = "";
  
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
    tasks.forEach(task => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${task.name} (${task.time} min)</span>
        <button onclick="selectTask('${task.name}', ${task.time})">Start</button>
      `;
      list.appendChild(li);
    });
  }
  
  // Select task from timer.html list
  function selectTask(name, time) {
    localStorage.setItem("taskName", name);
    localStorage.setItem("taskTime", time);
    location.reload();
  }
  
  // Countdown logic
  let countdownInterval;
  let secondsLeft = 0;
  
  function startCountdown() {
    const timerSection = document.getElementById("timerSection");
    timerSection.style.display = "block";
  
    const name = localStorage.getItem("taskName");
    const time = parseInt(localStorage.getItem("taskTime"));
    document.getElementById("taskTitle").innerText = `🎯 ${name}`;
  
    if (secondsLeft === 0) secondsLeft = time * 60;
    updateDisplay();
  
    countdownInterval = setInterval(() => {
      if (secondsLeft > 0) {
        secondsLeft--;
        updateDisplay();
      } else {
        clearInterval(countdownInterval);
        document.getElementById("countdown").innerText = "⏰ Done!";
        document.getElementById("alarmSound").play();
      }
    }, 1000);
  }
  
  function updateDisplay() {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    document.getElementById("countdown").innerText =
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  function resetCountdown() {
    clearInterval(countdownInterval);
    secondsLeft = parseInt(localStorage.getItem("taskTime")) * 60;
    updateDisplay();
  }
  
  function goBack() {
    clearInterval(countdownInterval);
    window.location.href = "index.html";
  }
  
  // Init logic on page load
  window.onload = function () {
    clearOldTasks();
    renderTaskList();
    showTodayTasksOnTimerPage();
  
    const name = localStorage.getItem("taskName");
    const time = parseInt(localStorage.getItem("taskTime"));
  
    if (name && time && document.getElementById("timerSection")) {
      document.getElementById("taskTitle").innerText = `🎯 ${name}`;
      secondsLeft = time * 60;
      updateDisplay();
      document.getElementById("timerSection").style.display = "block";
    }
  };
  
