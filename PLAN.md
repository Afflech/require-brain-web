# Kế hoạch demo game đoán nhanh

**Mục tiêu:** Có website chơi được để demo vào sáng mai. Làm bằng HTML, CSS, JavaScript thuần; dữ liệu tĩnh; không backend. Sau **mỗi giai đoạn** đều mở trình duyệt và demo được phần đã xong.

## 1. Khung chung tối giản — 1–2 giờ

- **Làm:** Tạo trang chủ có tên sản phẩm, nút vào Wordle và game kích thước; tạo vùng hiển thị game và nút về trang chủ. Dùng một CSS chung, chỉ cần bố cục rõ trên máy tính và điện thoại.
- **File:** `index.html`, `src/main.js`, `src/style.css`.
- **Demo xong giai đoạn:** Mở bằng máy chủ tĩnh, chuyển được giữa trang chủ và hai màn hình game tạm, quay lại được.
- **Rủi ro:** Mất thời gian trang trí. **Cách xử lý:** Dùng giao diện chữ, màu và nút đơn giản; chưa làm icon, sáng/tối hay hiệu ứng.

## 2. Wordle — 3–4 giờ

- **Làm:** Tự chọn lọc từ tiếng Anh 5 chữ từ nguồn có giấy phép mở, tạo danh sách đáp án và từ đoán hợp lệ; ghi nguồn ngắn trong README. Dựng lưới 6 lượt, bàn phím ảo và hỗ trợ bàn phím thật; kiểm tra từ; chấm xanh/vàng/xám đúng cả khi có chữ lặp; hiện thắng/thua và chơi lại.
- **File:** `src/games/wordle.js`, `data/answers.txt`, `data/allowed.txt`, `src/style.css`, `README.md`.
- **Demo xong giai đoạn:** Chơi trọn một ván thắng và một ván thua; thử từ không hợp lệ và từ có chữ lặp. Đây là **bản demo tối thiểu** nếu hết thời gian.
- **Rủi ro:** Chọn từ hoặc chấm chữ lặp sai. **Cách xử lý:** Dùng tập từ nhỏ đã kiểm tra thủ công; chấm chữ đúng vị trí trước, rồi mới xét chữ còn lại.

## 3. Deploy GitHub Pages ngay sau Wordle — 30–60 phút

- **Làm:** Đưa bản khung chung + Wordle lên GitHub Pages; sửa đường dẫn tài nguyên nếu bản online không tải được; thêm link demo và cách chạy ngắn vào README.
- **File:** `README.md`; chỉnh đường dẫn trong `index.html` hoặc `src/` nếu cần.
- **Demo xong giai đoạn:** Mở link GitHub Pages bằng trình duyệt khác và chơi trọn Wordle. Giữ link này làm bản dự phòng để trình bày.
- **Rủi ro:** Chưa có repository/remote GitHub hoặc Pages cần thời gian xuất bản. **Cách xử lý:** Tạo repository và bật Pages ngay khi Wordle chạy local; luôn giữ bản chạy local để demo.

## 4. Game ước lượng kích thước — 2–3 giờ

- **Làm:** Tạo 30–40 vật có tên, kích thước và đơn vị trong JSON. Mỗi vòng hiện vật tham chiếu và vật cần đoán; nhập tỉ lệ bằng số hoặc thanh trượt log. Chơi 10 vòng, chấm tối đa 100 điểm/vòng theo `max(0, 100 × (1 − |log10(đoán / thật)| / 2))`, hiện đáp án và tổng điểm; có nút chơi lại. Cập nhật GitHub Pages sau khi chạy local ổn.
- **File:** `data/objects.json`, `src/games/size.js`, `src/main.js`, `src/style.css`, `README.md`.
- **Demo xong giai đoạn:** Chơi đủ 10 vòng trên máy local và link online; kiểm tra đoán đúng được 100 điểm, lệch 10 lần được 50, lệch 100 lần được 0.
- **Rủi ro:** Dữ liệu không nhất quán hoặc chọn cặp có tỉ lệ quá khó. **Cách xử lý:** Quy đổi mọi kích thước về mét khi tính, chỉ chọn cặp có tỉ lệ trong khoảng 0,001–1.000 và không lặp cặp trong một ván.

## Cấu trúc tối thiểu

```text
index.html
README.md
PLAN.md
src/main.js
src/style.css
src/games/wordle.js
src/games/size.js
data/answers.txt
data/allowed.txt
data/objects.json
```

**Cắt giảm nếu sát giờ:** Ưu tiên giữ Wordle chạy online. Rút danh sách vật xuống 30 mục; nếu game kích thước chưa xong, ẩn nút vào game đó khỏi bản demo. Không làm game vị trí, sáng/tối, Survival, báo cáo dài hoặc lưu streak trong đợt này.

**Giả định:** Chưa có giờ nộp cụ thể; tổng thời gian thực hiện khoảng 7–10 giờ. Chưa có code trong repo. GitHub Pages cần tài khoản và repository GitHub, được chuẩn bị ở giai đoạn 3.
