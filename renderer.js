const address = document.getElementById('address')
const back = document.getElementById('back')
const forward = document.getElementById('forward')
const reload = document.getElementById('reload')
const webview = document.getElementById('webview')
const toggleBookmarks = document.getElementById('toggle-bookmarks')
const bookmarksPane = document.getElementById('bookmarks-pane')
const bookmarksEl = document.getElementById('bookmarks')
const bookmarkPageBtn = document.getElementById('bookmark-page')
const addBookmarkBtn = document.getElementById('add-bookmark')
const newBmTitle = document.getElementById('new-bm-title')
const newBmUrl = document.getElementById('new-bm-url')
const clearBookmarks = document.getElementById('clear-bookmarks')
const exportBookmarksBtn = document.getElementById('export-bookmarks')
const importBookmarksBtn = document.getElementById('import-bookmarks-btn')
const importBookmarksInput = document.getElementById('import-bookmarks')
const openSettings = document.getElementById('open-settings')
const settings = document.getElementById('settings')
const closeSettings = document.getElementById('close-settings')
const saveSettings = document.getElementById('save-settings')
const themeColor = document.getElementById('theme-color')
const bgColor = document.getElementById('bg-color')
const fontSelect = document.getElementById('font-select')
const layoutSelect = document.getElementById('layout-select')

function loadBookmarks(){
  const raw = localStorage.getItem('bookmarks')
  try{
    return raw? JSON.parse(raw): []
  }catch(e){
    return []
  }
}

function saveBookmarks(list){
  localStorage.setItem('bookmarks', JSON.stringify(list))
}

function renderBookmarks(){
  const list = loadBookmarks()
  bookmarksEl.innerHTML = ''
  list.forEach((b, i)=>{
    const el = document.createElement('div')
    el.className = 'bookmark'
    el.innerHTML = `<a href="#">${escapeHtml(b.title || b.url)}</a><div class="bm-actions"><button data-i="${i}" class="open">Open</button><button data-i="${i}" class="delete">✕</button></div>`
    bookmarksEl.appendChild(el)
  })
}

function escapeHtml(s){return (s+'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

bookmarksEl.addEventListener('click', e=>{
  const btn = e.target.closest('button')
  if(!btn) return
  const i = Number(btn.dataset.i)
  const list = loadBookmarks()
  if(btn.classList.contains('open')){
    openUrl(list[i].url)
  }else if(btn.classList.contains('delete')){
    list.splice(i,1)
    saveBookmarks(list)
    renderBookmarks()
  }
})

addBookmarkBtn.addEventListener('click', ()=>{
  const url = newBmUrl.value.trim()
  const title = newBmTitle.value.trim() || url
  if(!url) return
  const list = loadBookmarks()
  list.unshift({title, url: normalizeUrl(url)})
  saveBookmarks(list)
  renderBookmarks()
  newBmTitle.value = newBmUrl.value = ''
})

clearBookmarks.addEventListener('click', ()=>{
  if(confirm('Clear all bookmarks?')){
    saveBookmarks([])
    renderBookmarks()
  }
})

exportBookmarksBtn.addEventListener('click', ()=>{
  const list = loadBookmarks()
  const data = JSON.stringify(list, null, 2)
  const blob = new Blob([data], {type: 'application/json'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const now = new Date().toISOString().slice(0,10)
  a.href = url
  a.download = `bookmarks-${now}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
})

importBookmarksBtn.addEventListener('click', ()=> importBookmarksInput.click())
importBookmarksInput.addEventListener('change', e=>{
  const f = e.target.files && e.target.files[0]
  if(!f) return
  const reader = new FileReader()
  reader.onload = ()=>{
    try{
      const parsed = JSON.parse(reader.result)
      if(!Array.isArray(parsed)) throw new Error('Invalid format')
      const replace = confirm('Replace existing bookmarks? OK=Replace, Cancel=Merge')
      const existing = loadBookmarks()
      let result = parsed
      if(!replace){
        result = mergeBookmarks(existing, parsed)
      }
      saveBookmarks(result)
      renderBookmarks()
      importBookmarksInput.value = ''
      alert('Bookmarks imported')
    }catch(err){
      alert('Failed to import bookmarks: ' + err.message)
    }
  }
  reader.readAsText(f)
})

function mergeBookmarks(a, b){
  const map = new Map()
  a.concat(b).forEach(item=>{
    if(item && item.url) map.set(item.url, item)
  })
  return Array.from(map.values())
}

bookmarkPageBtn.addEventListener('click', ()=>{
  const url = webview.getURL()
  const title = url
  const list = loadBookmarks()
  list.unshift({title, url})
  saveBookmarks(list)
  renderBookmarks()
})

toggleBookmarks.addEventListener('click', ()=>{
  bookmarksPane.classList.toggle('hidden')
})

back.addEventListener('click', ()=> webview.canGoBack() && webview.goBack())
forward.addEventListener('click', ()=> webview.canGoForward() && webview.goForward())
reload.addEventListener('click', ()=> webview.reload())

address.addEventListener('keydown', e=>{
  if(e.key === 'Enter') openUrl(address.value)
})

function normalizeUrl(v){
  if(v.startsWith('http://') || v.startsWith('https://')) return v
  if(v.includes(' ')) return `https://www.google.com/search?q=${encodeURIComponent(v)}`
  return `https://${v}`
}

function openUrl(v){
  const url = normalizeUrl(v)
  webview.loadURL(url)
}

webview.addEventListener('did-start-loading', ()=>{
  address.value = webview.getURL()
})

webview.addEventListener('did-stop-loading', ()=>{
  address.value = webview.getURL()
})

function loadSettings(){
  const s = JSON.parse(localStorage.getItem('settings') || '{}')
  if(s.themeColor) document.documentElement.style.setProperty('--accent', s.themeColor)
  if(s.bgColor) document.documentElement.style.setProperty('--panel', s.bgColor)
  if(s.font) document.documentElement.style.setProperty('--font-family', s.font)
  if(s.layout === 'top') document.body.classList.add('layout-top')
  themeColor.value = s.themeColor || '#7c3aed'
  bgColor.value = s.bgColor || '#0b1220'
  fontSelect.value = s.font || getComputedStyle(document.documentElement).getPropertyValue('--font-family')
  layoutSelect.value = s.layout || 'left'
}

saveSettings.addEventListener('click', ()=>{
  const s = {themeColor: themeColor.value, bgColor: bgColor.value, font: fontSelect.value, layout: layoutSelect.value}
  localStorage.setItem('settings', JSON.stringify(s))
  applySettings(s)
  settings.classList.add('hidden')
})

closeSettings.addEventListener('click', ()=> settings.classList.add('hidden'))
openSettings.addEventListener('click', ()=> settings.classList.remove('hidden'))

function applySettings(s){
  if(s.themeColor) document.documentElement.style.setProperty('--accent', s.themeColor)
  if(s.bgColor) document.documentElement.style.setProperty('--panel', s.bgColor)
  if(s.font) document.documentElement.style.setProperty('--font-family', s.font)
  document.body.classList.toggle('layout-top', s.layout === 'top')
}

function init(){
  renderBookmarks()
  loadSettings()
  const s = JSON.parse(localStorage.getItem('settings') || '{}')
  if(Object.keys(s).length) applySettings(s)
}

init()
