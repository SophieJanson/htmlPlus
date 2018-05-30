var router = {
    init: function() {
    var self = this;
    let menuItems = document.querySelectorAll("*[data-menu-item]");

    window.addEventListener('popstate', function(e) {
      if(e.state !== null) {
        self.getPage(e.state, pageCallback);
      }
    });

    menuItems.forEach((item) => {
      let itemAttribute = item.getAttribute("data-menu-item");
      item.addEventListener("click", function() {
        let hash = self.getHash();
        if(itemAttribute == hash) {
          return;
        }
        self.getPage(itemAttribute, pageCallback);
        self.setHash(itemAttribute);
      });
    });
  },

  getPage: function (route, callback) {
    const fourOFour = '<div class="four-o-four"><h1>404</h1><p>Page not found.</p></div>';
    route = route || this.getHash() || 'home';
    let content = document.getElementById('content');
    var self = this;
    var request = new XMLHttpRequest();

    request.responseType = 'text';
    request.open("GET", './pages/' + route + '.html');
    request.send();

    request.onreadystatechange = function() {
      if(request.readyState !== XMLHttpRequest.DONE) {
        return;
      }
      if (request.status === 200) {
        let fragmentString = request.responseText;
        let fragment = document.createRange().createContextualFragment(fragmentString);
        content.innerHTML = "";

        content.appendChild(fragment);
        if (callback !== undefined && callback !== null) {
          callback(route);
        }
      } else if (request.status === 404) {
        content.innerHTML = "";
        content.innerHTML = fourOFour;
      } else {
        console.log("Request failed! Status: " + request.status);
      }
    };
  },

  setHash: function(hash) {
    history.pushState(hash, null, '#' + hash);
  },

  getHash: function() {
    return window.location.hash.split("#")[1];
  }
};

function pageCallback(route) {
  return;
}

document.addEventListener("DOMContentLoaded", function() {
  router.getPage(null, pageCallback);
  router.init();
  window.onhashchange = function() {
    router.getPage(null, pageCallback);
  };
});
