const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
const items = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'items.json'), 'utf8'));

async function main(){
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try{
    console.log('Creating table...');
    await client.query(sql);

    console.log('Clearing existing rows...');
    await client.query('DELETE FROM items');

    console.log('Inserting items...');
    const insertText = 'INSERT INTO items(id, name, city, genre, website) VALUES($1,$2,$3,$4,$5)';
    for(const it of items){
      await client.query(insertText, [it.id, it.name, it.city, it.genre, it.website]);
    }

    console.log('Done seeding database');
  }catch(err){
    console.error(err);
    process.exitCode = 1;
  }finally{
    await client.end();
  }
}

main();
