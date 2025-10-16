// MECH JS — full features with YouTube IFrame control
let YTAPIReady_mech = false;
function onYouTubeIframeAPIReady(){ YTAPIReady_mech = true; }

document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.card'));
  let currentPlayer = null; let currentIndex = -1;
  const modal = document.getElementById('modal'), playerWrap = document.getElementById('playerWrap');
  const vol = document.getElementById('vol'), rate = document.getElementById('rate'), muteBtn = document.getElementById('mute');
  const prevBtn = document.getElementById('prevVideo'), nextBtn = document.getElementById('nextVideo');
  const toast = document.getElementById('toast');
  const search = document.getElementById('search'), showUnlearned = document.getElementById('showUnlearned'), resetAll = document.getElementById('resetAll');

  function showToast(msg){ toast.textContent = msg; toast.style.opacity='1'; setTimeout(()=> toast.style.opacity='0',2000); }

  cards.forEach((card, idx) => {
    const vid = card.dataset.video;
    if(localStorage.getItem('mech_learned_'+vid) === '1') card.classList.add('learned');
    card.querySelector('.open').addEventListener('click', ()=> window.open(`https://www.youtube.com/watch?v=${vid}`,'_blank'));
    card.querySelector('.preview').addEventListener('click', ()=> openPreview(idx));
    card.querySelector('.download').addEventListener('click', ()=> downloadNotes(card));
    card.querySelector('.mark').addEventListener('click', ()=> toggleLearned(card));
    card.querySelector('.share').addEventListener('click', ()=> shareLecture(vid));
  });

  function toggleLearned(card){
    const vid = card.dataset.video;
    card.classList.toggle('learned');
    localStorage.setItem('mech_learned_'+vid, card.classList.contains('learned')? '1':'0');
    showToast(card.classList.contains('learned')? 'Marked learned':'Marked unlearned');
  }

  function downloadNotes(card){
    const title = card.querySelector('h3').innerText;
    const blob = new Blob([`MECH Notes for ${title}\n\nReplace with real PDF or materials.`], {type:'text/plain'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = title+'.txt'; a.click();
    showToast('Material downloaded');
  }

  function shareLecture(videoId){
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    if(navigator.share) navigator.share({title:'Lecture', text:'Check this', url}).then(()=>showToast('Shared'));
    else navigator.clipboard.writeText(url).then(()=>showToast('Link copied'));
  }

  function openPreview(index){
    currentIndex = index;
    const vid = cards[index].dataset.video;
    modal.setAttribute('aria-hidden','false');
    if(YTAPIReady_mech){
      if(currentPlayer && currentPlayer.destroy) currentPlayer.destroy();
      currentPlayer = new YT.Player('playerWrap', {height:'480', width:'100%', videoId:vid, playerVars:{rel:0,modestbranding:1}, events:{onReady:e=>{e.target.playVideo(); e.target.setVolume(vol.value);}}});
    } else {
      playerWrap.innerHTML = `<iframe width="100%" height="480" src="https://www.youtube.com/embed/${vid}?autoplay=1&rel=0" frameborder="0" allowfullscreen></iframe>`;
    }
  }

  document.getElementById('closeModal').addEventListener('click', closePreview);
  modal.addEventListener('click', e=>{ if(e.target===modal) closePreview(); });

  function closePreview(){ modal.setAttribute('aria-hidden','true'); if(currentPlayer && currentPlayer.destroy){currentPlayer.destroy(); currentPlayer = null;} playerWrap.innerHTML = ''; }

  vol.addEventListener('input', ()=>{ if(currentPlayer && currentPlayer.setVolume) currentPlayer.setVolume(Number(vol.value)); });
  rate.addEventListener('change', ()=>{ if(currentPlayer && currentPlayer.setPlaybackRate) currentPlayer.setPlaybackRate(Number(rate.value)); });
  muteBtn.addEventListener('click', ()=>{ if(!currentPlayer) return; if(currentPlayer.isMuted && currentPlayer.isMuted()){ currentPlayer.unMute(); muteBtn.innerText='Mute'; } else { currentPlayer.mute(); muteBtn.innerText='Unmute'; } });

  prevBtn.addEventListener('click', ()=> { if(currentIndex>0) openPreview(currentIndex-1); });
  nextBtn.addEventListener('click', ()=> { if(currentIndex<cards.length-1) openPreview(currentIndex+1); });

  search.addEventListener('input', ()=> {
    const q = search.value.toLowerCase();
    cards.forEach(c => { const t = c.querySelector('h3').innerText.toLowerCase(), d = c.querySelector('p').innerText.toLowerCase(); c.style.display = (t.includes(q) || d.includes(q))? '' : 'none'; });
  });

  showUnlearned.addEventListener('click', ()=> { cards.forEach(c => { if(c.classList.contains('learned')) c.style.display = 'none'; }); });
  resetAll.addEventListener('click', ()=> { cards.forEach(c=>{ c.style.display=''; c.classList.remove('learned'); localStorage.removeItem('mech_learned_'+c.dataset.video); }); showToast('Reset done'); });
});
