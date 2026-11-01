const $ = (s) => document.querySelector(s);
const audio = $("#audio"), audioFile = $("#audioFile"), playAudio = $("#playAudio");
const visualizer = $("#visualizer");
for(let i=0;i<58;i++){const bar=document.createElement("span");bar.style.setProperty("--h",`${8+Math.random()*38}px`);bar.style.setProperty("--d",`${Math.random()*.8}s`);visualizer.append(bar)}
function time(v){if(!Number.isFinite(v))return "0:00";return `${Math.floor(v/60)}:${String(Math.floor(v%60)).padStart(2,"0")}`}
audioFile.addEventListener("change",()=>{const f=audioFile.files[0];if(!f)return;audio.src=URL.createObjectURL(f);$("#trackTitle").textContent=f.name.replace(/\.[^.]+$/,"");$("#trackSubtitle").textContent="Your selected soundtrack";$("#audioStatus").textContent="TRACK LOADED · READY TO PLAY";audio.load();playAudio.textContent="▶"});
playAudio.addEventListener("click",()=>{if(!audio.src){audioFile.click();return}if(audio.paused){audio.play();playAudio.textContent="Ⅱ";visualizer.classList.add("playing")}else{audio.pause();playAudio.textContent="▶";visualizer.classList.remove("playing")}});
audio.addEventListener("timeupdate",()=>{$("#currentTime").textContent=time(audio.currentTime);$("#seek").value=audio.duration?audio.currentTime/audio.duration*100:0});
audio.addEventListener("loadedmetadata",()=>$("#duration").textContent=time(audio.duration));
$("#seek").addEventListener("input",e=>{if(audio.duration)audio.currentTime=e.target.value/100*audio.duration});
audio.addEventListener("ended",()=>{playAudio.textContent="▶";visualizer.classList.remove("playing")});

const video=$("#video"), videoFile=$("#videoFile"), playVideo=$("#playVideo");
videoFile.addEventListener("change",()=>{const f=videoFile.files[0];if(!f)return;video.src=URL.createObjectURL(f);video.classList.add("active");$(".reel-placeholder").style.display="none";video.load();playVideo.textContent="▶"});
playVideo.addEventListener("click",()=>{if(!video.src){videoFile.click();return}if(video.paused){video.play();playVideo.textContent="Ⅱ"}else{video.pause();playVideo.textContent="▶"}});
video.addEventListener("timeupdate",()=>{$("#videoCurrent").textContent=time(video.currentTime);$("#videoSeek").value=video.duration?video.currentTime/video.duration*100:0});
video.addEventListener("loadedmetadata",()=>$("#videoDuration").textContent=time(video.duration));
$("#videoSeek").addEventListener("input",e=>{if(video.duration)video.currentTime=e.target.value/100*video.duration});

const tiles=[...document.querySelectorAll(".gallery-tile")];let active=0;
function showTile(i){active=(i+tiles.length)%tiles.length;const t=tiles[active];$("#lightboxImage").src=t.querySelector("img").src;$("#lightboxCaption").textContent=t.dataset.caption}
tiles.forEach((t,i)=>t.addEventListener("click",()=>{showTile(i);$("#lightbox").classList.add("open")}));
function closeBox(){$("#lightbox").classList.remove("open")}
$("#closeLightbox").addEventListener("click",closeBox);$("#prevImage").addEventListener("click",()=>showTile(active-1));$("#nextImage").addEventListener("click",()=>showTile(active+1));
$("#lightbox").addEventListener("click",e=>{if(e.target.id==="lightbox")closeBox()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeBox();if(e.key==="ArrowRight"&&$("#lightbox").classList.contains("open"))showTile(active+1);if(e.key==="ArrowLeft"&&$("#lightbox").classList.contains("open"))showTile(active-1)});
document.querySelectorAll(".sense-card").forEach(card=>card.addEventListener("pointermove",e=>{const r=card.getBoundingClientRect();card.style.setProperty("--x",`${e.clientX-r.left}px`);card.style.setProperty("--y",`${e.clientY-r.top}px`)}));

const canvas=$("#webCanvas"),ctx=canvas.getContext("2d");let lines=[],drawing=false,current=null;
function resizeCanvas(){const r=canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;canvas.width=r.width*dpr;canvas.height=r.height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw()}
function pos(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
function draw(){const w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);ctx.save();ctx.strokeStyle="#24344d";ctx.lineWidth=1;for(let x=0;x<w;x+=42){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}for(let y=0;y<h;y+=42){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}ctx.restore();[...lines,current].filter(Boolean).forEach((l,i)=>{ctx.save();ctx.lineCap="round";ctx.shadowColor="#e93d59";ctx.shadowBlur=13;ctx.strokeStyle=i===lines.length?"#fff":"#e93d59";ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(l.x1,l.y1);ctx.lineTo(l.x2,l.y2);ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle="#ed5264";ctx.beginPath();ctx.arc(l.x2,l.y2,3,0,Math.PI*2);ctx.fill();ctx.restore()})}
canvas.addEventListener("pointerdown",e=>{drawing=true;canvas.setPointerCapture(e.pointerId);const p=pos(e);current={x1:p.x,y1:p.y,x2:p.x,y2:p.y};draw()});
canvas.addEventListener("pointermove",e=>{if(!drawing||!current)return;const p=pos(e);current.x2=p.x;current.y2=p.y;draw()});
function finish(){if(current){lines.push(current);current=null}drawing=false;draw()}
canvas.addEventListener("pointerup",finish);canvas.addEventListener("pointercancel",finish);
$("#clearWeb").addEventListener("click",()=>{lines=[];current=null;draw()});
window.addEventListener("resize",resizeCanvas);resizeCanvas();
$(".menu-toggle").addEventListener("click",()=>$(".topbar nav").classList.toggle("open"));
document.querySelectorAll(".topbar nav a").forEach(a=>a.addEventListener("click",()=>$(".topbar nav").classList.remove("open")));
