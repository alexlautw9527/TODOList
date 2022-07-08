let domainUrl="https://todoo.5xcamp.us"

const loginSubmit = document.querySelector('#loginSubmit'); 


let loginObj = {
    "user":{}
};

let res = {};

if(sessionStorage['token']){
  let header = {
    headers: {
      Authorization: sessionStorage['token']
    }
  }
  axios.post(`${domainUrl}/check`,header) 
       .then(function (response) {
        window.location.href="index.html";
       })
       .catch(function (error) {
        sessionStorage.removeItem('token');
       }); 
}

loginSubmit.addEventListener("click", function(e) {
    e.preventDefault();
    const formData = document.querySelector("#loginForm");
    
    //////
    // formData.querySelector('input[type="email"]').value = "ke0006123@gmail.com"
    // formData.querySelector('input[type="password"]').value = "123456"
    //////


    loginObj['user']['email'] = formData.querySelector('input[type="email"]').value
    loginObj['user']['password'] = formData.querySelector('input[type="password"]').value

    axios.post(`${domainUrl}/users/sign_in`,loginObj) 
       .then(function (response) {
          sessionStorage.setItem("token", response["headers"]["authorization"]);
          sessionStorage.setItem("nickname", response["data"]["nickname"]);
          window.location.href="index.html";
       })
       .catch(function (error) {
         document.querySelector('#loginResult').textContent = '登入失敗'
       });
})

