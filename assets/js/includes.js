(function(){
  function loadIncludes() {
    var nodes = document.querySelectorAll('[data-include]');
    nodes.forEach(function(node){
      var url = node.getAttribute('data-include');
      if(!url) return;
      fetch(url).then(function(r){return r.text()}).then(function(html){
        node.innerHTML = html;
      }).catch(function(e){
        console.error('Include failed:', url, e);
      });
    });
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', loadIncludes);
  } else {
    loadIncludes();
  }
})();
