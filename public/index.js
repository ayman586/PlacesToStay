document.getElementById("searchBtn").addEventListener("click", async () => {

    const location = document.getElementById("location").value;

    const res = await fetch(`/accommodation?location=${location}`);
    const data = await res.json();

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    data.forEach(item => {
        const div = document.createElement("div");

        div.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.type}</p>
            <button>Book</button>
        `;

        div.querySelector("button").addEventListener("click", async () => {
            await fetch("/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    accID: item.ID,
                    thedate: 260630,
                    npeople: 1,
                    apiID: "0x574144"
                })
            });

            alert("Booked!");
        });

        resultsDiv.appendChild(div);
    });
});