const WORD_LENGTH = 5;
const MAX_TRIES = 6;
const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

function grade(guess, answer) {
  const result = Array(WORD_LENGTH).fill("absent");
  const remaining = {};
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === answer[i]) result[i] = "correct";
    else remaining[answer[i]] = (remaining[answer[i]] || 0) + 1;
  }
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === "correct") continue;
    if (remaining[guess[i]] > 0) {
      result[i] = "present";
      remaining[guess[i]]--;
    }
  }
  return result;
}

async function readWords(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error("Không tải được danh sách từ.");
  return (await response.text()).trim().toUpperCase().split(/\s+/);
}

export function grayHintLetters(answer, guesses, current = "") {
  const seen = guesses.map(guess => guess.word).join("") + current;
  const choices = [...rows.join("")].filter(letter => !answer.includes(letter) && !seen.includes(letter));
  const picked = [];
  while (picked.length < 3 && choices.length) {
    picked.push(choices.splice(Math.floor(Math.random() * choices.length), 1)[0]);
  }
  return picked;
}

export function mount(root) {
  let active = true;
  let answers = [];
  let allowed = new Set();
  let answer = "";
  let guesses = [];
  let current = "";
  let finished = false;
  let hintsUsed = 0;
  const stats = JSON.parse(localStorage.getItem("wordleStats") || '{"wins":0,"losses":0,"streak":0}');
  const keyColors = {};

  root.innerHTML = `
    <section class="game-head"><p class="eyebrow">TRÒ 01 / Ô CHỮ 5</p><h1>Đoán từ bí mật</h1><p>5 chữ cái, 6 lượt đoán. Xanh: đúng chỗ · Vàng: sai chỗ · Xám: không có.</p></section>
    <div class="word-area">
      <div id="wordMessage" class="message" role="status">Đang tải từ...</div>
      <div id="board" class="board" aria-label="Bảng đoán từ"></div>
      <div id="keyboard" class="keyboard"></div>
      <button id="wordHint" class="primary" type="button">Gợi ý (2)</button>
      <p id="wordStats" class="word-stats"></p>
      <button id="wordAgain" class="primary hidden">Chơi ván mới</button>
    </div>`;
  const board = root.querySelector("#board");
  const keyboard = root.querySelector("#keyboard");
  const message = root.querySelector("#wordMessage");
  const hint = root.querySelector("#wordHint");
  const statsLine = root.querySelector("#wordStats");
  const again = root.querySelector("#wordAgain");

  function showStats() {
    statsLine.textContent = `Thắng ${stats.wins} · Thua ${stats.losses} · Streak ${stats.streak}`;
  }

  function saveResult(won) {
    if (won) {
      stats.wins++;
      if (!hintsUsed) stats.streak++;
    } else {
      stats.losses++;
      stats.streak = 0;
    }
    localStorage.setItem("wordleStats", JSON.stringify(stats));
    showStats();
  }

  function draw() {
    board.innerHTML = "";
    for (let row = 0; row < MAX_TRIES; row++) {
      const line = document.createElement("div");
      line.className = "board-row";
      const word = guesses[row]?.word || (row === guesses.length ? current : "");
      for (let col = 0; col < WORD_LENGTH; col++) {
        const cell = document.createElement("div");
        cell.className = "tile";
        cell.textContent = word[col] || "";
        if (guesses[row]) cell.classList.add(guesses[row].colors[col]);
        line.append(cell);
      }
      board.append(line);
    }
    keyboard.innerHTML = "";
    rows.forEach((row, index) => {
      const line = document.createElement("div");
      line.className = "key-row";
      if (index === 2) line.append(makeKey("ENTER", "Enter"));
      for (const letter of row) line.append(makeKey(letter, letter));
      if (index === 2) line.append(makeKey("⌫", "Backspace"));
      keyboard.append(line);
    });
    hint.textContent = `Gợi ý (${2 - hintsUsed})`;
    hint.disabled = !answer || finished || hintsUsed === 2;
  }

  hint.onclick = () => {
    if (!answer || finished || hintsUsed === 2) return;
    if (hintsUsed === 0) {
      const letters = grayHintLetters(answer, guesses, current);
      letters.forEach(letter => keyColors[letter] = "absent");
      message.textContent = letters.length ? `Không có trong đáp án: ${letters.join(", ")}.` : "Không còn chữ mới để loại.";
    } else {
      const positions = [...Array(WORD_LENGTH).keys()].filter(i => !guesses.some(guess => guess.colors[i] === "correct"));
      if (positions.length) {
        const i = positions[Math.floor(Math.random() * positions.length)];
        message.textContent = `Chữ thứ ${i + 1} là ${answer[i]}.`;
      } else message.textContent = "Bạn đã biết đúng cả 5 vị trí.";
    }
    hintsUsed++;
    draw();
  };

  function makeKey(label, value) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "key " + (keyColors[value] || "") + (value.length > 1 ? " wide" : "");
    button.textContent = label;
    button.onclick = () => handleKey(value);
    return button;
  }

  function handleKey(key) {
    if (!answer || finished) return;
    if (key === "Backspace") current = current.slice(0, -1);
    else if (key === "Enter") {
      if (current.length !== WORD_LENGTH) { message.textContent = "Cần đủ 5 chữ cái."; return; }
      if (!allowed.has(current)) { message.textContent = "Từ này chưa có trong danh sách."; return; }
      const colors = grade(current, answer);
      guesses.push({ word: current, colors });
      colors.forEach((color, i) => {
        const letter = current[i];
        const rank = { absent: 1, present: 2, correct: 3 };
        if (rank[color] > (rank[keyColors[letter]] || 0)) keyColors[letter] = color;
      });
      if (current === answer) {
        finished = true;
        message.textContent = `Đúng rồi! Bạn giải trong ${guesses.length} lượt.`;
        saveResult(true);
      } else if (guesses.length === MAX_TRIES) {
        finished = true;
        message.textContent = `Hết lượt! Đáp án là ${answer}.`;
        saveResult(false);
      } else message.textContent = `Còn ${MAX_TRIES - guesses.length} lượt.`;
      current = "";
      again.classList.toggle("hidden", !finished);
    } else if (/^[A-Z]$/.test(key) && current.length < WORD_LENGTH) current += key;
    draw();
  }

  function onKeyDown(event) {
    if (!active || !root.isConnected) return;
    const key = event.key.length === 1 ? event.key.toUpperCase() : event.key;
    if (/^[A-Z]$/.test(key) || key === "Enter" || key === "Backspace") {
      event.preventDefault();
      handleKey(key);
    }
  }
  document.addEventListener("keydown", onKeyDown);
  again.onclick = () => {
    answer = answers[Math.floor(Math.random() * answers.length)];
    guesses = [];
    current = "";
    finished = false;
    hintsUsed = 0;
    Object.keys(keyColors).forEach(key => delete keyColors[key]);
    again.classList.add("hidden");
    message.textContent = "Hãy nhập từ đầu tiên.";
    draw();
  };
  showStats();
  draw();
  Promise.all([readWords("./data/answers.txt"), readWords("./data/allowed.txt")])
    .then(([answerWords, validWords]) => {
      if (!active) return;
      answers = answerWords;
      allowed = new Set([...answerWords, ...validWords]);
      again.click();
    })
    .catch(() => { if (active) message.textContent = "Không tải được dữ liệu. Hãy chạy bằng máy chủ tĩnh."; });
  return () => { active = false; document.removeEventListener("keydown", onKeyDown); };
}

export { grade };
