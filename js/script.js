
    const body = document.body;
    const themeBtn = document.getElementById("themeBtn");
    const savedTheme = localStorage.getItem("gram-theme");
    const systemPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    function applyTheme(isDark) {
      body.classList.toggle("dark-mode", isDark);
      themeBtn.textContent = isDark ? "☀️" : "🌙";
      themeBtn.setAttribute("aria-label", isDark ? "Activar modo claro" : "Activar modo oscuro");
      themeBtn.setAttribute("aria-pressed", String(isDark));
    }

    applyTheme(savedTheme ? savedTheme === "dark" : systemPrefersDark);

    themeBtn.addEventListener("click", function () {
      const isDark = !body.classList.contains("dark-mode");
      applyTheme(isDark);
      localStorage.setItem("gram-theme", isDark ? "dark" : "light");
    });

    const followBtn = document.getElementById("followBtn");
    const followersCount = document.getElementById("followersCount");
    const privacyBtn = document.getElementById("privacyBtn");
    const privacyNotice = document.getElementById("privacyNotice");
    const postGrid = document.getElementById("postGrid");

    let siguiendo = false;
    let seguidores = 1024;

    followBtn.addEventListener("click", function () {
      siguiendo = !siguiendo;
      seguidores += siguiendo ? 1 : -1;

      followBtn.textContent = siguiendo ? "Siguiendo" : "Seguir";
      followBtn.classList.toggle("following", siguiendo);
      followersCount.textContent = seguidores.toLocaleString("es-UY");
    });

    privacyBtn.addEventListener("click", function () {
      const active = postGrid.classList.toggle("privacy-mode");
      privacyBtn.classList.toggle("active", active);
      privacyBtn.setAttribute("aria-pressed", String(active));
      privacyBtn.textContent = active ? "Ocultar pistas" : "Ver pistas";
      privacyNotice.hidden = !active;
    });

    const stories = {
      liceo: [
        { image: "img/escalera.png", title: "Liceo", caption: "Escalera del liceo." },
        { image: "img/merienda.png", title: "Liceo", caption: "Merienda compartida." },
        { image: "img/patio.png", title: "Liceo", caption: "Patio del liceo." }
      ],
      gym: [
        { image: "img/gym.jpeg", title: "Gym", caption: "Mi segunda casa" }
      ],
      cancha: [
        { image: "img/cancha.png", title: "Cancha", caption: "Como todos los viernes." }
      ],
      casa: [
        { image: "img/Casa.png", title: "Casa", caption: "Afuera de casa" }
      ]
    };

    const storyViewer = document.getElementById("storyViewer");
    const storyImage = document.getElementById("storyImage");
    const storyTitle = document.getElementById("storyTitle");
    const storyCaption = document.getElementById("storyCaption");
    const storyBars = document.getElementById("storyBars");
    const storyClose = document.getElementById("storyClose");
    const storyPrev = document.getElementById("storyPrev");
    const storyNext = document.getElementById("storyNext");
    const highlights = document.querySelectorAll(".highlight");

    let currentHighlight = "";
    let currentStoryIndex = 0;

    function openStory(highlightName) {
      if (!stories[highlightName] || stories[highlightName].length === 0) return;

      currentHighlight = highlightName;
      currentStoryIndex = 0;
      storyViewer.classList.add("active");
      body.classList.add("modal-open");
      renderStory();
    }

    function closeStory() {
      storyViewer.classList.remove("active");
      if (!postViewer.classList.contains("active")) {
        body.classList.remove("modal-open");
      }
    }

    function renderStory() {
      const currentStories = stories[currentHighlight];
      const currentStory = currentStories[currentStoryIndex];

      storyImage.src = currentStory.image;
      storyTitle.textContent = currentStory.title;
      storyCaption.textContent = currentStory.caption;
      storyBars.innerHTML = "";

      currentStories.forEach(function (_, index) {
        const bar = document.createElement("div");
        bar.className = "story-bar";
        if (index <= currentStoryIndex) bar.classList.add("seen");

        const fill = document.createElement("div");
        fill.className = "story-bar-fill";
        bar.appendChild(fill);
        storyBars.appendChild(bar);
      });
    }

    function nextStory() {
      const currentStories = stories[currentHighlight];
      if (currentStoryIndex < currentStories.length - 1) {
        currentStoryIndex++;
        renderStory();
      } else {
        closeStory();
      }
    }

    function prevStory() {
      if (currentStoryIndex > 0) {
        currentStoryIndex--;
        renderStory();
      }
    }

    highlights.forEach(function (highlight) {
      highlight.addEventListener("click", function () {
        openStory(highlight.dataset.highlight);
      });
    });

    storyClose.addEventListener("click", closeStory);
    storyNext.addEventListener("click", nextStory);
    storyPrev.addEventListener("click", prevStory);

    storyViewer.addEventListener("click", function (event) {
      if (event.target === storyViewer) closeStory();
    });

    const postViewer = document.getElementById("postViewer");
    const postClose = document.getElementById("postClose");
    const postViewerImage = document.getElementById("postViewerImage");
    const postViewerTitle = document.getElementById("postViewerTitle");
    const postViewerCaption = document.getElementById("postViewerCaption");
    const postViewerData = document.getElementById("postViewerData");
    const postViewerTip = document.getElementById("postViewerTip");
    const posts = document.querySelectorAll(".post");

    function openPost(post) {
      const image = post.querySelector("img");
      postViewerImage.src = image.src;
      postViewerImage.alt = image.alt;
      postViewerTitle.textContent = post.dataset.title || "Publicación";
      postViewerCaption.textContent = post.dataset.caption || "";
      postViewerData.textContent = post.dataset.data || "";
      postViewerTip.textContent = post.dataset.tip || "Observá qué información aparece en esta publicación.";
      postViewer.classList.add("active");
      body.classList.add("modal-open");
    }

    function closePost() {
      postViewer.classList.remove("active");
      if (!storyViewer.classList.contains("active")) {
        body.classList.remove("modal-open");
      }
    }

    posts.forEach(function (post) {
      post.addEventListener("click", function () {
        openPost(post);
      });
    });

    postClose.addEventListener("click", closePost);

    postViewer.addEventListener("click", function (event) {
      if (event.target === postViewer) closePost();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeStory();
        closePost();
      }

      if (!storyViewer.classList.contains("active")) return;

      if (event.key === "ArrowRight") nextStory();
      if (event.key === "ArrowLeft") prevStory();
    });