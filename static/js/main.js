document.addEventListener('DOMContentLoaded', () => {

  // ── Input focus micro-interaction ──────────────────────────
  const inputs = document.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      const label = input.parentElement.querySelector('label');
      if (label) label.style.color = '#00dbe9';
    });
    input.addEventListener('blur', () => {
      const label = input.parentElement.querySelector('label');
      if (label) label.style.color = '';
    });
  });

  // ── Contact form with Web3Forms ────────────────────────────
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button');
      if (!btn) return;
      const originalText = btn.innerHTML;
      btn.innerHTML = 'UPLOADING DATA...';
      btn.style.opacity = '0.7';

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      data.access_key = "c1f26399-2da6-4242-9f8f-4ba8991b6664";

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(r => r.json()).then(() => {
        setTimeout(() => {
          btn.innerHTML = 'TRANSMISSION COMPLETE ✓';
          btn.style.background = '#22c55e';
          btn.style.color = '#fff';
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.color = '';
            btn.style.opacity = '1';
            e.target.reset();
          }, 3000);
        }, 800);
      }).catch(() => {
        btn.innerHTML = originalText;
        btn.style.opacity = '1';
        alert('Something went wrong. Please try again.');
      });
    });
  }

  // ── About page: terminal typing + skill bars ───────────────
  const terminalLines = document.querySelectorAll('.font-body-lg p span');
  terminalLines.forEach(line => {
    if (!line.textContent.trim().startsWith('$')) {
      const originalText = line.textContent;
      line.textContent = '';
      let i = 0;
      const type = () => {
        if (i < originalText.length) {
          line.textContent += originalText.charAt(i++);
          setTimeout(type, 15);
        }
      };
      setTimeout(type, 500);
    }
  });

  const bars = document.querySelectorAll('.skill-progress');
  setTimeout(() => {
    bars.forEach(bar => {
      const targetWidth = bar.style.width;
      bar.style.width = '0';
      setTimeout(() => {
        bar.style.transition = 'width 1.5s ease-out';
        bar.style.width = targetWidth;
      }, 500);
    });
  }, 500);

  // ── Mobile Navigation Toggle ───────────────────────────────
  const mobileBtn  = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileBtn && mobileMenu) {
    const hambars = mobileBtn.querySelectorAll('span');
    const links   = mobileMenu.querySelectorAll('li');
    let isOpen    = false;

    mobileBtn.addEventListener('click', () => {
      isOpen = !isOpen;

      if (isOpen) {
        mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
        mobileMenu.classList.add('opacity-100', 'pointer-events-auto');
        hambars[0].style.transform = 'translateY(8px) rotate(45deg)';
        hambars[0].style.backgroundColor = '#00f0ff';
        hambars[1].style.opacity = '0';
        hambars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
        hambars[2].style.backgroundColor = '#00f0ff';
        links.forEach((link, index) => {
          setTimeout(() => {
            link.classList.remove('translate-y-4', 'opacity-0');
            link.classList.add('translate-y-0', 'opacity-100');
          }, 100 + index * 75);
        });
      } else {
        mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
        mobileMenu.classList.add('opacity-0', 'pointer-events-none');
        hambars[0].style.transform = 'translateY(0) rotate(0)';
        hambars[0].style.backgroundColor = '';
        hambars[1].style.opacity = '1';
        hambars[2].style.transform = 'translateY(0) rotate(0)';
        hambars[2].style.backgroundColor = '';
        links.forEach(link => {
          link.classList.remove('translate-y-0', 'opacity-100');
          link.classList.add('translate-y-4', 'opacity-0');
        });
      }
    });

    // Close mobile menu when a link is clicked
    links.forEach(li => {
      li.querySelector('a').addEventListener('click', () => {
        if (isOpen) mobileBtn.click();
      });
    });
  }

  // ── Scroll-reveal for project cards ───────────────────────
  const revealCards = document.querySelectorAll('.reveal-card');
  if (revealCards.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 120);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealCards.forEach(card => observer.observe(card));
  }

  // ── Cursor parallax on hero (desktop only) ────────────────
  const heroContainer = document.getElementById('hero-container');
  const heroImg       = document.getElementById('hero-profile-img');
  const floatingNodes = document.querySelectorAll('.floating-node');

  if (heroContainer && heroImg && window.innerWidth > 850) {
    document.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;  // -1 to 1
      const dy = (e.clientY - cy) / cy;  // -1 to 1

      // Profile image moves subtly opposite to cursor
      heroImg.style.transform = `translate(${dx * -8}px, ${dy * -6}px)`;

      // Floating nodes move a bit more
      floatingNodes.forEach((node, i) => {
        const factor = i === 0 ? 14 : 10;
        node.style.transform = `translate(${dx * factor}px, ${dy * factor}px) scale(1)`;
      });
    });

    // Reset on mouse leave
    heroContainer.addEventListener('mouseleave', () => {
      heroImg.style.transform = '';
      floatingNodes.forEach(node => { node.style.transform = ''; });
    });
  }

  // ── Pause spinning rings when tab not visible ──────────────
  document.addEventListener('visibilitychange', () => {
    const ringOuter = document.getElementById('ring-outer');
    if (!ringOuter) return;
    const rings = document.querySelectorAll('#ring-outer, #ring-outer + div');
    rings.forEach(ring => {
      ring.style.animationPlayState = document.hidden ? 'paused' : 'running';
    });
  });

});
