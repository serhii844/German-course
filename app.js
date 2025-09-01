let pairs = [];
let mode = "table"; // table | single
let currentIndex = 0;

async function loadData() {
  const res = await fetch("pairs.json"); // наш JSON с парами
  pairs = await res.json();
  render();
}

function switchMode(newMode) {
  mode = newMode;
  currentIndex = 0;
  render();
}

function render() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  if (mode === "table") {
    const table = document.createElement("table");
    table.border = "1";
    table.innerHTML = "<tr><th>Русский (антонимы)</th><th>Немецкий (ввод)</th><th>Проверка</th></tr>";

    pairs.forEach((p, i) => {
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
    btn.onclick = () => {
      // фикс: снимаем фокус, чтобы клавиатура закрывалась на мобильных
      document.activeElement.blur();

      pairs.forEach((p, i) => {
        const v1 = document.getElementById(`input_${i_
