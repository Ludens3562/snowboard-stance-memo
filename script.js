const KEY = "snowboard-history-v1";

const holes = [...document.querySelectorAll(".hole")];
const historyDiv = document.getElementById("history");

const boardEl = document.getElementById("board");
const dateEl = document.getElementById("date");
const snowEl = document.getElementById("snow");
const leftAngleEl = document.getElementById("left-angle");
const rightAngleEl = document.getElementById("right-angle");
const saveBtn = document.getElementById("saveBtn");

// 穴タップ
holes.forEach(h => {
  h.addEventListener("click", () => h.classList.toggle("active"));
});

saveBtn.addEventListener("click", () => {
  const item = {
    id: String(Date.now()),
    board: boardEl.value.trim(),
    date: dateEl.value,
    snow: snowEl.value,
    leftAngle: leftAngleEl.value.trim(),
    rightAngle: rightAngleEl.value.trim(),
    holes: holes.map(h => h.classList.contains("active"))
  };

  const list = loadList();
  list.unshift(item);
  localStorage.setItem(KEY, JSON.stringify(list));
  render();
});

function loadList() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function render() {
  const list = loadList();
  historyDiv.innerHTML = "";

  list.forEach((item, idx) => {
    const card = document.createElement("section");
    card.className = "card";
    card.innerHTML = `
      <div><b>${escapeHtml(item.date || "日付なし")} / ${escapeHtml(item.snow || "雪質なし")} / ${escapeHtml(item.board || "板名なし")}</b></div>
      <div>左 ${escapeHtml(item.leftAngle || "?")}°　右 ${escapeHtml(item.rightAngle || "?")}°</div>
      <button type="button" data-del="${idx}">削除</button>
    `;
    historyDiv.appendChild(card);
  });

  historyDiv.querySelectorAll("button[data-del]").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.del);
      const list = loadList();
      list.splice(idx, 1);
      localStorage.setItem(KEY, JSON.stringify(list));
      render();
    });
  });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

render();
