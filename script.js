document.addEventListener("DOMContentLoaded", () => {
  // Состояние
  let currentSection = "words";        // top: words | communication
  let currentSubsection = "adjectives";// second level
  let currentMode = "table";           // third: table | test
  let pairs = [];

  // Кэш DOM
  const content = document.getElementById("content");
  const submenuWords = document.getElementById("submenu-words");
  const submenuAdjectives = document.getElementById("submenu-adjectives");

  // ====== Утилиты ======
  const setActive = (selector, el) => {
    document.querySelectorAll(selector).forEach(b => b.classList.remove("active"));
    el.classList.add("active");
  };

  const showPlaceholder = (text) => {
    content.innerHTML = `<p>Тут буде контент (${text})</p>`;
  };

  // ====== Загрузка слов ======
  async function loadPairs() {
    if (pairs.length) return pairs;
    const res = await fetch("pairs.json");
    pairs = await res.json();
    return pairs;
  }

  // ====== Рендер режимов (3-й уровень) ======
  async function renderTable() {
    const list = await loadPairs();
    let html = `
      <table>
        <thead>
          <tr>
            <th>Українська 1</th>
            <th>Українська 2</th>
            <th>Deutsch 1</th>
            <th>Deutsch 2</th>
          </tr>
        </thead>
        <tbody>
    `;
    list.forEach((p, i) => {
      html += `
        <tr>
          <td>${p.ua1}</td>
          <td>${p.ua2}</td>
          <td><input type="text" id="de1_${i}" data-answer="${p.de1}"></td>
          <td><input type="text" id="de2_${i}" data-answer="${p.de2}"></td>
        </tr>
      `;
    });
    html += `
        </tbody>
      </table>
      <button class="btn action" id="check-all">Перевірити / Prüfen</button>
    `;
    content.innerHTML = html;

    document.getElementById("check-all").addEventListener("click", () => {
      document.querySelectorAll('input[type="text"]').forEach(inp => {
        const ok = inp.value.trim().toLowerCase() === inp.dataset.answer.toLowerCase();
        inp.style.backgroundColor = ok ? "#c8e6c9" : "#ffcdd2";
      });
    });
  }

  async function renderTest() {
    const list = await loadPairs();
    let index = 0;

    const renderQuestion = () => {
      content.innerHTML = `
        <p><strong>${list[index].ua1} — ${list[index].ua2}</strong></p>
        <input type="text" id="ans1" placeholder="Deutsch 1">
        <input type="text" id="ans2" placeholder="Deutsch 2">
        <button class="btn action" id="check-one">Перевірити / Prüfen</button>
        <div id="feedback" style="margin-top:10px;"></div>
      `;

      document.getElementById("check-one").addEventListener("click", () => {
        const a1 = document.getElementById("ans1");
        const a2 = document.getElementById("ans2");
        const ok1 = a1.value.trim().toLowerCase() === list[index].de1.toLowerCase();
        const ok2 = a2.value.trim().toLowerCase() === list[index].de2.toLowerCase();

        a1.style.backgroundColor = ok1 ? "#c8e6c9" : "#ffcdd2";
        a2.style.backgroundColor = ok2 ? "#c8e6c9" : "#ffcdd2";

        const fb = document.getElementById("feedback");
        if (ok1 && ok2) {
          fb.textContent = "✅ Правильно / Richtig";
        } else {
          fb.textContent = `❌ Неправильно / Falsch ( ${list[index].de1} — ${list[index].de2} )`;
        }

        index = (index + 1) % list.length;
        setTimeout(renderQuestion, 1300);
      });
    };

    renderQuestion();
  }

  // ====== Рендер по уровням ======
  function render() {
    // Верхний уровень
    if (currentSection === "words") {
      submenuWords.style.display = "flex";
      if (currentSubsection === "adjectives") {
        submenuAdjectives.style.display = "flex";
        // Третий уровень
        if (currentMode === "table") renderTable();
        else renderTest();
      } else {
        submenuAdjectives.style.display = "none";
        if (currentSubsection === "numerals") showPlaceholder("Числівники / Numerale");
        if (currentSubsection === "nouns")   showPlaceholder("Іменники / Substantive");
        if (currentSubsection === "verbs")   showPlaceholder("Дієслова / Verben");
      }
    } else {
      // communication
      submenuWords.style.display = "none";
      submenuAdjectives.style.display = "none";
      showPlaceholder("Спілкування / Kommunikation");
    }
  }

  // ====== Слушатели (делегирование) ======
  // 1-й уровень
  document.querySelector(".menu").addEventListener("click", (e) => {
    const btn = e.target.closest(".menu-btn");
    if (!btn) return;
    setActive(".menu-btn", btn);
    currentSection = btn.dataset.section;
    // при входе в "Слова" возвращаем дефолт второго/третьего уровней
    if (currentSection === "words") {
      // подсветим второй/третий уровень по умолчанию
      setActive(".submenu-btn", document.querySelector('[data-subsection="adjectives"]'));
      setActive(".subsubmenu-btn", document.querySelector('[data-mode="table"]'));
      currentSubsection = "adjectives";
      currentMode = "table";
    }
    render();
  });

  // 2-й уровень
  document.getElementById("submenu-words").addEventListener("click", (e) => {
    const btn = e.target.closest(".submenu-btn");
    if (!btn) return;
    setActive(".submenu-btn", btn);
    currentSubsection = btn.dataset.subsection;

    // если выбрали "Прикметники…", показываем 3-й уровень и сохраняем активную кнопку
    if (currentSubsection === "adjectives") {
      submenuAdjectives.style.display = "flex";
      // если до этого были в другом разделе, восстановим last mode или дефолт table
      if (!document.querySelector('.subsubmenu-btn.active')) {
        setActive(".subsubmenu-btn", document.querySelector('[data-mode="table"]'));
        currentMode = "table";
      }
    } else {
      submenuAdjectives.style.display = "none";
    }
    render();
  });

  // 3-й уровень
  document.getElementById("submenu-adjectives").addEventListener("click", (e) => {
    const btn = e.target.closest(".subsubmenu-btn");
    if (!btn) return;
    setActive(".subsubmenu-btn", btn);
    currentMode = btn.dataset.mode; // 'table' | 'test'
    render();
  });

  // ====== Старт: дефолтные активные уже стоят в HTML ======
  loadPairs().then(render);
});
