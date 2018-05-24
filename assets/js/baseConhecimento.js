
var json;
var url = "http://localhost:8080/api/";


$("#formCategoria").submit(function(e) {
    $('#msgOk').hide();
    $('#msgErro').hide();
    e.preventDefault();

    $("#html_btn_addCategoria").prop("disabled", true);

    var data = {};
    data["categoria"] = {};
    data["categoria"]["id"] = $("#cmbCategorias").val();
    data["topico"] = {};
    data["topico"]["id"] = $("#html_idTopico").val();


    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: url+"topicos/categoria",
        data: JSON.stringify(data),
        timeout: 600000,
        success: function (data) {
            $('#msgOk').html('Registro salvo com sucesso!').show();
            montaGridCategoriasTopico($("#html_idTopico").val());
        },
        error: function (xhr, textStatus, errorThrown) {
            mostrarErros(xhr);
        }
    });

    $("#html_btn_addCategoria").prop("disabled", false);

})

$("#form").submit(function(e) {
    $('#msgOk').hide();
    $('#msgErro').hide();
    e.preventDefault();

    $("#btnSubmit").prop("disabled", true);

    var data = {};
    data["id"] = $("#html_idInformacao").val();
    data["descricao"] = $("#html_informacao").val();
    data["categoriaId"] = $("#html_idCategoriaSelecionada").val();
    data["topico"] = {};
    data["topico"]["id"] = $("#html_idTopico").val();
    data["topico"]["nome"] = $("#html_topico").val();

    if (data["id"] == 0) {
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: url+"informacoes",
            data: JSON.stringify(data),
            timeout: 600000,
            async:false,
            success: function (data) {
                $('#msgOk').html('Registro salvo com sucesso!').show();
                limparCampos();
            },
            error: function (xhr, textStatus, errorThrown) {
                mostrarErros(xhr);
            }
        });
    } else {

        $.ajax({
            type: "PUT",
            contentType: "application/json",
            url: url+"informacoes/" + $("#html_idInformacao").val(),
            data: JSON.stringify(data),
            timeout: 600000,
            async:false,
            success: function (data) {
                $('#msgOk').html('Registro atualizado com sucesso!').show();
            },
            error: function (xhr, textStatus, errorThrown) {
                mostrarErros(xhr);
            }
        });
    }
    $("#btnSubmit").prop("disabled", false);
    carregarTreeview();
})

function montaGridCategoriasTopico(id) {
    $.get("http://localhost:8080/api/topicos/categorias/"+id, function (data) {

        var table = $('#gridCategorias').DataTable();

        table.rows().remove().draw();

        for (i =0; i < data.length; i++) {

            table.row.add( [
                '<a href="#" id="btn-excluir" style="width: 58px" class="btn btn-xs btn-danger" '
                +'      onclick="excluirCategoriaTopico('+id+','+data[i].id+'); montaGridCategoriasTopico('+id+');">Excluir</a>',
                data[i].nome
            ] )
                .draw();
        }
    });
};

function montaGridCategorias() {
    $.get("http://localhost:8080/api/categorias/listar", function (data) {

        var table = $('#gridCategorias').DataTable();

        table.rows().remove().draw();

        for (i =0; i < data["data"].length; i++) {

            table.row.add( [
                    data["data"][i].id,
                    data["data"][i].nome,
                    data["data"][i].nomePai,
                    '<a href="categorias_edit.html" style="width: 58px" class="btn btn-xs btn-success btn_edit"'
                    +'      onclick="localStorage.setItem(\'idCategoria\', '+data["data"][i].id+')">Editar</a>'
                    +'&ensp;<a href="#" id="btn-excluir" style="width: 58px" class="btn btn-xs btn-danger" '
                    +'      onclick="excluirCategoria('+data["data"][i].id+'); montaGridCategorias();">Excluir</a>'
                ] )
                .draw();
        }
    });
};

function excluirCategoria(id) {

    $('#msgOk').hide();
    $('#msgErro').hide();

    if (confirm('Tem certeza que deseja excluir?')) {

        var url = "http://localhost:8080/api/categorias/" + id;

        $.ajax({
            type: "DELETE",
            url: url,
            async: false,
            success: function () {
                $('#msgOk').html('Registro excluído com sucesso!').show();
            },
            error: function (xhr, textStatus, errorThrown) {
                mostrarErros(xhr);
            }
        });
    }
}

function excluirAnexo(id) {

    $('#msgOk').hide();
    $('#msgErro').hide();

    if (confirm('Tem certeza que deseja excluir?')) {

        $.ajax({
            type: "DELETE",
            url: url+"anexos/" + id,
            async: false,
            success: function () {
                $('#msgOk').html('Registro excluído com sucesso!').show();
            },
            error: function (xhr, textStatus, errorThrown) {
                mostrarErros(xhr);
            }
        });
    }
}

