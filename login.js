
var isLoginView = true;

function toggleAuth() {
    var nameRow = document.getElementById('nameRow');
    var submitbtn = document.getElementById('submitBtn');
    var toggleText = document.getElementById('toggleText');
    var toggleBtn = document.getElementById('toggleBtn');

    if (isLoginView) {
        nameRow.style.display = 'none';
        submitbtn.innerText = 'Log In';
        submitbtn.setAttribute('onclick', 'LogIn()');
        toggleText.innerText = "Don't have an account?";
        toggleBtn.innerText = "Create Account";
        isLoginView = false;
    }
    else {
        nameRow.style.display = 'block';
        submitbtn.innerText = 'Create Account';
        submitbtn.setAttribute('onclick', 'signup()');
        toggleText.innerText = "Already have an account?";
        toggleBtn.innerText = "Log In";
        isLoginView = true;
    }
}

function LogIn() {

    var passwordInput = document.getElementById('password');
    var emailInput = document.getElementById('email');
    var password = passwordInput.value;
    var email = emailInput.value;
    if (password.trim() === "" || email.trim() === "") {
        validationAlert()
        return
    }
    var showDashboard;
    var users = JSON.parse(localStorage.getItem('postly_users')) || [];
    var userfound = null;
    for (var i = 0; i < users.length; i++) {
        if (users[i].password === password && users[i].email === email) {

            userfound = users[i]
            showDashboard = true
            
            break
        }

    }
    if (userfound) {
        localStorage.setItem('userName', userfound.name)
        localStorage.setItem('isloggedin', 'true')
        welcomeBack();
        setTimeout(function () {
            if(showDashboard){
                 window.location.href = "index.html";
            }
           
        }, 1000)

    }
    else {
        loginFailed()
    }





}

function signup() {
    var name = document.getElementById('fullname').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    if (name.trim() === "" || password.trim() === "" || email.trim() === "") {
        validationAlert()
        return;
    }

    var users = JSON.parse(localStorage.getItem('postly_users')) || [];
    var exists = false;
    for (var i = 0; i < users.length; i++) {
        if (users[i].email === email) {
            exists = true;
            break

        }
    }
    if (exists) {
        Swal.fire("Error", "Email already exists!", "warning");
        return;
    }
    else {

        users.push({
            name: name,
            email: email,
            password: password
        });

        localStorage.setItem('postly_users', JSON.stringify(users))

        Swal.fire({
            icon: 'success',
            title: 'Account Created!',
            text: 'You can now log in.',
            background: '#1e293b',
            color: '#fff'
        });

        toggleAuth();
    }
}
function validationAlert() {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'All fields are required!',
        background: '#1e293b',
        color: '#fff'
    });
}
function welcomeBack() {
    Swal.fire({
        title: 'Welcome Back!',
        text: "Redirecting...",
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
        background: '#1e293b',
        color: '#fff'
    });
}
function loginFailed() {
    Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid email or password.',
        background: '#1e293b',
        color: '#fff'
    });
}