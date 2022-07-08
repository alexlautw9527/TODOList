let domainUrl="https://todoo.5xcamp.us"


const loginFormData = document.querySelector('#signUpForm'); 


const email = loginFormData.querySelector("#inputEmail");
const nickname = loginFormData.querySelector("#inputNickname");
const passwordMain = loginFormData.querySelector("#inputPasswordMain");
const passwordCheck = loginFormData.querySelector("#inputPasswordCheck");

  
const signupBtn = document.querySelector('#signupBtn')
//不斷監聽input

let signupValidCheck = {
    isEmailValid:false,
    isNicknameNonEmpty: false,
    isPasswordMainNonEmpty: false,
    isPasswordCheckNonEmpty: false,
    isPasswordMainValid: false,
    isPasswordCheckValid: false
}

let emailFeedback = document.querySelector('#inputEmail.invalid-feedback')
let nicknameCheckFeedback = document.querySelector('#inputNickname.invalid-feedback')
let passwordMainFeedback = document.querySelector('#inputPasswordMain.invalid-feedback')
let passwordCheckFeedback = document.querySelector('#inputPasswordCheck.invalid-feedback')





email.addEventListener('input', function(e) {
    const emailValue = this.value;
    const emailRegex = /\S+@\S+\.\S+/;
    
    if(emailValue.length===0){
        this.classList.add("is-invalid");
        emailFeedback.textContent="不得為空白" 
    } else {
        if(!emailRegex.test(emailValue)){
            this.classList.add("is-invalid");
            emailFeedback.textContent="請輸入email格式"  
        } else {
            this.classList.remove("is-invalid"); 
            signupValidCheck['isEmailValid']=true;
        }
    }
    
})



passwordMain.addEventListener('input', function(e) {
    const passwordValue = this.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,30}$/;


    if(passwordValue.length==0){
        passwordMainFeedback.textContent="不得為空白"  
    } else {

        if(!passwordRegex.test(passwordValue)){
            this.classList.add("is-invalid");
            passwordMainFeedback.textContent="密碼需8-30位數，並包含一個大寫字母與小寫字母" 
        } else {
            this.classList.remove("is-invalid"); 
            signupValidCheck['isPasswordMainNonEmpty']=true;
            signupValidCheck['isPasswordMainValid']=true;
        }
    }

    
})

passwordCheck.addEventListener('input', function(e) {
    const passwordCheckValue = this.value;
    if(passwordCheckValue.length===0){
        this.classList.add("is-invalid");
        passwordCheckFeedback.textContent="不得為空白"  
    } else {
        
        if(passwordCheckValue!==passwordMain.value){
            this.classList.add("is-invalid");
            passwordCheckFeedback.textContent="需和密碼一致" 
        } else {
            this.classList.remove("is-invalid"); 
            signupValidCheck['isPasswordCheckNonEmpty']=true;
            signupValidCheck['isPasswordCheckValid']=true;
        }
    }
     
})

nickname.addEventListener('input', function(e) {
    const nicknameValue = this.value;
    if(nicknameValue.length > 12) {
        this.classList.add("is-invalid");
        nicknameCheckFeedback.textContent="暱稱需2個字以上、12個字以下"  
        
    } else if (nicknameValue.length>= 2) {
        this.classList.remove("is-invalid");
        signupValidCheck['isNicknameNonEmpty']=true; 
    } else if(nicknameValue.length > 0){
        this.classList.add("is-invalid");
        nicknameCheckFeedback.textContent="暱稱需2個字以上、12個字以下"  
    } else if(nicknameValue.length === 0){
        this.classList.add("is-invalid");
        nicknameCheckFeedback.textContent="不得為空白"  
    }
     
})

signupBtn.addEventListener('click', e=>{
    e.preventDefault();
    signupResult = document.querySelector('#signupResult')
    let isDone = Object.values(signupValidCheck).filter(item=>item===false).length===0

    if (isDone) {
        let signupObj = {
          "user": {
            "email": email.value,
            "nickname": nickname.value,
            "password": passwordMain.value
          }
        }

        axios.post(`${domainUrl}/users/`,signupObj) 
        .then(function (response) {
            signupResult.textContent = '註冊成功' 
        })
        .catch(function (error) {
            signupResult.textContent = '註冊失敗，可能是已註冊'
            signupResult.classList.add("fw-bold")
        });
    } else {
        signupResult.textContent = '請檢查輸入項目'
    }
})


