document.addEventListener('DOMContentLoaded', () => {
  // Simple micro-interaction for input fields
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

  // Form submission animation (fake)
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button');
      if (!btn) return;
      const originalText = btn.innerHTML;
      btn.innerHTML = 'UPLOADING DATA...';
      btn.style.opacity = '0.7';
      
      // Using Web3Forms for reliable email delivery
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      data.access_key = "c1f26399-2da6-4242-9f8f-4ba8991b6664";
      
      fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify(data)
      }).then(response => response.json())
      .then(result => {
        setTimeout(() => {
          btn.innerHTML = 'TRANSMISSION COMPLETE';
          btn.classList.replace('bg-primary-container', 'bg-green-500');
          setTimeout(() => {
              btn.innerHTML = originalText;
              btn.classList.replace('bg-green-500', 'bg-primary-container');
              btn.style.opacity = '1';
              e.target.reset();
          }, 3000);
        }, 1000);
      });
    });
  }

  // Typing effect simulation for terminal strings on About page
  const terminalLines = document.querySelectorAll('.font-body-lg p span');
  terminalLines.forEach(line => {
      // Only apply to the spans that are meant to be typed (starting with $)
      if(line.textContent.trim().startsWith('$')) {
          // Do nothing to the prompt itself, type the text after it
      } else {
        const originalText = line.textContent;
        line.textContent = '';
        let i = 0;
        const type = () => {
            if (i < originalText.length) {
                line.textContent += originalText.charAt(i);
                i++;
                setTimeout(type, 15);
            }
        };
        // wait a little before starting
        setTimeout(type, 500);
      }
  });

  // Smooth reveal for skill bars
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
});

  // Mobile Navigation Toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileBtn && mobileMenu) {
    const bars = mobileBtn.querySelectorAll('span');
    const links = mobileMenu.querySelectorAll('li');
    let isOpen = false;

    mobileBtn.addEventListener('click', () => {
      isOpen = !isOpen;
      
      if (isOpen) {
        // Open menu
        mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
        mobileMenu.classList.add('opacity-100', 'pointer-events-auto');
        
        // Transform hamburger to X
        bars[0].style.transform = 'translateY(8px) rotate(45deg)';
        bars[0].style.backgroundColor = '#00f0ff';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
        bars[2].style.backgroundColor = '#00f0ff';
        
        // Staggered slide down for links
        links.forEach((link, index) => {
          setTimeout(() => {
            link.classList.remove('translate-y-4', 'opacity-0');
            link.classList.add('translate-y-0', 'opacity-100');
          }, 100 + (index * 75));
        });
      } else {
        // Close menu
        mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
        mobileMenu.classList.add('opacity-0', 'pointer-events-none');
        
        // Transform X back to hamburger
        bars[0].style.transform = 'translateY(0) rotate(0)';
        bars[0].style.backgroundColor = '';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'translateY(0) rotate(0)';
        bars[2].style.backgroundColor = '';
        
        // Reset links immediately on close
        links.forEach(link => {
          link.classList.remove('translate-y-0', 'opacity-100');
          link.classList.add('translate-y-4', 'opacity-0');
        });
      }
    });
  }
