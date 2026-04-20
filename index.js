// This runs the moment the page starts loading
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}
var currentUserName = localStorage.getItem('userName') || "Guest";
var posts = document.getElementById('posts');
var title = document.getElementById('title');
var description = document.getElementById('description');
var SelectedImgSrc = "";
var myStyle = "";
var selectedTextColor = "#000000";
var isEditing = false;
var editIndex = null;
var selectedFont = "Segoe UI"; 
var selectedSize = "18px";

function changeFont(fontPicker) {
    selectedFont = fontPicker.value;
    title.style.fontFamily = selectedFont;
}

function changeSize(sizePicker) {
    selectedSize = sizePicker.value; 
    title.style.fontSize = selectedSize;
    description.style.fontSize = selectedSize;
}

var userIcon = document.getElementById("userIcon");
if (userIcon) {
    userIcon.innerText = currentUserName.charAt(0).toUpperCase();
}

window.onload = loadPosts;

function applybg(img) {
    SelectedImgSrc = img.getAttribute('src');
    var bgimgs = document.getElementsByClassName('bgimg');
    for (var i = 0; i < bgimgs.length; i++) {
        bgimgs[i].classList.remove('selected');
    }
    img.classList.add('selected');
    myStyle = `background-image: url(${SelectedImgSrc}); background-repeat: no-repeat; background-size: cover; background-position: top;`;
}

function applycolor(element) {
    var colorbox = document.getElementsByClassName('colorbox');
    for (var i = 0; i < colorbox.length; i++) {
        colorbox[i].classList.remove('selected');
    }
    element.classList.add('selected');
    selectedTextColor = element.style.backgroundColor;
    title.style.color = selectedTextColor;
    description.style.color = selectedTextColor;
}

function post() {
    var allPosts = JSON.parse(localStorage.getItem('allPosts')) || [];

    if (title.value.trim() === "" || description.value.trim() === "") {
        Swal.fire({ title: 'Error!', text: 'Fill all fields', icon: 'error' });
        return;
    }

    var newPost = {
        title: title.value,
        description: description.value,
        image: SelectedImgSrc,
        color: selectedTextColor,
        author: currentUserName,
        font: selectedFont,
        fontSize: selectedSize
    };

    if (isEditing === true && editIndex !== null) {
        allPosts.splice(editIndex, 1, newPost);
        isEditing = false;
        editIndex = null;
    } else {
        allPosts.push(newPost);
    }

    localStorage.setItem("allPosts", JSON.stringify(allPosts));
    loadPosts();
    resetInputs();
}

function resetInputs() {
    title.value = "";
    description.value = "";
    title.style.cssText = "";
    description.style.cssText = "";
    myStyle = "";
    SelectedImgSrc = "";
    selectedTextColor = "#000000";
    selectedFont = "Segoe UI";
    selectedSize = "18px";
    
    var bgimgs = document.getElementsByClassName('bgimg');
    for (var i = 0; i < bgimgs.length; i++) {
        bgimgs[i].classList.remove('selected');
    }
    var colorbox = document.getElementsByClassName('colorbox');
    for (var i = 0; i < colorbox.length; i++) {
        colorbox[i].classList.remove('selected');
    }
}

function deletePost(index) {
    var allPosts = JSON.parse(localStorage.getItem('allPosts')) || [];
    allPosts.splice(index, 1);
    localStorage.setItem("allPosts", JSON.stringify(allPosts));
    loadPosts();
}

function previewPost() {
    if (!title.value.trim() && !description.value.trim()) {
        Swal.fire({ icon: 'error', title: 'Empty!', text: 'Write something to preview!' });
        return;
    }
    
    Swal.fire({
        title: 'Post Preview',
        html: `
        <div class="card text-start">
            <div class="card-body" style="${myStyle} min-height: 200px; font-family: ${selectedFont};">
                <h3 style="color: ${selectedTextColor}; font-size: ${selectedSize}; font-weight: bold;">${title.value}</h3>
                <p style="color: ${selectedTextColor}; font-size: ${selectedSize};">${description.value}</p>
            </div>
        </div>`,
        confirmButtonText: 'Looks Good!',
        width: '600px'
    });
}

function editPost(index) {
    var allPosts = JSON.parse(localStorage.getItem("allPosts")) || [];
    var item = allPosts[index];

    if (!item) return;

    title.value = item.title;
    description.value = item.description;
    selectedFont = item.font || "Segoe UI";
    selectedSize = item.fontSize || "18px";
    selectedTextColor = item.color || "#000000";
    SelectedImgSrc = item.image || "";

    title.style.fontFamily = selectedFont;
    title.style.fontSize = selectedSize;
    title.style.color = selectedTextColor;
    description.style.fontFamily = selectedFont;
    description.style.fontSize = selectedSize;
    description.style.color = selectedTextColor;

    if (document.getElementById('fontPicker')) document.getElementById('fontPicker').value = selectedFont;
    if (document.getElementById('sizePicker')) document.getElementById('sizePicker').value = selectedSize;

    myStyle = SelectedImgSrc ? `background-image: url(${SelectedImgSrc}); background-size: cover;` : "";
    editIndex = index;
    isEditing = true;
}

function loadPosts() {
    var postsContainer = document.getElementById('posts');
    var allPosts = JSON.parse(localStorage.getItem('allPosts')) || [];
    postsContainer.innerHTML = "";

    for (var i = allPosts.length - 1; i >= 0; i--) {
        var item = allPosts[i];
        var itemFont = item.font || "Segoe UI";
        var itemSize = item.fontSize || "18px";
        var itemBg = item.image ? `background-image: url(${item.image}); background-size: cover;` : "background-color: transparent;";

        postsContainer.innerHTML += `
            <div class="card mb-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span style="text-transform:capitalize;">Posted by: ${item.author}</span>
                    <div class="ms-auto">
                        <button onclick="deletePost(${i})" style="background: none; border: none; cursor: pointer;" class="me-2">
                            <img src="assets/trash-bin.png" style="width: 26px;">
                        </button>
                        <button onclick="editPost(${i})" style="background: none; border: none; cursor: pointer;">
                            <img src="assets/pencil.png" style="width: 19px;">
                        </button>
                    </div>
                </div>
                <div class="card-body px-4 py-4" style="${itemBg} min-height: 200px; font-family: ${itemFont};">
                    <h3 style="color: ${item.color} !important; font-size: ${itemSize} !important; font-weight: bold;">${item.title}</h3>
                    <p style="color: ${item.color};">${item.description}</p>
                </div>
            </div>`;
    }
}

function logOut() {
    Swal.fire({
        title: 'Logout?',
        text: "You will need to login again to post.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#22d3ee',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Yes, Logout'
    }).then(function (result) {
        if (result.isConfirmed) {
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'login.html';
        }
    });
}