function excluirCategoriaTopico(id, idcategoria) {

    $('#msgOk').hide();
    $('#msgErro').hide();

    if (confirm('Tem certeza que deseja excluir?')) {

        var url = "http://localhost:8080/api/topicos/"+id+"/categorias/" + idcategoria;

        $.ajax({
            type: "DELETE",
            url: url,
            async: false,
            success: function () {
                $('#msgOk').html('Registro excluído com sucesso!').show();
            },
            error: function (xhr, textStatus, errorThrown) {
                mostrarErros(xhr);
            }
        });
    }
}

function carregarComboCategorias() {

    var url = "http://localhost:8080/api/categorias";

    $.getJSON(url + "/listar", function (result) {
        $("#cmbCategorias option").remove();
        var $dropdown = $("#cmbCategorias");
        $.each(result.data, function () {
            $dropdown.append($("<option />").val(this.id).text(this.nome));
        });
    });
}

function preencheTabela(json, edicao) {

    $('#tabela_anexos tr').remove();
    for (i =0; i < json.length; i++) {
        if (edicao) {
            $('#tabela_anexos > tbody:last-child')
                .append('<tr>'
                    + '<td><a href="#" id="btn-excluir" style="width: 58px" class="btn btn-xs btn-danger"'
                    + 'onclick="excluirAnexo(\'' + json[i].id + '\'); ">Excluir</a>'
                    + '</td>'
                    + '<td><a target="_blank" href="' + json[i].caminho + '">' + json[i].nome + '</a></td>'
                    + '</tr>');
        } else {
            $('#tabela_anexos > tbody:last-child').append('<tr><td><a target="_blank" href="'+json[i].caminho+'">'+json[i].nome+'</a></td></tr>');
        }
    }
}

function mostraDivs(){

    var id = $("#html_idTopico").val();
    if (id) {
        $("#html_divAnexos").show();
        $("#html_divCategorias").show();
    } else {
        $("#html_divAnexos").hide();
        $("#html_divCategorias").hide();
    }
}

function mostraDados(node, edicao){

    $("#info").show();

    if (node.id) {

        $('#html_topico').val(node.text);
        $('#html_idTopico').val(node.id);
        $('#html_idCategoriaSelecionada').val(node.pai);

        var texto = $('[data-nodeid="'+node.parentId+'"]')[0].innerText;
        $('#html_categoriaSelecionada').html(texto);

        $.get("http://localhost:8080/api/informacoes/topico/" + node.id, function (data) {
            $('#html_informacao').val(data["data"][0].descricao);
            $('#html_idInformacao').val(data["data"][0].id);
        })
        .done(function (){
            $.get("http://localhost:8080/api/anexos/topico/" + node.id, function (data) {
                preencheTabela(data, edicao);
            }).done(function () {
                montaGridCategoriasTopico(node.id);
            })
        });
    } else {
        $('#html_idTopico').val(undefined);
        $("#html_idInformacao").val(0)
        $('#html_idCategoriaSelecionada').val(node.idCategoria);
        $('#html_topico').val("");
        $('#html_informacao').val("");
    }
    mostraDivs();
}

function montaTreeview(data) {
    json = '[';
    var i;
    for (i = 0; i < data["data"].length; i++) {
        json += '{"text": "' + data["data"][i].nome + '"';
        json += ',"idCategoria": "' + data["data"][i].id + '"';

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
                json += ',"pai": "' + data[i].pai + '"';
                json += ',"idCategoria": "' + data[i].id + '"';
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

function mostrarErros(xhr) {
    var texto = 'Operação não realizada!';

    if (xhr.responseJSON) {
        if (xhr.responseJSON.errors) {
            $.each(xhr.responseJSON.errors, function () {
                texto += '<br>' + this;
            });
        }
        if (xhr.responseJSON.message) {
            texto += '<br>' + xhr.responseJSON.message;
        }
    }
    else {
        texto += '<br>' + xhr.statusText;
    }
    $('#msgErro').html(texto).show();

}

function carregarTreeview() {
    $.get("http://localhost:8080/api/categorias", function (data) {
        montaTreeview(data);
    })
        .done(function () {
            var $tree = $('#treeview12').treeview({
                data: json,
                onNodeSelected: function(event, node) {
                    mostraDados(node, true);
                }
            });
        })
        .fail(function () {
            alert("error");
        });
}

function limparCampos() {
    $("#html_topico").val("");
    $("#html_idTopico").val(undefined);
    $("#html_informacao").val("");
    $("#html_idInformacao").val("");

}