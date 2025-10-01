document.addEventListener('DOMContentLoaded', () => {
  // Cursor
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0, outlineX = 0, outlineY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    dotX += (mouseX - dotX) * 0.9;
    dotY += (mouseY - dotY) * 0.9;
    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;

    outlineX += (mouseX - outlineX) * 0.2;
    outlineY += (mouseY - outlineY) * 0.2;
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .project-card, .skill-icon').forEach(el => {
    el.addEventListener('mouseover', () => gsap.to(cursorOutline, { scale: 2.5, duration: 0.3 }));
    el.addEventListener('mouseleave', () => gsap.to(cursorOutline, { scale: 1, duration: 0.3 }));
  });

  // Particles
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particlesArray;
  const mouse = { x: null, y: null, radius: (canvas.height/120) * (canvas.width/120) };

  window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.radius = (canvas.height/120) * (canvas.width/120);
    initParticles();
  });
  window.addEventListener('mouseout', () => { mouse.x = undefined; mouse.y = undefined; });

  class Particle {
    constructor(x, y, dx, dy, size, color) {
      this.x = x; this.y = y; this.dx = dx; this.dy = dy; this.size = size; this.color = color;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    update() {
      if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
      if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;

      let dx = mouse.x - this.x, dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < mouse.radius + this.size) {
        if (mouse.x < this.x) this.x += 5;
        if (mouse.x > this.x) this.x -= 5;
        if (mouse.y < this.y) this.y += 5;
        if (mouse.y > this.y) this.y -= 5;
      }
      this.x += this.dx; this.y += this.dy;
      this.draw();
    }
  }

  function initParticles() {
    particlesArray = [];
    let number = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < number; i++) {
      let size = Math.random() * 2 + 1;
      let x = Math.random() * (innerWidth - size * 2) + size * 2;
      let y = Math.random() * (innerHeight - size * 2) + size * 2;
      let dx = (Math.random() * 0.4) - 0.2;
      let dy = (Math.random() * 0.4) - 0.2;
      particlesArray.push(new Particle(x, y, dx, dy, size, 'rgba(14,165,233,0.5)'));
    }
  }

  function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    particlesArray.forEach(p => p.update());
  }
  initParticles();
  animateParticles();

  // Typing Effect
  const typedText = document.querySelector(".typing-effect span:first-child");
  const cursor = document.querySelector(".typing-effect .cursor");
  const textArray = ["innovative web solutions.", "scalable backend systems.", "beautiful UIs.", "AI-driven apps."];
  let index = 0, char = 0;

  function type() {
    if (char < textArray[index].length) {
      if(!cursor.classList.contains("typing")) cursor.classList.add("typing");
      typedText.textContent += textArray[index].charAt(char);
      char++;
      setTimeout(type, 100);
    } else {
      cursor.classList.remove("typing");
      setTimeout(erase, 2000);
    }
  }
  function erase() {
    if (char > 0) {
      if(!cursor.classList.contains("typing")) cursor.classList.add("typing");
      typedText.textContent = textArray[index].substring(0, char-1);
      char--;
      setTimeout(erase, 50);
    } else {
      cursor.classList.remove("typing");
      index = (index+1) % textArray.length;
      setTimeout(type, 1200);
    }
  }
  setTimeout(type, 2500);

  // GSAP Animations
  gsap.registerPlugin(ScrollTrigger);
  gsap.timeline()
    .from('.logo, .nav-links a', { y: -50, opacity: 0, duration: 0.8, stagger: 0.1 })
    .from('.hero-line-1', { x: -100, opacity: 0, duration: 0.8 }, '-=0.5')
    .from('.hero-line-2', { x: -100, opacity: 0, duration: 0.8 }, '-=0.6')
    .from('.hero-line-3', { x: -100, opacity: 0, duration: 0.8 }, '-=0.6');

  document.querySelectorAll('.section').forEach(section => {
    gsap.from(section.querySelector('.section-title'), {
      scrollTrigger: { trigger: section, start: 'top 80%' },
      y: 50, opacity: 0, duration: 1
    });
    gsap.from(section.querySelectorAll('.section-content'), {
      scrollTrigger: { trigger: section, start: 'top 70%' },
      y: 50, opacity: 0, duration: 1, stagger: 0.2
    });
  });

  gsap.from('.project-card', {
    scrollTrigger: { trigger: '#projects', start: 'top 70%' },
    opacity: 0, y: 50, duration: 0.8, stagger: 0.2
  });

  gsap.from('.skill-icon', {
    scrollTrigger: { trigger: '#skills', start: 'top 70%' },
    opacity: 0, scale: 0.5, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)'
  });
});
