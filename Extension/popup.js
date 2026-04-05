document.getElementById("saveBtn").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const url = tab.url;
    const title = tab.title;

    const res = await fetch("http://localhost:5000/api/items/create-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(({ url, title, description } = {})),
    });

    const data = await res.json();

    console.log(data);
    alert("Saved successfully!");
  } catch (err) {
    console.error(err);
    alert("Error saving item");
  }
});
