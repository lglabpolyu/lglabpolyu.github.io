(function(){
  function loadIncludes() {
    var nodes = document.querySelectorAll('[data-include]');
    var jobs = Array.prototype.map.call(nodes, function(node){
      var url = node.getAttribute('data-include');
      if(!url) return Promise.resolve();
      return fetch(url).then(function(r){return r.text()}).then(function(html){
        node.innerHTML = html;
      }).catch(function(e){
        console.error('Include failed:', url, e);
      });
    });
    Promise.all(jobs).then(function(){
      window.__includesLoaded = true;
      document.dispatchEvent(new CustomEvent('includes:loaded'));
    });
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', loadIncludes);
  } else {
    loadIncludes();
  }
})();
