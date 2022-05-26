import * as forms from "../../../core/templates/bunker/js/forms.js";
import {modal,alerta} from "../../../core/templates/bunker/js/bunker.js";


const DocumentacaoExtra = {
    init: ()=> {
        // botão abrir modal
        document.querySelector('#btnAbrirModalDocExtra').addEventListener('click', function() {
            DocumentacaoExtra.abrirModalDocExtra();
        });
        // botões fechar modal
        document.querySelectorAll("[name='btnFecharModalDocExtra']").forEach(el => {
            el.addEventListener('click', () => {
                DocumentacaoExtra.fecharModalDocExtra();
            });
        });

        // exibir o none do arquivo escolhido
        DocumentacaoExtra.atribuirEventoInputFile();

        //botão confirmar
        document.getElementById('btnConfirmarDocExtra').addEventListener('click', function() {
            DocumentacaoExtra.confirmarModalDocExtra();
        });

        //botão adicionar documentação extra
        document.getElementById('btnAdicionaArquivoDocExtra').addEventListener('click', function() {
            DocumentacaoExtra.adicionarArquivo();
        });
    },
    idDocumentacaoExtra: 0,
    listaArquivos: [],
    abrirModalDocExtra: () => {
        const frmdocExtra = document.getElementById('frmModalDocExtra');
        forms.registra(frmdocExtra);
        modal.abre('m_upload_docExtra');
    },
    fecharModalDocExtra: () => {
        if (window.confirm('Deseja descartar todas as informações?')) {
            document.getElementById('frmModalDocExtra').reset();
            DocumentacaoExtra.apagarTrs();
            modal.fecha('m-upload-docExtra');
        }
    },
    confirmarModalDocExtra: () => {
        const frm = document.getElementById('frmModalDocExtra');
        if (!forms.valido(frm)) {
            alert('complete o formulário antes de fechar o modal')
            return false;
        }
        modal.fecha('m-upload-docExtra');
    },
    removerArquivoDocumetacaoExtra: (id) => {
        const row = document.querySelector('[data-id_anexo_extra="' + id + '"]');
        row.remove(row.rowIndex);
        DocumentacaoExtra.reNumeraTrs()
    },
    reNumeraTrs:()=>{
        let i = 0;
        document.querySelectorAll('#m_upload_docExtra tr[data-id_anexo_extra]').forEach((el)=>{
            el.dataset['id_anexo_extra']=i;
            i++;
        });
        DocumentacaoExtra.idDocumentacaoExtra = i-1;
    },
    apagarTrs:()=>{
        document.querySelectorAll('#m_upload_docExtra tr[data-id_anexo_extra]').forEach((el)=>{
            if(parseInt(el.dataset['id_anexo_extra'])){
                el.remove();
           }
        });
        const disabled = document.createAttribute('disabled');
        disabled.value = 'disabled';
        //document.getElementById('btnExcluirArquivoDocExtra0').setAttributeNode(disabled);
        //DocumentacaoExtra.idDocumentacaoExtra = 0;
    },
    adicionarArquivo: () => {
        const proximoArquivo = DocumentacaoExtra.idDocumentacaoExtra + 1;
        const arquivoAnterior = proximoArquivo-1;
        const trAnterior = document.querySelector('[data-id_anexo_extra="' + arquivoAnterior + '"]');
        const btnVisualizarAnterior = trAnterior.querySelector('[name="btnVisualizarArquivoDocExtra"]');

      if(!proximoArquivo || btnVisualizarAnterior.value.length === 0){
          alerta.abreOK('Escolha o arquivo anterior antes de acrescentar o próximo arquivo',10);
          return false
      }
      const tds = `
            <td class="d-flex flex-row justify-content-around">
                <span class="btn fileinput-button d-flex ">
                    <span><i class="fa fa-2x fa-folder-open-o" aria-hidden="true"></i></span>
                    <input type="file" name="arqDocExtra[]"  accept=".zip,.pdf" />
                </span>
               <input type="text" class="w-75" name="visualizaArquivoDocExtra" readonly>
            </td>
            <td>
                <button type="button" name="btnExcluirArquivoDocExtra" class="btn disabled" disabled="disabled">
                    <i aria-hidden="true" class="fa fa-2x fa-trash"></i>
                </button>
            </td>          
      `;
      const tr = document.createElement('tr');
      tr.dataset['id_anexo_extra']= proximoArquivo;
      tr.innerHTML = tds;
      document.querySelector('[data-id_anexo_extra="' + arquivoAnterior + '"]').after(tr);
      DocumentacaoExtra.idDocumentacaoExtra++;
      DocumentacaoExtra.removerEventoInputFile();
      DocumentacaoExtra.atribuirEventoInputFile();
    },

    //todo: Acessar todos os elementos da TR baseado no nome pelo numero da TR

    habilitarBtnExcluirArquivoDocExtra:(idInputVisualizar)=> {
        const btnExcluirArquivoDocExtra = document.getElementById('btnExcluirArquivoDocExtra' + idInputVisualizar)
        btnExcluirArquivoDocExtra.addEventListener('click', () => {
            DocumentacaoExtra.removerArquivoDocumetacaoExtra(idInputVisualizar);
        });
        btnExcluirArquivoDocExtra.classList.toggle('disabled');
        btnExcluirArquivoDocExtra.attributes.removeNamedItem('disabled');
    },
    exibirNomeArquivoDocExtra: (evento) => {
        const arquivo = evento.target.files[0].name;
        if(DocumentacaoExtra.listaArquivos.includes(arquivo)){
            alerta.abreOK('Arquivo já adicionado',10);
            evento.target.value = '';
            return false;
        }
        DocumentacaoExtra.listaArquivos.push(arquivo);
        const idInputVisualizar = evento.target.parentNode.parentNode.parentNode.dataset.id_anexo_extra;
        const visualizaArquivo = document.getElementById('visualizaArquivoDocExtra'+idInputVisualizar);
        visualizaArquivo.value = arquivo;
        if(parseInt(idInputVisualizar)){
            DocumentacaoExtra.habilitarBtnExcluirArquivoDocExtra(idInputVisualizar);
        }
    },
    removerEventoInputFile:()=>{
        document.getElementsByName('arqDocExtra[]').forEach(el => {
            el.removeEventListener('change',DocumentacaoExtra.atribuirEventoInputFile,false);
        });
    },
    atribuirEventoInputFile:()=> {
        document.getElementsByName('arqDocExtra[]').forEach(el => {
            el.addEventListener('change', (evento) => {
                DocumentacaoExtra.exibirNomeArquivoDocExtra(evento);
            });
        });
    },
}
export {DocumentacaoExtra}

