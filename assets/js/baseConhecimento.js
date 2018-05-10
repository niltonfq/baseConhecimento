
var json;

function montaGridCategorias(id_da_grid, inicializar) {
    $.get("http://localhost:8080/api/categorias/listar", function (data) {

        $('#'+id_da_grid+' tbody tr').remove();

        for (i =0; i < data["data"].length; i++) {
            $('#grid > tbody:last-child')
                .append('<tr>'
                    +'<td>'+data["data"][i].id+'</td>'
                    +'<td>'+data["data"][i].nome+'</td>'
                    +'<td>'+data["data"][i].nomePai+'</td>'
                    +'<td><a href="#" style="width: 58px" class="btn btn-xs btn-success btn_edit">Editar</a>'
                    +'&ensp;<a href="#" id="btn-excluir" style="width: 58px" class="btn btn-xs btn-danger" '
                    +'      onclick="excluirCategoria( confirm(\'Tem certeza que deseja excluir?\'),'+data["data"][i].id+',\''+id_da_grid+'\')">Excluir</a></td>'
                    +'</tr>');
        }
    })
    .done(function (){
        if (inicializar) {
            $('#' + id_da_grid).DataTable({
                "language": {
                    "decimal": ",",
                    "emptyTable": "Nenhum dado encontrado",
                    "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
                    "infoEmpty": "Mostrando 0 registros",
                    "infoFiltered": "(filtrado de um total de _MAX_ registros)",
                    "infoPostFix": "",
                    "thousands": ".",
                    "lengthMenu": "Mostrar _MENU_ registros",
                    "loadingRecords": "Carregando...",
                    "processing": "Processando...",
                    "search": "Procurar:",
                    "zeroRecords": "Nenhum registro encontrado",
                    "paginate": {
                        "first": "Primeiro",
                        "last": "Último",
                        "next": "Próximo",
                        "previous": "Anterior"
                    },
                    "aria": {
                        "sortAscending": ": activate to sort column ascending",
                        "sortDescending": ": activate to sort column descending"
                    }
                }
            });
        }
    });


};

function excluirCategoria(confirmacao, id, id_da_grid) {
    if (confirmacao) {

        var url = "http://localhost:8080/api/categorias/" + id;

        $.ajax({
            type: "DELETE",
            url: url,
            success: function (data) {
                montaGridCategorias(id_da_grid, false);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("falha: Item não foi excluído");
            }
        });
    }
}

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

