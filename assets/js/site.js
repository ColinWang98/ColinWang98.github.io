(function () {
  const poems = [
    { title: "绌烘偓", content: "闀滀腑浜烘槸鍕ゅ姵鐨勮摑鑹茬殑\n濂逛滑鎶婃椂闂寸紪杩涙摝鎷溂娉殑鎵嬪笗\n绉颁箣涓哄鍛絓n鑰屽鍛藉張琚棌杩涘鏅氱殑姊﹂噷\n绛夊緟鏉ユ棩琚繕璁癨n鎴戜滑鍙栦竴浜涢鏅炬檼鍦ㄩ槼鍙?\n鐜荤拑鎴垮瓙閲岀殑鑺辩 鏆傛椂灏嗙溂鐫涢棴璧锋潵\n鐢熼攬鐨勮閬撲笂\n鐢蜂汉锛屽コ浜哄拰瀛╁瓙锛屼粬浠殑鍙峰瓙鏄涓殑绉佽\n鍌湢鏃朵唬鐨勬ⅵ澧僜n澶滄櫄鐨勬枟绡风唬婊＄帿鐟拌姳鐨勭瀛怽n闃冲厜涓嬪紑鍑鸿崋妫樼紶缁曠殑娴极\n涓€鍦烘父鎴忥紵 涓€鍑哄ソ鎴忥紒\n鎰氫汉鐨勫瀛愯府鐫€鑴?浣忚繘浜嗘矙婊╁煄鍫n鎴樺＋浠垯涓嶇煡鐤插€﹀湴鍐虫枟 瀵规墜鍙槸涓€棰楀埡姊╘n楗笅钖勮嵎鍙跺彂閰电殑姣掗厭\n鏈堜寒涓嬬殑鍊掑奖渚濇棫娌夊瘋" },
    { title: "浣庤", content: "\"蹇樻帀閭ｄ簺绾㈣壊鐨勬ⅵ鍚?\n閽㈤搧妫灄 杩烽浘绗肩僵鐫€閲戝睘鐨勫０闊砛n鐙溂宸ㄤ汉瀹堟姢鐫€鏈€鍚庝竴鐗囦笉姣涗箣鍦癨n鍦ㄥぇ鍦颁笂鐢绘弧鏈煡鐨勮鍛? 璇曞浘鎶靛尽鏂囨槑鐨勫叆渚礬n鍚戝乏锛佸悜宸︼紒\n涔岄甫鐐圭紑浜嗙敯閲庣殑鑴婇  鍝€鎮肩敓閿堢殑鍐滃叿\n璐垫棌浠殑鐢茶儎鍙戝嚭闃甸樀鑰荤瑧  鍖栦綔闃冲厜涓嬬殑鎮查福\n宸ㄤ汉楗笅鏃朵唬鐨勬瘨閰? 鍒归偅闂寸殑鐩庣劧鐢熸満\n澶槼娌夋矇鐫″幓 鍜岄偅浜涚敓閿堜簡鐨勪俊浠颁竴璧穃n娑堝け鍦ㄧ澶╃殑鏄ラ閲宍" },
    { title: "涓€鍦烘父鎴?", content: "锛堜竴锛夊捊涓嬬煭鏆傜殑娆㈡剦 鎷ユ姳鍨傛鐨勬氮婕玕n鎴戝湪鐢伴噹鐨勮剨楠ㄦ梺鍝€鎮糪n鐑熸皵銆佹播闈掍笌鐢电伀鑺辨车鍏ユ椂浠ｇ殑鍔ㄨ剦\n杞伴福 杞伴福鎺╃洊鍢磋竟鏈鍑虹殑鍠滄\n濡傚悓鏈笘鐑熻姳涓€鑸?缁氱儌 鐭殏\n鑰屽涓婃柊鏄ョ殑妗冪 鍙墿鍑犱釜瀛楁瘝\n涓€骞村張鍘?澶ч浘鎰堝彂娴撻噸\n\n锛堜簩锛塡n鎴忓墽涓婃紨渚夸粠鏈仠涓媆n浜轰滑鎵紨鐫€鑽掕癁瑙掕壊 鍋囪褰兼鐩哥埍\n鐒跺悗鍋峰伔鍦?缁欎豢鐢熶汉鍐欎竴灏佺數瀛愭儏涔n濡勫浘鍦ㄤ簩鏋佺瀵煎悜鐨勪箤鎵橀偊鍐呰嫙娲籠n姣曠珶鐜颁笘 涓嶆姷涓€鍦洪敊杩嘰n\n锛堜笁锛塡n鍦ㄦ鏈涚浉鎼忕殑娓告垙閲孿n鐥涜嫤渚挎槸浠呭瓨鐨勪俊浠癨n娆叉湜闂儊 娌夋拨鏄竻閱掕€呯殑鏁戣祹\n闇撹櫣鑱氬張鏁?涓栫晫鍖栦綔涓€鍦虹媯娆n琚鐪烽【鐨勪竴浠?閬楀繕鍗存垚浜嗗ア鏈沑n\n锛堝洓锛塡n濡堝 鎴戜細鍍忎粬浠偅鏍烽棯鐑佸悧\n鐢峰瓙鍛嗗憜鍦伴棶 闈㈣壊鑻嶇櫧绻佹槦涓嶈\n濡囦汉澶翠綆浜嗕笅鍘荤牬鎹熺殑瀹囪埅鏈?\n闈㈢僵鍐呭竷婊′簡浜戦浘闂儊鐫€鐨勬槦娌宠お鑹?\n閫愭笎鍖栦负浜嗕粬鐨勫潫鍐?涓€鎶旂瑁傜殑鍛㈠杻\n\n锛堜簲锛塡n榄傞瓌鎴栬鍑鸿蛋灞辨灄\n娉ユ渤鍋舵湁灞遍泙 褰掑浠嶆棤鏈焋" }
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
      prev && prev.addEventListener("click", () => goTo(index - 1));
      next && next.addEventListener("click", () => goTo(index + 1));
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

  ready(() => {
    initFadeIns();
    initVisitorCount();
    initEasterEgg();
    initCarousels();
    initPoems();
  });
})();
