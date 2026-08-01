if (localStorage.getItem("currentUser")) {
    location.href = "Main.html";
}

let form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;

    if (email === "") {
        alert("Please enter your email!");
        return;
    }

    if (password === "") {
        alert("Please enter your password!");
        return;
    }

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        alert("Invalid email address!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.length === 0) {
        alert("No account found. Please sign up first!");
        return;
    }

    let user = users.find(
        user => user.email === email && user.password === password
    );

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        alert("Login successful!");
        location.href = "Main.html";
    } else {
        alert("Email or password is incorrect!");
    }
});