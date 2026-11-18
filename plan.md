# Kế hoạch đồ án: Website game đoán nhanh

## Tổng quan

Xây ứng dụng bằng HTML, CSS và JavaScript thuần. Mỗi game là một module độc lập trong khung chung. Sau giai đoạn 3 phải có **bản deploy đủ để nộp**, gồm Wordle, game ước lượng kích thước, README và báo cáo kỹ thuật bản nháp. Game đoán vị trí là phần cộng thêm.

- Hạn nộp/vấn đáp: **[điền ngày]**.
- Thời gian làm mỗi ngày: **[điền số giờ]**.
- Tổng thời gian dự kiến: **55–65 giờ**; mốc nộp được: khoảng **30–35 giờ**.
- Triển khai mặc định: GitHub Pages.
- Bản đầu không có backend, đăng nhập hoặc chế độ Survival.

## Giai đoạn 1. Khung chung — 7–9 giờ

**Mục tiêu và kết quả:** Có trang chủ, điều hướng đến các màn hình game tạm, giao diện sáng/tối và lưu kết quả bằng `localStorage`.

**Công việc theo thứ tự:**

1. Tạo trang HTML, CSS chung và điểm vào JavaScript.
2. Dựng trang chủ cùng vùng hiển thị game.
3. Quy định mỗi game có hàm `mount(container, onFinish)`; viết điều hướng và dọn màn hình khi đổi game.
4. Viết hàm lưu/đọc điểm cao nhất và streak theo từng game.
5. Thêm nút sáng/tối và lưu lựa chọn.
6. Tạo màn hình tạm để thử mở từng game.

**File tạo/sửa:** `index.html`, `src/main.js`, `src/storage.js`, `src/style.css`, các file tạm trong `src/games/`.

**Tiêu chí hoàn thành:** Chạy bằng máy chủ tĩnh; chuyển qua lại giữa trang chủ và các màn hình game; tải lại trang vẫn thấy giao diện và kết quả thử được giữ lại.

**Rủi ro và cách giảm thiểu:** Các game phụ thuộc chặt vào khung chung. Chỉ giao tiếp qua `mount` và `onFinish`; mỗi game tự quản lý nội dung trong vùng được cấp.

## Giai đoạn 2. Wordle — 8–10 giờ

**Mục tiêu và kết quả:** Chơi trọn một ván đoán từ tiếng Anh 5 chữ trong tối đa 6 lượt, bằng bàn phím thật hoặc bàn phím ảo.

**Công việc theo thứ tự:**

1. Tìm bộ từ có giấy phép mở; **tự chọn lọc và tổng hợp** hai tập từ 5 chữ: đáp án và từ đoán hợp lệ. Không chép nguyên danh sách của game gốc. Ghi nguồn, giấy phép và cách chọn lọc trong README.
2. Tải dữ liệu và dựng lưới 6 × 5.
3. Xử lý nhập chữ, xóa, Enter và kiểm tra từ hợp lệ.
4. Chấm xanh/vàng/xám: xét chữ đúng vị trí trước, rồi xét số chữ còn lại để xử lý chữ lặp.
5. Cập nhật màu bàn phím, thông báo thắng/thua và nút chơi lại.
6. Gửi kết quả cho khung chung để lưu thống kê.

**File tạo/sửa:** `src/games/wordle.js`, `data/answers.txt`, `data/allowed.txt`, `src/style.css`, `README.md`.

**Tiêu chí hoàn thành:** Thử từ thiếu chữ, từ không hợp lệ và từ có chữ lặp; chơi thắng, thua sau 6 lượt và chơi lại; tải lại trang để kiểm tra thống kê.

**Rủi ro và cách giảm thiểu:** Nguồn từ có thể không cho phép tái sử dụng hoặc chứa từ quá lạ. Kiểm tra giấy phép trước khi dùng, lọc từ dễ hiểu và ghi nguồn ngay lúc tạo dữ liệu.

## Giai đoạn 3. Game ước lượng kích thước và mốc nộp được — 15–18 giờ

**Mục tiêu và kết quả:** Chơi đủ 10 vòng, xem tổng điểm. Website gồm khung chung, Wordle và game kích thước đã được deploy; có README và báo cáo kỹ thuật bản nháp.

**Công việc theo thứ tự:**

