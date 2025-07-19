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

## Design Portfolio
View my design work collection featuring architectural and creative projects.

<div class="pdf-preview-container">
  <iframe 
    src="{{ '/docs/ColinDesign.pdf' | relative_url }}" 
    width="100%" 
    height="600" 
    style="border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  </iframe>
  
  <div class="pdf-download-section">
    <a href="{{ '/docs/ColinDesign.pdf' | relative_url }}" 
       target="_blank" 
       class="btn pdf-download-btn">
      📄 Download PDF
    </a>
    <p class="pdf-description">Design portfolio showcasing architectural and creative works</p>
  </div>
</div>

## Architectural Design
- Participated in various architectural design projects during undergraduate and postgraduate studies. 