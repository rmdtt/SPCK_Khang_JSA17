if (localStorage.getItem("currentUser")) {
    location.href = "Main.html";
}

let form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let username = document.getElementById("username").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    let lowerCaseLetter = /[a-z]/g;
    let upperCaseLetter = /[A-Z]/g;
    let numbers = /[0-9]/g;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (username.length < 6) {
        alert("Username must be at least 6 characters");
        return;
    }

    if (!emailRegex.test(email)) {
        alert("Invalid email address!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let existedUsername = users.find(user => user.username === username);

    if (existedUsername) {
        alert("Username already exists!");
        return;
    }

    let existedEmail = users.find(user => user.email === email);

    if (existedEmail) {
        alert("Email already exists!");
        return;
    }

    if (password.length < 8) {
        alert("Password must be at least 8 characters");
        return;
    }

    if (!password.match(lowerCaseLetter)) {
        alert("Password must contain a lowercase letter");
        return;
    }

    if (!password.match(upperCaseLetter)) {
        alert("Password must contain an uppercase letter");
        return;
    }

    if (!password.match(numbers)) {
        alert("Password must contain at least one number");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    users.push({
        username,
        email,
        password,
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("User created successfully, please login");
    location.href = "Login.html";
}
);