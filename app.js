const AntonymsTrainer = {
  pairs: [],
  mode: "table", // table | single | five | ten | last10
  currentIndex: 0,
  lastIndex: -1, 

  async init() {
    const res = await fetch("pairs.json");
    this.pairs = await res.json();
    this.render();
  },

  switchMode(newMode) {
    this.mode = newMode;
    this.currentIndex = 0;
    this.lastIndex = -1;
    this.render();
  },

  getPairsForMode() {
    if (this.mode === "table") {
      return this.shuffle([...this.pairs]);
    }
    if (this.mode === "five") {
      return this.shuffle([...this.pairs]).slice(0, 5);
    }
    if (this.mode === "ten") {
      return this.shuffle([...this.pairs]).slice(0, 10);
    }
    if (this.mode === "last10") {
      return this.shuffle(this.pairs.slice(-10));
    }
    return [];
  },

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  render() {
    const app = document.getElementById("app");
    app.innerHTML = "";

    if (["table", "five", "ten", "last10"].includes(this.mode)) {
      const data = this.getPairsForMode();
      const table = document.createElement("table");
      table.border = "1";
      table.innerHTML = "<tr><th>Українська</th><th>Німецька</th><th>Перевірка</th></tr>";

      data.forEach((p, i) => {
        const row = document.createElement("tr");
        row.id = `row_${i}`;

        let refreshBtn = "";
        if (["five", "ten"].includes(this.mode)) {
          refreshBtn = `<button onclick="AntonymsTrainer.refreshRow(${i})">🔄</button> `;
        }

        const skipBtn = `<button onclick="AntonymsTrainer.skipRow(${i})">➡</button>`;

        row.innerHTML = `
          <td>${refreshBtn}${p.ua1} — ${p.ua2} ${skipBtn}</td>
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
        data.forEach((p, i) => {
          const v1 = document.getElementById(`input_${i}_1`);
          const v2 = document.getElementById(`input_${i}_2`);
          const checkCell = document.getElementById(`check_${i}`);
          if (!v1 || !v2 || !checkCell) return;

          const ok1 = v1.value.trim().toLowerCase() === p.de1.toLowerCase();
          const ok2 = v2.value.trim().toLowerCase() === p.de2.toLowerCase();

          let result = "";
          result += ok1 ? "✅" : `❌ (${p.de1})`;
          result += " ";
          result += ok2 ? "✅" : `❌ (${p.de2})`;

          checkCell.innerText = result;
        });
      };

      app.appendChild(table);
      app.appendChild(btn);
    }

    if (this.mode === "single") {
      if (this.pairs.length === 0) {
        app.innerHTML = "<h3>Нет пар для отображения!</h3>";
        return;
      }

      do {
        this.currentIndex = Math.floor(Math.random() * this.pairs.length);
      } while (this.currentIndex === this.lastIndex && this.pairs.length > 1);
      this.lastIndex = this.currentIndex;

      const p = this.pairs[this.currentIndex];
      const div = document.createElement("div");
      div.innerHTML = `
        <h3>${p.ua1} — ${p.ua2}</h3>
        <input type="text" id="answer1" placeholder="${p.ua1}"> 
        <input type="text" id="answer2" placeholder="${p.ua2}">
        <div class="single-controls">
          <button onclick="AntonymsTrainer.checkSingle()">Перевірити</button>
          <button onclick="AntonymsTrainer.switchMode('single')">Пропустити</button>
        </div>
        <p id="result"></p>
        <button id="nextBtn" style="display:none;" onclick="AntonymsTrainer.render()">Наступна пара</button>
      `;
      app.appendChild(div);
    }
  },

  checkSingle() {
    const p = this.pairs[this.currentIndex];
    const v1 = document.getElementById("answer1").value.trim().toLowerCase();
    const v2 = document.getElementById("answer2").value.trim().toLowerCase();
    const result = document.getElementById("result");

    let resText = "";
    resText += (v1 === p.de1.toLowerCase()) ? "✅" : `❌ (${p.de1})`;
    resText += " ";
    resText += (v2 === p.de2.toLowerCase()) ? "✅" : `❌ (${p.de2})`;

    result.innerText = resText;

    document.getElementById("nextBtn").style.display = "inline-block";
  },

  skipRow(i) {
    const row = document.getElementById(`row_${i}`);
    if (row) row.remove();
  },

  refreshRow(i) {
    const row = document.getElementById(`row_${i}`);
    if (!row) return;
    const randomPair = this.pairs[Math.floor(Math.random() * this.pairs.length)];
    row.querySelector("td").innerHTML = 
      `<button onclick="AntonymsTrainer.refreshRow(${i})">🔄</button> ${randomPair.ua1} — ${randomPair.ua2} <button onclick="AntonymsTrainer.skipRow(${i})">➡</button>`;
    row.querySelectorAll("td")[1].innerHTML = `
      <input type="text" id="input_${i}_1" placeholder="${randomPair.ua1}"> 
      <input type="text" id="input_${i}_2" placeholder="${randomPair.ua2}">
    `;
    row.querySelectorAll("td")[2].innerHTML = "";
  }
};

window.onload = () => AntonymsTrainer.init();
