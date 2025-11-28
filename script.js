// Carrega o JSON
fetch("items.json")
  .then(r => r.json())
  .then(data => {

    const areas = data.relatorio_empresarial_2025.areas;
    const leftTitle = document.getElementById("areaTitulo");
    const scrollBox = document.getElementById("scroll");

    let html = "";
    const headers = [];  // armazenar todos H2 para detectar área

    // Cria conteúdo
    areas.forEach(area => {

      // Título principal vira h2 também
      html += `<h2 data-area="${area.titulo}">${area.titulo}</h2>`;
      headers.push(area.titulo);

      // Área simples (IMPLANTAÇÃO, SUPORTE…)
      if (area.itens) {
        area.itens.forEach(item => {
          html += `<div class="item">${item.id}. ${item.descricao}</div>`;
        });
      }

      // Área com subáreas (DESENVOLVIMENTO…)
      if (area.subareas) {
        area.subareas.forEach(sub => {
          html += `<h2 data-area="${area.titulo}">${sub.subtitulo}</h2>`;

          sub.itens.forEach(item => {
            html += `<div class="item">${item.id}. ${item.descricao}</div>`;
          });
        });
      }

    });

    // Carrega conteúdo
    scrollBox.innerHTML = html;
    scrollBox.innerHTML += html; // duplicação automática

    /* ----------------------------------------------------------
       🔥 DETECTOR DE ÁREA VISÍVEL NA TELA (dinâmico)
       ---------------------------------------------------------- */
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const area = entry.target.getAttribute("data-area");
          if (area) {
            leftTitle.textContent = area; // atualiza H1 automaticamente
          }
        }
      });
    }, {
      root: document.querySelector('.right'),
      threshold: 0.3
    });

    // Observar todos os H2
    document.querySelectorAll("#scroll h2").forEach(h2 => observer.observe(h2));

  });
