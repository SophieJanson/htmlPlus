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
    const emptyState = `<div class="content-container snake-container content-grid-element" id="snake-container"><div><p>Ah, you got me... I haven\'t produced any content for the ${route}-page yet. Why not play a game, while I take care of the content?</p><div id="start-snake" class="button button-small button-center" onclick="startSnake();"><span>Play Snake</span></div></div></div><script src="assets/js/snake.js"></script>`;
    let content = document.getElementById('content');
    var self = this;
    var request = new XMLHttpRequest();

    request.responseType = 'text';
    request.open("GET", 'pages/' + route + '.html');
    request.send();

    request.onreadystatechange = function() {
      if(request.readyState !== XMLHttpRequest.DONE) {
        return;
      }
      if (request.status === 200) {
        let fragmentString = request.responseText.trim().length == 0 ? emptyState : request.responseText;
        let style = self.setStyle(route);
        fragmentString += style;
        let fragment = document.createRange().createContextualFragment(fragmentString);
        content.innerHTML = "";

        backgrounds.setBackground();
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
  },
  setStyle: function(item) {
  if (item == undefined || item == null) {
     return;
  }

  let StyleTag = `
    <style>
      @media screen and (max-width: 800px) {
        .navbar ul li[data-menu-item="${item}"] {
          color: lightcoral;
          font-family: Moon-Bold;
        }
      }

      @media screen and (min-width: 801px) {
        .navbar ul li[data-menu-item="${item}"] {
          color: #000;
          outline: 1px solid #000;
        }
      }
    </style>`;

  return StyleTag;
  }
};

var backgrounds = {
  defaultBackgroundsList: [
    { "src": "main-image.jpg", "colorScheme": "light", "position": "bottom" },
    { "src": "ballerinaprojecttwo.jpg", "colorScheme": "dark", "position": "top" },
    { "src": "ballerinaprojectthree.png", "colorScheme": "dark", "position": "center", "credits": "Sharon Lee Photography - 2013" },
    { "src": "ballerinaprojectfour.png", "colorScheme": "dark", "position": "top", "credits": "Sharon Lee Photography - 2013" },

  ],
  randomizeBackgrounds : function() {
      return this.defaultBackgroundsList.sort(() => { return .5 - Math.random() });
   },
  getBackground: function () {
    let background = this.backgroundsList.shift();
    this.defaultBackgroundsList.push(background);
    return background;
  },
  init: function () {
    var self = this;
    self.backgroundsList = self.randomizeBackgrounds();
    var backgroundChangeLink = document.getElementById('change-background');
    backgroundChangeLink.addEventListener("click", function () {
      self.setBackground();
    });
  },
  setBackground: function () {
    let background = this.getBackground();
    let container = document.getElementsByClassName('container')[0];
    let credits = document.getElementById('image-credits');
    container.style.backgroundImage = `url(./assets/images/${background.src}`;
    container.style.backgroundPosition = "center " + background.position;
    if (background.credits != undefined && background.credits != null) {
      credits.innerHTML = `Image credits: ${background.credits}`;
    } else {
      credits.innerHTML = "";
    }
  }
};

function pageCallback(route) {
  return;
}

document.addEventListener("DOMContentLoaded", function() {
  router.getPage(null, pageCallback);
  router.init();
  backgrounds.init();
  window.onhashchange = function() {
    router.getPage(null, pageCallback);
  };
});
