let pairs = [];
let mode = "table"; // table | single
let currentIndex = 0;
let lastIndex = -1; // для случайного выбора

async function loadData() {
  const res = await fetch("pairs.json"); // наш JSON с парами
  pairs = await res.json();
  render();
}

function switchMode(newMode) {
  mode = newMode;
  currentIndex = 0;
  lastIndex = -1;
  render();
}

// Функция перемешивания массива (Fisher–Yates)
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function render() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  if (mode === "table") {
    const table = document.createElement("table");
    table.border = "1";
    table.innerHTML = "<tr><th>Русский (антонимы)</th><th>Немецкий (ввод)</th><th>Проверка</th></tr>";

    // перемешиваем пары для отображения
    const shuffled = shuffleArray(pairs);

    shuffled.forEach((p, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${p.ua1} — ${p.ua2}</td>
        <td>
          <input type="text" id="input_${i}_1" placeholder="${p.ua1}"> 
          <input type="text" id="input_${i}_2" placeholder="${p.ua2}">
        </td>
        <td id="check_${i}"></td>
      `;
      table.appendChild(row);
    });

    const btn = document.createElement("button");
    btn.innerText = "Проверить всё";
    btn.className = "check-all";
    btn.onclick = () => {
      shuffled.forEach((p, i) => {
        const v1 = document.getElementById(`input_${i}_1`).value.trim().toLowerCase();
        const v2 = document.getElementById(`input_${i}_2`).value.trim().toLowerCase();
        const ok1 = v1 === p.de1.toLowerCase();
        const ok2 = v2 === p.de2.toLowerCase();
