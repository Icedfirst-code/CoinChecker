let liveCryptoData = [];

const tableBody = document.querySelector(".crypto.data");
const searchInput = document.querySelector(".searchbtn");

async function getLiveCryptoData() {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=1h,24h",
  );
  const data = await response.json();

  liveCryptoData = data;

  renderTable(liveCryptoData);
}

function renderTable(dataToRender) {
  tableBody.innerHTML = "";

  dataToRender.forEach(function (coin) {
    let change1h = coin.price_change_percentage_1h_in_currency || 0;
    let colorClass1h = change1h < 0 ? "text-red" : "text-green";

    let change24h = coin.price_change_percentage_24h || 0;
    let colorClass24h = change24h < 0 ? "text-red" : "text-green";

    let newRow = `
      <tr>
        <td><strong>${coin.name}</strong></td>
        <td>$${coin.current_price.toLocaleString()}</td>
        <td class="${colorClass1h}">${change1h.toFixed(2)}%</td>
        <td class="${colorClass24h}">${change24h.toFixed(2)}%</td>
        <td>$${coin.total_volume.toLocaleString()}</td>
        <td>$${coin.market_cap.toLocaleString()}</td>
      </tr>
    `;

    tableBody.innerHTML += newRow;
  });
}

const searchForm = document.querySelector("form");

searchForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  let typedText = searchInput.value.toLowerCase();

  if (typedText === "") {
    renderTable(liveCryptoData);
    return;
  }

  try {
    const searchResponse = await fetch(
      `https://api.coingecko.com/api/v3/search?query=${typedText}`,
    );
    const searchData = await searchResponse.json();

    if (searchData.coins.length === 0) {
      tableBody.innerHTML = "<tr><td colspan='6'>No coins found!</td></tr>";
      return;
    }

    const coinIds = searchData.coins
      .slice(0, 10)
      .map((coin) => coin.id)
      .join(",");

    const priceResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&price_change_percentage=1h,24h`,
    );
    const priceData = await priceResponse.json();

    renderTable(priceData);
  } catch (error) {
    console.error("Error searching for coins:", error);
    tableBody.innerHTML =
      "<tr><td colspan='6'>Error loading search results. Please try again later.</td></tr>";
  }
});

searchInput.addEventListener("keyup", function (event) {
  if (event.target.value === "") {
    renderTable(liveCryptoData);
  }
});

getLiveCryptoData();

// 1. Grab all the elements we need
const themeToggleBtn = document.getElementById("theme-toggle");
const sunIcon = document.getElementById("sun-icon");
const moonIcon = document.getElementById("moon-icon");

// 2. Check if the user already chose dark mode in the past
// localStorage is a mini database inside the browser
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "dark") {
  // If they previously chose dark, apply it immediately
  document.body.classList.add("dark-mode");
  // Hide the moon, show the sun
  moonIcon.classList.add("hidden");
  sunIcon.classList.remove("hidden");
}

// 3. Listen for a click on the button
themeToggleBtn.addEventListener("click", () => {
  // .toggle() adds the class if it's missing, and removes it if it's there
  document.body.classList.toggle("dark-mode");

  // Toggle the icons
  moonIcon.classList.toggle("hidden");
  sunIcon.classList.toggle("hidden");

  // 4. Save the user's choice to localStorage
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});
