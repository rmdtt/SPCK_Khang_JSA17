if (localStorage.getItem("currentUser")) {
    location.href = "Main.html";
}

let form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find((item) => {
        return item.email === email && item.password === password;
    });

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));

        alert("Login successful!");

        location.href = "Main.html";
    } else {
        alert("Email or password is incorrect!");
    }
});