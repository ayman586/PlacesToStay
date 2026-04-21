"use strict";
async function search() {
    const locationInput = document.getElementById("locationInput");
    const location = locationInput.value.trim();
    if (!location) {
        alert("Please enter a location");
        return;
    }
    console.log("Searching:", location);
    const res = await fetch(`http://localhost:3000/accommodation?location=${encodeURIComponent(location)}`);
    const data = await res.json();
    console.log("Results:", data);
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
    if (!data || data.length === 0) {
        resultsDiv.innerHTML = "<p>No accommodation found</p>";
        return;
    }
    data.forEach((item) => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
      <h3>🏨 ${item.name}</h3>
      <p><b>Type:</b> ${item.type}</p>
      <p><b>Location:</b> ${item.location}</p>
      <p>${item.description || ""}</p>

      <button class="book-btn" onclick="book(${item.ID})">
        Book Now
      </button>
    `;
        resultsDiv.appendChild(div);
    });
}
async function book(accID) {
    try {
        const res = await fetch("http://localhost:3000/accommodation/book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accID: accID,
                npeople: 1,
                thedate: 260630,
                apiID: "0x574144"
            })
        });
        const data = await res.json();
        alert(data.message || data.error);
    }
    catch (err) {
        alert("Booking failed");
    }
}
window.search = search;
window.book = book;
