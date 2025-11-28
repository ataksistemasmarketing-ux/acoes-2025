// Carrega o JSON
fetch("items.json")
  .then(r => r.json())
  .then(data => {
    const areas = data.relatorio_empresarial_2025.areas;
    const leftTitle = document.getElementById("areaTitulo");
    const scrollBox = document.getElementById("scroll");

    let html = "";
    let lastArea = "";

    // Monta o conteúdo da coluna direita
    areas.forEach(area => {

      // ATUALIZA O H1 FIXO (esquerda)
      lastArea = area.titulo;

      html += `<h2>${area.titulo}</h2>`;

      // Se é uma área simples: (IMPLANTAÇÃO, SUPORTE, COMERCIAL, RH, MARKETING)
      if (area.itens) {
        area.itens.forEach(item => {
          html += `<div class="item">${item.id}. ${item.descricao}</div>`;
        });
      }

      // Se tem subáreas (DESENVOLVIMENTO)
      if (area.subareas) {
        area.subareas.forEach(sub => {
          html += `<h2>${sub.subtitulo}</h2>`;
          sub.itens.forEach(item => {
            html += `<div class="item">${item.id}. ${item.descricao}</div>`;
          });
        });
      }

    });

    // Exibe o H1 da última área — mas você pode alterar a lógica
    leftTitle.textContent = lastArea;

    // Coloca tudo na coluna direita
    scrollBox.innerHTML = html;

    // DUPLICA AUTOMATICAMENTE para loop infinito
    scrollBox.innerHTML += html;
  });
