import { writeFileSync } from "node:fs";
import atlas from "world-atlas/countries-110m.json" with { type: "json" };
import { feature } from "topojson-client";
import { geoArea, geoAzimuthalEqualArea, geoCentroid, geoPath } from "d3-geo";

const earthRadiusKm = 6371;
const names = {
  "643": "Nga", "124": "Canada", "840": "Hoa Kỳ", "156": "Trung Quốc",
  "076": "Brazil", "036": "Úc", "356": "Ấn Độ", "032": "Argentina",
  "398": "Kazakhstan", "180": "CHDC Congo", "012": "Algeria", "304": "Greenland",
  "484": "Mexico", "682": "Ả Rập Xê Út", "360": "Indonesia", "434": "Libya",
  "364": "Iran", "496": "Mông Cổ", "604": "Peru", "710": "Nam Phi",
  "818": "Ai Cập", "566": "Nigeria", "392": "Nhật Bản", "276": "Đức",
  "704": "Việt Nam", "380": "Ý", "826": "Vương quốc Anh", "352": "Iceland",
  "056": "Bỉ", "422": "Liban"
};

const countries = feature(atlas, atlas.objects.countries).features
  .filter(country => names[country.id])
  .map(country => {
    const [longitude, latitude] = geoCentroid(country);
    const projection = geoAzimuthalEqualArea()
      .rotate([-longitude, -latitude])
      .scale(earthRadiusKm)
      .translate([0, 0])
      .precision(1);
    const shape = geoPath(projection);
    const [[left, top], [right, bottom]] = shape.bounds(country);
    projection.translate([-left, -top]);
    return {
      name: names[country.id],
      areaKm2: Math.round(geoArea(country) * earthRadiusKm ** 2),
      path: shape.digits(2)(country),
      width: Math.round((right - left) * 100) / 100,
      height: Math.round((bottom - top) * 100) / 100
    };
  });

if (countries.length !== Object.keys(names).length) throw new Error("Thiếu quốc gia trong countries-110m.");
writeFileSync(new URL("../data/countries.json", import.meta.url), `${JSON.stringify(countries, null, 2)}\n`);
console.log(`Đã tạo ${countries.length} quốc gia.`);
