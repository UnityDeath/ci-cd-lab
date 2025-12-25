async function api(path, opts){
const res = await fetch(path, opts);
return res.json();
}


async function updateStatus(){
try{
const h = await api('/api/health');
document.getElementById('health').textContent = h.status;
const t = await api('/api/time');
document.getElementById('time').textContent = new Date(t.time).toLocaleString();
const v = await api('/api/visits');
document.getElementById('visits').textContent = v.visits;
}catch(e){
document.getElementById('health').textContent = 'error';
}
}


function kajsdn() {
    return 0;
}

async function loadTasks(){
const tasks = await api('/api/tasks');
const ul = document.getElementById('taskList');
ul.innerHTML = '';
tasks.forEach(t=>{
const li = document.createElement('li');
li.textContent = `${t.id}. ${t.title} — ${t.description}`;
ul.appendChild(li);
});
}


document.getElementById('taskForm').addEventListener('submit', async (e)=>{
e.preventDefault();
const title = document.getElementById('title').value.trim();
const desc = document.getElementById('desc').value.trim();
if(!title) return;
await fetch('/api/tasks', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,description:desc})});
document.getElementById('title').value='';
document.getElementById('desc').value='';
await loadTasks();
});


// init
updateStatus();
loadTasks();
setInterval(updateStatus, 15_000);