import mysql from 'mysql2/promise';
const conn = await mysql.createConnection({host:'45.79.40.132',port:3306,user:'siacecom_aapu',password:'Admin2104aapu*',database:'siacecom_misdelirios'});
const [tables] = await conn.query('SHOW TABLES');
console.log(tables.map(t=>Object.values(t)[0]).join(', '));
const t = tables.map(t=>Object.values(t)[0]);
for (const name of t.filter(x=>x.startsWith('cms_section'))) {
  const [rows] = await conn.query(`SELECT * FROM \`${name}\` LIMIT 1`);
  if (rows.length) {
    const cols = Object.keys(rows[0]);
    console.log('\n==', name, 'cols:', cols.join(','));
    for (const c of cols) {
      const v = String(rows[0][c] ?? '');
      console.log('   ', c, ':', v.slice(0,140).replace(/\n/g,' '));
    }
  }
}
await conn.end();
