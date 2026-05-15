const API_URL = "http://127.0.0.1:5000/tasks";


// FETCH TASKS
async function fetchTasks() {

    const response = await fetch(API_URL);

    const tasks = await response.json();

    const taskList =
        document.getElementById("taskList");

    const searchValue =
        document.getElementById("search")
        .value.toLowerCase();

    const filterStatus =
        document.getElementById("filterStatus")
        .value;

    taskList.innerHTML = "";

    let completedTasks = 0;

    const filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.title.toLowerCase()
            .includes(searchValue);

        const matchesFilter =
            filterStatus === "All" ||
            task.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    filteredTasks.forEach(task => {

        if (task.status === "Completed") {
            completedTasks++;
        }

        taskList.innerHTML += `

        <div class="col-md-4">

            <div class="card shadow p-3 mb-4">

                <h4>${task.title}</h4>

                <p>${task.description}</p>

                <p>
                    <strong>Status:</strong>
                    ${task.status}
                </p>

                <p>
                    <strong>Due:</strong>
                    ${task.dueDate}
                </p>

                <div class="d-flex gap-2">

                    <button class="btn btn-success w-100"
                        onclick="markCompleted('${task._id}')">

                        Completed

                    </button>

                    <button class="btn btn-warning w-100"
                        onclick="markInProgress('${task._id}')">

                        In Progress

                    </button>

                    <button class="btn btn-danger w-100"
                        onclick="deleteTask('${task._id}')">

                        Delete

                    </button>

                </div>

            </div>

        </div>
        `;
    });

    // Progress Calculation
    const progress =
        filteredTasks.length > 0
        ? (completedTasks / filteredTasks.length) * 100
        : 0;

    const progressBar =
        document.getElementById("progressBar");

    progressBar.style.width =
        `${progress}%`;

    progressBar.innerText =
        `${Math.round(progress)}%`;
}


// ADD TASK
async function addTask() {

    const title =
        document.getElementById("title").value;

    const description =
        document.getElementById("description").value;

    const status =
        document.getElementById("status").value;

    const dueDate =
        document.getElementById("dueDate").value;

    await fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title,
            description,
            status,
            dueDate
        })
    });

    // Clear form
    document.getElementById("title").value = "";

    document.getElementById("description").value = "";

    fetchTasks();
}


// DELETE TASK
async function deleteTask(id) {

    await fetch(`${API_URL}/${id}`, {

        method: "DELETE"
    });

    fetchTasks();
}


// MARK COMPLETED
async function markCompleted(id) {

    const response =
        await fetch(API_URL);

    const tasks =
        await response.json();

    const task =
        tasks.find(t => t._id === id);

    await fetch(`${API_URL}/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            title: task.title,
            description: task.description,
            status: "Completed",
            dueDate: task.dueDate
        })
    });

    fetchTasks();
}


// MARK IN PROGRESS
async function markInProgress(id) {

    const response =
        await fetch(API_URL);

    const tasks =
        await response.json();

    const task =
        tasks.find(t => t._id === id);

    await fetch(`${API_URL}/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            title: task.title,
            description: task.description,
            status: "In Progress",
            dueDate: task.dueDate
        })
    });

    fetchTasks();
}


// LOAD TASKS
fetchTasks();