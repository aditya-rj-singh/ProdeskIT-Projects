const searchBtn = document.getElementById("searchBtn");
const usernameInput = document.getElementById("username");
const profile = document.getElementById("profile");
const loading = document.getElementById("loading");


searchBtn.addEventListener("click", getUser);

async function getUser() {
    console.log(usernameInput);
    const username = usernameInput.value.trim();

    if (username === "") {
        profile.innerHTML = "<p class= 'error'>Please Enter Username</p>";
        return;
    }

    loading.textContent = "Loading...";
    profile.innerHTML = "";

    try {

        const response = await fetch(
            `https://api.github.com/users/${username}`
        );

        if (!response.ok) {
            throw new Error("User Not Found");
        }

        const data = await response.json();

        console.log(data);

        profile.innerHTML = `
    <div class="card">
        <img src="${data.avatar_url}" alt="avatar">

        <h2>${data.name || "No name"}</h2>
        <p>${data.bio || "No Bio Available"}</p>
        <p> joined: ${data.created_at}</p>

        <a href="${data.blog}" target="_blank">Portfolio</a>

    </div> 
    `;
    }

    catch (error) {
        profile.innerHTML = `
        <p class= "error">
        User Not Found</p>`;
    }

    finally {
        loading.textContent = ""
    }
}