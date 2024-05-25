document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript carregado");
    let imovelIndex = 1;

    function calcularValorM2(index) {
        const metragemInput = document.getElementById(`metragemImovel${index}`);
        const valorInput = document.getElementById(`valorImovel${index}`);
    
        // Verifica se os elementos foram encontrados no DOM
        if (metragemInput && valorInput) {
            const metragem = parseFloat(metragemInput.value.replace(/[^\d,]/g, '').replace(',', '.'));
            const valor = parseFloat(valorInput.value.replace(/[^\d,]/g, '').replace(',', '.'));
    
            if (!isNaN(metragem) && !isNaN(valor) && metragem > 0) {
                const valorM2 = valor / metragem;
                document.getElementById(`valorM2Imovel${index}`).value = valorM2.toFixed(2).replace('.', ',');
                return valorM2;
            }
        } else {
            console.error(`Elemento com ID metragemImovel${index} ou valorImovel${index} não encontrado.`);
        }
        return 0;
    }
    

    window.adicionarImovel = function () {
        imovelIndex++;
        const imoveisContainer = document.getElementById('imoveis-container');
    
        const imovelDiv = document.createElement('div');
        imovelDiv.classList.add('input-group', 'imovel');
        imovelDiv.dataset.index = imovelIndex;
        imovelDiv.innerHTML = `
            <h2>Imóvel ${imovelIndex}</h2>
            <label for="linkImovel${imovelIndex}">Link do Imóvel:</label>
            <input type="url" id="linkImovel${imovelIndex}">
            
            <label for="metragemImovel${imovelIndex}">Metragem (m²):</label>
            <input type="text" id="metragemImovel${imovelIndex}" class="metragem">
            
            <label for="valorImovel${imovelIndex}">Valor (R$):</label>
            <input type="text" id="valorImovel${imovelIndex}" class="valor">
            
            <label for="valorM2Imovel${imovelIndex}">Valor por M² (R$):</label>
            <input type="text" id="valorM2Imovel${imovelIndex}" readonly>
            <button type="button" class="delete-button" onclick="excluirImovel(${imovelIndex})">Excluir</button>
        `;
        imoveisContainer.appendChild(imovelDiv);

    // Adicionar eventos de entrada aos novos elementos de imóvel
    const newMetragemInput = imovelDiv.querySelector(`#metragemImovel${imovelIndex}`);
    const newValorInput = imovelDiv.querySelector(`#valorImovel${imovelIndex}`);
    newMetragemInput.addEventListener('input', recalcular);
    newValorInput.addEventListener('input', recalcular);

    // Atualizar botões de excluir
    atualizarBotoesExcluir(); 
    }

    window.excluirImovel = function (index) {
        const imovelDiv = document.querySelector(`.imovel[data-index="${index}"]`);
        if (imovelDiv) {
            const numImoveis = document.querySelectorAll('.imovel').length;
            if (numImoveis > 1) {
                imovelDiv.remove();
                imovelIndex--;
                atualizarBotoesExcluir();
                recalculaIndices();
                recalcular(); // Recalcular após a exclusão do imóvel
            } else {
                console.log("Não é possível excluir o único imóvel presente.");
            }
        }
    }

    function atualizarBotoesExcluir() {
        const botoesExcluir = document.querySelectorAll('.delete-button');
        if (botoesExcluir.length > 1) { 
            botoesExcluir.forEach(botao => {
                botao.disabled = false;
            });
        } else { 
            botoesExcluir.forEach(botao => {
                botao.disabled = true;
            });
        }
    }