1. Đặt tên riêng cho game; tạo `objects.json` với 40–60 vật, kích thước và đơn vị; quy đổi về mét khi tính.
2. Chọn cặp vật không lặp trong một ván, với tỉ lệ thật từ `0,001` đến `1.000`.
3. Hiện vật tham chiếu, kích thước đã biết và vật cần đoán; đồng bộ ô nhập số với thanh trượt log.
4. Tính điểm mỗi vòng từ `|log10(số đoán / tỉ lệ thật)|`: đúng được 100 điểm, sai từ 100 lần trở lên được 0 điểm.
5. Hiện kết quả từng vòng, tổng kết sau 10 vòng và lưu điểm.
6. **Deploy bản hiện có lên GitHub Pages**; chơi lại hai game trên link công khai và sửa lỗi đường dẫn nếu có.
7. **Viết README và báo cáo bản nháp:** cách chạy, cách chơi, cấu trúc, nguồn dữ liệu, thuật toán, ảnh giao diện và kết quả kiểm thử. Ghi rõ game vị trí đang phát triển.

**File tạo/sửa:** `src/games/size.js`, `data/objects.json`, `src/style.css`, `README.md`, `docs/report.md` và cấu hình deploy nếu cần.

**Tiêu chí hoàn thành:** Đoán chính xác, lệch 10 lần và 100 lần để đối chiếu điểm 100, 50, 0; chơi đủ 10 vòng. Mở link GitHub Pages trên trình duyệt khác, chơi trọn Wordle và game kích thước. Người khác đọc README có thể chạy dự án.

**Rủi ro và cách giảm thiểu:** Dữ liệu vật thể không nhất quán; bản local chạy nhưng bản deploy lỗi. Dùng cùng một cách diễn giải kích thước cho từng vật, ghi nguồn số liệu và kiểm tra trực tiếp trên link deploy trước khi sang giai đoạn 4.

## Giai đoạn 4. Game đoán vị trí — phần cộng thêm — 17–20 giờ

**Mục tiêu và kết quả:** Xem ảnh, đặt ghim trên bản đồ, nhận điểm theo khoảng cách và tổng kết sau 5 vòng. Bản nộp được của giai đoạn 3 tiếp tục hoạt động.

**Công việc theo thứ tự:**

1. Chọn tối thiểu 30 ảnh tự chụp hoặc có giấy phép mở; ghi nguồn, giấy phép và tọa độ khi thêm từng ảnh.
2. Tạo `places.json` và lưu ảnh tĩnh trong `assets/places/`.
3. Thêm Leaflet, bản đồ OpenStreetMap và dòng ghi công.
4. Cho nhấp bản đồ để đặt hoặc đổi ghim; chỉ xác nhận sau khi có ghim.
5. Tính khoảng cách Haversine; điểm mỗi vòng là `round(1000 × max(0, 1 − khoảng_cách_km / 10000))`.
6. Hiện vị trí thật, khoảng cách và điểm; chọn 5 địa điểm không lặp rồi tổng kết.
7. Cập nhật bản deploy, README và báo cáo khi game đã chơi trọn ván.

**File tạo/sửa:** `src/games/location.js`, `data/places.json`, `assets/places/`, `index.html`, `src/style.css`, `README.md`, `docs/report.md`.

**Tiêu chí hoàn thành:** Đặt ghim gần và xa vị trí thật; chơi đủ 5 vòng; kiểm tra ảnh, bản đồ, ghi công và nguồn ảnh trên link deploy.

**Rủi ro và cách giảm thiểu:** Thu thập ảnh hợp lệ tốn thời gian; ô bản đồ cần Internet. Bắt đầu với 30 ảnh, ưu tiên ảnh tự chụp và kiểm tra từng ảnh trên bản deploy.

## Giai đoạn 5. Hoàn thiện UI và responsive — 6–7 giờ

**Mục tiêu và kết quả:** Các game đã hoàn thành có giao diện nhất quán, dễ chơi trên điện thoại và ở chế độ sáng/tối.

**Công việc theo thứ tự:**

1. Thống nhất màu, chữ, nút, thông báo và màn hình tổng kết.
2. Chỉnh trang chủ và từng game cho màn hình nhỏ.
3. Kiểm tra bàn phím Wordle, thanh trượt kích thước và bản đồ bằng thao tác chạm.
4. Bổ sung trạng thái tải dữ liệu/ảnh và thông báo ngắn khi tải thất bại.
5. Kiểm tra độ tương phản, nhãn nút và thao tác bằng bàn phím.

**File tạo/sửa:** `src/style.css`, `index.html`, các module game đã hoàn thành.

**Tiêu chí hoàn thành:** Chơi một ván mỗi game ở chiều rộng khoảng 360 px và trên máy tính; không cuộn ngang, nút dễ chạm, chữ đọc được trong cả hai giao diện.

**Rủi ro và cách giảm thiểu:** Ảnh và bản đồ làm vỡ bố cục. Giới hạn kích thước ảnh, cho bản đồ co theo vùng chứa và kiểm tra bằng DevTools.

