const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Optional Postgres support
require('dotenv').config();
let dbClient = null;
const DATABASE_URL = process.env.DATABASE_URL;
if(DATABASE_URL){
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: DATABASE_URL });
  dbClient = pool;
  console.log('Postgres pool created');
}

// Serve static files from public
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to return list data — reads from DB if available or falls back to JSON
app.get('/api/items', async (req, res) => {
  if(dbClient){
    try{
      const result = await dbClient.query('SELECT id, name, city, genre, website FROM items ORDER BY id');
      return res.json(result.rows);
    }catch(err){
      console.error('DB query failed', err);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  // Fallback
  const data = require('./data/items.json');
  res.json(data);
});

// Fallback to index.html for unknown routes (SPA-friendly)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
