const switchThemeBtn = document.querySelector("[toggle-btn]");
const body = document.querySelector("body");
const header = document.querySelector(".header");

const todoForm = document.querySelector("[data-form]");
const todoInput = document.querySelector("[data-input]");
const todoList = document.querySelector("[data-todo-list]");
const tabList = document.querySelectorAll("[data-tab]");
const todoListCount = document.querySelector("[data-count]");
const todoClearComplete = document.querySelector("[data-clear]");
let theme;
switchThemeBtn.addEventListener("click", () => {
  body.classList.toggle("dark-theme");
  switchThemeBtn.classList.toggle("dark-theme");
  header.classList.toggle("dark-theme");

  if (switchThemeBtn.classList.contains("dark-theme")) {
    theme = "dark-theme";
  } else {
    theme = "light-theme";
  }
  localStorage.setItem("theme", JSON.stringify(theme));
});

let getTheme = JSON.parse(localStorage.getItem("theme"));
if (getTheme === "dark-theme") {
  body.classList.add(getTheme);
  switchThemeBtn.classList.add(getTheme);
  header.classList.add(getTheme);
} else {
  body.classList.remove(getTheme);
  switchThemeBtn.classList.remove(getTheme);
  header.classList.remove(getTheme);
}

let todoStorage = JSON.parse(localStorage.getItem("todoStorage")) || [];
let currentTab = "all";

function addTodo(e) {
  e.preventDefault();
  let inputValue = todoInput.value;

  if (!inputValue) return;

  const randomNumber = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

  let todo = {
    todoValue: inputValue,
    completed: false,
    id: randomNumber,
  };

  if (todo.id >= 0) {
    todoStorage.push(todo);
    localStorage.setItem("todoStorage", JSON.stringify(todoStorage));
  }

  console.log(todoStorage);
  displayTodos();

  todoInput.value = "";
}
displayTodos();

function displayTodos(currentTab = "all") {
  todoList.innerHTML = "";
  countItems();

  todoStorage.length === 0 ? emptyList() : checkActiveAndCompletedList();

  todoStorage.forEach((todo) => {
    if (currentTab === "all") renderList(todo);
    if (currentTab === "completed" && todo.completed) renderList(todo);
    if (currentTab === "active" && !todo.completed) renderList(todo);
  });
}

function renderList(todo) {
  let documentFragment = new DocumentFragment();

  const todoItem = document.createElement("li");
  todoItem.className = "todo__list--item";
  todoItem.setAttribute("id", `${todo.id}`);
  todoItem.setAttribute("data-todo-item", `${todo.completed ? "completed" : "active"}`);

  const checkBox = document.createElement("input");
  checkBox.setAttribute("type", "checkbox");
  checkBox.setAttribute("name", "todo");
  checkBox.setAttribute("id", `item-${todo.id}`);
  checkBox.setAttribute("data-index", `${todo.id}`);
  todo.completed ? (checkBox.checked = true) : (checkBox.checked = false);

  const label = document.createElement("label");
  label.setAttribute("for", `item-${todo.id}`);
  label.innerHTML = todo.todoValue;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = ` <img src="./images/icon-cross.svg" alt="" /> `;

  todoItem.appendChild(checkBox);
  todoItem.appendChild(label);
  todoItem.appendChild(deleteBtn);
  documentFragment.appendChild(todoItem);
  todoList.appendChild(documentFragment);

  checkBox.addEventListener("click", (e) => checkBoxToggle(e));
  deleteBtn.addEventListener("click", (e) => removeTodo(e));
}

// render while lists are empty
function emptyList() {
  todoList.innerHTML = `

    <li class="todo__list--item empty">
            <img src="./images/checklist.png" width="40px" height="100%" alt="" />
            <span>${currentTab === "completed" ? "Complete your TODO List" : "Enter your TODO list"}</span>
    </li>

`;
}

function checkActiveAndCompletedList() {
  let activeList = 0;
  let completedList = 0;

  todoStorage.forEach((todo) => (todo.completed ? completedList++ : activeList++));

  if (activeList === 0 && currentTab === "active") {
    emptyList();
  }
  if (completedList === 0 && currentTab === "completed") {
    emptyList();
  }
}

function countItems() {
  let activeTodo = 0;

  todoStorage.forEach((todo) => (!todo.completed ? activeTodo++ : null));
  todoListCount.textContent = activeTodo;
}

function removeTodo(e) {
  const target = e.target;
  const parent = target.closest("[data-todo-item]");
  let indexValue = parent.getAttribute("id");

  let clickedItemIndex = todoStorage.findIndex((item) => item.id === Number(indexValue));
  todoStorage.splice(clickedItemIndex, 1);

  localStorage.setItem("todoStorage", JSON.stringify(todoStorage));
  console.log(todoStorage);
  displayTodos(currentTab);
}

function checkBoxToggle(e) {
  const target = e.target;

  let indexValue = target.getAttribute("data-index");

  // find the clicked item in the array
  let clickedItemIndex = todoStorage.findIndex((item) => item.id === Number(indexValue));

  // toggle the check box to true and false
  todoStorage[clickedItemIndex].completed = !todoStorage[clickedItemIndex].completed;

  // push the completed item to the -1 index of the array
  const item = todoStorage.splice(clickedItemIndex, 1);
  todoStorage.push(...item);
  localStorage.setItem("todoStorage", JSON.stringify(todoStorage));

  countItems();
  console.log(todoStorage);
}

function clearAllComplete() {
  const filtered = todoStorage.filter((item) => !item.completed);
  todoStorage = filtered;

  localStorage.setItem("todoStorage", JSON.stringify(todoStorage));

  displayTodos(currentTab);
}

todoForm.addEventListener("submit", (e) => addTodo(e));

todoClearComplete.addEventListener("click", clearAllComplete);

tabList.forEach((tab) => {
  tab.addEventListener("click", (e) => {
    const target = e.target;
    const tabValue = target.getAttribute("data-tab");
    currentTab = tabValue;
    displayTodos(tabValue);
  });
});
