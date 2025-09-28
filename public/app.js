async function fetchItems(){
  const res = await fetch('/api/items');
  if(!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

function createCard(item){
  const el = document.createElement('article');
  el.className = 'card';
  el.innerHTML = `
    <h3>${escapeHtml(item.name)}</h3>
    <p class="meta">${escapeHtml(item.city)} • ${escapeHtml(item.genre)}</p>
    <p><a href="${escapeAttr(item.website)}" target="_blank" rel="noopener">Visit website</a></p>
  `;
  return el;
}

function escapeHtml(s){
  if(!s) return '';
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function escapeAttr(s){
  return escapeHtml(s).replace(/"/g,'&quot;');
}

function populateGenreSelect(items){
  const sel = document.getElementById('genre');
  const genres = Array.from(new Set(items.map(i=>i.genre).filter(Boolean))).sort();
  for(const g of genres){
    const opt = document.createElement('option');
    opt.value = g; opt.textContent = g;
    sel.appendChild(opt);
  }
}

function applyFilters(items){
  const q = document.getElementById('q').value.toLowerCase().trim();
  const genre = document.getElementById('genre').value;
  return items.filter(i => {
    if(genre && i.genre !== genre) return false;
    if(!q) return true;
    return (i.name+ ' ' + i.city + ' ' + i.genre).toLowerCase().includes(q);
  });
}

(async function(){
  try{
    const items = await fetchItems();
    populateGenreSelect(items);
    const list = document.getElementById('list');

    function render(){
      list.innerHTML='';
      const filtered = applyFilters(items);
      if(filtered.length===0){
        list.textContent = 'No results';
        return;
      }
      for(const it of filtered){
        list.appendChild(createCard(it));
      }
    }

    document.getElementById('filter-form').addEventListener('input', render);
    render();
  }catch(err){
    console.error(err);
    document.getElementById('list').textContent = 'Failed to load data.';
  }
})();
