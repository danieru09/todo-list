function addTask() {
    const input = document.getElementById('personal-input');
    const list = document.getElementById('personal-list');
    if (input.value.trim() !== "") {
        const li = document.createElement("li");
        li.textContent = input.value;
        li.onclick = function() { moveTask(this, 'work-list'); };
        list.appendChild(li);
        input.value = "";
    }
}

function moveTask(item, targetListId) {
    if (targetListId === 'work-list') {
        item.onclick = function() { moveTask(this, 'other-list'); };
    } else if (targetListId === 'other-list') {
        item.onclick = null; // No more moves after "Done"
        item.style.textDecoration = "line-through";

        // Add X button if not already present
        if (!item.querySelector('button')) {
            const delBtn = document.createElement('button');
            delBtn.textContent = '✖';
            delBtn.onclick = function(e) {
                e.stopPropagation(); // Prevent li click
                item.parentElement.removeChild(item);
            };
            item.appendChild(delBtn);
        }
    }
    document.getElementById(targetListId).appendChild(item);
}

function addDoneTask(taskText) {
    const doneList = document.getElementById('other-list');
    const li = document.createElement('li');
    li.textContent = taskText;

    // Create the X button
    const delBtn = document.createElement('button');
    delBtn.textContent = '✖';
    delBtn.onclick = function() {
        doneList.removeChild(li);
    };

    li.appendChild(delBtn);
    doneList.appendChild(li);
}

// Example usage: addDoneTask('Sample done task');
