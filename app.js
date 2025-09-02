const AntonymsTrainer = {
  pairs: [],
  mode: "table", // table | single | 5pairs | 10pairs | last10
  currentIndex: 0,
  lastIndex: -1, // для случайного выбора

  async loadData() {
    const res = await fetch("pairs.json"); // наш JSON с парами
    this.pairs = await res.json();
    this.render();
  },

  switchMode(newMode) {
    this.mode = newMode;
    this.currentIndex = 0;
    this.lastIndex = -1;
    this.render();
  },

  render() {
    const app = document.getElementById("app");
    app.innerHTML = "";

    if (this.mode === "table") {
      const shuffled = [...this.pairs].sort(() => Math.random() - 0.5); // случайный порядок
      const table = document.createElement("table");
      table.border = "1";
      table.innerHTML = "<tr><th>Українська</th><th>Німецька</th><th>Перевірка</th></tr>";

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
      btn.innerText = "Перевірити все";
      btn.onclick = () => {
        shuffled.forEach((p, i) => {
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

    if (this.mode === "single") {
      if (this.pairs.length === 0) {
        app.innerHTML = "<h3>Немає пар для відображення!</h3>";
        return;
      }

      // выбираем случайную пару, отличающуюся от предыдущей
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

    // показать кнопку "Наступна пара"
    document.getElementById("nextBtn").style.display = "inline-block";
  }
};

window.onload = () => AntonymsTrainer.loadData();
