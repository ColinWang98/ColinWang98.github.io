---
permalink: /
title: "Homepage"
classes: homepage
---

<div class="hero-section" id="hero-section">
  <div class="hero-content">
    <h1 class="name-title">Wang Yao</h1>
    <h2 class="position-title">HCI Researcher & XR Developer</h2>
    <div class="research-motto">
      <em>"Constantly thinking, constantly progressing"</em>
    </div>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const heroSection = document.getElementById('hero-section');
  
  // 检测是否为移动设备
  const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // 移动设备不执行复杂动画
  if (isMobile) {
    return;
  }
  
  let mouseX = 0, mouseY = 0;
  let sphereX = 0, sphereY = 0;
  let animationId;
  
  // 平滑跟随动画
  function animateSphere() {
    // 添加延迟效果，球体跟随鼠标有一定滞后
    sphereX += (mouseX - sphereX) * 0.1;
    sphereY += (mouseY - sphereY) * 0.1;
    
    heroSection.style.setProperty('--sphere-x', sphereX + 'px');
    heroSection.style.setProperty('--sphere-y', sphereY + 'px');
    
    animationId = requestAnimationFrame(animateSphere);
  }
  
  heroSection.addEventListener('mousemove', function(e) {
    const rect = heroSection.getBoundingClientRect();
    mouseX = e.clientX - rect.left - 60;
    mouseY = e.clientY - rect.top - 60;
    
    // 根据鼠标位置调整颜色
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const distanceFromCenter = Math.sqrt(
      Math.pow(e.clientX - rect.left - centerX, 2) + 
      Math.pow(e.clientY - rect.top - centerY, 2)
    );
    
    // 温和的色相调整
    const hueOffset = (distanceFromCenter / 200) * 30;
    heroSection.style.setProperty('--sphere-hue', hueOffset + 'deg');
    
    // 温和的饱和度调整
    const saturation = 0.8 + (distanceFromCenter / 400);
    heroSection.style.setProperty('--sphere-saturation', saturation);
  });
  
  heroSection.addEventListener('mouseenter', function() {
    // 球体从小变大
    heroSection.style.setProperty('--sphere-size', '120px');
    heroSection.style.setProperty('--sphere-opacity', '1');
    // 开始粒子发光动画
    heroSection.style.animation = 'particleGlow 3s ease-in-out infinite';
    animateSphere();
  });
  
  heroSection.addEventListener('mouseleave', function() {
    // 球体变小并消失
    heroSection.style.setProperty('--sphere-size', '20px');
    heroSection.style.setProperty('--sphere-opacity', '0');
    // 停止颜色动画
    heroSection.style.animation = 'none';
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });
});
</script>


## About Me

