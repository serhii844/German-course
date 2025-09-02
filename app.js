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

function render() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  if (mode === "table") {
    const table = document.createElement("table");
    table.border = "1";
    table.innerHTML = "<tr><th>Українська</th><th>Німецька</th><th>Перевірка</th></tr>";

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
    btn.innerText = "Перевірити все";
    btn.onclick = () => {
      pairs.forEach((p, i) => {
        const v1 = document.getElementById(`input_${i}_1`).value.trim().toLowerCase();
        const v2 = document.getElementById(`input_${i}_2`).value.trim().toLowerCase();
        const ok1 = v1 === p.de1.toLowerCase();
        const ok2 = v2 === p.de2.toLowerCase();
        
        let result = "";
        result += ok1 ? "✅" : `❌ (${p.de1})`;
        result += " ";
        result += ok2 ? "✅" : `❌ (${p.de2})`;

        document.getElementById(`check_${i}`).innerText = result;
      });
    };

    app.appendChild(table);
    app.appendChild(btn);
  }

  if (mode === "single") {
    if (pairs.length === 0) {
      app.innerHTML = "<h3>Нет пар для отображения!</h3>";
      return;
    }

    // выбираем случайную пару, отличающуюся от предыдущей
    do {
      currentIndex = Math.floor(Math.random() * pairs.length);
    } while (currentIndex === lastIndex && pairs.length > 1);
    lastIndex = currentIndex;

    const p = pairs[currentIndex];
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${p.ua1} — ${p.ua2}</h3>
      <input type="text" id="answer1" placeholder="${p.ua1}"> 
      <input type="text" id="answer2" placeholder="${p.ua2}">
      <button onclick="checkSingle()">Перевірити</button>
      <p id="result"></p>
      <button id="nextBtn" style="display:none;" onclick="render()">Наступна пара</button>
    `;
    app.appendChild(div);
  }
}

function checkSingle() {
  const p = pairs[currentIndex];
  const v1 = document.getElementById("answer1").value.trim().toLowerCase();
  const v2 = document.getElementById("answer2").value.trim().toLowerCase();
  const result = document.getElementById("result");

  let resText = "";
  resText += (v1 === p.de1.toLowerCase()) ? "✅" : `❌ (${p.de1})`;
  resText += " ";
  resText += (v2 === p.de2.toLowerCase()) ? "✅" : `❌ (${p.de2})`;

  result.innerText = resText;

  // показать кнопку "Следующая пара"
  document.getElementById("nextBtn").style.display = "inline-block";
}

window.onload = loadData;

