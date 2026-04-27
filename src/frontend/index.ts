import * as L from "leaflet";

const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement;
const locationInput = document.getElementById("location") as HTMLInputElement;
const resultsDiv = document.getElementById("results") as HTMLDivElement;

const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement;
const userInfo = document.getElementById("userInfo") as HTMLDivElement;

const map = L.map("map").setView([51.505, -0.09], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
}).addTo(map);

let markers: L.Marker[] = [];

loginBtn.addEventListener("click", async () => {

    const username = (document.getElementById("username") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.error);
    } else {
        loadUser();
    }
});

searchBtn.addEventListener("click", async () => {

    const location = locationInput.value;
    resultsDiv.innerHTML = "Searching...";

    try {
        const res = await fetch(`/accommodation?location=${location}`);
        const data = await res.json();

        if (data.length === 0) {
            resultsDiv.innerHTML = "No results found";
            return;
        }

        resultsDiv.innerHTML = "";

        markers.forEach(m => map.removeLayer(m));
        markers = [];

        data.forEach((item: any) => {

            const div = document.createElement("div");

            div.innerHTML = `
                <h3>${item.name}</h3>
                <p>${item.type}</p>
                <button>Book</button>
            `;

            div.querySelector("button")!.addEventListener("click", async () => {

                const res = await fetch("/book", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        accID: item.ID,
                        thedate: 260630,
                        npeople: 1,
                        apiID: "0x574144"
                    })
                });

                const result = await res.json();

                if (!res.ok) {
                    alert("Booking failed: " + result.error);
                } else {
                    alert("Booking successful!");
                }
            });

            const marker = L.marker([item.latitude, item.longitude])
                .addTo(map)
                .bindPopup(`<b>${item.name}</b><br>${item.type}`);

            markers.push(marker);

            resultsDiv.appendChild(div);
        });

        map.setView([data[0].latitude, data[0].longitude], 8);

    } catch {
        resultsDiv.innerHTML = "Error loading data";
    }
});

async function loadUser() {
    const res = await fetch("/auth/me");
    const data = await res.json();

    if (data.loggedIn) {
        userInfo.innerHTML = `Logged in as ${data.user}`;
    } else {
        userInfo.innerHTML = "";
    }
}

loadUser();