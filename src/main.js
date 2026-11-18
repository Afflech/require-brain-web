import { mount as mountWord } from "./games/wordle.js";
import { mount as mountSize } from "./games/size.js";

const app = document.querySelector("#app");
let cleanup = () => {};

function showHome() {
  cleanup();
  cleanup = () => {};
  app.innerHTML = `
    <section class="hero">
      <p class="eyebrow">CHỌN MỘT TRÒ</p>
      <h1>Đoán một chút,<br>vui một lúc.</h1>
      <p>Hai thử thách ngắn để khởi động trí óc.</p>
    </section>
    <div class="cards">
      <button class="card" data-game="word"><span class="card-icon">A<span class="accent">B</span>C</span><strong>Ô Chữ 5</strong><small>Đoán từ trong 6 lượt</small><span class="arrow">Chơi ngay →</span></button>
      <button class="card" data-game="size"><span class="card-icon">×10</span><strong>Tỉ Lệ Vạn Vật</strong><small>Ước lượng vật thể và diện tích quốc gia</small><span class="arrow">Chơi ngay →</span></button>
    </div>`;
  app.querySelector('[data-game="word"]').onclick = () => showGame(mountWord);
  app.querySelector('[data-game="size"]').onclick = () => showGame(mountSize);
}

function showGame(mount) {
  cleanup();
  app.innerHTML = '<div id="game"></div>';
  cleanup = mount(app.querySelector("#game")) || (() => {});
}

document.querySelector("#homeButton").onclick = showHome;
showHome();
