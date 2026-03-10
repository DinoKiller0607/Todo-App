const todoForm = $("form");
const todoInput = $("#todo-input");
const todoListUL = $("#todo-list");
let allTodos = getTodos();
updateTodoList();
todoForm.on("submit", function (e) {
    e.preventDefault();
    addTodo();
});
function addTodo() {
    const todoText = todoInput.val().trim();
    if (todoText.length > 0) {
        const todoObject = {
            text: todoText,
            completed: false
        };
        allTodos.push(todoObject);
        updateTodoList();
        saveTodos();
        todoInput.val("");
    }
}
function updateTodoList() {
    todoListUL.empty();
    const sortedTodos = allTodos
        .map((todo, todoIndex) => ({ todo, todoIndex }))
        .sort((a, b) => Number(a.todo.completed) - Number(b.todo.completed));
    sortedTodos.forEach(({ todo, todoIndex }) => {
        const todoItem = createTodoItem(todo, todoIndex);
        todoListUL.append(todoItem);
    });
}
function createTodoItem(todo, todoIndex) {
    const todoId = "todo-" + todoIndex;

    const todoLI = $(`
        <li class="todo">
            <input type="checkbox" id="${todoId}">
            <label class="custom-checkbox" for="${todoId}">
                <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
            </label>
            <label for="${todoId}" class="todo-text">
                ${todo.text}
            </label>
            <button class="delete-button">
                <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
            </button>
        </li>
    `);
    todoLI.find(".delete-button").on("click", function () {
        deleteTodoItem(todoIndex);
    });
    todoLI.find("input")
        .prop("checked", todo.completed)
        .on("change", function () {
            allTodos[todoIndex].completed = $(this).is(":checked");
            saveTodos();
        });

    return todoLI;
}
function deleteTodoItem(todoIndex) {
    allTodos = allTodos.filter((_, i) => i !== todoIndex);
    saveTodos();
    updateTodoList();
}
function saveTodos() {
    const todosJson = JSON.stringify(allTodos);
    localStorage.setItem("todos", todosJson);
}
function getTodos() {
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}