function addTask() {
    const input = document.getElementById("taskInput");
    const task = input.value.trim();

    if (task === "") {
        alert("Please enter a task.");
        return;
    }

    const li = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = task;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => li.remove());

    li.append(label, deleteButton);
    document.getElementById("taskList").appendChild(li);
    input.value = "";
    input.focus();
}
