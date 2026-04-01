(function () {
  const poems = [
    {
      title: "空悬",
      content: `镜中人是勤劳的蓝色的
她们把时间编进擦拭眼泪的手帕
称之为宿命
而宿命又被藏进夜晚的梦里
等待来日被忘记
"我们取一些风晾晒在阳台"
玻璃房子里的花童 暂时将眼睛闭起来
生锈的街道上
男人，女人和孩子，他们的号子是风中的私语
催眠时代的梦境
夜晚的斗篷绣满玫瑰花的种子
阳光下开出荆棘缠绕的浪漫
一场游戏？ 一出好戏！
愚人的妻子踮着脚 住进了沙滩城堡
战士们则不知疲倦地决斗 对手只是一颗刺梨
饮下薄荷叶发酵的毒酒
月亮下的倒影依旧沉寂`
    },
    {
      title: "低语",
      content: `"忘掉那些红色的梦吧"
钢铁森林 迷雾笼罩着金属的声音
独眼巨人守护着最后一片不毛之地
在大地上画满未知的警告  试图抵御文明的入侵
向左！向左！
乌鸦点缀了田野的脊骨  哀悼生锈的农具
贵族们的甲胄发出阵阵耻笑  化作阳光下的悲鸣
巨人饮下时代的毒酒  刹那间的盎然生机
太阳沉沉睡去 和那些生锈了的信仰一起
消失在秋天的春风里`
    },
    {
      title: "一场游戏",
      content: `（一）咽下短暂的欢愉 拥抱垂死的浪漫
我在田野的脊骨旁哀悼
烟气、沥青与电火花泵入时代的动脉
轰鸣 轰鸣掩盖嘴边未说出的喜欢
如同末世烟花一般 绚烂 短暂
而墙上新春的桃符 只剩几个字母
一年又去 大雾愈发浓重

（二）
戏剧上演便从未停下
人们扮演着荒诞角色 假装彼此相爱
然后偷偷地 给仿生人写一封电子情书
妄图在二极管导向的乌托邦内苟活
毕竟现世 不抵一场错过


（三）
在欲望相搏的游戏里
痛苦便是仅存的信仰
欲望闪烁 沉沦是清醒者的救赎
霓虹聚又散 世界化作一场狂欢
被神眷顾的一代 遗忘却成了奢望

（四）
"妈妈 我会像他们那样闪烁吗"
男子呆呆地问  面色苍白繁星不语
妇人头低了下去破损的宇航服
面罩内布满了云雾闪烁着的星河褪色
逐渐化为了他的坟冢 一抔碎裂的呢喃


（五）
魂魄或许出走山林
泥河偶有山雀  归家仍无期`
    }
  ];

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  function initFadeIns() {
    if (!("IntersectionObserver" in window)) return;
    const targets = document.querySelectorAll(".hero-section, .paper-box, .timeline-item, .photo-carousel, .design-portfolio-card, .poem-stage");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach((element) => {
      element.classList.add("fade-enter");
      observer.observe(element);
    });
  }

  function initVisitorCount() {
    const countElement = document.getElementById("visitor-count-num");
    if (!countElement) return;
    const sessionKey = "siteVisitCounted";
    const storageKey = "totalVisitorCount";
    let visitorCount = Number.parseInt(localStorage.getItem(storageKey) || "0", 10);
    if (!sessionStorage.getItem(sessionKey)) {
      visitorCount += 1;
      localStorage.setItem(storageKey, String(visitorCount));
      sessionStorage.setItem(sessionKey, "true");
    }
    countElement.textContent = visitorCount.toLocaleString();
  }

  function initEasterEgg() {
    const triggers = document.querySelectorAll(".js-easter-egg-trigger");
    if (!triggers.length) return;
    const baseUrl = document.body.dataset.siteBaseurl || "";
    let iframe = document.getElementById("bg-automaton-egg");
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "bg-automaton-egg";
      iframe.className = "easter-egg-backdrop";
      iframe.src = `${baseUrl}/images/cellular-automaton-animation.html`;
      document.body.appendChild(iframe);
    }
    let open = false;
    triggers.forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.stopPropagation();
        open = !open;
        iframe.classList.toggle("is-active", open);
      });
    });
    document.addEventListener("click", (event) => {
      if (open && !event.target.closest(".js-easter-egg-trigger")) {
        iframe.classList.remove("is-active");
        open = false;
      }
    });
  }

  function initCarousels() {
    document.querySelectorAll(".photo-carousel").forEach((carousel) => {
      const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
      const indicators = Array.from(carousel.querySelectorAll(".indicator"));
      const prev = carousel.querySelector(".carousel-btn.prev");
      const next = carousel.querySelector(".carousel-btn.next");
      if (!slides.length) return;
      let index = slides.findIndex((slide) => slide.classList.contains("active"));
      index = index >= 0 ? index : 0;
      const render = () => {
        slides.forEach((slide, slideIndex) => slide.classList.toggle("active", slideIndex === index));
        indicators.forEach((indicator, indicatorIndex) => indicator.classList.toggle("active", indicatorIndex === index));
      };
      const goTo = (target) => {
        index = (target + slides.length) % slides.length;
        render();
      };
      if (prev) prev.addEventListener("click", () => goTo(index - 1));
      if (next) next.addEventListener("click", () => goTo(index + 1));
      indicators.forEach((indicator, indicatorIndex) => indicator.addEventListener("click", () => goTo(indicatorIndex)));
      let timer = window.setInterval(() => goTo(index + 1), 5000);
      carousel.addEventListener("mouseenter", () => window.clearInterval(timer));
      carousel.addEventListener("mouseleave", () => {
        timer = window.setInterval(() => goTo(index + 1), 5000);
      });
      render();
    });
  }

  function initPoems() {
    const container = document.getElementById("poem-container");
    if (!container) return;
    let poemIndex = 0;
    const render = () => {
      const poem = poems[poemIndex];
      container.classList.remove("is-ready");
      container.innerHTML = `<article class="poem-card"><h3 class="poem-title">${poem.title}</h3><div class="poem-body">${poem.content}</div></article>`;
      window.requestAnimationFrame(() => container.classList.add("is-ready"));
    };
    render();
    window.setInterval(() => {
      poemIndex = (poemIndex + 1) % poems.length;
      render();
    }, 9000);
  }

  function initHeroAura() {
    const hero = document.querySelector(".hero-section");
    if (!hero || !window.matchMedia("(pointer: fine)").matches) return;

    const root = document.documentElement;
    let rafId = null;
    let clientX = window.innerWidth * 0.58;
    let clientY = window.innerHeight * 0.22;

    const render = () => {
      rafId = null;
      root.style.setProperty("--cursor-x", `${clientX}px`);
      root.style.setProperty("--cursor-y", `${clientY}px`);

      const rect = hero.getBoundingClientRect();
      const relativeX = ((clientX - rect.left) / rect.width) * 100;
      const relativeY = ((clientY - rect.top) / rect.height) * 100;
      const clampedX = Math.max(0, Math.min(100, relativeX));
      const clampedY = Math.max(0, Math.min(100, relativeY));
      hero.style.setProperty("--hero-glow-x", `${clampedX}%`);
      hero.style.setProperty("--hero-glow-y", `${clampedY}%`);
    };

    const queueRender = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", (event) => {
      clientX = event.clientX;
      clientY = event.clientY;
      queueRender();
    }, { passive: true });

    hero.addEventListener("pointerleave", () => {
      hero.style.setProperty("--hero-glow-x", "58%");
      hero.style.setProperty("--hero-glow-y", "44%");
    });

    queueRender();
  }

  ready(() => {
    initFadeIns();
    initVisitorCount();
    initEasterEgg();
    initCarousels();
    initPoems();
    initHeroAura();
  });
})();
