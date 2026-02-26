// Firebase Config (သင့် Project အချက်အလက်များ အစားထိုးရန်)
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

// API Settings
const API_KEY = 'Ce467a7dee5e4c9cb6017a1a5b0753c3';

async function fetchMatches() {
    try {
        const res = await fetch('https://api.football-data.org/v4/matches', {
            headers: { 'X-Auth-Token': API_KEY }
        });
        const data = await res.json();
        let html = "";
        
        data.matches.slice(0, 10).forEach(m => {
            // Odds တွက်ချက်မှု (API ကမပေးရင် Random ဖြင့်ပြပေးခြင်း)
            const homeOdd = (Math.random() * (3.5 - 1.2) + 1.2).toFixed(2);
            const drawOdd = (Math.random() * (4.0 - 2.5) + 2.5).toFixed(2);
            const awayOdd = (Math.random() * (5.0 - 1.5) + 1.5).toFixed(2);

            html += `
                <div class="match-card">
                    <div class="match-header">
                        <span> ${m.competition.name}</span>
                        <span class="live-status">${m.status}</span>
                    </div>
                    <div class="teams-container">
                        <div class="team">
                            <img src="https://crests.football-data.org/${m.homeTeam.id}.png" onerror="this.src='https://via.placeholder.com/40'" alt="logo">
                            <p>${m.homeTeam.shortName}</p>
                        </div>
                        <div class="vs">VS</div>
                        <div class="team">
                            <img src="https://crests.football-data.org/${m.awayTeam.id}.png" onerror="this.src='https://via.placeholder.com/40'" alt="logo">
                            <p>${m.awayTeam.shortName}</p>
                        </div>
                    </div>
                    <div class="odds-row">
                        <div class="odd-box">1 <span>${homeOdd}</span></div>
                        <div class="odd-box">X <span>${drawOdd}</span></div>
                        <div class="odd-box">2 <span>${awayOdd}</span></div>
                    </div>
                </div>
            `;
        });
        document.getElementById('apiMatchContainer').innerHTML = html;
    } catch (e) {
        document.getElementById('apiMatchContainer').innerHTML = "<p style='color:gray;'>ပွဲစဉ်များ ခေတ္တပိတ်ထားပါသည် (API Limit)</p>";
    }
}

fetchMatches();

// Admin Login & Post Logic (အရင်အတိုင်းထားပါ)
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

database.ref('posts').on('value', (snap) => {
    const cont = document.getElementById('postContainer');
    cont.innerHTML = "";
    snap.forEach(child => {
        const val = child.val();
        cont.innerHTML += `
            <div class="post-card">
                <h3 style="margin-top:0; color:#d32f2f">${val.title}</h3>
                <p>${val.content}</p>
                <div class="sub-info">Posted at: ${val.time}</div>
            </div>
        `;
    });
});
