document.getElementById("searchBtn").addEventListener("click", async () => {

    const location = document.getElementById("location").value;
    const resultsDiv = document.getElementById("results");

    resultsDiv.innerHTML = "Searching...";

    try {
        const res = await fetch(`/accommodation?location=${location}`);
        const data = await res.json();

        if (data.length === 0) {
            resultsDiv.innerHTML = "No results found";
            return;
        }

        resultsDiv.innerHTML = "";

        data.forEach(item => {
            const div = document.createElement("div");

            div.innerHTML = `
                <h3>${item.name}</h3>
                <p>${item.type}</p>
                <button>Book</button>
            `;

            div.querySelector("button").addEventListener("click", async () => {

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

            resultsDiv.appendChild(div);
        });

    } catch (err) {
        resultsDiv.innerHTML = "Error loading data";
    }
});