function recalculaIndices() {
    const imoveis = document.querySelectorAll('.imovel');
    imoveis.forEach((imovel, index) => {
        const newIndex = index + 1;
        imovel.dataset.index = newIndex;
        const h2 = imovel.querySelector('h2');
        if (h2) {
            h2.textContent = `Imóvel ${newIndex}`;
        }
        // Atualiza os IDs dos elementos dentro do imóvel
        const inputs = imovel.querySelectorAll('input');
        inputs.forEach(input => {
            const oldId = input.id;
            const newId = oldId.replace(/\d+$/, newIndex); // Substitui o último número pelo novo índice
            input.id = newId;
        });
    });
}


    function calcularAvaliacao() {
        console.log("Calcular avaliação acionado");
        let valorTotalM2 = 0;
        let numeroOfertas = 0;
    
        document.querySelectorAll('.imovel').forEach(imovel => {
            const index = imovel.dataset.index;
            const valorM2 = calcularValorM2(index);
            if (valorM2 > 0) {
                valorTotalM2 += valorM2;
                numeroOfertas++;
            }
        });
    
        if (numeroOfertas === 0) {
            document.getElementById('resultado').innerHTML = '<h2>Nenhuma oferta válida encontrada</h2>';
            return;
        }
    
        const mediaTotalM2 = valorTotalM2 / numeroOfertas;
        const fatorOfertaInput = document.getElementById('fatorOferta');
        const fatorOferta = parseFloat(fatorOfertaInput.value.replace(/[^\d,]/g, '').replace(',', '.')) / 100;
        const valorAjustadoOferta = mediaTotalM2 * (1 - fatorOferta);
        const valorMedioM2 = valorAjustadoOferta;
        const metragemAvaliandoInput = document.getElementById('metragemAvaliando');
        const metragemAvaliando = parseFloat(metragemAvaliandoInput.value.replace(/[^\d,]/g, '').replace(',', '.'));
        const valorMercadoAvaliando = metragemAvaliando * valorMedioM2;
    
        document.getElementById('resultado').innerHTML = `
            <h2>Resultado da Avaliação</h2>
            <p>Valor Total de M² sem ajuste: R$ ${mediaTotalM2.toFixed(2).replace('.','', ',')}</p>
            <p>Preço Ajustado pelo Fator de Oferta: R$ ${valorAjustadoOferta.toFixed(2).replace('.', ',')}</p>
            <p>Número de Ofertas: ${numeroOfertas}</p>
            <p>Valor Médio por M²: R$ ${valorMedioM2.toFixed(2).replace('.', ',')}</p>
            <p>Valor de Mercado do Imóvel Avaliando: R$ ${valorMercadoAvaliando.toFixed(2).replace('.', ',')}</p>
        `;
    }

    window.imprimirResultado = function () {
        console.log("Imprimir acionado");
        const resultadoDiv = document.getElementById('resultado');
        const imoveis = document.querySelectorAll('.imovel');
        const printWindow = window.open('', '', 'height=400,width=600');
        printWindow.document.write('<html><head><title>Resultado da Avaliação</title>');
        printWindow.document.write('<style>@media print { body { font-family: Arial, sans-serif; background-color: #f0f0f0; margin: 0; padding: 0; } .container { max-width: 800px; margin: 50px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); } h1 { text-align: center; color: #333; } h2 { text-align: center; } .input-group { margin-bottom: 20px; } label { display: block; margin-bottom: 5px; color: #555; } input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; } .buttons { display: flex; justify-content: space-between; } button { padding: 10px; background-color: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer; width: 30%; } button:hover { background-color: #0056b3; } #resultado { margin-top: 20px; padding: 10px;background-color: #e9ecef; border-radius: 4px; } footer { text-align: center; margin-top: 20px; background-color: #f5f5f5; padding: 10px; border-top: 1px solid #ccc; } footer img { max-width: 150px; margin-bottom: 10px; } footer p { margin: 5px 0; color: #555; } footer p.bold { font-weight: bold; font-size: 1.2em; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<div class="container">');
        printWindow.document.write('<h1>Avaliação Imobiliária</h1>');
        printWindow.document.write('<h2>Método comparativo direto de dados do mercado</h2>');
    
        imoveis.forEach(imovel => {
            const index = imovel.dataset.index;
            const link = document.getElementById(`linkImovel${index}`).value;
            const metragem = document.getElementById(`metragemImovel${index}`).value;
            const valor = document.getElementById(`valorImovel${index}`).value;
            const valorM2 = document.getElementById(`valorM2Imovel${index}`).value;
    
            printWindow.document.write(`
                <div class="input-group">
                    <h2>Imóvel ${index}</h2>
                    <p>Link: <a href="${link}" target="_blank">${link}</a></p>
                    <p>Metragem: ${metragem} m²</p>
                    <p>Valor: R$ ${valor}</p>
                    <p>Valor por M²: R$ ${valorM2}</p>
                </div>
            `);
        });
    
        printWindow.document.write(resultadoDiv.innerHTML);
        printWindow.document.write(`
            <footer>
                <img src="https://s01.jetimgs.com/tnnAwYXphKBPiW3sr35S56TSBu59xTuwOiBGvJNNoNMd29yUZL3dr5Is9mHwU6exARdqah8P0l2J2TfnKp_6FFqtTdh1bJ6YBFfo7QEHQ3KTeM0TryQt/logoareamorarouinvestir202301png.webp" alt="ÁREA2 IMÓVEIS LTDA Logo">
                <p>ÁREA2 IMOVEIS LTDA, Creci: J04175, imobiliária credenciada para venda de imóveis de propriedade da Caixa Econômica Federal.</p>
                <p>Para MORAR ou INVESTIR, garanta seu imóvel no Paraná com tranquilidade. 📲💬 Fale conosco. WhatsApp [41] 99966.3908 📧 contato@areaimoveis.com.br</p>
                <br><br><p class="bold" style="font-size: 1.2em;">Responsabilidade sobre Avaliações</p><br>
                <p>A ferramenta de cálculo disponibilizada nesta página tem o objetivo de auxiliar na estimativa de viabilidade econômica de operações imobiliárias. As informações e resultados gerados pela calculadora são baseados nos dados inseridos pelo usuário e
                <p>A ÁREA2 IMÓVEIS LTDA não se responsabiliza pela precisão das informações fornecidas pelo usuário nem pelos resultados obtidos através desta ferramenta. As avaliações devem ser consideradas apenas como uma referência inicial, não substituindo a análise detalhada e profissional de um especialista no setor imobiliário.</p>
            </footer>
        `);
    
        printWindow.document.write('</div>'); 
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }
    
    document.getElementById('avaliacaoForm').addEventListener('input', recalcular);

    document.querySelectorAll('.metragem, .valor').forEach(input => {
        input.addEventListener('input', recalcular);
    });

    function recalcular() {
        calcularAvaliacao();
    }
});

