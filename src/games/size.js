const ROUNDS = 10;
const units = { mm: 0.001, cm: 0.01, m: 1, km: 1000 };
const metres = item => item.size * units[item.unit];
const format = number => new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 3 }).format(number);
const formatLength = value => {
  if (value < 0.001) return `${format(value * 1_000_000)} µm`;
  if (value < 0.01) return `${format(value * 1000)} mm`;
  if (value < 1) return `${format(value * 100)} cm`;
  if (value >= 1000) return `${format(value / 1000)} km`;
  return `${format(value)} m`;
};
const iconFor = item => item.path
  ? `<svg viewBox="0 0 ${item.width} ${item.height}" aria-hidden="true"><path d="${item.path}"/></svg>`
  : `<svg viewBox="0 0 ${item.iconSize} ${item.iconSize}" aria-hidden="true"><path ${item.iconSize === 100 ? 'fill-rule="evenodd" ' : ""}d="${item.iconPath}"/></svg>`;
const axes = {
  "Con bướm":"sải cánh","Đồng xu":"đường kính","Viên bi":"đường kính",
  "Nút áo":"đường kính","Quả bóng đá":"đường kính",
  "Quả trứng gà":"chiều cao","Điện thoại":"chiều cao","Quyển sách":"chiều cao",
  "Chai nước nhỏ":"chiều cao","Người trưởng thành":"chiều cao","Cửa ra vào":"chiều cao",
  "Cột đèn đường":"chiều cao","Tháp Eiffel":"chiều cao",
  "Cốc thủy tinh":"chiều cao","Quả bóng rổ":"đường kính",
  "Va li":"chiều cao","Ghế gỗ":"chiều cao",
  "Tủ lạnh":"chiều cao","Cây thông":"chiều cao","Ô gấp":"đường kính"
};
const axisFor = item => axes[item.name] || "chiều dài";
const formatMeters = value => `${new Intl.NumberFormat("vi-VN", { maximumSignificantDigits: 4 }).format(value)} m`;

export function scoreGuess(guess, actual) {
  return Math.round(Math.max(0, 100 * (1 - Math.abs(Math.log10(guess / actual)) / 2)));
}

export function sceneHeights(referenceMetres, ratio, sceneHeight, zoom = 1) {
  const pxPerMet = sceneHeight * 0.75 / Math.max(referenceMetres, referenceMetres * ratio) * zoom;
  return { pxPerMet, referenceHeight: referenceMetres * pxPerMet, targetHeight: referenceMetres * ratio * pxPerMet };
}

export function ratioFromCornerDrag(ratio, width, height, dx, dy, power = 1) {
  const scale = Math.max(0, ((width + dx) / width + (height - dy) / height) / 2);
  return Math.max(0.001, Math.min(1000, ratio * scale ** power));
}

