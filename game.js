const LINES=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const boardEl=document.getElementById('board');
const statusEl=document.getElementById('status');
const aiBox=document.getElementById('ai');
let board,turn,over;

const cells=[...Array(9)].map((_,i)=>{
  const c=document.createElement('button');
  c.className='cell';
  c.onclick=()=>play(i);
  boardEl.appendChild(c);
  return c;
});

function getWinner(){
  for(const [a,b,c] of LINES){
    if(board[a] && board[a]===board[b] && board[a]===board[c]) return {p:board[a],line:[a,b,c]};
  }
  return null;
}

function render(){
  cells.forEach((c,i)=>{
    c.textContent=board[i]||'';
    c.className='cell'+(board[i]?' '+board[i]:'');
  });
}

function reset(){
  board=Array(9).fill(null);
  turn='X';
  over=false;
  statusEl.textContent="X's turn";
  render();
}

function play(i){
  if(over||board[i]) return;
  board[i]=turn;
  render();
  const w=getWinner();
  if(w){
    over=true;
    statusEl.textContent=w.p+' wins!';
    w.line.forEach(k=>cells[k].classList.add('win'));
    return;
  }
  if(board.every(Boolean)){
    over=true;
    statusEl.textContent="It's a draw";
    return;
  }
  turn=turn==='X'?'O':'X';
  statusEl.textContent=turn+"'s turn";
  if(aiBox.checked && turn==='O'){
    over=true;
    setTimeout(()=>{over=false;aiMove();},350);
  }
}

function findLine(p){
  for(const l of LINES){
    const v=l.map(k=>board[k]);
    if(v.filter(x=>x===p).length===2 && v.includes(null)) return l[v.indexOf(null)];
  }
  return -1;
}

function aiMove(){
  let m=findLine('O');
  if(m<0) m=findLine('X');
  if(m<0 && !board[4]) m=4;
  if(m<0){
    const empty=board.map((v,i)=>v?null:i).filter(v=>v!==null);
    m=empty[Math.floor(Math.random()*empty.length)];
  }
  play(m);
}

document.getElementById('reset').onclick=reset;
aiBox.onchange=reset;
reset();
