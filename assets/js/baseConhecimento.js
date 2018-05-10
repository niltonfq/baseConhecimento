
var json;

function montaGridCategorias(data) {

    $('#grid tbody tr').remove();

    for (i =0; i < data["data"].length; i++) {
        $('#grid > tbody:last-child')
            .append('<tr>'
                +'<td>'+data["data"][i].id+'</td>'
                +'<td>'+data["data"][i].nome+'</td>'
                +'<td>'+data["data"][i].nomePai+'</td>'
                +'<td><a href="#" style="width: 58px" class="btn btn-xs btn-success btn_edit">Editar</a>'
                +'&ensp;<a href="#" id="btn-excluir" data-id=data["data"][i].id style="width: 58px" class="btn btn-xs btn-danger">Excluir</a></td>'
                +'</tr>');




    }
};

function preencheTabela(json) {
    $('#tabela_anexos tr').remove();
    for (i =0; i < json.length; i++) {
        $('#tabela_anexos > tbody:last-child').append('<tr><td><a target="_blank" href="'+json[i].caminho+'">'+json[i].nome+'</a></td></tr>');
    }
}

function mostraDados(node){
    if (node.id) {
        $('#html_topico').html(node.text);
        $.get("http://localhost:8080/api/informacoes/topico/" + node.id, function (data) {
            $('#html_informacao').html(data["data"][0].descricao);
        })
            .done(function (){
                $.get("http://localhost:8080/api/anexos/topico/" + node.id, function (data) {
                    preencheTabela(data);
                })
            });
    }
}

function montaTreeview(data) {
    json = '[';
    var i;
    for (i = 0; i < data["data"].length; i++) {
        json += '{"text": "' + data["data"][i].nome + '"';

        montaNodes(data["data"][i].itens);

        json += '}';
        if (i != data["data"].length - 1) {
            json += ',';
        }
    }
    json += ']';
};

function montaNodes(data, gravaId) {
    if (data) {
        if (data.length != 0) {

            json += ',"nodes": [{';

            var i;
            for (i = 0; i < data.length; i++) {

                json += '"text": "' + data[i].nome + '"';
                if (gravaId) {
                    json += ',"id": "' + data[i].id + '"';
                }
                montaNodes(data[i].itens, false);
                montaNodes(data[i].topicos, true);
                if (i != data.length - 1) {
                    json += '},{';
                }
            }

            json += '}]';
        }
    }
};

