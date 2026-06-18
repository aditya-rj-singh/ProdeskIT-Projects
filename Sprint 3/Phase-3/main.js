const searchBtn = document.getElementById("searchBtn");
const usernameInput = document.getElementById("username");
const profile = document.getElementById("profile");
const loading = document.getElementById("loading");
const repository = document.getElementById("repos");
const batttlebtn = document.getElementById("battlebtn");
const username2 = document.getElementById("username2");
let battleMode = false;

searchBtn.addEventListener("click", getUser);

// helper function for username
async function getUserData(username) {
    const response = await fetch(
        `https://api.github.com/users/${username}`
    );
    if (!response.ok) {
        throw new Error("User Not Found");
    }
    const data = await response.json();
    const repourl = await fetch(data.repos_url);
    const repos = await repourl.json();

    return {
        data, repos
    };
}

// helper func. for stars
function calcstars(repos){
    return repos.reduce((total, repo) => total + repo.stargazers_count, 0);
}

// date format
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString(
        "en-GB", { day: "numeric", month: "short", year: "numeric" }
    );
}

// battle toggle button
batttlebtn.addEventListener("click", () => {
    battleMode = !battleMode;

    if (battleMode) {
        batttlebtn.textContent = "ON";
        batttlebtn.className = "bg-green-500 text-white px-4 py-2 rounded-lg";
        username2.classList.remove("hidden");
    }
    else {
        batttlebtn.textContent = "OFF";
        batttlebtn.className = "bg-slate-200 px-4 py-2 rounded-lg";
        username2.classList.add("hidden");
    }
});

// Profile card reusable function
function createprofilecard(user, repos) {
    const latestrepo = repos.sort(
            (a, b) =>new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 5);

    return `
    <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow w-full">
        <img src="${user.avatar_url}" alt="avatar" class="w-28 h-28 rounded-full mx-auto mb-4 border border-slate-300 ">
    <h2 class="text-xl font-bold text-center">
        ${user.name || user.login} 
    </h2>
    <p class="text-center text-slate-600 mt-2">
        ${user.bio || "No Bio Available"}
    </p>
    <p class="text-center text-sm mt-2">
        Joined: ${formatDate(user.created_at)}
    </p>
    ${user.blog ? `<a href ="${user.blog}" target="_blank" class="text-black hover:text-red-500 text-center mt-4">Portfolio</a>`
            : `<p class="text-center mt-4">No Portfolio</p>`}

    <div class="mt-4">
        <h3 class="font-semibold mb-2">Latest Repositories</h3>

    ${latestrepo
    .map(
        (repos)=>`
            <div class="bg-white border border-slate-200 rounded-lg p-4 hover:shadow transition" >
                <a href= "${repos.html_url}" target="_blank" class="text-black hover:text-red-500 font-medium"> ${repos.name} </a>
            </div> `)
    .join("")}
    </div>
    `;
}

// core logic
async function getUser() {
    const username = usernameInput.value.trim();
    const usernametwo = username2.value.trim();

    if (username === "") {
        profile.innerHTML = "<p class= 'error'>Please Enter Username</p>";
        repository.innerHTML = "";

        return;
    }

    loading.textContent = "Loading...";
    repository.innerHTML = "";
    profile.innerHTML = "";

    try {

        if (battleMode) {
            if (usernametwo === "") {
                profile.innerHTML = "<p class='error'>Please Enter Second username</p>";
                loading.textContent="";
                return;
            }
            const [player1, player2] = await Promise.all([getUserData(username), getUserData(usernametwo)]);
            const stars1 = calcstars(player1.repos);
            const stars2 = calcstars(player2.repos);
            const draw = stars1 === stars2;
            const p1wins = stars1 > stars2;

            profile.innerHTML = `
            <div class="flex flex-col md:flex-row gap-4 items-start">
                <div class="flex-1 w-full">
                    <div class="text-center mb-2 font-bold ${draw ? 'text-yellow-400' : p1wins ? 'text-green-500' : 'text-red-500'}">
                        ${draw ? '🤝Draw' : p1wins ? 'Winner' : 'Loser'} ･ ${stars1}&#x2605
                    </div>
                    <div class="border-2 rounded-xl ${draw ? 'border-yellow-400' : p1wins ? 'border-green-400' : 'border-red-400'}">
                    ${createprofilecard(player1.data, player1.repos)}
                    </div>
                </div>
                <div class="flex items-center justify-center text-2xl font-black text-slate-400 py-2 md:py-0 md:self-center">
                VS
                </div>
                <div class="flex-1 w-full">
                    <div class="text-center mb-2 font-bold ${draw ? 'text-yellow-400' : p1wins ? 'text-red-500' : 'text-green-500'}">
                        ${draw ? '🤝Draw' : p1wins ? 'Loser' : 'Winner'} ･ ${stars2}&#x2605
                    </div>
                    <div class="border-2 rounded-xl ${draw ? 'border-yellow-400' : p1wins ? 'border-red-400' : 'border-green-400'}">
                    ${createprofilecard(player2.data, player2.repos)}
                    </div>
                </div>
            </div>`;    
                return;
            }
        const {data, repos} = await getUserData(username);
        profile.innerHTML = createprofilecard(data,repos);     
    }
    catch (error) {
        console.error(error);
        repository.innerHTML = "";
        profile.innerHTML = `<p class= "error"> User Not Found</p>`;
    }
    finally {
        loading.textContent = ""
    }
}