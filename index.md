---
permalink: /
title: "Homepage"
classes: homepage
---

<div class="hero-section" id="hero-section">
  <div class="hero-device-label" aria-hidden="true">
    <span>PERSONAL ARCHIVE / 01</span>
    <span>HONG KONG</span>
  </div>
  <div class="hero-device-grid">
    <div class="hero-display">
      <div class="hero-display-bar" aria-hidden="true"><span><span class="display-light"></span> <span data-device-caption>PROFILE / 01</span></span><span>HCI + XR</span></div>
      <div class="device-pages" id="device-pages">
      <section class="device-page" data-device-page="profile" aria-label="Profile">
      <div class="hero-content">
        <h1 class="name-title">Wang Yao</h1>
        <p class="position-title">HCI Researcher &amp; XR Developer</p>
        <div class="research-motto">
          <em>"Constantly thinking, constantly progressing"</em>
        </div>
      </div>
      {% include hero-poem.html %}
      </section>
      <section class="device-page device-info" data-device-page="research" aria-label="Research overview" hidden>
        <p class="device-eyebrow">RESEARCH / 02</p>
        <h2>People, technology,<br>and virtual experience.</h2>
        <ul><li>Human-computer interaction and environmental psychology</li><li>XR interaction, biofeedback and immersive therapy</li><li>Digital heritage and spatial storytelling</li></ul>
        <a class="btn btn--secondary" href="{{ '/publications/' | relative_url }}">Research &amp; publications &rarr;</a>
      </section>
      <section class="device-page device-info" data-device-page="projects" aria-label="Project overview" hidden>
        <p class="device-eyebrow">PROJECTS / 03</p>
        <h2>From research<br>to prototypes.</h2>
        <ul><li><a href="#project-breathing">VR breathing training with biofeedback</a></li><li><a href="#project-moderator">AI versus human usability moderators</a></li></ul>
        <a class="btn btn--secondary" href="#featured-research-projects">Explore all projects &rarr;</a>
      </section>
      <section class="device-page device-info" data-device-page="contact" aria-label="Contact and PhD interests" hidden>
        <p class="device-eyebrow">CONNECT / 04</p>
        <h2>Seeking PhD<br>opportunities.</h2>
        <p>I am interested in doctoral research across HCI, environmental psychology, XR, and digital heritage.</p>
        <a href="#phd-interests">Read my research interests &rarr;</a>
        <div class="device-actions"><a class="btn" href="mailto:{{ site.author.email }}">Email me</a><a class="btn btn--secondary" href="{{ '/assets/Wang Yao CV.pdf' | relative_url }}" download>Download CV</a></div>
      </section>
      <section class="device-page device-video" data-device-page="video" aria-label="Video player" hidden>
        <video class="device-video-player" data-device-video controls playsinline preload="none" width="640" height="360" data-src="{{ '/assets/videos/jizura.mp4' | relative_url }}" data-title="RADWIMPS - 君と羊と青" aria-label="RADWIMPS - 君と羊と青"></video>
        <p class="video-status" data-video-status role="status">Press START to play.</p>
        <div class="device-actions"><button class="btn btn--secondary" type="button" data-video-exit>Back to profile</button><a href="{{ '/assets/videos/jizura.mp4' | relative_url }}" target="_blank" rel="noopener noreferrer">Open video &nearr;</a></div>
      </section>
      </div>
      <p class="device-announcement" role="status" aria-live="polite" data-device-announcement></p>
    </div>
    <div class="device-controls" hidden>
      <div class="hero-wheel" role="group" aria-label="Screen navigation and video controls">
        <button class="wheel-link wheel-link--top" type="button" data-device-direction="up" aria-label="Show profile" aria-controls="device-pages" aria-pressed="true"><span aria-hidden="true">&#9650;</span></button>
        <button class="wheel-link wheel-link--right" type="button" data-device-direction="right" aria-label="Show research" aria-controls="device-pages" aria-pressed="false"><span aria-hidden="true">&#9654;</span></button>
        <button class="wheel-link wheel-link--bottom" type="button" data-device-direction="down" aria-label="Show projects" aria-controls="device-pages" aria-pressed="false"><span aria-hidden="true">&#9660;</span></button>
        <button class="wheel-link wheel-link--left" type="button" data-device-direction="left" aria-label="Show contact" aria-controls="device-pages" aria-pressed="false"><span aria-hidden="true">&#9664;</span></button>
        <button class="wheel-center" type="button" data-device-start aria-label="Play RADWIMPS - 君と羊と青">START</button>
      </div>
      <p class="wheel-help" data-device-help>Arrows explore. START to play.</p>
    </div>
  </div>
  <noscript><p><a href="{{ '/assets/videos/jizura.mp4' | relative_url }}">Watch RADWIMPS - 君と羊と青</a></p></noscript>
