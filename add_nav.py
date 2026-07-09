import re

def update_base_html():
    filepath = 'templates/base.html'
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Update breakpoint for desktop nav
    html = html.replace('class="hidden md:flex gap-8 items-center"', 'class="hidden min-[800px]:flex gap-8 items-center"')

    # 2. Add hamburger button right before </nav>
    button_html = """
        <!-- Mobile Toggle Button -->
        <button id="mobile-menu-btn" class="min-[800px]:hidden flex flex-col justify-center items-center w-10 h-10 z-50 relative focus:outline-none bg-white/5 rounded-full border border-white/10 hover:border-[#00f0ff] transition-colors">
            <span class="w-5 h-[2px] bg-white rounded-full transition-all duration-300 ease-in-out origin-center mb-1.5 pointer-events-none"></span>
            <span class="w-5 h-[2px] bg-white rounded-full transition-all duration-300 ease-in-out origin-center mb-1.5 pointer-events-none"></span>
            <span class="w-5 h-[2px] bg-white rounded-full transition-all duration-300 ease-in-out origin-center pointer-events-none"></span>
        </button>
    </nav>"""
    
    html = html.replace('    </nav>', button_html)

    # 3. Add mobile menu overlay right after </nav>
    menu_html = """
    <!-- Mobile Menu Overlay -->
    <div id="mobile-menu" class="fixed inset-0 bg-surface/95 backdrop-blur-md z-40 flex flex-col justify-center items-center opacity-0 pointer-events-none transition-opacity duration-300 ease-in-out">
        <ul class="flex flex-col gap-8 text-center">
            <li class="mobile-link translate-y-4 opacity-0 transition-all duration-500 ease-out">
                <a class="font-mono-label text-2xl uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="{{ url_for('index') }}">Home</a>
            </li>
            <li class="mobile-link translate-y-4 opacity-0 transition-all duration-500 ease-out">
                <a class="font-mono-label text-2xl uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="{{ url_for('about') }}">About</a>
            </li>
            <li class="mobile-link translate-y-4 opacity-0 transition-all duration-500 ease-out">
                <a class="font-mono-label text-2xl uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="{{ url_for('projects') }}">Projects</a>
            </li>
            <li class="mobile-link translate-y-4 opacity-0 transition-all duration-500 ease-out">
                <a class="font-mono-label text-2xl uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="{{ url_for('blog') }}">Blog</a>
            </li>
            <li class="mobile-link translate-y-4 opacity-0 transition-all duration-500 ease-out">
                <a class="font-mono-label text-2xl uppercase tracking-widest text-primary glow-accent transition-colors" href="{{ url_for('contact') }}">Contact</a>
            </li>
        </ul>
    </div>
"""
    # Insert right after </nav>
    html = html.replace('</nav>', '</nav>\n' + menu_html, 1)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)

def update_main_js():
    filepath = 'static/js/main.js'
    js_code = """
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
"""
    with open(filepath, 'a', encoding='utf-8') as f:
        f.write(js_code)

if __name__ == '__main__':
    update_base_html()
    update_main_js()
    print("Mobile menu added!")
