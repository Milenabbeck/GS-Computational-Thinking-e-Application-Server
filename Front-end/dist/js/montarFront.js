const API_URL = 'http://localhost:3000/api/professions';

let PROFISSOES_TOTAIS = [];

document.addEventListener("DOMContentLoaded", function () {
  const elMain = document.querySelector("#gridProfissao");
  const elSelectFiltro = document.querySelector("#filtroProfissao");
  const elTextBuscar = document.querySelector("#txtBuscar");

  function exibirProfissao(profissoes) {
    elMain.innerHTML = "";

    if (profissoes.length === 0) {
      elMain.innerHTML = `
            <div class="my-10 flex justify-center">
                <div class="text-center md:w-2/3">
                    <h3 class="text-2xl text-center ">Desculpe, nenhuma profissão encontrada!</h3>
                </div>
            </div>
            `;
      return;
    }

    profissoes.forEach((p) => {
      let corDemanda = "";
      if (p.demanda.toLowerCase() === "alta") {
        corDemanda = "bg-red-400";
      } else if (p.demanda.toLowerCase() === "média" || p.demanda.toLowerCase() === "media") {
        corDemanda = "bg-yellow-300";
      } else if (p.demanda.toLowerCase() === "baixa") {
        corDemanda = "bg-green-300";
      }

      elMain.innerHTML += `
                <div class="border border-teal-200 rounded shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl bg-white dark:bg-gray-800">
                    <div class="bg-gradient-to-r from-teal-900 via-teal-600 to-violet-900 m-4 p-4 rounded">
                        <h1 class="text-white text-2xl text-center font-chakra">${p.titulo}</h1>
                    </div>
                    <div class="flex items-center justify-center">
                        <img class="w-80 h-30 rounded" src="${p.imagem}" alt="${p.alt}">
                    </div>
                    <div class="m-5">
                        <p><strong>Área de atuação:</strong> ${p.area}</p>
                        <p><strong>Nível de demanda:</strong> 
                            <span class="${corDemanda} rounded-sm text-white p-1">${p.demanda}</span>
                        </p>
                        <p class=""><strong>Descrição:</strong> ${p.descricao}</p>
                        <p><strong>Competência:</strong> ${p.competencia}</p>
                        <p><strong>Formação:</strong> ${p.formacao}</p>
                        <p><strong>Média salarial:</strong> R$ ${p.mediaSalarial.toLocaleString('pt-BR')}</p> <p><strong>Impacto social:</strong> ${p.impactoSocial}</p>
                    </div>
                </div>`;
    });
  }

  function preencherAreas() {
    const areas = [...new Set(PROFISSOES_TOTAIS.map((p) => p.area))].sort();
    areas.forEach((are) => {
      const option = document.createElement("option");
      option.value = are;
      option.textContent = are;
      elSelectFiltro.appendChild(option);
    });
  }

  function buscarProfissoes() {
    const valorBusca = elTextBuscar.value.toLowerCase().trim();

    if (valorBusca === "") {
      alert("Preencha o campo. Exibindo todas as profissões.");
      exibirProfissao(PROFISSOES_TOTAIS);
    } else {
      const encontrados = PROFISSOES_TOTAIS.filter((p) =>
        p.titulo.toLowerCase().includes(valorBusca)
      );
      exibirProfissao(encontrados);
    }
  }

  elSelectFiltro.addEventListener("change", function () {
    const valor = elSelectFiltro.value;
    if (valor === "todos") {
      exibirProfissao(PROFISSOES_TOTAIS);
    } else {
      const filtrados = PROFISSOES_TOTAIS.filter((p) => p.area === valor);
      exibirProfissao(filtrados);
    }
  });

  elTextBuscar.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      buscarProfissoes();
    }
  });

  async function carregarDadosAPI() {
    elMain.innerHTML = `
            <div class="col-span-full text-center p-10">
                <h3 class="text-xl text-gray-500 dark:text-gray-400">Carregando profissões...</h3>
                </div>
        `;

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ${response.status}: ${errorData.error || 'Falha ao buscar dados'}`);
      }

      PROFISSOES_TOTAIS = await response.json();

      preencherAreas();
      exibirProfissao(PROFISSOES_TOTAIS);

    } catch (error) {
      elMain.innerHTML = `
                <div class="col-span-full text-center p-10 bg-red-100 dark:bg-red-900 rounded-lg">
                    <h3 class="text-2xl font-bold text-red-700 dark:text-red-300">Erro de Conexão com o Servidor</h3>
                    <p class="text-red-600 dark:text-red-400 mt-2">Detalhe: ${error.message}</p>
                    <p class="mt-4">Verifique se o seu Backend está ativo (rodando 'node index.js' na pasta Back-end).</p>
                </div>
            `;
      console.error("Erro na integração da API:", error);
    }
  }
  carregarDadosAPI();
});