</div>

<section class="home-introduction" aria-labelledby="about-me">
  <div class="intro-heading">
    <h2 id="about-me">About Me</h2>
    <span class="intro-status" id="current-status"><span class="display-light" aria-hidden="true"></span>Seeking PhD opportunities</span>
  </div>
  <p>I am an HCI researcher and Research Assistant with <a href="https://chenli.me/">Prof. Li Chen Richard</a> at The Hong Kong Polytechnic University, where I completed my Master's degree in Sustainable Urban Development. My work explores HCI, XR, cultural heritage, and environmental psychology.</p>
  <div class="home-interests" id="research-interests">
    <strong>Research interests</strong><span>Human-Computer Interaction</span><span>Extended Reality</span><span>Virtual Experience</span><span>Environmental Psychology</span>
  </div>
  <section class="phd-interests" aria-labelledby="phd-interests">
    <p class="device-eyebrow">DOCTORAL RESEARCH</p>
    <h3 id="phd-interests">Seeking PhD opportunities</h3>
    <p>Research themes I would like to develop further:</p>
    <div class="phd-theme-grid">
      <div><h4>HCI &amp; environmental psychology</h4><p>How do physical and virtual environments shape perception, emotion, and behaviour, and how can these insights inform interactive experiences?</p></div>
      <div><h4>XR interaction &amp; wellbeing</h4><p>How can biofeedback and immersive environments support breathing practice, therapeutic experiences, and meaningful interaction?</p></div>
      <div><h4>Digital heritage &amp; spatial experience</h4><p>How can XR and AI-supported storytelling connect people with cultural heritage, urban places, and cross-cultural experiences?</p></div>
    </div>
    <a href="mailto:{{ site.author.email }}">Discuss a potential research fit &rarr;</a>
  </section>
</section>

<section class="selected-publications" aria-labelledby="recent-publications">
  <div class="section-heading section-heading--inline">
    <h2 id="recent-publications">Selected Publications</h2>
    <a href="{{ '/publications/' | relative_url }}">All research &amp; publications &rarr;</a>
  </div>
  <div class="selected-paper-list">
    <article class="selected-paper">
      <span class="paper-venue">CHI '26<br>2026</span>
      <div>
        <h3><a href="https://dl.acm.org/doi/10.1145/3772318.3791653" target="_blank" rel="noopener noreferrer">Agentic Audio Moderator vs Human Moderator in Think-Aloud Usability Testing: Results from a Randomized Controlled Trial</a></h3>
        <p>Wangda Zhu; Guang Chen; <strong>Yao Wang</strong>; Pengcheng An; Jiachun Du; Chen Li</p>
        <p>Published April 13, 2026 &middot; Article 727, pp. 1-19</p>
      </div>
      <a class="paper-link" href="https://dl.acm.org/doi/10.1145/3772318.3791653" target="_blank" rel="noopener noreferrer" aria-label="CHI 2026 paper DOI, opens in a new tab">DOI &nearr;</a>
    </article>
    <article class="selected-paper">
      <span class="paper-venue">ICWL '24<br>2025</span>
      <div>
        <h3><a href="https://link.springer.com/chapter/10.1007/978-981-96-4407-0_4" target="_blank" rel="noopener noreferrer">Towards Effective Collaborative Learning in Edu-Metaverse: A Study on Learners' Anxiety, Perception, and Behaviour</a></h3>
        <p>Yufei Lu; Ye Jia; Guang Chen; <strong>Yao Wang</strong>; Peter H. F. Ng; Laura Zhou; Qing Li; Chen Li</p>
        <p>Published April 17, 2025 &middot; Springer, LNCS 15589</p>
      </div>
      <a class="paper-link" href="https://doi.org/10.1007/978-981-96-4407-0_4" target="_blank" rel="noopener noreferrer" aria-label="ICWL paper DOI, opens in a new tab">DOI &nearr;</a>
    </article>
  </div>
