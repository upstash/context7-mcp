// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  // Activar los tooltips de Bootstrap
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Activar los popovers de Bootstrap
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.map(function(popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  // Navegación suave al hacer clic en los enlaces del menú
  document.querySelectorAll('a.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href.startsWith('#')) {
        e.preventDefault();
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 70,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Cambiar la clase activa en la navegación al hacer scroll
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach(navLink => {
          navLink.classList.remove('active');
          if (navLink.getAttribute('href') === '#' + sectionId) {
            navLink.classList.add('active');
          }
        });
      }
    });
  });

  // Función para simular la ejecución de un servidor MCP
  window.runMcpServer = function(serverType) {
    const demoOutput = document.getElementById('demo-output');
    demoOutput.innerHTML = `<div class="alert alert-info">Iniciando servidor MCP: ${serverType}...</div>`;
    
    setTimeout(() => {
      demoOutput.innerHTML += `<div class="alert alert-success">¡Servidor ${serverType} iniciado correctamente!</div>`;
      
      // Simular salida de consola
      const consoleOutput = document.createElement('div');
      consoleOutput.className = 'code-block mt-3';
      
      let outputText = '';
      
      switch(serverType) {
        case 'Context7':
          outputText = `Context7 Documentation MCP Server running on stdio\nServer ready to provide up-to-date documentation for libraries and frameworks.`;
          break;
        case 'Puppeteer':
          outputText = `Puppeteer MCP Server running on stdio\nBrowser automation capabilities ready.`;
          break;
        case 'Sequential Thinking':
          outputText = `Sequential Thinking MCP Server running on stdio\nReady to help with complex problem solving.`;
          break;
        case 'GitHub':
          outputText = `GitHub MCP Server running on stdio\nConnected to GitHub API. Ready to interact with repositories.`;
          break;
      }
      
      consoleOutput.textContent = outputText;
      demoOutput.appendChild(consoleOutput);
    }, 1500);
  };
});
