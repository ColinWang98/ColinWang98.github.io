---
layout: default
title: "Others"
permalink: /others/
author_profile: true
classes: subpage
---

# Others

## Photography
Contributor to [tuchong.com](https://tuchong.com), an online photography community.

<div class="photo-carousel">
  <div class="carousel-container">
    <div class="carousel-slide active">
      <img src="{{ '/Photos/photo1.jpg' | relative_url }}" alt="Photography 1">
    </div>
    <div class="carousel-slide">
      <img src="{{ '/Photos/photo2.jpg' | relative_url }}" alt="Photography 2">
    </div>
    <div class="carousel-slide">
      <img src="{{ '/Photos/photo3.jpg' | relative_url }}" alt="Photography 3">
    </div>
    <div class="carousel-slide">
      <img src="{{ '/Photos/photo4.jpg' | relative_url }}" alt="Photography 4">
    </div>
    <div class="carousel-slide">
      <img src="{{ '/Photos/photo5.jpg' | relative_url }}" alt="Photography 5">
    </div>
    <div class="carousel-slide">
      <img src="{{ '/Photos/photo6.jpg' | relative_url }}" alt="Photography 6">
    </div>
    <div class="carousel-slide">
      <img src="{{ '/Photos/photo8.jpg' | relative_url }}" alt="Photography 8">
    </div>
    <div class="carousel-slide">
      <img src="{{ '/Photos/photo9.jpg' | relative_url }}" alt="Photography 9">
    </div>
    <div class="carousel-slide">
      <img src="{{ '/Photos/photo11.jpg' | relative_url }}" alt="Photography 11">
    </div>
  </div>
  
  <!-- 轮播控制按钮 -->
  <button class="carousel-btn prev" onclick="changeSlide(-1)">&#10094;</button>
  <button class="carousel-btn next" onclick="changeSlide(1)">&#10095;</button>
  
  <!-- 指示器 -->
  <div class="carousel-indicators">
    <span class="indicator active" onclick="currentSlide(1)"></span>
    <span class="indicator" onclick="currentSlide(2)"></span>
    <span class="indicator" onclick="currentSlide(3)"></span>
    <span class="indicator" onclick="currentSlide(4)"></span>
    <span class="indicator" onclick="currentSlide(5)"></span>
    <span class="indicator" onclick="currentSlide(6)"></span>
    <span class="indicator" onclick="currentSlide(7)"></span>
    <span class="indicator" onclick="currentSlide(8)"></span>
    <span class="indicator" onclick="currentSlide(9)"></span>
  </div>
</div>

## Poetry
<div id="poem-container" style="min-height:900px;position:relative;text-align:center;margin:2em 0 4em 0;font-size:1.2em;line-height:2;max-width:100vw;overflow:hidden;"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script>
// 诗歌数据
const poems = [
  {
    title: "空悬",
    content: `镜中人是勤劳的蓝色的\n她们把时间编进擦拭眼泪的手帕\n称之为宿命\n而宿命又被藏进夜晚的梦里\n等待来日被忘记\n"我们取一些风晾晒在阳台"\n玻璃房子里的花童 暂时将眼睛闭起来\n生锈的街道上\n男人，女人和孩子，他们的号子是风中的私语\n催眠时代的梦境\n夜晚的斗篷绣满玫瑰花的种子\n阳光下开出荆棘缠绕的浪漫\n一场游戏？ 一出好戏！\n愚人的妻子踮着脚 住进了沙滩城堡\n战士们则不知疲倦地决斗 对手只是一颗刺梨\n饮下薄荷叶发酵的毒酒\n月亮下的倒影依旧沉寂`
  },
  {
    title: "低语",
    content: `"忘掉那些红色的梦吧"\n钢铁森林 迷雾笼罩着金属的声音\n独眼巨人守护着最后一片不毛之地\n在大地上画满未知的警告  试图抵御文明的入侵\n向左！向左！\n乌鸦点缀了田野的脊骨  哀悼生锈的农具\n贵族们的甲胄发出阵阵耻笑  化作阳光下的悲鸣\n巨人饮下时代的毒酒  刹那间的盎然生机\n太阳沉沉睡去 和那些生锈了的信仰一起\n消失在秋天的春风里`
  },
  {
    title: "一场游戏",
    content: `（一）咽下短暂的欢愉 拥抱垂死的浪漫\n我在田野的脊骨旁哀悼\n烟气、沥青与电火花泵入时代的动脉\n轰鸣 轰鸣掩盖嘴边未说出的喜欢\n如同末世烟花一般 绚烂 短暂\n而墙上新春的桃符 只剩几个字母\n一年又去 大雾愈发浓重\n\n（二）\n戏剧上演便从未停下\n人们扮演着荒诞角色 假装彼此相爱\n然后偷偷地 给仿生人写一封电子情书\n妄图在二极管导向的乌托邦内苟活\n毕竟现世 不抵一场错过\n\n\n（三）\n在欲望相搏的游戏里\n痛苦便是仅存的信仰\n欲望闪烁 沉沦是清醒者的救赎\n霓虹聚又散 世界化作一场狂欢\n被神眷顾的一代 遗忘却成了奢望\n\n（四）\n"妈妈 我会像他们那样闪烁吗"\n男子呆呆地问  面色苍白繁星不语  \n妇人头低了下去破损的宇航服  \n面罩内布满了云雾闪烁着的星河褪色 \n逐渐化为了他的坟冢 一抔碎裂的呢喃\n\n\n（五）\n魂魄或许出走山林\n泥河偶有山雀  归家仍无期`
  }
];
let poemIndex = 0;

function wrapCharsRandom(str, containerW, containerH) {
  // 每个字用span包裹，初始随机位置
  let html = '';
  let x0 = containerW/2, y0 = containerH/2;
  let line = 0, col = 0;
  for(let i=0;i<str.length;i++){
    let ch = str[i];
    if(ch==="\n"){line++;col=0;html+='<br>';continue;}
    let rx = Math.random()*containerW;
    let ry = Math.random()*containerH;
    // 为英文单词添加特殊处理
    let isEnglish = /[a-zA-Z]/.test(ch);
    let charClass = isEnglish ? 'poem-char-en' : 'poem-char';
    html += `<span class="${charClass}" data-line="${line}" data-col="${col}" style="position:absolute;left:${rx}px;top:${ry}px;opacity:0;white-space:nowrap;display:inline-block;min-width:1em;">${ch}</span>`;
    col++;
  }
  return html;
}

function layoutPoemChars(container, lineHeight, fontSize) {
  // 让每个字回到诗歌排版位置
  const chars = container.querySelectorAll('.poem-char, .poem-char-en');
  let x0 = container.offsetWidth/2, y0 = 20;
  let maxCol = 0;
  chars.forEach(span=>{maxCol=Math.max(maxCol,parseInt(span.dataset.col));});
  chars.forEach(span=>{
    let line = parseInt(span.dataset.line);
    let col = parseInt(span.dataset.col);
    let isEnglish = span.classList.contains('poem-char-en');
    let charWidth = isEnglish ? fontSize * 0.6 : fontSize * 1.1; // 英文字符宽度较小
    let left = x0 - (maxCol/2-col)*charWidth;
    let top = y0 + line*lineHeight;
    gsap.to(span, {left:left, top:top, opacity:1, duration:0.8, ease:'power2.out', delay:0.2+Math.random()*0.3});
  });
}

function flyAwayPoemChars(container) {
  // 每个字无序飞走
  const chars = container.querySelectorAll('.poem-char, .poem-char-en');
  chars.forEach(span=>{
    let dx = (Math.random()-0.5)*600;
    let dy = (Math.random()-0.5)*300;
    gsap.to(span, {left:`+=${dx}`, top:`+=${dy}`, opacity:0, duration:0.7+Math.random()*0.4, ease:'power1.in'});
  });
}

function showPoem(idx) {
  const container = document.getElementById('poem-container');
  // 移动端自适应高度和字体
  let isMobile = window.innerWidth <= 768;
  let height = isMobile ? 500 : 700; // 减少高度，只显示中文
  let fontSize = isMobile ? 15 : 20;
  let lineHeight = isMobile ? 24 : 32;
  container.style.position = 'relative';
  container.style.height = height + 'px';
  container.style.fontSize = fontSize + 'px';
  container.innerHTML = '';
  const poem = poems[idx];
  
  // 标题
  let title = poem.title;
  let content = poem.content;
  
  // 创建标题HTML
  let html = `<div style='font-weight:bold;font-size:1.3em;margin-bottom:1em;position:relative;height:2em;'>${wrapCharsRandom(title,container.offsetWidth,60)}</div>`;
  
  // 创建内容HTML - 只显示中文
  html += `<div style='position:relative;height:${height-100}px;'>`;
  
  // 将中文内容按行分割
  let chineseLines = content.split('\n');
  
  // 为每行创建中文显示
  for(let i = 0; i < chineseLines.length; i++) {
    let chineseLine = chineseLines[i];
    
    if(chineseLine.trim() === '') {
      // 空行
      html += `<div style='height:${lineHeight*1.2}px;'></div>`;
    } else {
      // 中文行
      html += `<div style='position:relative;height:${lineHeight}px;margin-bottom:4px;'>`;
      html += `<div style='text-align:center;'>`;
      html += `<div style='display:inline-block;text-align:left;'>${wrapCharsRandom(chineseLine,container.offsetWidth,lineHeight)}</div>`;
      html += '</div></div>';
    }
  }
  
  html += '</div>';
  container.innerHTML = html;
  
  setTimeout(()=>{
    layoutPoemChars(container,lineHeight,fontSize);
  },100);
}

window.addEventListener('DOMContentLoaded', ()=>{
  const container = document.getElementById('poem-container');
  container.innerHTML = '';
  showPoem(poemIndex);
  setInterval(()=>{
    flyAwayPoemChars(container);
    setTimeout(()=>{
      poemIndex = (poemIndex+1)%poems.length;
      showPoem(poemIndex);
    },900);
  }, 9000);
});
</script>

## Design Portfolio
View my design work collection featuring architectural and creative projects.

<div class="design-portfolio-card">
  <div class="portfolio-icon">
    📐
  </div>
  <div class="portfolio-content">
    <h3>Portfolio</h3>
    <p>A comprehensive collection of architectural and creative design works showcasing innovative spatial concepts and design thinking.</p>
    <div class="portfolio-meta">
      <span class="file-size">📄 PDF Document</span>
    </div>
  </div>
  <div class="portfolio-action">
    <a href="{{ '/assets/Portfolio.pdf' | relative_url }}" 
       target="_blank" 
       class="btn portfolio-download-btn">
      📥 Download Portfolio
    </a>
  </div>
</div>

<!-- Portfolio嵌入预览 -->
<div style="margin-top: 30px;">
  <h3 style="margin-bottom: 20px; color: #333;">📄 Portfolio 预览</h3>
  
  <!-- 直接嵌入PDF -->
  <div style="margin-bottom: 20px; text-align: center;">
    <iframe src="{{ '/assets/Portfolio.pdf' | relative_url }}" 
            width="100%" 
            height="700px" 
            style="border: 2px solid #dee2e6; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <p style="padding: 20px; text-align: center; color: #666;">
        您的浏览器不支持PDF内嵌显示，请点击下方链接查看Portfolio
      </p>
    </iframe>
  </div>
  

</div>

<script>
// 添加移动端响应式样式
const portfolioStyles = document.createElement('style');
portfolioStyles.textContent = `
  @media (max-width: 768px) {
    /* 移动端优化 */
    iframe[src*="Portfolio.pdf"] {
      height: 500px !important;
    }
    
    .portfolio-meta {
      font-size: 14px;
    }
    
    .portfolio-action a {
      display: block !important;
      margin: 10px 0 !important;
      text-align: center;
    }
  }
  
  /* 为PDF iframe添加加载状态 */
  iframe[src*="Portfolio.pdf"] {
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50" font-size="18" text-anchor="middle" x="50" fill="%23999">加载中...</text></svg>') center center no-repeat;
    background-size: 200px 50px;
  }
`;
document.head.appendChild(portfolioStyles);
</script> 