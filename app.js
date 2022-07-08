
// let pageToggle = false;

let domainUrl = "https://todoo.5xcamp.us"
let token = sessionStorage["token"]
let header = {
  headers: {
    Authorization: token
  }
}

let todoArr;

//將本地todo arr 更新為伺服器版本
async function fetchTodo() {
  let apiUrl = `${domainUrl}/todos`
  try {
    const res = await axios.get(apiUrl, header)
    todoArr = res.data['todos'];
    console.log('fetch successfully')
  } catch (error) {
  }
}


//刪除已完成todo
async function deleteAllDoneTodo() {
  try {
    let doneTodoArr =  todoArr.filter(item=>item.completed_at!==null)
    await axios.all(
      doneTodoArr.map(item => {
        let apiUrl = `${domainUrl}/todos/${item.id}`;
        return axios.delete(apiUrl,header)
      })
    )
    await fetchTodo();
    await renderTodoList();
    console.log('delete all successfully')
  } catch (error) {
    console.log(error)
  }
}



async function addTodo(obj) {
  try{
    await axios.post(
      domainUrl + "/todos", obj, header
    )
    await fetchTodo();
    await renderTodoList();
  } catch (error) {
    console.log(error)
  }
}


async function deleteTodo(id, ifRender = true) {
  try{
      await axios.delete(domainUrl + `/todos/${id}`, header)
      await fetchTodo();
     if (ifRender) {
       await renderTodoList();
     }
  } catch (error) {
    console.log(error)
  }
}

// toggle todo completion
async function patchTodo(id) {
  try{
    await axios.patch(`${domainUrl}/todos/${id}/toggle`, {}, header)
    await fetchTodo();
    await renderTodoList();
  } catch (error) {
    console.log(error)
  }
}



/////////////////////////////////////Main Todo Render/////////////////////////////////////
async function renderTodoList() {


  let todoListHTML = "";
  let todoNum = 0;
  let nickname = sessionStorage["nickname"]


  let activeCate = document.querySelector(".todoSelector-item.border-dark").getAttribute('data-cate')

  const noTodo = document.querySelector('.noTodo');
  const todoTotal = document.querySelector('.todoTotal');
  noTodo.classList.add("d-none");
  todoTotal.classList.add("d-none");

  const nickDiv = document.querySelector("#nickname")
  nickDiv.textContent = `${nickname}的代辦`


  //todo 列表
  const todoList = document.querySelector(".todoList");
  //顯示剩餘todo數量div
  const todoListNum = document.querySelector(".todoList-num");


  

  //本地矩陣為空先fetch
  if(todoArr===undefined){
   
    await fetchTodo();
  
  } else if (todoArr.length===0) {
   
    //todoarr是空的 則開啟無todo預設頁面
    noTodo.classList.remove("d-none");
    todoTotal.classList.add("d-none");

  } else {

      //反之開始渲染
      const noTodo = document.querySelector(".noTodo");
      const todoTotal = document.querySelector(".todoTotal");
      noTodo.classList.add("d-none");
      todoTotal.classList.remove("d-none");


      if (activeCate === "todo") {
        filteredTodoArr = todoArr.filter(item => item.completed_at === null);
      } else if (activeCate === "done") {
        filteredTodoArr = todoArr.filter(item => item.completed_at !== null);
      } else filteredTodoArr = todoArr

      //遍歷所有todo obj 生成html
      filteredTodoArr.forEach(ele => {
        let checkedClass = "";
        let checked = "";
        let { content, id, completed_at } = ele
        if (completed_at) {
          //if isDone is true, add deleteLine
          checkedClass = "todo-deleteLine text-black-50";
          checked = "checked";

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
  });

  e.target.classList.add(activeClass);

  let todoCate = e.target.getAttribute("data-cate")

  if (todoCate === 'todo') {
    renderTodoList()
  } else if (todoCate === 'done') {
    renderTodoList()
  } else {
    renderTodoList()
  }

})


//初始化
// if there is no token, go to login page
if(sessionStorage['token']===undefined){
  window.location.href="login.html";
} else {


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
      newTodo.value = ""
    }
  })


  //todo勾選功能
  let TodoItem = document.querySelector('.todoList');
  TodoItem.addEventListener("click", function (e) {
    let currentTarget = e.target;


    if (currentTarget.nodeName === 'INPUT') {
      let id = currentTarget.closest('li').getAttribute('data-num')
      patchTodo(id);
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


  //登出
  let logout = document.querySelector("#logout");
  logout.addEventListener("click", async function (e) {
    
    await axios.delete(`${domainUrl}/users/sign_out`, header)
      window.location.href="login.html";
      sessionStorage.removeItem('token');

  })
}