## Giai đoạn 6. Chuẩn bị nộp bài — 5–7 giờ

**Mục tiêu và kết quả:** Bản deploy cuối cùng, README và báo cáo hoàn chỉnh; sinh viên giải thích được mã và sửa được thay đổi nhỏ khi vấn đáp.

**Công việc theo thứ tự:**

1. Chạy lại toàn bộ game đã hoàn thành trên link deploy; ghi kết quả kiểm thử vào báo cáo.
2. Cập nhật README theo tính năng thực tế, nguồn từ Wordle, nguồn vật thể, nguồn/giấy phép ảnh và link demo.
3. Hoàn thiện báo cáo: yêu cầu, kiến trúc, dữ liệu, thuật toán, giao diện, kiểm thử và giới hạn.
4. Tập trình bày luồng `main.js → game module → onFinish → storage.js`.
5. Sửa thử một thay đổi nhỏ ở mỗi game đã hoàn thành và giải thích tác động của nó.

**File tạo/sửa:** `README.md`, `docs/report.md`, các file cần chỉnh sau kiểm thử.

**Tiêu chí hoàn thành:** Người khác làm theo README để chạy được; link demo chơi trọn các game được ghi là hoàn thành; sinh viên giải thích được từng module và công thức tính điểm.

**Rủi ro và cách giảm thiểu:** Báo cáo mô tả tính năng chưa hoàn thành. Đối chiếu từng mục với bản deploy cuối và ghi rõ phần cộng thêm nào chưa có.

## Cấu trúc thư mục đề xuất

```text
web_game/
├── plan.md
├── README.md
├── index.html
├── src/
│   ├── main.js
│   ├── storage.js
│   ├── style.css
│   └── games/
│       ├── wordle.js
│       ├── size.js
│       └── location.js
├── data/
│   ├── answers.txt
│   ├── allowed.txt
│   ├── objects.json
│   └── places.json
├── assets/
│   └── places/
└── docs/
    └── report.md
```

## Điểm cắt giảm

Bỏ chế độ Survival trước. Nếu thiếu thời gian tiếp, **dừng sau giai đoạn 3**: giữ bản deploy gồm khung chung, Wordle, game kích thước, README và báo cáo nháp; hoàn thiện UI và tài liệu cho đúng những gì đã có. Game vị trí chỉ được ghi là hoàn thành khi đủ ảnh có nguồn, chơi trọn 5 vòng và chạy trên bản deploy.

## Câu hỏi vấn đáp có thể gặp

| Module | Câu hỏi | Gợi ý trả lời ngắn |
|---|---|---|
| Khung chung | Thêm game mới thế nào? | Tạo module có `mount(container, onFinish)`, thêm mục điều hướng và nơi lưu kết quả. |
| Khung chung | Vì sao dùng `localStorage`? | Bản đầu không có tài khoản hay backend; điểm cần tồn tại sau khi tải lại trang. |
| Wordle | Danh sách từ lấy ở đâu? | Tự chọn lọc từ nguồn có giấy phép mở, ghi nguồn trong README; không chép danh sách game gốc. |
| Wordle | Chấm chữ lặp thế nào? | Đánh dấu ô xanh trước, rồi dùng số chữ còn lại để xác định ô vàng. |
| Kích thước | Vì sao dùng log? | Đoán lớn gấp 10 lần và nhỏ bằng một phần mười có mức sai tương đương. |
| Kích thước | Thanh trượt log hoạt động thế nào? | Vị trí thanh trượt là số mũ; tỉ lệ đoán bằng `10` lũy thừa số mũ đó. |
| Vị trí | Haversine tính gì? | Khoảng cách gần đúng trên mặt cầu từ hai cặp vĩ độ, kinh độ. |
| Vị trí | Vì sao dùng ảnh tĩnh? | Dễ kiểm soát nguồn và giấy phép, không cần API ảnh trả phí. |

## Giả định

- Wordle dùng từ tiếng Anh 5 chữ. Nguồn mở cụ thể được chọn khi thực hiện, sau khi kiểm tra giấy phép và chất lượng từ.
- Streak là số ván liên tiếp đạt mục tiêu: Wordle giải đúng; game kích thước đạt ít nhất 600/1.000 điểm; game vị trí đạt ít nhất 3.000/5.000 điểm.
- Các game chọn nội dung ngẫu nhiên và không cần tài khoản.
- Chỉ lấy ý tưởng chơi; tên sản phẩm, giao diện, icon và dữ liệu đều tự làm hoặc dùng nguồn có giấy phép phù hợp.
