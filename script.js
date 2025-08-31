let currentSection = "words";
let currentSubsection = "adjectives";
let currentMode = "table";

async function loadPairs() {
  const response = await fetch("pairs.json");
  return response.json();
}

function setActiveButton(selector, button) {
  document.querySelectorAll(selector).forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
}

function showContent(text) {
  document.getElementById("content").innerHTML = `<p>${text}</p>`;
}

async function renderAdjectives(mode) {
  const pairs = await loadPairs();
  const contentDiv = document.getElementById("content");

  if (mode === "table") {
    let html = "<table><tr><th>Українська 1</th><th>Українська 2</th><th>Deutsch 1</th><th>Deutsch 2</th></tr>";
    pairs.forEach(p => {
      html += `<tr>
        <td>${p.ua1}</td>
        <td>${p.ua2}</td>
        <td><input type="text" data-answer="${p.de1}"></td>
        <td><input type="text" data-answer="${p.de2}"></td>
      </tr>`;
    });
    html += "</table><button id='check'>Перевірити / Überprüfen</button>";
    contentDiv.innerHTML = html;

    document.getElementById("check").onclick = () => {
      document.querySelectorAll("input").forEach(input => {
        if (input.value.trim().toLowerCase() === input.dataset.answer.toLowerCase()) {
          input.style.backgroundColor = "#c8e6c9";
        } else {
          input.style.backgroundColor = "#ffcdd2";
        }
      });
    };
  } else if (mode === "random") {
    const rand = pairs[Math.floor(Math.random() * pairs.length)];
    contentDiv.innerHTML = `
      <p>${rand.ua1} - ${rand.ua2}</p>
      <input type="text" placeholder="Deutsch 1" data-answer="${rand.de1}">
      <input type="text" placeholder="Deutsch 2" data-answer="${rand.de2}">
      <button id="check">Перевірити / Überprüfen</button>
    `;
    document.getElementById("check").onclick = () => {
      document.querySelectorAll("input").forEach(input => {
        if (input.value.trim().toLowerCase() === input.dataset.answer.toLowerCase()) {
          input.style.backgroundColor = "#c8e6c9";
        } else {
          input.style.backgroundColor = "#ffcdd2";
        }
      });
    };
  }
}

function render() {
  if (currentSection === "words") {
    if (currentSubsection === "adjectives") {
      renderAdjectives(currentMode);
    } else if (currentSubsection === "numerals") {
      showContent("Тут буде контент (Числівники / Numerale)");
    } else if (currentSubsection === "nouns") {
      showContent("Тут буде контент (Іменники / Substantive)");
    } else if (currentSubsection === "verbs") {
      showContent("Тут буде контент (Дієслова / Verben)");
    }
  } else if (currentSection === "communication") {
    showContent("Тут буде контент (Спілкування / Kommunikation)");
  }
}

// Навигация верхнего уровня
document.querySelectorAll(".menu-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    currentSection = btn.dataset.section;
    setActiveButton(".menu-btn", btn);

    if (currentSection === "words") {
      document.getElementById("words-submenu").style.display = "block";
      document.getElementById("adjectives-submenu").style.display = "block";
    } else {
      document.getElementById("words-submenu").style.display = "none";
      document.getElementById("adjectives-submenu").style.display = "none";
    }
    render();
  });
});

// Навигация второго уровня
document.querySelectorAll(".submenu-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    currentSubsection = btn.dataset.subsection;
    setActiveButton(".submenu-btn", btn);

    if (currentSubsection === "adjectives") {
      document.getElementById("adjectives-submenu").style.display = "block";
    } else {
      document.getElementById("adjectives-submenu").style.display = "none";
    }
    render();
  });
});

// Навигация третьего уровня
document.querySelectorAll(".subsubmenu-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    currentMode = btn.dataset.mode;
    setActiveButton(".subsubmenu-btn", btn);
    render();
  });
});

// Первичная отрисовка
render();