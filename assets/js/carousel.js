// Photography Carousel JavaScript
let slideIndex = 1;

// 初始化轮播
document.addEventListener('DOMContentLoaded', function() {
  showSlide(slideIndex);
  
  // 自动轮播（可选）
  setInterval(() => {
    changeSlide(1);
  }, 5000); // 每5秒自动切换
});

// 切换幻灯片
function changeSlide(n) {
  showSlide(slideIndex += n);
}

// 显示指定幻灯片
function currentSlide(n) {
  showSlide(slideIndex = n);
}

// 显示幻灯片函数
function showSlide(n) {
  const slides = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.indicator');
  
  if (!slides.length) return; // 如果没有轮播元素，退出
  
  if (n > slides.length) { slideIndex = 1; }
  if (n < 1) { slideIndex = slides.length; }
  
  // 隐藏所有幻灯片
  slides.forEach(slide => {
    slide.classList.remove('active');
  });
  
  // 隐藏所有指示器
  indicators.forEach(indicator => {
    indicator.classList.remove('active');
  });
  
  // 显示当前幻灯片
  if (slides[slideIndex - 1]) {
    slides[slideIndex - 1].classList.add('active');
  }
  
  // 显示当前指示器
  if (indicators[slideIndex - 1]) {
    indicators[slideIndex - 1].classList.add('active');
  }
}

// 键盘控制（可选）
document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft') {
    changeSlide(-1);
  } else if (e.key === 'ArrowRight') {
    changeSlide(1);
  }
});

// 触摸滑动支持（移动设备）
let startX = 0;
let endX = 0;

document.addEventListener('touchstart', function(e) {
  startX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
  endX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const threshold = 50; // 最小滑动距离
  
  if (startX - endX > threshold) {
    // 向左滑动，显示下一张
    changeSlide(1);
  } else if (endX - startX > threshold) {
    // 向右滑动，显示上一张
    changeSlide(-1);
  }
} 