(function () {
  'use strict';
  const stream = document.querySelector('.project-stream');
  if (!stream || typeof HTMLDialogElement === 'undefined') return;
  const projects = Array.from(stream.querySelectorAll('[data-project]'));
  if (!projects.length) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'project-dialog';
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'project-dialog-close';
  closeButton.textContent = 'Close project';
  const content = document.createElement('div');
  content.className = 'project-dialog-content';
  dialog.append(closeButton, content);
  document.body.append(dialog);
  const entries = new Map();
  let current = null;
  let previousHash = '';

  for (const project of projects) {
    const title = project.querySelector('h3');
    title.id = title.id || `${project.id}-title`;
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'project-gallery-card';
    card.setAttribute('aria-haspopup', 'dialog');
    card.setAttribute('aria-label', `Read about ${title.textContent}`);
    const artwork = project.querySelector('.project-cover-art').cloneNode(true);
    artwork.setAttribute('aria-hidden', 'true');
    const description = document.createElement('span');
    description.className = 'project-gallery-description';
    const meta = document.createElement('span');
    meta.className = 'project-gallery-meta';
    meta.textContent = `${project.dataset.category} / ${project.dataset.period}`;
    const name = document.createElement('strong');
    name.textContent = title.textContent;
    const action = document.createElement('span');
    action.className = 'project-gallery-action';
    action.textContent = 'View project +';
    description.append(meta, name, action);
    card.append(artwork, description);
    project.before(card);
    project.hidden = true;
    for (const iframe of project.querySelectorAll('iframe')) {
      iframe.dataset.previewSrc = iframe.getAttribute('src');
      iframe.removeAttribute('src');
    }
    for (const details of project.querySelectorAll('.project-demo')) {
      details.addEventListener('toggle', () => {
        if (!details.open || current?.project !== project) return;
        for (const iframe of details.querySelectorAll('iframe')) {
          if (!iframe.hasAttribute('src')) iframe.src = iframe.dataset.previewSrc;
        }
      });
    }
    const entry = { project, card, title };
    entries.set(`#${project.id}`, entry);
    card.addEventListener('click', () => open(entry, true));
  }
  stream.classList.add('project-gallery-ready');

  function restore() {
    if (!current) return;
    const { project, card } = current;
    project.hidden = true;
    for (const iframe of project.querySelectorAll('iframe')) iframe.removeAttribute('src');
    for (const details of project.querySelectorAll('.project-demo')) details.open = false;
    card.after(project);
    current = null;
  }

  function open(entry, updateHash) {
    if (current === entry) return;
    if (!dialog.open) previousHash = entries.has(location.hash) ? '' : location.hash;
    restore();
    current = entry;
    entry.project.hidden = false;
    content.append(entry.project);
    dialog.setAttribute('aria-labelledby', entry.title.id);
    document.documentElement.classList.add('project-dialog-open');
    if (!dialog.open) dialog.showModal();
    content.scrollTop = 0;
    closeButton.focus();
    if (updateHash) history.replaceState(null, '', `#${entry.project.id}`);
  }

  function close(updateHash = true) {
    const card = current?.card;
    restore();
    dialog.close();
    document.documentElement.classList.remove('project-dialog-open');
    if (updateHash && entries.has(location.hash)) {
      history.replaceState(null, '', location.pathname + location.search + previousHash);
    }
    card?.focus({ preventScroll: true });
  }
  closeButton.addEventListener('click', () => close());
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) close();
  });
  window.addEventListener('hashchange', () => {
    const entry = entries.get(location.hash);
    if (entry) open(entry, false);
    else if (dialog.open) close(false);
  });
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#project-"]');
    const entry = anchor && entries.get(anchor.getAttribute('href'));
    if (!entry) return;
    event.preventDefault();
    open(entry, true);
  });
  if (entries.has(location.hash)) open(entries.get(location.hash), false);
})();
