async function carregar() {
  const res = await fetch("items.json");
  const data = await res.json();

  const areas = data.relatorio_empresarial_2025.areas;
  const tituloArea = document.getElementById("tituloArea");
  const tituloSubarea = document.getElementById("tituloSubarea");
  const lista = document.getElementById("lista");

  // Criamos uma lista linear de blocos (area + subarea + itens)
  const blocos = [];

  areas.forEach(area => {

    // Área SIMPLES (IMPLANTAÇÃO, SUPORTE, etc.)
    if (area.itens) {
      blocos.push({
        area: area.titulo,
        sub: "",
        itens: area.itens
      });
    }

    // Área COMPLEXA com subáreas (DESENVOLVIMENTO)
    if (area.subareas) {
      area.subareas.forEach(sub => {
        blocos.push({
          area: area.titulo,
          sub: sub.subtitulo,
          itens: sub.itens
        });
      });
    }

  });

  let index = 0;

  function mostrarBloco() {
    const bloco = blocos[index];

    // Atualiza textos na coluna da esquerda
    tituloArea.textContent = bloco.area;
    tituloSubarea.textContent = bloco.sub || "";

    // Monta itens
    let html = "";
    bloco.itens.forEach(i => {
      html += `<div class="item">${i.id}. ${i.descricao}</div>`;
    });

    lista.innerHTML = html;

    // Calcula tempo de animação (baseado nos itens)
    const duration = bloco.itens.length * 2.8; // segundos por item
    lista.style.animation = `slide ${duration}s linear 1`;

    // Quando terminar a animação, passa para o próximo bloco
    setTimeout(() => {
      index = (index + 1) % blocos.length;
      mostrarBloco();
    }, duration * 1000);
  }

  mostrarBloco();
}

carregar();
