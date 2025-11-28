async function carregar() {
  try {
    const res = await fetch("items.json");
    if (!res.ok) throw new Error('Erro ao carregar items.json');
    const data = await res.json();
    console.log('JSON carregado:', data);

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

    console.log('Blocos criados:', blocos.length);
    let index = 0;

    function mostrarBloco() {
      console.log('Mostrando bloco:', index);
      const bloco = blocos[index];

      // Atualiza textos na coluna da esquerda
      tituloArea.textContent = bloco.area;
      tituloSubarea.textContent = bloco.sub || "";

      // Monta itens
      let html = "";
      bloco.itens.forEach(i => {
        html += `<div class="item"><div class="item-numero"><span class="item-numero-text">${i.id}</span></div><div class="item-descricao">${i.descricao}</div><div class="item-timer">⏱ 10s</div></div>`;
      });

      lista.innerHTML = html;
      console.log('Itens montados:', bloco.itens.length);

      // Mostra itens um por um
      const itens = lista.querySelectorAll('.item');
      console.log('Itens encontrados no DOM:', itens.length);
      let itemIndex = 0;

      // Garante que todos começam escondidos
      itens.forEach((item, idx) => {
        item.classList.remove('ativo');
        console.log('Item', idx, 'preparado');
      });

      function atualizarTimer(elemento, tempoRestante) {
        const timer = elemento.querySelector('.item-timer');
        if (timer) {
          timer.textContent = `⏱ ${tempoRestante}s`;
        }
      }

      function mostrarProximoItem() {
        console.log('mostrarProximoItem chamado, itemIndex:', itemIndex, 'total:', itens.length);
        
        if (itemIndex < itens.length) {
          const itemAtual = itens[itemIndex];
          console.log('Mostrando item:', itemIndex);
          
          // Remove classe ativo do anterior
          if (itemIndex > 0) {
            const itemAnterior = itens[itemIndex - 1];
            itemAnterior.classList.remove('ativo');
            console.log('Escondendo item anterior:', itemIndex - 1);
          }
          
          // Mostra item atual
          itemAtual.classList.add('ativo');
          console.log('Adicionada classe ativo ao item:', itemIndex);

          // Countdown timer
          let tempoRestante = 10;
          atualizarTimer(itemAtual, tempoRestante);
          
          const timerInterval = setInterval(() => {
            tempoRestante--;
            atualizarTimer(itemAtual, tempoRestante);
            if (tempoRestante <= 0) {
              clearInterval(timerInterval);
            }
          }, 1000);

          itemIndex++;
          console.log('Próximo timer: 10s');
          setTimeout(() => {
            mostrarProximoItem();
          }, 10000); // 10 segundos por item
        } else {
          // Volta pro início (ciclo infinito)
          console.log('Voltando ao início');
          itemIndex = 0;
          if (itens.length > 0) {
            itens[itens.length - 1].classList.remove('ativo');
          }
          setTimeout(() => {
            mostrarProximoItem();
          }, 500);
        }
      }

      mostrarProximoItem();
    }

    mostrarBloco();
  } catch(erro) {
    console.error('Erro:', erro);
  }
}

carregar();
