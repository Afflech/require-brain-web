# Đoán Nhanh

Website gồm **Ô Chữ 5** (đoán từ trong 6 lượt) và **Tỉ Lệ Vạn Vật** (ước lượng kích thước qua 10 vòng). Chạy hoàn toàn trên trình duyệt, không cần backend.

**Ô Chữ 5** có tối đa hai gợi ý mỗi ván: loại ba chữ không có trong đáp án, rồi tiết lộ một chữ đúng vị trí. Kết quả thắng/thua và chuỗi thắng được lưu trên trình duyệt; ván dùng gợi ý không tăng chuỗi thắng.

Trong **Tỉ Lệ Vạn Vật**, chọn **Vật thể** hoặc **Địa lý**. Kéo mũi tên ở góc hình đỏ để đoán tỉ lệ, kéo thân hình để di chuyển mà không đổi đáp án. Nút **+/−** phóng cả cảnh. Khi chốt, hình đáp án chồng lên hình đoán, camera khớp cả hai và điểm chạy lên. Chế độ Địa lý đoán tỉ lệ diện tích quốc gia; kéo hình rộng/cao gấp đôi thì diện tích tăng gấp bốn. Ảnh thật của vật thể chỉ hiện trong hai ô thông tin bên dưới.

## Chạy thử

Trong thư mục dự án, chạy `python3 -m http.server 8000` rồi mở `http://localhost:8000`. Không mở trực tiếp `index.html` bằng `file://` vì trình duyệt sẽ chặn tải dữ liệu.

## Cấu trúc

- `src/main.js`: trang chủ và chuyển game.
- `src/games/wordle.js`: nhập từ, kiểm tra từ và chấm màu.
- `src/games/size.js`: chọn cặp vật hoặc quốc gia, kéo hình và tính điểm.
- `data/`: danh sách từ, vật thể và đường viền quốc gia đã tạo sẵn.
- `tools/build-countries.mjs`: script Node tạo lại dữ liệu địa lý; không chạy trên web.

## Dữ liệu và nguồn

