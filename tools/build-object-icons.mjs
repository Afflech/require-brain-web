import { readFileSync, writeFileSync } from "node:fs";

const source = new URL("../data/objects.json", import.meta.url);
const objects = JSON.parse(readFileSync(source, "utf8"));
const mdi = {
  "Hạt đậu xanh": "seed", "Con ong mật": "bee", "Con bướm": "butterfly",
  "Cục tẩy": "eraser", "Chìa khóa": "key", "Quả trứng gà": "egg",
  "Thẻ ngân hàng": "credit-card", "Điện thoại": "cellphone", "Bút chì": "pencil",
  "Bàn tay người lớn": "hand-front-right", "Quyển sách": "book-open-variant",
  "Chai nước nhỏ": "bottle-soda-classic", "Quả bóng đá": "soccer",
  "Thước kẻ": "ruler", "Bàn phím máy tính": "keyboard",
  "Cây đàn guitar": "guitar-acoustic", "Bàn học": "table-furniture",
  "Xe đạp": "bicycle", "Người trưởng thành": "human-male",
  "Cửa ra vào": "door", "Giường đôi": "bed-double", "Ô tô con": "car-side",
  "Xe buýt": "bus-side", "Máy bay chở khách": "airplane",
  "Sân bóng đá": "soccer-field", "Tháp Eiffel": "eiffel-tower",
  "Đèn pin": "flashlight", "Bàn chải đánh răng": "toothbrush",
  "Cái kéo": "content-cut", "Thìa ăn": "silverware-spoon",
  "Đồng hồ đeo tay": "watch", "Máy ảnh": "camera",
  "Quả bóng rổ": "basketball", "Va li": "bag-suitcase",
  "Máy tính xách tay": "laptop", "Tủ lạnh": "fridge",
  "Cây thông": "pine-tree", "Xe máy": "motorbike", "Ô gấp": "umbrella"
};
const drawn = {
  "Hạt gạo": "M8 77 Q20 27 87 14 Q75 68 20 84Z M23 68 Q43 35 69 30 Q51 58 23 68Z",
  "Hạt cà phê": "M52 10 C92 13 96 60 69 85 C44 106 7 85 9 49 C12 23 29 9 52 10Z M56 18 C43 37 66 54 41 82 C51 73 55 61 53 52 C50 39 43 33 56 18Z",
  "Con kiến": "M17 44 A9 9 0 1 0 17 62 A9 9 0 1 0 17 44Z M43 40 A11 13 0 1 0 43 66 A11 13 0 1 0 43 40Z M73 33 A18 20 0 1 0 73 73 A18 20 0 1 0 73 33Z M34 57 L22 82 L27 84 L43 59Z M44 59 L40 85 L45 85 L51 59Z M59 56 L73 83 L78 80 L67 55Z M11 47 L5 29 L9 27 L19 44Z M19 44 L18 26 L22 26 L24 44Z",
  "Đồng xu": "M50 4 A46 46 0 1 0 50 96 A46 46 0 1 0 50 4Z M50 13 A37 37 0 1 1 50 87 A37 37 0 1 1 50 13Z M50 24 A26 26 0 1 0 50 76 A26 26 0 1 0 50 24Z",
  "Viên bi": "M50 5 A45 45 0 1 0 50 95 A45 45 0 1 0 50 5Z M29 38 C41 14 68 14 78 33 C62 20 41 25 29 38Z M23 59 C33 75 57 83 75 69 C59 88 32 83 23 59Z",
  "Nút áo": "M50 4 A46 46 0 1 0 50 96 A46 46 0 1 0 50 4Z M35 30 A6 6 0 1 0 35 42 A6 6 0 1 0 35 30Z M65 30 A6 6 0 1 0 65 42 A6 6 0 1 0 65 30Z M35 58 A6 6 0 1 0 35 70 A6 6 0 1 0 35 58Z M65 58 A6 6 0 1 0 65 70 A6 6 0 1 0 65 58Z",
  "Gối ngủ": "M14 27 Q7 17 23 13 Q51 5 77 13 Q94 15 86 29 Q96 50 86 71 Q94 85 77 87 Q50 95 23 87 Q7 84 14 71 Q4 50 14 27Z M23 28 Q50 21 77 28 Q68 50 77 72 Q50 79 23 72 Q32 50 23 28Z",
  "Cột đèn đường": "M42 92 H62 V85 H55 V26 H77 V18 H89 V9 H77 V13 H47 V19 H38 V26 H47 V85 H42Z M44 13 L18 4 L14 11 L38 20Z",
  "Hồ bơi thi đấu": "M5 10 H95 V90 H5Z M11 19 H89 V22 H11Z M11 34 H89 V37 H11Z M11 49 H89 V52 H11Z M11 64 H89 V67 H11Z M11 79 H89 V82 H11Z",
  "Cốc thủy tinh": "M18 10 H82 L74 88 Q50 96 26 88Z M27 17 L33 80 Q50 87 67 80 L73 17Z",
  "Ghế gỗ": "M28 7 H72 V55 H28Z M34 15 V47 H66 V15Z M18 53 H82 V65 H76 V92 H68 V65 H32 V92 H24 V65 H18Z"
};

for (const item of objects) {
  const icon = mdi[item.name];
  if (icon) {
    const svg = readFileSync(new URL(`../node_modules/@mdi/svg/svg/${icon}.svg`, import.meta.url), "utf8");
    item.iconPath = svg.match(/<path d="([^"]+)"/)[1];
    item.iconSize = 24;
  } else if (drawn[item.name]) {
    item.iconPath = drawn[item.name];
    item.iconSize = 100;
  } else throw new Error(`Chưa có hình cho ${item.name}`);
}

writeFileSync(source, `${JSON.stringify(objects, null, 2)}\n`);
console.log(`Đã cập nhật hình bóng cho ${objects.length} vật thể.`);
