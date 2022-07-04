// let todoArr = [
//     {
//         content: "今天刷牙",
//         isDone: true
//     },
//     {
//         content: "運動",
//         isDone: false
//     },
//     {
//         content: "洗澡",
//         isDone: false
//     },
// ];


let domainUrl="https://alex-todo-server.herokuapp.com"



function deleteAllTodo() {

  //refresh todo
  axios.get(
    domainUrl+"/todos"
  )
    .then(function (response) {

      //get
      todoArr = response.data;
      todoArr.forEach(item => {
        let apiUrl = `/todos/${item.id}`;
        axios.delete(apiUrl)
          .then(function (response) {
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      console.log('deleted all todos');
    })
    .catch(function (error) {
      console.log(error);
    });
}



//重新渲染要做在CRUD的callback裡面
function addTodo(obj) {
  axios.post(
    domainUrl+"/todos", obj
  )
    .then(function (response) {
      console.log('post successfully');
      renderTodoList()
    })
    .catch(function (error) {
      console.log(error);
    });
}


function deleteTodo(id, ifRender=true) {
  axios.delete(domainUrl+`/todos/${id}`)
    .then(function (response) {
      console.log('delete successfully');
      if (ifRender){
        renderTodoList()
      }
    })
    .catch(function (error) {
      console.log(error);
    })
}

function deleteAllDoneTodo(){
  apiUrl = domainUrl+`/todos?isDone=true`
  doneTodoArr =[];
  axios.get(apiUrl)
    .then(function (response) {
      doneTodoArr = response.data;
      console.log(doneTodoArr);
      if (doneTodoArr.length===0) {
        return
      } else {
        doneTodoArr.forEach(item => {
          deleteTodo(item.id)
        })
        renderTodoList()
        
      }
    })
}


function putTodo(id, status) {
  let obj = {
    isDone: status
  }
  axios.patch(
    domainUrl+`/todos/${id}`, obj
  )
    .then(function (response) {
      console.log('mod successfully');
      renderTodoList()
    })
    .catch(function (error) {
      console.log(error);
    });
}




//主畫面渲染
function renderTodoList() {
  let todoListHTML = "";
  let todoNum = 0;
  let todoArr = [];
  let apiUrl = domainUrl+"/todos"

  let activeCate = document.querySelector(".todoSelector-item.border-dark").getAttribute('data-cate')

  const noTodo = document.querySelector('.noTodo');
  const todoTotal = document.querySelector('.todoTotal');
  noTodo.classList.add("d-none");
  todoTotal.classList.add("d-none");
  


  //todo 列表
  const todoList = document.querySelector(".todoList");
  //顯示剩餘todo數量div
  const todoListNum = document.querySelector('.todoList-num');
  axios.get(apiUrl)
    .then(function (response) {
      todoArr = response.data;
      console.log(todoArr);
      if (todoArr.length === 0) {

        //todoarr是空的 則開啟無todo預設頁面
        const noTodo = document.querySelector('.noTodo');
        const todoTotal = document.querySelector('.todoTotal');
        noTodo.classList.remove("d-none");
        todoTotal.classList.add("d-none");

      } else {

        //反之開始渲染
        const noTodo = document.querySelector('.noTodo');
        const todoTotal = document.querySelector('.todoTotal');
        noTodo.classList.add("d-none");
        todoTotal.classList.remove("d-none");

        if (activeCate==='todo') {
          todoArr = todoArr.filter(item => item.isDone===false);
        } else if (activeCate==='done'){
          todoArr = todoArr.filter(item => item.isDone===true); 
        }
        //遍歷所有todo obj
        todoArr.forEach((ele) => {
          let checkedClass = "";
          let checked = "";
          let { content, id, isDone } = ele
          if (isDone) {
            //if isDone is true, add deleteLine
            checkedClass = 'todo-deleteLine text-black-50';
            checked = 'checked';

            // add index to data-num for deleting todos
            todoListHTML += `
                    <li class="d-flex" data-num="${id}">
                    <div class="flex-grow-1 flex-v-center border-bottom">
                        <label class="styled-checkbox  ${checkedClass}">
                        <input type="checkbox"  ${checked}>
                        <span></span>
                        ${content}
                        </label>
                    </div>
        
                    <div class="flex-all-center p-3">
                      <i class="todoClear fa-solid fa-trash-can"></i>
                    </div>
                    </li>
                    `;
          } else {
            todoNum++;
            todoListHTML += `
                    <li class="d-flex" data-num="${id}">
                    <div class="flex-grow-1 flex-v-center border-bottom">
                        <label class="styled-checkbox  ${checkedClass}">
                        <input type="checkbox"  ${checked}>
                        <span></span>
                        ${content}
                        </label>
                    </div>
        
                    <div class="flex-all-center p-3">
                      <i class="todoClear fa-solid fa-trash-can"></i>
                    </div>
                    </li>
                    `;
          }
        })
        todoList.innerHTML = todoListHTML
        todoListNum.textContent = `${todoNum}個待完成事項`
      }
    })
    .catch(function (error) {
      console.log(error);
    });

}


//todo選單功能
const todoSelector = document.querySelector(".todoSelector");
todoSelector.addEventListener("click", function (e) {

  //todo選單ele
  const todoSelectorItemArr = document.querySelectorAll(".todoSelector-item");

  activeClass = "border-dark"

  //先清空active狀態
  todoSelectorItemArr.forEach(item => {
    if (item.classList.contains(activeClass)) {
      item.classList.remove(activeClass)
    }
  }
  );
  e.target.classList.add(activeClass);

  let todoCate = e.target.getAttribute("data-cate")

  if (todoCate === 'todo') {
    renderTodoList(false)

  } else if (todoCate === 'done') {
    renderTodoList(true)
  } else {
    renderTodoList()
  }

})


//初始化
renderTodoList()


//todo新增功能
const todoAdd = document.querySelector('.button-addTodo');
todoAdd.addEventListener("click", function (e) {

  const newTodo = document.querySelector('.text-addTodo');
  if (newTodo.value !== "") {
    todoObj = {
      content: newTodo.value,
      isDone: false,
    }

    addTodo(todoObj)
    newTodo.value=""
  }
})



//todo勾選功能
let TodoItem = document.querySelector('.todoList');
TodoItem.addEventListener("click", function (e) {
  let currentTarget = e.target;
  console.log(currentTarget.nodeName)


  if (currentTarget.nodeName === 'INPUT') {
    let id = currentTarget.closest('li').getAttribute('data-num')
    if (currentTarget.checked === true) {
      putTodo(id, true)
    } else {
      putTodo(id, false)
    }
  }
})

//todo單筆刪除
TodoItem.addEventListener("click", function (e) {
  let currentTarget = e.target;
  let condition = currentTarget.nodeName === 'I' && getComputedStyle(currentTarget).visibility === "visible";

  if (condition) {
    let id = currentTarget.parentElement.parentElement.getAttribute('data-num')
    deleteTodo(id)
  }
})



//清除個別todo
let todoClear = document.querySelector('.todo-allClear');

//清除已完成todo
let clearDoneTodo = document.querySelector('.todo-allClear');
clearDoneTodo.addEventListener("click", function (e) {
  deleteAllDoneTodo()
})





