
var json;

function montaGridCategorias() {
    $.get("http://localhost:8080/api/categorias/listar", function (data) {

        $('#gridCategorias tbody tr').remove();

        for (i =0; i < data["data"].length; i++) {
            $('#gridCategorias > tbody:last-child')
                .append('<tr>'
                    +'<td>'+data["data"][i].id+'</td>'
                    +'<td>'+data["data"][i].nome+'</td>'
                    +'<td>'+data["data"][i].nomePai+'</td>'
                    +'<td><a href="categorias_edit.html" style="width: 58px" class="btn btn-xs btn-success btn_edit"'
                    +'      onclick="localStorage.setItem(\'idCategoria\', '+data["data"][i].id+')">Editar</a>'
                    +'&ensp;<a href="#" id="btn-excluir" style="width: 58px" class="btn btn-xs btn-danger" '
                    +'      onclick="excluirCategoria('+data["data"][i].id+'); montaGridCategorias();">Excluir</a></td>'
                    +'</tr>');
        }
    });
};

function excluirCategoria(id) {
    if (confirm('Tem certeza que deseja excluir?')) {

        var url = "http://localhost:8080/api/categorias/" + id;

        $.ajax({
            type: "DELETE",
            url: url,
            async: false,
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

function configurarGrid(id_da_grid){
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

