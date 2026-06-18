const searchBtn = document.getElementById("searchBtn");
const usernameInput = document.getElementById("username");
const profile = document.getElementById("profile");
const loading = document.getElementById("loading");
const repository = document.getElementById("repos");
const repoHeading = document.getElementById("repoHeading");


searchBtn.addEventListener("click", getUser);


function formatDate(dateString){
    return new Date(dateString).toLocaleDateString(
        "en-GB",{ day: "numeric", month: "short", year: "numeric"}
    );
}

async function getUser() {
    console.log(usernameInput);
    const username = usernameInput.value.trim();

    if (username === "") {
        profile.innerHTML = "<p class= 'error'>Please Enter Username</p>";
        repoHeading.style.display = "none";
        repository.innerHTML="";

        return;
    }

    loading.textContent = "Loading...";
    repoHeading.style.display = "none";
    profile.innerHTML = "";

    try {

        const response = await fetch(
            `https://api.github.com/users/${username}`
        );

        if (!response.ok) {
            throw new Error("User Not Found");
        }

        const data = await response.json();
        const repourl = await fetch(data.repos_url);
        const repos = await repourl.json();

        const latestrepo = repos
        .sort(
            (a,b)=>
                new Date(b.updated_at) - new Date(a.updated_at)
        )
        .slice(0,5);

        console.log(repos);
        console.log(data);

        profile.innerHTML = `
    <div class="card">
        <img src="${data.avatar_url}" alt="avatar">

        <h2>${data.name || "No name"}</h2>
        <p>${data.bio || "No Bio Available"}</p>
        <p> Joined: ${formatDate(data.created_at)}</p>

        ${data.blog ? `<a href ="${data,blog}" target="_blank">Portfolio</a>`
        : `<p>No Portfolio</p>` }

    </div> 
    `;

        repoHeading.style.display = "block";

    repository.innerHTML = latestrepo
    .map(
        (repo)=>`
        <div style="margin-top: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
        <a href = ${repo.html_url} target="_blank"> ${repo.name} </a>
        </div>`
    )
    .join("");
    }

    catch(error){
        console.error(error);
        repoHeading.style.display = "none";
        repository.innerHTML="";
        profile.innerHTML=`<p class= "error"> User Not Found</p>`;
    }

    finally{
        loading.textContent=""
    }

}