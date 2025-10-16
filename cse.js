// CSE JS — full controls with YouTube IFrame API
let YTAPIReady = false;
let currentPlayer = null;
let currentIndex = -1;
let cardsArray = [];

function onYouTubeIframeAPIReady(){ YTAPIReady = true; }

document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.card'));
  cardsArray = cards;
  const modal = document.getElementById('modal');
  const playerWrap = document.getElementById('playerWrap');
  const closeModal = document.getElementById('closeModal');
  const vol = document.getElementById('vol');
  const rate = document.getElementById('rate');
  const muteBtn = document.getElementById('mute');
  const prevBtn = document.getElementById('prevVideo');
  const nextBtn = document.getElementById('nextVideo');
  const toast = document.getElementById('toast');
  const search = document.getElementById('search');
  const showUnlearned = document.getElementById('showUnlearned');
  const resetAll = document.getElementById('resetAll');

  function showToast(msg){
    toast.textContent = msg;
    toast.style.opacity = '1';
    setTimeout(()=> toast.style.opacity = '0', 2000);
  }

  // restore learned from localStorage
  cards.forEach((card, idx) => {
    const id = card.dataset.video;
    if(localStorage.getItem('cse_learned_'+id) === '1') card.classList.add('learned');
    // actions
    card.querySelector('.open').addEventListener('click', ()=> window.open(`https://www.youtube.com/watch?v=${id}`, '_blank'));
    card.querySelector('.preview').addEventListener('click', ()=> openPreview(idx));
    card.querySelector('.download').addEventListener('click', ()=> downloadNotes(card));
    card.querySelector('.mark').addEventListener('click', ()=> toggleLearned(card));
    card.querySelector('.share').addEventListener('click', ()=> shareLecture(id));
  });

  function toggleLearned(card){
    const id = card.dataset.video;
    card.classList.toggle('learned');
    const is = card.classList.contains('learned');
    localStorage.setItem('cse_learned_'+id, is? '1':'0');
    showToast(is? 'Marked learned' : 'Marked unlearned');
  }

  function downloadNotes(card){
    const title = card.querySelector('h3').innerText;
    const content = `${title}\n\nThis is sample notes for ${title}. Replace with your real materials.`;
    const blob = new Blob([content], {type: 'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = title.replace(/\s+/g,'_') + '.txt';
    document.body.appendChild(a); a.click(); a.remove();
    showToast('Material downloaded');
  }

  function shareLecture(videoId){
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    if(navigator.share){
      navigator.share({title:'Lecture', text:'Check this lecture', url}).then(()=>showToast('Shared'));
    } else {
      navigator.clipboard.writeText(url).then(()=> showToast('Link copied'));
    }
  }

  function openPreview(index){
    currentIndex = index;
    const videoId = cards[index].dataset.video;
    modal.setAttribute('aria-hidden','false');
    // create player
    if(YTAPIReady){
      if(currentPlayer) currentPlayer.destroy();
      currentPlayer = new YT.Player('playerWrap', {
        height: '480', width: '100%',
        videoId: videoId,
        playerVars: {rel:0, modestbranding:1},
        events: {
          onReady: (e)=> { e.target.playVideo(); e.target.setVolume(vol.value); }
        }
      });
    } else {
      // fallback embed
      document.getElementById('playerWrap').innerHTML = `<iframe width="100%" height="480" src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" frameborder="0" allowfullscreen></iframe>`;
    }
  }

  closeModal.addEventListener('click', closePreview);
  modal.addEventListener('click', e=> { if(e.target===modal) closePreview(); });

  function closePreview(){
    modal.setAttribute('aria-hidden','true');
    if(currentPlayer && currentPlayer.destroy) { currentPlayer.destroy(); currentPlayer = null; }
    document.getElementById('playerWrap').innerHTML = '';
  }

  vol.addEventListener('input', ()=> {
    if(currentPlayer && currentPlayer.setVolume) currentPlayer.setVolume(Number(vol.value));
  });

  rate.addEventListener('change', ()=> {
    if(currentPlayer && currentPlayer.setPlaybackRate) currentPlayer.setPlaybackRate(Number(rate.value));
  });

  muteBtn.addEventListener('click', ()=> {
    if(!currentPlayer) return;
    if(currentPlayer.isMuted && currentPlayer.isMuted()){
      currentPlayer.unMute(); muteBtn.innerText = 'Mute';
    } else { currentPlayer.mute(); muteBtn.innerText = 'Unmute'; }
  });

  prevBtn.addEventListener('click', ()=> {
    if(currentIndex > 0) openPreview(currentIndex-1);
  });
  nextBtn.addEventListener('click', ()=> {
    if(currentIndex < cards.length-1) openPreview(currentIndex+1);
  });

  // search filter
  search.addEventListener('input', ()=> {
    const q = search.value.toLowerCase();
    cards.forEach(c => {
      const title = c.querySelector('h3').innerText.toLowerCase();
      const desc = c.querySelector('p').innerText.toLowerCase();
      c.style.display = (title.includes(q) || desc.includes(q))? '' : 'none';
    });
  });

  showUnlearned.addEventListener('click', ()=> {
    cards.forEach(c => { if(c.classList.contains('learned')) c.style.display = 'none'; });
  });

  resetAll.addEventListener('click', ()=> {
    cards.forEach(c => { c.style.display=''; c.classList.remove('learned'); localStorage.removeItem('cse_learned_'+c.dataset.video); });
    showToast('Reset done');
  });

});
