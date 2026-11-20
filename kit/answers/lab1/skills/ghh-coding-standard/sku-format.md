# SKU format

`GH-<CAT>-<NNNN>`

| Code | Category |
|------|----------|
| CEM | Cement & Structure (ปูนและโครงสร้าง) |
| ROF | Roofing (หลังคา) |
| PLB | Plumbing (ประปา) |
| ELC | Electrical (ไฟฟ้า) |
| PNT | Paint (สี) |
| TIL | Tiles & Flooring (กระเบื้องและพื้น) |
| TLS | Tools (เครื่องมือช่าง) |
| GRD | Garden (สวน) |
| DEC | Home Decor (ของตกแต่งบ้าน) |
| DRW | Doors & Windows (ประตูหน้าต่าง) |

`NNNN` is four digits starting at 1001 within each category.

Valid pattern: `/^GH-(CEM|ROF|PLB|ELC|PNT|TIL|TLS|GRD|DEC|DRW)-\d{4}$/`

Branch codes: `KKN` Khon Kaen, `ROE` Roi Et, `UDN` Udon Thani.
