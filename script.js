const scene = document.querySelector(".scene");
const dove = document.querySelector(".dove");
const profile = document.querySelector(".profile");
const name = document.querySelector(".name");
const details = document.querySelector(".details");
const hint = document.querySelector("#interaction-hint");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (
  profile instanceof HTMLElement &&
  name instanceof HTMLButtonElement &&
  details instanceof HTMLElement
) {
  const setPanelOpen = (open) => {
    profile.classList.toggle("profile--open", open);
    name.setAttribute("aria-expanded", String(open));
    details.setAttribute("aria-hidden", String(!open));
    details.inert = !open;
  };

  name.addEventListener("click", () => {
    setPanelOpen(name.getAttribute("aria-expanded") !== "true");
    if (hint instanceof HTMLElement) {
      hint.classList.remove("hint--visible");
      hint.setAttribute("aria-hidden", "true");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && name.getAttribute("aria-expanded") === "true") {
      setPanelOpen(false);
      name.focus();
    }
  });
}

if (hint instanceof HTMLElement && name instanceof HTMLButtonElement) {
  window.setTimeout(() => {
    if (name.getAttribute("aria-expanded") !== "true") {
      hint.classList.add("hint--visible");
      hint.setAttribute("aria-hidden", "false");
    }
  }, 60_000);
}

if (scene instanceof HTMLElement && dove instanceof HTMLElement && name instanceof HTMLElement && !reducedMotion.matches) {
  let x = 24;
  let y = 24;
  let velocityX = 118;
  let velocityY = 83;
  let previousTime = 0;

  const intersects = (left, top, width, height, obstacle) =>
    left < obstacle.right &&
    left + width > obstacle.left &&
    top < obstacle.bottom &&
    top + height > obstacle.top;

  const animate = (time) => {
    const elapsed = previousTime === 0 ? 0 : Math.min((time - previousTime) / 1000, 0.04);
    previousTime = time;
    const bounds = scene.getBoundingClientRect();
    const birdWidth = dove.offsetWidth;
    const birdHeight = dove.offsetHeight;
    const maxX = Math.max(0, scene.clientWidth - birdWidth);
    const maxY = Math.max(0, scene.clientHeight - birdHeight);
    if (x > maxX) {
      x = maxX;
      velocityX = -Math.abs(velocityX);
    }
    if (y > maxY) {
      y = maxY;
      velocityY = -Math.abs(velocityY);
    }
    let nextX = x + velocityX * elapsed;
    let nextY = y + velocityY * elapsed;

    if (nextX < 0) {
      nextX = -nextX;
      velocityX = Math.abs(velocityX);
    } else if (nextX > maxX) {
      nextX = 2 * maxX - nextX;
      velocityX *= -1;
    }
    if (nextY < 0) {
      nextY = -nextY;
      velocityY = Math.abs(velocityY);
    } else if (nextY > maxY) {
      nextY = 2 * maxY - nextY;
      velocityY *= -1;
    }

    const heading = name.getBoundingClientRect();
    const padding = 12;
    const obstacleBounds = {
      left: heading.left - bounds.left - padding,
      right: heading.right - bounds.left + padding,
      top: heading.top - bounds.top - padding,
      bottom: heading.bottom - bounds.top + padding,
    };

    if (intersects(nextX, nextY, birdWidth, birdHeight, obstacleBounds)) {
      if (velocityX > 0 && x + birdWidth <= obstacleBounds.left) {
        nextX = obstacleBounds.left - birdWidth;
        velocityX *= -1;
      } else if (velocityX < 0 && x >= obstacleBounds.right) {
        nextX = obstacleBounds.right;
        velocityX *= -1;
      }
      if (velocityY > 0 && y + birdHeight <= obstacleBounds.top) {
        nextY = obstacleBounds.top - birdHeight;
        velocityY *= -1;
      } else if (velocityY < 0 && y >= obstacleBounds.bottom) {
        nextY = obstacleBounds.bottom;
        velocityY *= -1;
      }
    }

    x = Math.min(maxX, Math.max(0, nextX));
    y = Math.min(maxY, Math.max(0, nextY));
    dove.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}
