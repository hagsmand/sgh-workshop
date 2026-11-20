// Product catalogue for the workshop dataset (synthetic data, not real Global House data).
// `story` is only used by seed.js to plant a few stock situations to discover:
//   out  = sold out today
//   low  = at or below reorder point
//   over = more than 90 days of cover

export const CATEGORIES = {
  CEM: { en: 'Cement & Structure', th: 'ปูนและโครงสร้าง', margin: 0.15, demand: 9 },
  ROF: { en: 'Roofing', th: 'หลังคา', margin: 0.24, demand: 4 },
  PLB: { en: 'Plumbing', th: 'ประปา', margin: 0.27, demand: 7 },
  ELC: { en: 'Electrical', th: 'ไฟฟ้า', margin: 0.26, demand: 8 },
  PNT: { en: 'Paint', th: 'สี', margin: 0.3, demand: 5 },
  TIL: { en: 'Tiles & Flooring', th: 'กระเบื้องและพื้น', margin: 0.28, demand: 5 },
  TLS: { en: 'Tools', th: 'เครื่องมือช่าง', margin: 0.3, demand: 3 },
  GRD: { en: 'Garden', th: 'สวน', margin: 0.32, demand: 6 },
  DEC: { en: 'Home Decor', th: 'ของตกแต่งบ้าน', margin: 0.38, demand: 3 },
  DRW: { en: 'Doors & Windows', th: 'ประตูหน้าต่าง', margin: 0.27, demand: 1.5 },
};

