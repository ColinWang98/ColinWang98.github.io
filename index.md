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
  console.log('页面加载完成');
});

const researchInterestsStyle = document.createElement('style');
researchInterestsStyle.textContent = `
  .research-interests-simple {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin: 20px 0;
  }
  
  .interest-tag {
    display: inline-block;
    padding: 8px 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .interest-tag:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
  
  @media (max-width: 768px) {
    .research-interests-simple {
      justify-content: center;
    }
    
    .interest-tag {
      font-size: 13px;
      padding: 6px 12px;
    }
  }
`;
document.head.appendChild(researchInterestsStyle);
</script>

## About Me

I am a passionate HCI researcher. Currently working as a Research Assistant with **[Prof. Li Chen Richard](https://chenli.me/)** at The Hong Kong Polytechnic University, where I completed my Master's degree in Sustainable Urban Development (SUD).

### Research Interests

<div class="research-interests-simple">
  <span class="interest-tag">Human-Computer Interaction (HCI)</span>
  <span class="interest-tag">Extended Reality (XR)</span>
  <span class="interest-tag">Virtual Experience</span>
</div>

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

<div class="paper-box">
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
    <div style="width: 100%; height: 250px; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); display: flex; align-items: center; justify-content: center; border-radius: 8px;">
      <div style="text-align: center; color: white;">
        <i class="fas fa-robot" style="font-size: 48px; margin-bottom: 16px;"></i>
        <p style="margin: 0; font-size: 16px;">AI vs Human<br>Moderator Study</p>
      </div>
    </div>
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

---

## Recent Publications

### Conference Papers

- Wangda Zhu; Guang Chen; **Yao Wang**; Pengcheng An; Jiachun Du; Chen Li  
  *"Agentic Audio Moderator vs Human Moderator in Think-Aloud Usability Testing: Results from a Randomized Controlled Trial."* **CHI '26: ACM CHI Conference on Human Factors in Computing Systems (To Appear)**

- Yufei Lu; Ye Jia; Guang Chen; **Yao Wang**; Peter H. F. Ng; Laura Zhou; Qing Li; Chen Li  
  *"Towards Effective Collaborative Learning in Edu-Metaverse: A Study on Learners' Anxiety, Perception, and Behaviour."* **Learning Technologies and Systems (ICWL 2024)**  
  *Springer, Lecture Notes in Computer Science, vol 15589*  
  [View Paper](https://link.springer.com/chapter/10.1007/978-981-96-4407-0_4) | [DOI](https://doi.org/10.1007/978-981-96-4407-0_4)
