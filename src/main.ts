import './styles.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div class="video-wrapper">
    <video autoplay muted loop id="background-video">
        <source src="background.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
    <div class="container">
        <h1>TO-DO LIST</h1>
        <form>
            <input type="text" id="taskInput" placeholder="Enter a new task...">
            <label>
                Set deadline:
                <input type="datetime-local" id="deadline" class="datetime-picker" min="${new Date().toISOString().slice(0, 16)}" />
            </label>
            <button class="addbutton" id="addTaskButton">Add</button>
        </form>
        <ul id="taskList">
            <li></li>
        </ul>
    </div>
</div>
`

interface Task {
  id: number;
  description: string;
  completed: boolean;
  expired: boolean;
  deadline: string;
}

let tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
displayTasks();


document.querySelector("form")?.addEventListener("submit", e => {
  e.preventDefault();
});

function addTask(description: string, deadline: string): void {
  const task: Task = {
    id: new Date().getTime(),
    description,
    completed: false,
    expired: false,
    deadline,
  };
  tasks.push(task);
  displayTasks();
  saveTasks();
}

function removeTask(id: number): void {
  tasks = tasks.filter(task => task.id !== id); 
  displayTasks();
  saveTasks();
}

function toggleTask(id: number): void {
  const task = tasks.find(task => task.id === id);
  if (task) {
    task.completed = !task.completed;
    displayTasks();
    saveTasks();
  }
}


function saveTasks(): void {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function formatDateTime(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true 
  };

  const date = new Date(dateString);
  return date.toLocaleString('en-US', options);
}

function displayTasks(): void {
  const taskList = document.getElementById('taskList') as HTMLUListElement;
  taskList.innerHTML = '';

  const currentDate = new Date();

  tasks.sort((a, b) => {
    const aExpired = new Date(a.deadline) < currentDate; 
    const bExpired = new Date(b.deadline) < currentDate; // Check if task b is expired

    if (aExpired && !bExpired) {
        return -1; 
    }
    if (!aExpired && bExpired) {
        return 1; 
    }
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
 

  tasks.forEach(task => {
    const taskDeadline = new Date(task.deadline);
    if (currentDate >= taskDeadline) { 
      task.expired = true; 
    } else {
      task.expired = false; 
    }

    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.className = 'checkbox';
    checkbox.onclick = () => toggleTask(task.id);
    
    const description = document.createElement('span');
    description.className = 'task-description';
    description.textContent = task.description;
    description.style.color = task.completed ? 'rgb(202, 121, 0)' : 'black';

    const deadline = document.createElement('span');
    deadline.className = 'task-deadline';
    deadline.textContent = formatDateTime(task.deadline);
    deadline.style.color = task.completed ? 'rgb(202, 121, 0)' : 'black';

   
    const annotation = document.createElement('span');
    annotation.className = 'task-annotation';

    if (task.completed) {
      annotation.textContent = 'done'; 
      annotation.style.color = 'green';
    } else if (task.expired) {
      annotation.textContent = 'past due';
      annotation.style.color = 'red'; 
    } else {
      annotation.textContent = 'not started';
      annotation.style.color = 'black'; 
    }


    const removeButton = document.createElement('button');
    removeButton.textContent = 'x';
    removeButton.onclick = () => removeTask(task.id);

    li.appendChild(checkbox);
    li.appendChild(description);
    li.appendChild(deadline);
    li.appendChild(annotation);
    li.appendChild(removeButton);
    taskList.appendChild(li);
  });
  
}

document.getElementById('addTaskButton')?.addEventListener('click', () => {
  const taskInput = document.getElementById('taskInput') as HTMLInputElement;
  const taskDescription = taskInput.value.trim();
  const deadlineInput = document.getElementById('deadline') as HTMLInputElement;
  const deadline = deadlineInput.value;

  if (taskDescription && deadline) {
    addTask(taskDescription, deadline);
    taskInput.value = '';
    deadlineInput.value = '';
  } else {
    alert('Please enter a task and deadline!');
  }
});



