(function(){
  "use strict";

  function ready(fn) {
    if (window.__includesLoaded) {
      fn();
    } else {
      document.addEventListener('includes:loaded', fn, { once: true });
    }
  }

  function text(value) {
    return value == null ? '' : String(value).trim();
  }

  function has(value) {
    return text(value).length > 0;
  }

  function escapeHtml(value) {
    return text(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function parseMarkdownItem(source) {
    var data = {};
    var body = text(source);
    if (body.indexOf('---') === 0) {
      var end = body.indexOf('\n---', 3);
      if (end !== -1) {
        var frontMatter = body.slice(3, end).trim();
        body = body.slice(end + 4).trim();
        frontMatter.split(/\r?\n/).forEach(function(line){
          var separator = line.indexOf(':');
          if (separator === -1) return;
          var key = line.slice(0, separator).trim();
          var value = line.slice(separator + 1).trim();
          if (!key) return;
          data[key] = value.replace(/^["']|["']$/g, '');
        });
      }
    }
    data.body = body;
    return data;
  }

  function markdownToParagraphs(markdown) {
    if (!has(markdown)) return '';
    return text(markdown).split(/\n{2,}/).map(function(paragraph){
      return '<p>' + escapeHtml(paragraph).replace(/\n/g, '<br>') + '</p>';
    }).join('');
  }

  function fetchJson(url) {
    return fetch(url, { cache: 'no-store' }).then(function(response){
      if (!response.ok) throw new Error('Failed to load ' + url);
      return response.json();
    });
  }

  function fetchMarkdown(url) {
    return fetch(url, { cache: 'no-store' }).then(function(response){
      if (!response.ok) throw new Error('Failed to load ' + url);
      return response.text();
    }).then(parseMarkdownItem);
  }

  function loadMarkdownItems(manifestUrl, files) {
    return Promise.all(files.map(function(file){
      return fetchMarkdown(resolvePath(manifestUrl, file)).then(function(item){
        item.id = file.replace(/\.md$/, '');
        return item;
      }).catch(function(error){
        console.error('Content item failed:', file, error);
        return null;
      });
    })).then(function(items){
      return items.filter(Boolean);
    });
  }

  function resolvePath(manifestUrl, itemPath) {
    if (/^(https?:)?\/\//.test(itemPath) || itemPath.charAt(0) === '/') return itemPath;
    return manifestUrl.replace(/[^\/]+$/, '') + itemPath;
  }

  function linkButton(url, label) {
    if (!has(url)) return '';
    return '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener">' + escapeHtml(label) + '</a>';
  }

  function renderPublication(item) {
    var title = escapeHtml(item.title || 'Untitled publication');
    var highlighted = ['true', 'yes', '1', 'star'].indexOf(text(item.highlight).toLowerCase()) !== -1;
    var highlightBadge = highlighted ? '<span class="publication-star" title="Highlighted paper">*</span>' : '';
    var titleHtml = has(item.paper)
      ? '<a href="' + escapeHtml(item.paper) + '" target="_blank" rel="noopener">' + title + '</a>'
      : title;
    var imageHtml = has(item.image)
      ? '<div class="col-lg-4"><div class="paper-demo"><img src="' + escapeHtml(item.image) + '" alt="' + title + '" class="img-fluid"></div></div>'
      : '';
    var textCol = has(item.image) ? 'col-lg-8' : 'col-lg-12';
    var meta = [item.venue, item.year].filter(has).map(escapeHtml).join(' / ');
    var links = [
      linkButton(item.paper, 'Paper'),
      linkButton(item.project, 'Project Page'),
      linkButton(item.code, 'Code'),
      linkButton(item.webpage, 'Webpage'),
      linkButton(item.demo, 'Demo'),
      linkButton(item.dataset, 'Dataset'),
      linkButton(item.bibtex, 'BibTeX')
    ].filter(has).join('');

    return [
      '<article class="publication-entry' + (highlighted ? ' publication-highlight' : '') + '" data-publication-id="' + escapeHtml(item.id) + '">',
        '<div class="row">',
          imageHtml,
          '<div class="' + textCol + '">',
            '<h3 class="paper-title">' + highlightBadge + titleHtml + '</h3>',
            has(item.authors) ? '<p class="authors">' + escapeHtml(item.authors) + '</p>' : '',
            has(meta) ? '<p class="conference">' + meta + '</p>' : '',
            markdownToParagraphs(item.body),
            has(links) ? '<p class="links publication-links">' + links + '</p>' : '',
          '</div>',
        '</div>',
      '</article>'
    ].join('');
  }

  function publicationYear(item) {
    var parsed = parseInt(text(item.year), 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function renderPublicationGroup(title, items, className) {
    if (!items.length) return '';
    return '<div class="publication-group ' + escapeHtml(className || '') + '">' +
      '<h3>' + escapeHtml(title) + '</h3>' +
      items.map(renderPublication).join('') +
    '</div>';
  }

  function loadPublications() {
    var target = document.getElementById('publications-list');
    if (!target) return;
    var manifestUrl = target.getAttribute('data-source');
    fetchJson(manifestUrl).then(function(manifest){
      var files = manifest.items || [];
      return loadMarkdownItems(manifestUrl, files);
    }).then(function(items){
      var preprints = items.filter(function(item){
        return text(item.type).toLowerCase() === 'preprint' || text(item.venue).toLowerCase() === 'arxiv';
      }).sort(function(a, b){
        return publicationYear(b) - publicationYear(a);
      });
      var papers = items.filter(function(item){
        return preprints.indexOf(item) === -1;
      }).sort(function(a, b){
        return publicationYear(b) - publicationYear(a);
      });
      var years = papers.reduce(function(groups, item){
        var year = text(item.year) || 'Other';
        if (!groups[year]) groups[year] = [];
        groups[year].push(item);
        return groups;
      }, {});
      var html = renderPublicationGroup('Preprints', preprints, 'publication-preprints');
      Object.keys(years).sort(function(a, b){
        return parseInt(b, 10) - parseInt(a, 10);
      }).forEach(function(year){
        html += renderPublicationGroup(year, years[year], 'publication-year');
      });
      target.innerHTML = html || '<p class="content-empty">No publications yet.</p>';
    }).catch(function(error){
      console.error(error);
      target.innerHTML = '<p class="content-empty">Publications could not be loaded.</p>';
    });
  }

  function personIconLink(url, label, iconClass, external) {
    if (!has(url)) return '';
    var target = external ? ' target="_blank" rel="noopener"' : '';
    return '<a href="' + escapeHtml(url) + '"' + target + ' aria-label="' + escapeHtml(label) + '" title="' + escapeHtml(label) + '"><i class="' + escapeHtml(iconClass) + '" aria-hidden="true"></i></a>';
  }

  function renderPerson(person) {
    var name = escapeHtml(person.name || 'Unnamed');
    var nameHtml = '<span class="person-name">' + name + '</span>';
    var links = [
      personIconLink(person.homepage, 'Home', 'bx bx-home', true),
      personIconLink(person.scholar, 'Google Scholar', 'bx bxs-graduation', true),
      personIconLink(person.github, 'GitHub', 'bx bxl-github', true),
      personIconLink(person.linkedin, 'LinkedIn', 'bx bxl-linkedin', true),
      has(person.email) ? personIconLink('mailto:' + text(person.email), 'Email', 'bx bx-envelope', false) : ''
    ].filter(has).join('');

    return [
      '<article class="person-card" data-person-id="' + escapeHtml(person.id) + '">',
        has(person.image) ? '<img src="' + escapeHtml(person.image) + '" alt="' + name + '">' : '',
        nameHtml,
        has(person.role) ? '<p>' + escapeHtml(person.role) + '</p>' : '',
        markdownToParagraphs(person.body),
        has(links) ? '<div class="person-links">' + links + '</div>' : '',
      '</article>'
    ].join('');
  }

  function loadPeople() {
    var grids = document.querySelectorAll('.people-grid[data-source][data-group]');
    if (!grids.length) return;
    var manifestUrl = grids[0].getAttribute('data-source');
    fetchJson(manifestUrl).then(function(manifest){
      var files = manifest.items || [];
      return loadMarkdownItems(manifestUrl, files);
    }).then(function(people){
      grids.forEach(function(grid){
        var group = grid.getAttribute('data-group');
        var groupPeople = people.filter(function(person){ return text(person.group) === group; });
        grid.innerHTML = groupPeople.map(renderPerson).join('') || '<p class="content-empty">No people listed.</p>';
      });
    }).catch(function(error){
      console.error(error);
      grids.forEach(function(grid){
        grid.innerHTML = '<p class="content-empty">People could not be loaded.</p>';
      });
    });
  }

  ready(function(){
    loadPublications();
    loadPeople();
    setTimeout(function(){
      document.dispatchEvent(new CustomEvent('content:loaded'));
    }, 250);
  });
})();
