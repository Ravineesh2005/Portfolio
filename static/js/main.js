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
      
      // We can also make a real fetch request here to the Flask backend
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      fetch('/contact', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
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
