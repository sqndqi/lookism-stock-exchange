const table = document.querySelector("#stock-table");
const ticker = document.querySelector("#ticker");
const summary = document.querySelector("#summary");
const template = document.querySelector("#row-template");
const searchInput = document.querySelector("#search");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const lastUpdate = document.querySelector("#last-update");

let market = [];
let activeFilter = "all";

function money(value) {
  return `$${Number(value).toFixed(2)}`;
}

function signed(value) {
  const number = Number(value);
  return `${number >= 0 ? "+" : ""}${number.toFixed(2)}%`;
}

function trendClass(item) {
  if (item.trend === "up") return "up";
  if (item.trend === "down") return "down";
  return "flat";
}

function renderTicker(items) {
  ticker.innerHTML = "";
  items.slice(0, 4).forEach((item) => {
    const card = document.createElement("article");
    card.className = "ticker-card";
    card.innerHTML = `
      <span>${item.name}</span>
      <strong>${money(item.price)}</strong>
      <span class="${trendClass(item)}">${signed(item.changePercent)}</span>
    `;
    ticker.append(card);
  });
}

function renderSummary(items, postsScanned) {
  const bulls = items.filter((item) => item.trend === "up").length;
  const bears = items.filter((item) => item.trend === "down").length;
  const topMentioned = [...items].sort((a, b) => b.mentions - a.mentions)[0];

  summary.innerHTML = `
    <article class="summary-card"><span>Posts scanned</span><strong>${postsScanned}</strong></article>
    <article class="summary-card"><span>Bull / Bear split</span><strong><span class="up">${bulls}</span> / <span class="down">${bears}</span></strong></article>
    <article class="summary-card"><span>Most discussed</span><strong>${topMentioned?.name ?? "None yet"}</strong></article>
  `;
}

function renderTable() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = market.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(query);
    const matchesFilter = activeFilter === "all" || item.trend === activeFilter;
    return matchesSearch && matchesFilter;
  });

  table.innerHTML = "";
  filtered.forEach((item) => {
    const row = template.content.cloneNode(true);
    row.querySelector(".character").textContent = item.name;
    row.querySelector(".reason").textContent = item.reason;
    row.querySelector(".price").textContent = money(item.price);

    const change = row.querySelector(".change");
    change.textContent = `${money(item.change)} (${signed(item.changePercent)})`;
    change.className = `change ${trendClass(item)}`;

    row.querySelector(".mentions").textContent = item.mentions;
    row.querySelector("meter").value = item.sentiment;

    const signal = row.querySelector(".signal");
    const topPost = item.citedPosts?.[0];
    signal.innerHTML = topPost ? `<a href="${topPost.url}" target="_blank" rel="noreferrer">Top post</a>` : "No post";
    table.append(row);
  });
}

async function loadMarket() {
  const response = await fetch("./data/stocks.json", { cache: "no-store" });
  const data = await response.json();
  market = data.market ?? [];
  lastUpdate.textContent = data.generatedAt ? new Date(data.generatedAt).toLocaleString() : "Unknown";
  renderTicker(market);
  renderSummary(market, data.postsScanned ?? 0);
  renderTable();
}

searchInput.addEventListener("input", renderTable);
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderTable();
  });
});

loadMarket().catch((error) => {
  table.innerHTML = `<tr><td colspan="6">Could not load market data: ${error.message}</td></tr>`;
});

