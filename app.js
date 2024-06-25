const API_URL = "https://api.github.com/users/";

const main = document.getElementById("main");
const searchBox = document.getElementById("search");
const moon = document.querySelector("#moon");
const sun = document.querySelector("#sun");
const title = document.querySelector(".title");
const themeText = document.querySelector(".theme-text");



// Call onsubmit 

const formSubmit = (e) => {
    const getUser = async (username) => {
        try {
            const response = await fetch(API_URL + username);
            if (!response.ok) {
                throw new Error(response.status);
            }
            const data = await response.json();
            const card = `
            <div class="card">
                <div>
                    <img src="${data.avatar_url}" alt="image" class="avatar">
                </div>
                <div class="user-info">
                    <h2>${data.name}</h2>
                    <p>${data.bio}</p>
    
                    <ul class="info">
                        <li>${data.followers}<strong>Followers</strong></li>
                        <li>${data.following}<strong>Following</strong></li>
                        <li>${data.public_repos}<strong>Repos</strong></li>
                    </ul>
    
                    <div id="repo"></div>
                </div>
            </div>
            `;
            main.innerHTML = card;
            getRepos(username);
        } catch (error) {
            console.log(error);
            if (error.message == 404) {
                createErrorCard('No profile with this Username');
            } else {
                createErrorCard('Something went wrong');
            }
        }
    };
    getUser("fabpot");

const getRepos = async (username) => {
    try {
        const repos = document.getElementById("repo");
        const response = await fetch(API_URL + username + "/repos");
        if (!response.ok) {
            throw new Error(response.status);
        }
        const data = await response.json();
        data.map((item) => {
            const elem = document.createElement("a");
            elem.classList.add("repo");
            elem.href = item.html_url;
            elem.innerText = item.name;
            elem.target = "_blank";
            repos.appendChild(elem);
        });
    } catch (error) {
        createErrorCard('No repos found for this user');
    }
};

    e.preventDefault();
    if (searchBox.value != "") {
        getUser(searchBox.value);
        searchBox.value = "";
    }
};


document.querySelector("form").addEventListener("submit", formSubmit);

searchBox.addEventListener("focusout", () => {
    formSubmit({ preventDefault: () => {} });
});

const createErrorCard = (msg) => {
    const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `;
    main.innerHTML = cardHTML;
};

// Change background
const flipTheme = (theme) => {
    if (theme === "dark") {
        moon.style.display = "none";
        sun.style.display = "block";
        document.body.style.backgroundColor = "var(--dark)";
    } else {
        moon.style.display = "block";
        sun.style.display = "none";
        document.body.style.backgroundColor = "var(--white)";
    }

    title.classList.toggle("dark");
    themeText.classList.toggle("dark");
    searchBox.classList.toggle("dark");
    document.querySelectorAll(".card").forEach((card) => card.classList.toggle("dark"));
};

moon.addEventListener("click", () => flipTheme("dark"));
sun.addEventListener("click", () => flipTheme("light"));
