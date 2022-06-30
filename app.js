let todoArr = [
    {
        content: "今天刷牙",
        isDone: true
    },
    {
        content: "運動",
        isDone: false
    },
    {
        content: "洗澡",
        isDone: false
    },
];


// axios.post(
//     "https://fathomless-brushlands-42339.herokuapp.com/todo7",todoArr
//     )
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

// axios.delete("https://fathomless-brushlands-42339.herokuapp.com/todo7")
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });


//主畫面渲染
function renderTodoList(arr){
    let todoListHTML = "";
    let todoNum = 0;
    
    //todo 列表
    const todoList = document.querySelector(".todoList");
    //顯示剩餘todo數量div
    const todoListNum = document.querySelector('.todoList-num');

    if (todoArr.length===0) {
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

        //遍歷所有todo obj
        arr.forEach((item, index) => {
            let checkedClass="";
            let checked="";
            if(item.isDone){
                //if isDone is true, add deleteLine
                checkedClass = 'todo-deleteLine text-black-50';
                checked = 'checked';
    
                // add index to data-num for deleting todos
                todoListHTML+=`
                <li data-num="${index}" class="d-flex">
                <div class="flex-grow-1 flex-v-center border-bottom">
                    <label class="styled-checkbox  ${checkedClass}">
                    <input type="checkbox"  ${checked}>
                    <span></span>
                    ${item.content}
                    </label>
                </div>
    
                <div class="flex-all-center p-3">
                  <i class="todoClear fa-solid fa-trash-can"></i>
                </div>
                </li>
                `;
            } else {
                todoNum++;
                todoListHTML+=`
                <li data-num="${index}" class="d-flex">
                <div class="flex-grow-1 flex-v-center border-bottom">
                    <label class="styled-checkbox  ${checkedClass}">
                    <input type="checkbox"  ${checked}>
                    <span></span>
                    ${item.content}
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
todoSelector.addEventListener("click",function(e) {

    //todo選單ele
    const todoSelectorItemArr = document.querySelectorAll(".todoSelector-item");

    activeClass = "border-dark"

    //先清空active狀態
    todoSelectorItemArr.forEach(item=>{
        if (item.classList.contains(activeClass)){
            item.classList.remove(activeClass)
        }
      }
    );
    e.target.classList.add(activeClass);
    
    let todoCate=e.target.getAttribute("data-cate")

    if (todoCate==='todo') {

        let filteredArr = todoArr.filter(item => item.isDone==false)
        renderTodoList(filteredArr)

    } else if(todoCate==='done'){

        let filteredArr = todoArr.filter(item => item.isDone==true)
        renderTodoList(filteredArr)

    } else {
        renderTodoList(todoArr) 
    }

})


//初始化
renderTodoList(todoArr)


//todo新增功能
const todoAdd = document.querySelector('.button-addTodo');
todoAdd.addEventListener("click", function(e){
    
    const newTodo = document.querySelector('.text-addTodo');
    if (newTodo.value!=="") {
        todoObj = {
            content: newTodo.value,
            isDone: false,
        }
        
        todoArr.push(todoObj)
        renderTodoList(todoArr)
    }
})



//todo勾選功能與刪除
let TodoItem = document.querySelector('.todoList');
TodoItem.addEventListener("click", function(e){
       let currentTarget = e.target;
       console.log(currentTarget.nodeName)


       if (currentTarget.nodeName==='INPUT') {
        let index = currentTarget.closest('li').getAttribute('data-num') 
        if (currentTarget.checked===true) {
            
            todoArr[index].isDone=true;
            renderTodoList(todoArr)
        } else {
            todoArr[index].isDone=false;
            renderTodoList(todoArr) 
        }
       } else if (
        currentTarget.nodeName==='I' && getComputedStyle(currentTarget).visibility==="visible"
        ) {
            let index = currentTarget.parentElement.parentElement.getAttribute('data-num')
            todoArr.splice(index,1)
            renderTodoList(todoArr) 
       }
})

//清除個別todo
let todoClear = document.querySelector('.todo-allClear');

//清除已完成todo
let clearDoneTodo = document.querySelector('.todo-allClear');
clearDoneTodo.addEventListener("click", function(e){
   todoArr = todoArr.filter(item=>item.isDone===false)
   renderTodoList(todoArr)
})


 