Danh sách từ trong `data/answers.txt` và `data/allowed.txt` gồm **208 đáp án** và **600 từ đoán bổ sung**, đều là từ tiếng Anh 5 chữ được chọn lọc thủ công và kiểm tra chính tả. Nguồn tham khảo mở: [dwyl/english-words](https://github.com/dwyl/english-words), giấy phép [Unlicense](https://github.com/dwyl/english-words/blob/master/LICENSE.md). Không dùng danh sách đáp án hoặc thương hiệu của game gốc.

Kích thước trong `data/objects.json` là số đo tham khảo gần đúng theo chiều dài, chiều cao hoặc đường kính thường gặp, chỉ phục vụ trò chơi; kích thước thực tế có thể thay đổi theo mẫu vật.

Đường viền trong `data/countries.json` lấy từ [Natural Earth 1:110m qua world-atlas](https://github.com/topojson/world-atlas#countries-110mjson). [Natural Earth thuộc phạm vi công cộng](https://www.naturalearthdata.com/about/terms-of-use/). Script `tools/build-countries.mjs` chọn 30 quốc gia, chiếu từng nước bằng phép chiếu bảo toàn diện tích, rồi tính `areaKm2` bằng `d3.geoArea × 6371²`; không nhập tay diện tích. Để tạo lại dữ liệu: chạy `npm install` và `npm run build:countries`. Các gói npm chỉ dùng khi tạo dữ liệu, trang web vẫn là HTML/CSS/JS thuần.

## Deploy

Repository: [Afflech/doan-nhanh-web-game](https://github.com/Afflech/doan-nhanh-web-game) (riêng tư). Mã nguồn đã ở nhánh `main`. GitHub Pages chưa được bật; khi cần bản demo công khai, đổi mức hiển thị repo theo lựa chọn của chủ dự án rồi bật Pages từ thư mục gốc.

## Ảnh game kích thước

35 ảnh thật đã được lưu trong `assets/objects/` để game chạy cả khi không có mạng. Ảnh được thu nhỏ, chuyển sang WebP và thêm nền cho cùng kích thước khung. Tác giả, giấy phép và trang ảnh gốc:

| Vật | Tác giả | Giấy phép | Ảnh gốc |
|---|---|---|---|
| Hạt gạo | Vadakkan | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Rice_grains.jpg) |
| Hạt đậu xanh | Ivar Leidus | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Mung_beans_%28Vigna_radiata%29.jpg) |
| Hạt cà phê | MarkSweep | Public domain | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Roasted_coffee_beans.jpg) |
| Con kiến | Samantha Henneke from Seagrove, North Carolina, USA | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Red_Ant_-_March_2025.jpg) |
| Con ong mật | Andreas Trepte | [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Apis_mellifera_Western_honey_bee.jpg) |
| Con bướm | fesoj | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Fesoj_-_Papilio_machaon_%28by%29.jpg) |
| Đồng xu | Michael Sander | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Kiloware.JPG) |
| Viên bi | Wendy | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Marble_collector_-_Flickr_-_smkybear.jpg) |
| Nút áo | Europeana staff photographer | Public domain | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Reserveknapper_til_Hans%27_uniform.jpg) |
| Cục tẩy | Evan-Amos | Public domain | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Office-pink-erasers.jpg) |
| Chìa khóa | Trougnouf | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Solex_99_30_padlock_with_keys_%28DSCF2659%29.jpg) |
| Quả trứng gà | Garitzko | Public domain | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Brown_chicken_egg.jpg) |
| Thẻ ngân hàng | Lotus Head from Johannesburg, Gauteng, South Africa | [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Credit-cards.jpg) |
| Điện thoại | Sage Ross | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Wikipedia_homepage_on_a_large_Android_phone%2C_2015-04-16.jpg) |
| Bút chì | Original uploader was Dmgerman at en.wikipedia | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Pencils_hb.jpg) |
| Bàn tay người lớn | Genusfotografen (Tomas Gunnarsson) / Wikimedia | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Hand%2C_fingers_-_back.jpg) |
| Quyển sách | NYC Wanderer (Kevin Eng) | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg) |
| Chai nước nhỏ | Amraepowell | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Multi-use_water_bottle.JPG) |
| Quả bóng đá | Rick Dikeman | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Football_in_Bloomington%2C_Indiana%2C_1995.jpg) |
| Thước kẻ | Geof | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Diverse%C2%B7Ma%C3%9Fst%C3%A4be%2C15.365.jpg) |
| Bàn phím máy tính | Marius Iordache | Public domain | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Black_computer_keyboard.jpg) |
| Gối ngủ | Amin | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Pillows_on_a_hotel_bed.jpg) |
| Cây đàn guitar | User:Martin Möller Talk | [CC BY-SA 2.0 de](https://creativecommons.org/licenses/by-sa/2.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:GuitareClassique5.png) |
| Bàn học | John Townsend | CC0 | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Bureau_table_MET_DP108643.jpg) |
| Xe đạp | 齐健 from Peking, People's Republic of China | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Left_side_of_Flying_Pigeon.jpg) |
| Người trưởng thành | Weltenbummler84 | [CC BY-SA 2.0 de](https://creativecommons.org/licenses/by-sa/2.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Akha_cropped_hires.JPG) |
| Cửa ra vào | Sergey A. Demidov / Sergey A. Demidov | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:20260114_The_Door.jpg) |
| Giường đôi | R-E-AL (talk / contribs / Gallery)  (German Wikipedia) | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:2008-04-12_Freilichtmuseum_Detmold_%2811%29.jpg) |
| Ô tô con | Daniel Lu (User:dllu) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:White_Toyota_Corolla_sedan_in_San_Jose_California_dllu.jpg) |
| Xe buýt | SIA321 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:LTZ1328-19-20241030-160332.jpg) |
| Cột đèn đường | Mschel | Public domain | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Street_lamp.jpg) |
| Hồ bơi thi đấu | Vic Brincat from Keswick, Ontario, Canada | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:Backyardpool.jpg) |
| Máy bay chở khách | G B_NZ | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) | [Xem ảnh](https://commons.wikimedia.org/wiki/File:United_A320_N405UA_at_BOS_%2833787222465%29.jpg) |
| Sân bóng đá | Victor | [Unsplash License](https://unsplash.com/license) | [Xem ảnh](https://unsplash.com/photos/empty-football-field-in-aerial-photgraphy-raesgfwU7iM) |
| Tháp Eiffel | Calvin Craig | [Unsplash License](https://unsplash.com/license) | [Xem ảnh](https://unsplash.com/photos/0UGBFphLYeE) |
