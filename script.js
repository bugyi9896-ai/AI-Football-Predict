// 1. Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyC3jAPr4ULvoksmIpn2D77TzeWQjDG7Cac",
    authDomain: "aifootballpro.firebaseapp.com",
    databaseURL: "https://aifootballpro-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "aifootballpro",
    storageBucket: "aifootballpro.firebasestorage.app",
    messagingSenderId: "101709577836",
    appId: "1:101709577836:web:0fdfc2190196d38e3aa249"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 2. Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

// 3. Admin & Post Logic
function handleLogin() {
    let pass = prompt("Password:");
    if (pass === "admin123") {
        document.getElementById('adminBtn').style.display = "inline-block";
        alert("Welcome Admin!");
    }
}

function toggleAdminPanel() {
    const p = document.getElementById('adminPanel');
    p.style.display = p.style.display === "none" ? "block" : "none";
}

function uploadPost() {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    if (title && content) {
        database.ref('posts').push().set({
            title: title,
            content: content,
            time: new Date().toLocaleTimeString()
        });
        alert("Posted!");
        document.getElementById('postTitle').value = "";
        document.getElementById('postContent').value = "";
    }
}

// 4. Real-time Database Listener
database.ref('posts').on('value', (snap) => {
    const cont = document.getElementById('postContainer');
    cont.innerHTML = "";
    snap.forEach(child => {
        const val = child.val();
        cont.innerHTML += `
            <div class="post-card">
                <h3 style="margin-top:0; color:var(--primary)">${val.title}</h3>
                <p>${val.content}</p>
                <div class="sub-info">Posted at: ${val.time}</div>
            </div>
        `;
    });
});

// 5. API Match Fetching
async function fetchMatches() {
    try {
        const res = await fetch('https://api.football-data.org/v4/matches', {
            headers: { 'X-Auth-Token': 'Ce467a7dee5e4c9cb6017a1a5b0753c3' }
        });
        const data = await res.json();
        let html = "";
        data.matches.slice(0, 8).forEach(m => {
            html += `
                <div class="match-card">
                    <div style="flex:1"><b>${m.homeTeam.shortName}</b> vs <b>${m.awayTeam.shortName}</b></div>
                    <div style="color:var(--primary); font-weight:bold">${m.status}</div>
                </div>
            `;
        });
        document.getElementById('apiMatchContainer').innerHTML = html;
    } catch (e) {
        document.getElementById('apiMatchContainer').innerHTML = "API limit ပြည့်သွားပါပြီ (သို့) Error တက်နေပါသည်။";
    }
}

fetchMatches();





















































