</section>

<section class="project-explorer" aria-label="Research project explorer">
{% include project-instruments.html %}
<div class="project-stream">
<h2 id="featured-research-projects">Featured Research Projects</h2>

<div class="paper-box" id="project-breathing" data-project data-category="XR" data-year="2025" data-period="10/2024 - 03/2025">
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
            width="100%" height="250" frameborder="0" loading="lazy" title="VR Breathing Training Platform preview" allowfullscreen>
    </iframe>
  </div>
</div>

<div class="paper-box" id="project-intercultural" data-project data-category="XR" data-year="now" data-period="12/2024 - Present">
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
    
  </div>
  <div class="paper-box-image">
    <div class="project-poster poster--violet" role="img" aria-label="VR collaborative 3D painting project preview">
      <div>
        <i class="fas fa-palette" aria-hidden="true"></i>
        <p>VR Collaborative<br>3D Painting</p>
      </div>
    </div>
  </div>
</div>

<div class="paper-box" id="project-moderator" data-project data-category="AI" data-year="2025" data-period="06/2025 - 09/2025">
  <div class="paper-box-text">
    <h3>Agentic Audio Moderator vs Human Moderator in Usability Testing</h3>
    <div class="project-tags">
      <span class="badge">AI Agents</span>
      <span class="badge">Usability Testing</span>
      <span class="badge">Human-Computer Interaction</span>
      <span class="badge">Experimental Design</span>
    </div>
    
    <p>This study investigates the effectiveness of AI agent moderators versus human moderators in facilitating think-aloud usability testing protocols.</p>
    
    <p><strong>Research Focus:</strong> Literature review, Experimental design and conduction</p>
    <p><strong>Duration:</strong> 06/2025 - 09/2025</p>
  </div>
  <div class="paper-box-image">
    <div class="project-poster poster--ember" role="img" aria-label="AI versus human moderator study preview">
      <div>
        <i class="fas fa-robot" aria-hidden="true"></i>
        <p>AI vs Human<br>Moderator Study</p>
      </div>
    </div>
  </div>
</div>

<div class="paper-box" id="project-metachamber" data-project data-category="Heritage" data-year="2024" data-period="06/2024 - 08/2024">
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
            width="100%" height="250" frameborder="0" loading="lazy" title="The Red MetaChamber preview" allowfullscreen>
    </iframe>
  </div>
</div>

<div class="paper-box" id="project-farm" data-project data-category="UI-UX" data-year="2025" data-period="11/2024 - 03/2025">
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
      <a href="https://www.figma.com/proto/FQzUH1De4VzhFHOtUhwqvi/Farming-Therapy?node-id=245-276&starting-point-node-id=245%3A276&show-proto-sidebar=1&t=CfAqJiNC7My3qKD0-9" target="_blank" rel="noopener noreferrer" class="btn">View Full Prototype</a>
    </div>
  </div>
  <div class="paper-box-image">
    <iframe
      class="embed-frame"
      width="100%"
      height="300"
      loading="lazy"
      title="Sensor-enabled Urban Green Care Farm Figma prototype"
      src="https://www.figma.com/embed?embed_host=share&url=https%3A//www.figma.com/proto/FQzUH1De4VzhFHOtUhwqvi/Farming-Therapy%3Fnode-id%3D245-276%26starting-point-node-id%3D245%253A276%26scaling%3Dscale-down%26content-scaling%3Dfixed%26show-proto-sidebar%3D0%26t%3DCfAqJiNC7My3qKD0-1"
      allowfullscreen>
    </iframe>
  </div>
</div>
</div>
</section>

---

<section class="home-contact" aria-labelledby="contact-heading">
  <div><h2 id="contact-heading">Let's connect.</h2><p>For PhD opportunities and research conversations in HCI, XR, and digital heritage.</p></div>
  <a class="btn" href="mailto:{{ site.author.email }}">Contact Wang Yao <span aria-hidden="true">&nearr;</span></a>
</section>
