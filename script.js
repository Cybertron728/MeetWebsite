const year = document.querySelector("#year");
const profilePhoto = document.querySelector("#profilePhoto");
const portfolioVideos = document.querySelectorAll(".portfolio-card video");
const revealItems = document.querySelectorAll(".section, .work-band");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (profilePhoto) {
  profilePhoto.addEventListener("error", () => {
    profilePhoto.classList.add("is-hidden");
  });
}

if (revealItems.length) {
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.16
    });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
}

const pauseVideo = (video) => {
  video.pause();
};

const setVideoLoading = (video, isLoading) => {
  video.closest(".video-frame")?.classList.toggle("is-loading", isLoading);
};

const setVideoStarted = (video) => {
  video.closest(".video-frame")?.classList.add("has-started");
};

const playVideo = (video) => {
  portfolioVideos.forEach((item) => {
    if (item !== video) {
      pauseVideo(item);
    }
  });

  setVideoLoading(video, video.readyState < 3);

  video.play().catch(() => {
    setVideoLoading(video, false);
    // Browsers may block playback until the user interacts with the page.
  });
};

if (portfolioVideos.length) {
  const prefersHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  portfolioVideos.forEach((video) => {
    const card = video.closest(".portfolio-card");

    video.addEventListener("loadstart", () => {
      if (!video.paused) {
        setVideoLoading(video, true);
      }
    });
    video.addEventListener("waiting", () => setVideoLoading(video, true));
    video.addEventListener("stalled", () => setVideoLoading(video, true));
    video.addEventListener("playing", () => {
      setVideoStarted(video);
      setVideoLoading(video, false);
    });
    video.addEventListener("canplay", () => setVideoLoading(video, false));
    video.addEventListener("pause", () => setVideoLoading(video, false));
    video.addEventListener("ended", () => setVideoLoading(video, false));
    video.addEventListener("error", () => setVideoLoading(video, false));

    if (card && prefersHover) {
      card.addEventListener("mouseenter", () => playVideo(video));
      card.addEventListener("mouseleave", () => pauseVideo(video));
      card.addEventListener("focusin", () => playVideo(video));
      card.addEventListener("focusout", () => pauseVideo(video));
    }
  });

  if (!prefersHover && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (entry.isIntersecting) {
          playVideo(video);
        } else {
          pauseVideo(video);
        }
      });
    }, {
      threshold: 0.65
    });

    portfolioVideos.forEach((video) => observer.observe(video));
  }
}