export const PRODUCTS = [
  // Cement & Structure
  { cat: 'CEM', th: 'ปูนซีเมนต์ปอร์ตแลนด์ 50 กก.', en: 'Portland cement 50 kg', unit: 'bag', price: 135, story: 'out' },
  { cat: 'CEM', th: 'ปูนฉาบสำเร็จรูป 40 กก.', en: 'Ready-mix plaster 40 kg', unit: 'bag', price: 95 },
  { cat: 'CEM', th: 'ปูนกาวซีเมนต์ 20 กก.', en: 'Tile adhesive 20 kg', unit: 'bag', price: 165 },
  { cat: 'CEM', th: 'เหล็กเส้นกลม 9 มม. ยาว 10 เมตร', en: 'Round steel bar 9 mm x 10 m', unit: 'piece', price: 185 },
  { cat: 'CEM', th: 'ลวดผูกเหล็ก 1 กก.', en: 'Tie wire 1 kg', unit: 'roll', price: 58, story: 'out' },
  { cat: 'CEM', th: 'อิฐมวลเบา 7.5x20x60 ซม.', en: 'Lightweight brick (AAC) 7.5x20x60 cm', unit: 'piece', price: 38 },
  // Roofing
  { cat: 'ROF', th: 'กระเบื้องหลังคาลอนคู่ สีแดง', en: 'Corrugated roof tile, red', unit: 'piece', price: 42 },
  { cat: 'ROF', th: 'เมทัลชีทหลังคา 0.35 มม. ยาว 3 เมตร', en: 'Metal roofing sheet 0.35 mm x 3 m', unit: 'sheet', price: 420, story: 'low' },
  { cat: 'ROF', th: 'ฉนวนกันความร้อนใต้หลังคา 1.2x20 ม.', en: 'Roof insulation foil 1.2 x 20 m', unit: 'roll', price: 1290 },
  { cat: 'ROF', th: 'สกรูยิงหลังคา 2 นิ้ว (กล่อง 100 ตัว)', en: 'Roofing screws 2" (box of 100)', unit: 'box', price: 145 },
  { cat: 'ROF', th: 'ครอบสันหลังคา', en: 'Roof ridge cap', unit: 'piece', price: 95 },
  { cat: 'ROF', th: 'รางน้ำฝน PVC ยาว 3 เมตร', en: 'PVC rain gutter 3 m', unit: 'piece', price: 220 },
  // Plumbing
  { cat: 'PLB', th: 'ท่อ PVC 1/2 นิ้ว ยาว 4 เมตร', en: 'PVC pipe 1/2" x 4 m', unit: 'piece', price: 49, story: 'low' },
  { cat: 'PLB', th: 'ข้อต่อตรง PVC 1/2 นิ้ว', en: 'PVC coupling 1/2"', unit: 'piece', price: 6, story: 'low' },
  { cat: 'PLB', th: 'สายฉีดชำระสเตนเลส', en: 'Stainless bidet spray set', unit: 'set', price: 290 },
  { cat: 'PLB', th: 'ก๊อกน้ำสนาม 1/2 นิ้ว', en: 'Garden faucet 1/2"', unit: 'piece', price: 85 },
  { cat: 'PLB', th: 'ถังเก็บน้ำ 1,000 ลิตร', en: 'Water tank 1,000 L', unit: 'piece', price: 3490 },
  { cat: 'PLB', th: 'กาวทาท่อ PVC 250 กรัม', en: 'PVC pipe cement 250 g', unit: 'can', price: 79, story: 'low' },
  // Electrical
  { cat: 'ELC', th: 'สายไฟ VAF 2x1.5 ตร.มม. 100 ม.', en: 'VAF cable 2x1.5 sq.mm x 100 m', unit: 'roll', price: 1450 },
  { cat: 'ELC', th: 'เบรกเกอร์ 20A 1 โพล', en: 'Circuit breaker 20A 1-pole', unit: 'piece', price: 165 },
  { cat: 'ELC', th: 'ปลั๊กพ่วง 4 ช่อง ยาว 5 เมตร', en: 'Power strip 4 outlets 5 m', unit: 'piece', price: 259, story: 'low' },
  { cat: 'ELC', th: 'หลอด LED 12W แสงขาว', en: 'LED bulb 12W daylight', unit: 'piece', price: 59, story: 'out' },
  { cat: 'ELC', th: 'สวิตช์ไฟ 1 ทาง', en: '1-way light switch', unit: 'piece', price: 35 },
  { cat: 'ELC', th: 'ตู้ไฟ Consumer Unit 6 ช่อง', en: 'Consumer unit 6-way', unit: 'piece', price: 890 },
  // Paint
  { cat: 'PNT', th: 'สีน้ำอะคริลิกทาภายนอก สีขาว 9 ลิตร', en: 'Exterior acrylic paint, white 9 L', unit: 'can', price: 1190, story: 'low' },
  { cat: 'PNT', th: 'สีน้ำอะคริลิกทาภายใน สีขาว 9 ลิตร', en: 'Interior acrylic paint, white 9 L', unit: 'can', price: 890 },
  { cat: 'PNT', th: 'สีรองพื้นปูนใหม่ 9 ลิตร', en: 'New-plaster primer 9 L', unit: 'can', price: 990 },
  { cat: 'PNT', th: 'สีน้ำมันทาเหล็ก สีเทา 1 ลิตร', en: 'Enamel paint for steel, grey 1 L', unit: 'can', price: 245 },
  { cat: 'PNT', th: 'เทปกาวย่น 24 มม.', en: 'Masking tape 24 mm', unit: 'roll', price: 25 },
  { cat: 'PNT', th: 'น้ำยากันซึมผสมปูน 5 ลิตร', en: 'Cement waterproofing additive 5 L', unit: 'can', price: 420, story: 'out', season: 1.0 },
  // Tiles & Flooring
  { cat: 'TIL', th: 'กระเบื้องปูพื้น 60x60 ซม. ลายหินอ่อน (กล่อง 4 แผ่น)', en: 'Floor tile 60x60 cm marble look (box of 4)', unit: 'box', price: 540 },
  { cat: 'TIL', th: 'กระเบื้องบุผนัง 30x60 ซม. สีขาว (กล่อง)', en: 'Wall tile 30x60 cm white (box)', unit: 'box', price: 360 },
  { cat: 'TIL', th: 'กระเบื้องยางลายไม้ (กล่อง 2 ตร.ม.)', en: 'Vinyl plank, wood look (box of 2 sq.m)', unit: 'box', price: 690 },
  { cat: 'TIL', th: 'ยาแนวกระเบื้อง 1 กก.', en: 'Tile grout 1 kg', unit: 'bag', price: 55 },
  { cat: 'TIL', th: 'ไม้พื้นลามิเนต 8 มม. (กล่อง)', en: 'Laminate flooring 8 mm (box)', unit: 'box', price: 760 },
  { cat: 'TIL', th: 'บัวพื้น PVC ยาว 2.4 ม.', en: 'PVC skirting board 2.4 m', unit: 'piece', price: 129 },
  // Tools
  { cat: 'TLS', th: 'สว่านไฟฟ้า 13 มม. 600 วัตต์', en: 'Electric drill 13 mm 600 W', unit: 'piece', price: 1190 },
  { cat: 'TLS', th: 'ค้อนหงอน 16 ออนซ์', en: 'Claw hammer 16 oz', unit: 'piece', price: 129 },
  { cat: 'TLS', th: 'ตลับเมตร 5 เมตร', en: 'Tape measure 5 m', unit: 'piece', price: 79 },
  { cat: 'TLS', th: 'ชุดไขควง 6 ชิ้น', en: 'Screwdriver set 6 pcs', unit: 'set', price: 199 },
  { cat: 'TLS', th: 'ใบเลื่อยวงเดือน 7 นิ้ว', en: 'Circular saw blade 7"', unit: 'piece', price: 249, story: 'low' },
  { cat: 'TLS', th: 'ถุงมือผ้าเคลือบยาง', en: 'Rubber-coated work gloves', unit: 'pair', price: 39 },
  // Garden
  { cat: 'GRD', th: 'สายยางรดน้ำ 5/8 นิ้ว ยาว 20 ม.', en: 'Garden hose 5/8" x 20 m', unit: 'roll', price: 459, story: 'low' },
  { cat: 'GRD', th: 'ดินปลูกต้นไม้ 20 ลิตร', en: 'Potting soil 20 L', unit: 'bag', price: 79 },
  { cat: 'GRD', th: 'กระถางต้นไม้พลาสติก 12 นิ้ว', en: 'Plastic plant pot 12"', unit: 'piece', price: 59 },
  { cat: 'GRD', th: 'ปุ๋ยสูตร 15-15-15 ขนาด 1 กก.', en: 'Fertilizer 15-15-15, 1 kg', unit: 'bag', price: 55 },
  { cat: 'GRD', th: 'กรรไกรตัดแต่งกิ่ง', en: 'Pruning shears', unit: 'piece', price: 189 },
  { cat: 'GRD', th: 'รั้วตาข่ายพลาสติกสีเขียว', en: 'Green plastic mesh fence', unit: 'roll', price: 349, story: 'over' },
  // Home Decor
  { cat: 'DEC', th: 'ผ้าม่านกันแสง 140x220 ซม.', en: 'Blackout curtain 140x220 cm', unit: 'piece', price: 590 },
  { cat: 'DEC', th: 'โคมไฟตั้งโต๊ะ', en: 'Table lamp', unit: 'piece', price: 450 },
  { cat: 'DEC', th: 'พรมปูพื้น 160x230 ซม.', en: 'Floor rug 160x230 cm', unit: 'piece', price: 1290, story: 'over' },
  { cat: 'DEC', th: 'กรอบรูปไม้ 8x10 นิ้ว', en: 'Wooden photo frame 8x10"', unit: 'piece', price: 129, story: 'over' },
  { cat: 'DEC', th: 'นาฬิกาแขวนผนัง 12 นิ้ว', en: 'Wall clock 12"', unit: 'piece', price: 259 },
  { cat: 'DEC', th: 'ชั้นวางของไม้ 3 ชั้น', en: 'Wooden shelf, 3-tier', unit: 'piece', price: 890, story: 'over' },
  // Doors & Windows
  { cat: 'DRW', th: 'ประตู UPVC ห้องน้ำ 70x200 ซม.', en: 'UPVC bathroom door 70x200 cm', unit: 'piece', price: 1590 },
  { cat: 'DRW', th: 'หน้าต่างอลูมิเนียมบานเลื่อน 120x110 ซม.', en: 'Aluminium sliding window 120x110 cm', unit: 'piece', price: 2890 },
  { cat: 'DRW', th: 'มือจับประตูสเตนเลส', en: 'Stainless door handle', unit: 'set', price: 349 },
  { cat: 'DRW', th: 'บานพับสเตนเลส 4 นิ้ว', en: 'Stainless hinge 4"', unit: 'pair', price: 79 },
  { cat: 'DRW', th: 'กลอนประตูสเตนเลส', en: 'Stainless door bolt', unit: 'piece', price: 59 },
  { cat: 'DRW', th: 'มุ้งลวดสำเร็จรูป 80x120 ซม.', en: 'Ready-made window insect screen 80x120 cm', unit: 'piece', price: 390 },
];