export function mount(root) {
  let active = true;
  let objects = [];
  let countries = [];
  let mode = "objects";
  let used = new Set();
  let pair = null;
  let round = 0;
  let total = 0;
  root.innerHTML = `
    <section class="game-head"><p class="eyebrow">TRÒ 02 / TỈ LỆ VẠN VẬT</p><h1>Lớn gấp mấy lần?</h1><p>Ước lượng tỉ lệ qua 10 vòng: vật thể hoặc diện tích quốc gia.</p></section>
    <div class="size-area"><div class="mode-switch"><button type="button" data-mode="objects" class="selected">Vật thể</button><button type="button" data-mode="countries">Địa lý</button></div><div id="sizeStatus" class="message">Đang tải dữ liệu...</div><div id="sizePlay"></div></div>`;
  const status = root.querySelector("#sizeStatus");
  const play = root.querySelector("#sizePlay");

  function nextPair() {
    const items = mode === "countries" ? countries : objects;
    const choices = [];
    for (let i = 0; i < items.length; i++) for (let j = 0; j < items.length; j++) {
      if (i === j || used.has(`${i}-${j}`)) continue;
      const ratio = mode === "countries" ? items[j].areaKm2 / items[i].areaKm2 : metres(items[j]) / metres(items[i]);
      if (ratio >= 0.001 && ratio <= 1000) choices.push({ i, j, ratio });
    }
    pair = choices[Math.floor(Math.random() * choices.length)];
    used.add(`${pair.i}-${pair.j}`);
  }

  function showRound() {
    nextPair();
    const geography = mode === "countries";
    const items = geography ? countries : objects;
    let logRatio = 0;
    let locked = false;
    status.textContent = `Vòng ${round + 1}/${ROUNDS} · Tổng điểm: ${total}`;
    const reference = items[pair.i];
    const target = items[pair.j];
    const referenceInfo = geography
      ? `<span>Tham chiếu: <strong>${reference.name}</strong> (diện tích)<small>${format(reference.areaKm2)} km²</small></span>`
      : `<img src="${reference.image}" alt=""><span>Tham chiếu: <strong>${reference.name}</strong> (${axisFor(reference)})<small>${format(reference.size)} ${reference.unit} · <a href="${reference.imageSource}" target="_blank" rel="noopener noreferrer">Nguồn ảnh</a></small></span>`;
    const targetInfo = geography
      ? `<span><strong>${target.name}</strong> (kéo để chỉnh diện tích)</span>`
      : `<img src="${target.image}" alt=""><span><strong>${target.name}</strong> (kéo để chỉnh ${axisFor(target)})<small><a href="${target.imageSource}" target="_blank" rel="noopener noreferrer">Nguồn ảnh</a></small></span>`;
    play.innerHTML = `
      <p class="scene-hint">Kéo mũi tên ở góc để chỉnh ${geography ? "diện tích" : "kích thước"}; kéo thân hình đỏ để di chuyển tự do.</p>
      <div id="sizeScene" class="size-scene">
        <div class="scene-grid"></div><div class="scene-ground"></div>
        <div class="zoom-controls"><button id="zoomIn" type="button" aria-label="Phóng to cảnh">+</button><button id="zoomOut" type="button" aria-label="Thu nhỏ cảnh">−</button><button id="autoFit" type="button" title="Tự khớp cảnh" aria-label="Tự khớp cảnh">⤢</button></div>
        <div id="referenceShape" class="scene-object scene-reference" aria-label="Tham chiếu: ${reference.name}"><div class="silhouette">${iconFor(reference)}</div></div>
        <div id="targetShape" class="scene-object scene-target" aria-label="Cần đoán: ${target.name}"><div class="silhouette">${iconFor(target)}</div><div id="resizeHandle" class="resize-handle" role="slider" tabindex="0" aria-label="Kéo góc trên phải để đổi tỉ lệ" aria-valuemin="0.001" aria-valuemax="1000" aria-valuenow="1">↗</div></div>
        <div id="answerShape" class="scene-object scene-answer" hidden><div class="silhouette">${iconFor(target)}</div></div>
        <div id="scoreOverlay" class="score-overlay" hidden><strong>0</strong><span> / 100</span><div id="scoreDetails" hidden></div></div>
        <span id="referenceDot" class="tiny-marker reference-marker" hidden>↗ rất nhỏ</span><span id="targetDot" class="tiny-marker target-marker" hidden>↗ rất nhỏ</span>
        <div id="scaleBar" class="scale-bar"><span></span><b></b></div>
      </div>
      <div class="scene-legend">
        <div>${referenceInfo}</div>
        <div>${targetInfo}</div>
      </div>
      <div class="scene-actions"><p id="ratioReadout" class="ratio-readout" aria-live="polite">${geography ? "Diện tích gấp" : "Bạn đoán:"} <strong>1 lần</strong></p><button id="submitSize" class="primary">Chốt đáp án</button></div>`;
    const scene = play.querySelector("#sizeScene");
    const referenceShape = play.querySelector("#referenceShape");
    const frame = play.querySelector("#targetShape");
    const answerShape = play.querySelector("#answerShape");
    const handle = play.querySelector("#resizeHandle");
    const readout = play.querySelector("#ratioReadout strong");
    function fitIcon(shape) {
      const svg = shape.querySelector("svg");
      const box = svg.querySelector("path").getBBox();
      const pad = 0.5;
      svg.setAttribute("viewBox", `${box.x - pad} ${box.y - pad} ${box.width + pad * 2} ${box.height + pad * 2}`);
      return (box.width + pad * 2) / (box.height + pad * 2);
    }
    const referenceAspect = geography ? reference.width / reference.height : fitIcon(referenceShape);
    const targetAspect = geography ? target.width / target.height : fitIcon(frame);
    answerShape.querySelector("svg").setAttribute("viewBox", frame.querySelector("svg").getAttribute("viewBox"));
    const referenceSize = geography ? reference.height : metres(reference);
    const targetSize = geography ? target.height : metres(target);
    const targetScale = ratio => geography ? Math.sqrt(ratio / pair.ratio) : ratio / pair.ratio;
    const fitCamera = (ratio, includeAnswer = false) => {
      if (!geography) return sceneHeights(referenceSize, includeAnswer ? Math.max(ratio, pair.ratio) : ratio, scene.clientHeight).pxPerMet;
      const scales = includeAnswer ? [targetScale(ratio), 1] : [targetScale(ratio)];
      const height = Math.max(referenceSize, ...scales.map(scale => targetSize * scale));
      const width = Math.max(referenceSize * referenceAspect, ...scales.map(scale => targetSize * scale * targetAspect));
      return Math.min(scene.clientHeight * 0.75 / height, scene.clientWidth * 0.42 / width);
    };
    const clamp = value => Math.max(-3, Math.min(3, value));
    let targetX = scene.clientWidth * (scene.clientWidth < 520 ? 0.5 : 0.56);
    let targetBottom = 42;
    let cameraPx = null;
    let currentPxPerMet = 0;
    let drag = null;
    let move = null;
    let revealed = false;
    function updateScene() {
      const ratio = 10 ** logRatio;
      const pxPerMet = cameraPx || fitCamera(ratio);
      currentPxPerMet = pxPerMet;
      const referenceHeight = referenceSize * pxPerMet;
      const targetHeight = targetSize * targetScale(ratio) * pxPerMet;
      for (const [height, shape, marker, aspect] of [
        [referenceHeight, referenceShape, play.querySelector("#referenceDot"), referenceAspect],
        [targetHeight, frame, play.querySelector("#targetDot"), targetAspect]
      ]) {
        const tiny = height < 6;
        const shownHeight = Math.max(6, height);
        shape.style.height = `${shownHeight}px`;
        shape.style.width = `${shownHeight * aspect}px`;
        shape.classList.toggle("tiny", tiny);
        marker.hidden = !tiny;
      }
      frame.style.left = `${targetX}px`;
      frame.style.bottom = `${targetBottom}px`;
      if (revealed) {
        const answerHeight = Math.max(6, targetSize * pxPerMet);
        answerShape.style.height = `${answerHeight}px`;
        answerShape.style.width = `${answerHeight * targetAspect}px`;
        answerShape.style.left = `${targetX}px`;
        answerShape.style.bottom = `${targetBottom}px`;
      }
      play.querySelector("#referenceDot").style.left = `${referenceShape.offsetLeft + referenceShape.offsetWidth / 2}px`;
      play.querySelector("#targetDot").style.left = `${targetX + frame.offsetWidth / 2}px`;
      play.querySelector("#targetDot").style.bottom = `${targetBottom + 12}px`;
      const desiredStep = 65 / pxPerMet;
      const decade = 10 ** Math.floor(Math.log10(desiredStep));
      const steps = [1, 2, 5, 10].map(multiplier => multiplier * decade);
      const gridStep = steps.reduce((best, step) =>
        Math.abs(step * pxPerMet - 65) < Math.abs(best * pxPerMet - 65) ? step : best
      );
      const bar = play.querySelector("#scaleBar");
      bar.querySelector("span").style.width = `${gridStep * pxPerMet}px`;
      bar.querySelector("b").textContent = formatLength(gridStep * (geography ? 1000 : 1));
      scene.style.setProperty("--grid-size", `${gridStep * pxPerMet}px`);
      handle.setAttribute("aria-valuenow", Number(ratio.toPrecision(3)));
      handle.setAttribute("aria-valuetext", `${format(ratio)} lần`);
      readout.textContent = `${format(ratio)} lần`;
    }
    play.querySelector("#zoomIn").onclick = () => { cameraPx = currentPxPerMet * 2; updateScene(); };
    play.querySelector("#zoomOut").onclick = () => { cameraPx = currentPxPerMet / 2; updateScene(); };
    play.querySelector("#autoFit").onclick = () => {
      cameraPx = revealed
        ? fitCamera(10 ** logRatio, true)
        : null;
      updateScene();
    };
    handle.onpointerdown = event => {
      if (locked) return;
      event.stopPropagation();
      drag = { x: event.clientX, y: event.clientY, width: frame.offsetWidth,
        height: frame.offsetHeight, ratio: 10 ** logRatio };
      cameraPx = currentPxPerMet;
      scene.classList.add("dragging");
      handle.setPointerCapture(event.pointerId);
    };
    handle.onpointermove = event => {
      if (locked || !drag || !handle.hasPointerCapture(event.pointerId)) return;
      const ratio = ratioFromCornerDrag(drag.ratio, drag.width, drag.height,
        event.clientX - drag.x, event.clientY - drag.y, geography ? 2 : 1);
      logRatio = Math.log10(ratio);
      updateScene();
    };
    handle.onpointerup = handle.onpointercancel = event => {
      if (!drag) return;
      if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
      drag = null;
      scene.classList.remove("dragging");
    };
    frame.onpointerdown = event => {
      if (locked || event.target === handle) return;
      move = { x: event.clientX, y: event.clientY, left: targetX, bottom: targetBottom };
      scene.classList.add("dragging");
      frame.setPointerCapture(event.pointerId);
    };
    frame.onpointermove = event => {
      if (!move || !frame.hasPointerCapture(event.pointerId)) return;
      targetX = Math.max(0, Math.min(scene.clientWidth - frame.offsetWidth,
        move.left + event.clientX - move.x));
      targetBottom = Math.max(0, Math.min(scene.clientHeight - 6,
        move.bottom + move.y - event.clientY));
      updateScene();
    };
    frame.onpointerup = frame.onpointercancel = event => {
      if (!move) return;
      if (frame.hasPointerCapture(event.pointerId)) frame.releasePointerCapture(event.pointerId);
      move = null;
      scene.classList.remove("dragging");
    };
    handle.onkeydown = event => {
      if (locked || !["ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      logRatio = clamp(logRatio + (event.key === "ArrowUp" ? 0.05 : -0.05));
      updateScene();
    };
    updateScene();
    const submitButton = play.querySelector("#submitSize");
    submitButton.onclick = () => {
      const guess = 10 ** logRatio;
      const points = scoreGuess(guess, pair.ratio);
      total += points;
      locked = true;
      submitButton.disabled = true;
      submitButton.textContent = "Vòng tiếp →";
      play.querySelector("#zoomIn").hidden = true;
      play.querySelector("#zoomOut").hidden = true;
      play.querySelector(".zoom-controls").classList.add("result");
      const fitButton = play.querySelector("#autoFit");
      fitButton.textContent = "Khớp cả hai";
      fitButton.setAttribute("aria-label", "Khớp cả hai hình");
      frame.classList.add("revealed");
      handle.hidden = true;
      handle.setAttribute("tabindex", "-1");
      revealed = true;
      answerShape.hidden = false;
      updateScene();
      scene.classList.add("show-result");
      void scene.offsetWidth;
      cameraPx = fitCamera(guess, true);
      updateScene();
      const score = play.querySelector("#scoreOverlay");
      score.hidden = false;
      const details = play.querySelector("#scoreDetails");
      const guessedSize = (geography ? reference.areaKm2 : metres(reference)) * guess;
      const trueSize = geography ? target.areaKm2 : metres(target);
      const showSize = geography ? value => `${format(value)} km²` : formatMeters;
      details.innerHTML = `<p>Bạn đoán: ${showSize(guessedSize)}</p><p>Đáp án: ${showSize(trueSize)}</p><p>Lệch ${format(Math.abs(guessedSize - trueSize) / trueSize * 100)}%</p>`;
      let started;
      function animateScore(now) {
        if (!active || !scene.isConnected) return;
        started ??= now;
        const progress = Math.min(1, (now - started) / 1000);
        score.querySelector("strong").textContent = Math.round(points * progress);
        if (progress < 1) requestAnimationFrame(animateScore);
        else { details.hidden = false; submitButton.disabled = false; }
      }
      requestAnimationFrame(animateScore);
      submitButton.onclick = () => {
        round++;
        if (round === ROUNDS) showSummary(); else showRound();
      };
    };
  }

  function showSummary() {
    status.textContent = "Hoàn thành 10 vòng";
    play.innerHTML = `<div class="summary"><p class="eyebrow">KẾT QUẢ</p><h2>${total}/1000 điểm</h2><p>Bạn đã đoán ${mode === "countries" ? "diện tích của 10 cặp quốc gia" : "kích thước của 10 cặp vật"}.</p><button id="sizeAgain" class="primary">Chơi lại</button></div>`;
    play.querySelector("#sizeAgain").onclick = () => { round = 0; total = 0; used = new Set(); showRound(); };
  }

  const load = file => fetch(`./data/${file}.json`).then(response => {
    if (!response.ok) throw new Error("Không tải được dữ liệu.");
    return response.json();
  });
  Promise.all([load("objects"), load("countries")]).then(([objectData, countryData]) => {
    if (!active) return;
    objects = objectData;
    countries = countryData;
    root.querySelectorAll("[data-mode]").forEach(button => button.onclick = () => {
      mode = button.dataset.mode;
      root.querySelectorAll("[data-mode]").forEach(choice => choice.classList.toggle("selected", choice === button));
      round = 0;
      total = 0;
      used = new Set();
      showRound();
    });
    showRound();
  })
    .catch(() => { if (active) status.textContent = "Không tải được dữ liệu. Hãy chạy bằng máy chủ tĩnh."; });
  return () => { active = false; };
}