I am a passionate HCI researcher focused on **Virtual Experience** and **Nature restoration**. Currently working as a Research Assistant with **[Prof. Li Chen Richard](https://chenli.me/)** at The Hong Kong Polytechnic University, where I completed my Master's degree in Sustainable Urban Development (SUD).



### Research Interests

<details class="research-interests-expandable">
  <summary class="research-interests-summary">
    <div class="research-interests-preview">
      <span class="interest-tag-preview">Human-Computer Interaction (HCI)</span>
      <span class="interest-tag-preview">Extended Reality (XR)</span>
      <span class="interest-tag-preview">Virtual Experience</span>
      <span class="expand-icon">▼</span>
    </div>
  </summary>
  
  <div class="research-interests-expanded">
    <div class="interest-item">
      <h4>Human-Computer Interaction (HCI)</h4>
      <p>Interactive design and user experience in virtual environments</p>
    </div>
    <div class="interest-item">
      <h4>Extended Reality (XR)</h4>
      <p>VR/AR applications for education, therapy, and cultural preservation</p>
    </div>
    <div class="interest-item">
      <h4>Virtual Experience</h4>
      <p>Design and development of immersive virtual experiences for cultural preservation and education</p>
    </div>
    <div class="interest-item">
      <h4>Environmental Psychology</h4>
      <p>Understanding spatial perception and behavior in virtual environments</p>
    </div>
    <div class="interest-item">
      <h4>Tourism</h4>
      <p>Virtual tourism experiences and cultural heritage presentation</p>
    </div>
    <div class="interest-item">
      <h4>Metaverse & Virtual Environments</h4>
      <p>Social interaction and cultural expression in digital spaces</p>
    </div>
  </div>
</details>

### Current Status
🎯 **Seeking PhD opportunities** in HCI, XR, Culture Heritage, and Environmental Psychology.

---

## Featured Research Projects

<div class="paper-box">
  <div class="paper-box-text">
    <h3>VR Breathing Training Platform</h3>
    <div class="project-tags">
      <span class="badge">Healthcare VR</span>
      <span class="badge">Biofeedback</span>
      <span class="badge">Therapeutic Design</span>
      <span class="badge">Unity</span>
    </div>
    
    <p>An immersive VR environment for respiratory therapy, integrating biofeedback and interactive design to enhance box-breathing training efficacy through nature-based therapeutic experiences.</p>
    
    <p><strong>Research Focus:</strong> Bio-responsive interaction, Implicit/Explicit cues, Therapeutic VR</p>
    <p><strong>Duration:</strong> 10/2024 - 03/2025</p>
  </div>
  <div class="paper-box-image">
    <iframe src="https://drive.google.com/file/d/1LDRFxU0sGxzm0ri0hFEfME6U3Egr_d7t/preview" 
            width="100%" height="250" frameborder="0" allowfullscreen>
    </iframe>
  </div>
</div>

<div class="paper-box">
  <div class="paper-box-text">
    <h3>The Red MetaChamber (元界·红楼)</h3>
    <div class="project-tags">
      <span class="badge">VR/AR</span>
      <span class="badge">Cultural Heritage</span>
      <span class="badge">Metaverse</span>
      <span class="badge">AI Integration</span>
    </div>
    
    <p>A metaverse project focusing on the classic architecture and original plots of the Dream of the Red Chamber through virtual reality. Features the Xiao Xiang Guan (潇湘馆) scene with interactive elements, character dialogues, and traditional Chinese music appreciation.</p>
    
    <p><strong>Technical Stack:</strong> Unity, SketchUp, Blender, Spatial.io, AI Integration</p>
    <p><strong>Key Features:</strong> Scene Interaction, AI Character Dialogues, Music Appreciation</p>
  </div>
  <div class="paper-box-image">
    <iframe src="https://drive.google.com/file/d/1xEbWGYLEB5gONDsF0zcCc2zGLkpVm9xT/preview" 
            width="100%" height="250" frameborder="0" allowfullscreen>
    </iframe>
  </div>
</div>

<div class="paper-box">
  <div class="paper-box-text">
    <h3>UI Design for Sensor-enabled Urban Green Care Farm</h3>
    <div class="project-tags">
      <span class="badge">UI/UX Design</span>
      <span class="badge">Therapeutic Design</span>
      <span class="badge">Accessibility</span>
      <span class="badge">Figma</span>
    </div>
    
    <p>User interfaces for farming therapy applications, focusing on accessible design principles. The project emphasized creating calming, intuitive interfaces that support mental health and wellness through digital guidance of gardening experiences.</p>
    
    <p><strong>Design Principles:</strong> Accessibility, therapeutic interaction, nature-inspired aesthetics, dementia-friendly design</p>
    <p><strong>Platform:</strong> Mobile Application Design</p>
    
    <div class="project-links">
      <a href="https://www.figma.com/proto/FQzUH1De4VzhFHOtUhwqvi/Farming-Therapy?node-id=245-276&starting-point-node-id=245%3A276&show-proto-sidebar=1&t=CfAqJiNC7My3qKD0-9" target="_blank" class="btn">🎨 View Full Prototype</a>
    </div>
  </div>
  <div class="paper-box-image">
    <iframe 
      style="border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 8px;" 
      width="100%" 
      height="300" 
      src="https://www.figma.com/embed?embed_host=share&url=https%3A//www.figma.com/proto/FQzUH1De4VzhFHOtUhwqvi/Farming-Therapy%3Fnode-id%3D245-276%26starting-point-node-id%3D245%253A276%26scaling%3Dscale-down%26content-scaling%3Dfixed%26show-proto-sidebar%3D0%26t%3DCfAqJiNC7My3qKD0-1" 
      allowfullscreen>
    </iframe>
  </div>
</div>

<div class="paper-box">
  <div class="paper-box-text">
    <h3>Intercultural Communication in Virtual Platform</h3>
    <div class="project-tags">
      <span class="badge">VR Collaboration</span>
      <span class="badge">Intercultural Communication</span>
      <span class="badge">3D Painting</span>
      <span class="badge">Social VR</span>
    </div>
    
    <p>Foster communication among individuals from diverse cultural backgrounds through collaborative 3D painting tasks in VR.</p>
    
    <p><strong>Research Focus:</strong> Idea generation, Experimental design and conduction, Data Processing</p>
    <p><strong>Platform:</strong> Virtual Reality</p>
    
    <div class="project-links">
      <a href="https://www.icc-artgallery2025.top/" target="_blank" class="btn">🌐 View Experimental Results</a>
    </div>
  </div>
  <div class="paper-box-image">
    <div style="width: 100%; height: 250px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; border-radius: 8px;">
      <div style="text-align: center; color: white;">
        <i class="fas fa-palette" style="font-size: 48px; margin-bottom: 16px;"></i>
        <p style="margin: 0; font-size: 16px;">VR Collaborative<br>3D Painting</p>
      </div>
    </div>
  </div>
</div>

---

## Recent Publications

### Conference Papers
- Yufei Lu; Ye Jia; Guang Chen; **Yao Wang**; Peter H. F. Ng; Laura Zhou; Qing Li; Chen Li  
  *"Towards Effective Collaborative Learning in Edu-Metaverse: A Study on Learners' Anxiety, Perception, and Behaviour."* **Learning Technologies and Systems (SETE 2024)**  
  *Springer, Lecture Notes in Computer Science, vol 15589*  
  [📄 View Paper](https://link.springer.com/chapter/10.1007/978-981-96-4407-0_4) | [🔗 DOI](https://doi.org/10.1007/978-981-96-4407-0_4)
