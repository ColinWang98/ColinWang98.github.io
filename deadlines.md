---
layout: default
title: "HCI Deadlines"
permalink: /deadlines/
author_profile: true
classes: subpage deadlines-page
---

# HCI Deadlines

<div class="deadlines-links">
  <a href="https://hci-deadlines.github.io/" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> Open original site</a>
  <a href="https://github.com/hci-deadlines/hci-deadlines.github.io" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github" aria-hidden="true"></i> HCI Deadlines source</a>
</div>

<div id="deadlines-app" data-snapshot="{{ '/assets/data/hci-deadlines.json' | relative_url }}">
  <form class="deadlines-filters" role="search">
    <label>Search<input id="deadline-search" type="search" placeholder="Conference or location"></label>
    <label>Field<select id="deadline-field"><option value="">All fields</option></select></label>
    <label>Status<select id="deadline-status"><option value="upcoming">Upcoming</option><option value="all">All deadlines</option><option value="past">Past</option></select></label>
  </form>
  <p id="deadline-source" class="deadline-meta" role="status">Loading conference data...</p>
  <section class="deadline-board" aria-labelledby="deadline-board-title">
  <header class="deadline-board-header">
    <h2 id="deadline-board-title"><i class="fa-solid fa-clock" aria-hidden="true"></i> Submission board</h2>
    <p id="deadline-count" class="deadline-meta" aria-live="polite"></p>
  </header>
  <div id="deadline-list"></div>
  </section>
  <noscript>JavaScript is required for conference filtering and countdowns. <a href="https://hci-deadlines.github.io/">Visit HCI Deadlines</a>.</noscript>
</div>
<script defer src="{{ '/assets/js/vendor/js-yaml.min.js' | relative_url }}"></script>
<script defer src="{{ '/assets/js/deadlines.js' | relative_url }}"></script>
