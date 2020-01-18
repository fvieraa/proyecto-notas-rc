class Nota {

    constructor(titulo, contenido, id, fecha, hora) { //, id) {
        this.titulo = titulo;
        this.contenido = contenido;
        this.id = id;
        this.fecha = fecha;
        this.hora = hora;

    }


}


function generarId(length) {
    var id = '';
    var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var caracteresLength = caracteres.length;
    for (var i = 0; i < length; i++) {
        id += caracteres.charAt(Math.floor(Math.random() * caracteresLength));
    }
    return id;
}


function agregarnota() {
    var act = new Date();
    var hora = act.getHours() + ':' + act.getMinutes();
    var fecha = act.getDate() + '-' + (act.getMonth() + 1) + '-' + act.getFullYear();

    let titulo = document.getElementById('titulo');
    let contenido = document.getElementById('contenido');
    let id = generarId(20);
    //Verifico que estén todos los campos
    if (titulo.value != "" && contenido.value != "") {

        if (titulo.value.length >= 60 || contenido.value.length >= 500) {
            alert("Titulo maximo 60 caracteres \nContenido maximo 500 caracteres");
            return false;

        } else {
            let nuevaNota = new Nota(
                titulo.value,
                contenido.value, id,
                fecha, hora

            );

            if (existeNota(nuevaNota)) {
                alert('Ya existe una nota con ese titulo');
                return false;
            } else {
                let nota = JSON.parse(localStorage.getItem('nota'));
                if (!nota) {
                    nota = [];
                }
                nota.push(nuevaNota);
                localStorage.setItem('nota', JSON.stringify(nota));

                //Limpio el formulario
                titulo.value = "";
                contenido.value = "";
                alert('Nota guardada correctamente');
            }
        }

    } else {
        alert('Campos incompletos!!');
    }
}

function listarNotas(nota = null) {
    if (nota == null) {
        nota = JSON.parse(localStorage.getItem('nota'));
        fecha = JSON.parse(localStorage.getItem('fecha'));
        //Controlo si tengo la agenda vacía
        if (!nota) {
            nota = [];
        }
    }

    //Genero el contenido de la tabla
    let tabla = "";
    for (let index = 0; index < nota.length; index++) {


        tabla += '<tr><td>' + nota[index].id + '</td>';
        tabla += '<td>' + nota[index].titulo + '</td><td>' + nota[index].contenido + '</td>';
        if (nota[index].fecha && nota[index].hora) {
            tabla += '<td>' + nota[index].fecha + ' ' + nota[index].hora + '</td>';
        }
        tabla += '<td><button type="button" class="btn btn-warning btn-sm mr-1" data-toggle="modal" data-target="#editarNotaModal" onclick="cargarFormMod(\'' + nota[index].id + '\')">Modificar</button>';

        tabla += '<button type="button" class="btn btn-danger btn-sm" onclick="eliminarNota(\'' + nota[index].titulo + '\')">Eliminar</button></td></tr>';
    }
    //Muestro el contenido de la tabla
    document.getElementById('tablaNotas').innerHTML = tabla;
}

function eliminarNota(txt) {
    if (confirm('¿Esta seguro de borrar la nota?')) {
        let nota = JSON.parse(localStorage.getItem('nota'));
        let indice = nota.findIndex(n => n.titulo == txt);
        nota.splice(indice, 1);
        localStorage.setItem('nota', JSON.stringify(nota));
        alert('nota eliminada');
        //listarContactos();
        buscar();
    }
}

function existeNota(nt) {
    let nota = JSON.parse(localStorage.getItem('nota'));
    if (nota) {
        return nota.find(n => n.titulo == nt.titulo) != null;
    } else {
        return false;
    }
}

function buscar() {
    console.log(event);
    if (event.type == "submit") {
        event.preventDefault();
    }
    let txt = document.getElementById('txt-buscador').value;
    let nota = JSON.parse(localStorage.getItem('nota'));
    // Controlo que se haya ingresado algo en el buscador
    // y que la agenda no este vacía
    if (txt && nota) {
        let notaFiltradaxtitulo = nota.filter(n => n.titulo.toLowerCase().indexOf(txt.toLowerCase()) > -1);
        let notaFiltradaxcontenido = nota.filter(n => n.contenido.toLowerCase().indexOf(txt.toLowerCase()) > -1);
        if (notaFiltradaxtitulo.length > 0) {

            listarNotas(notaFiltradaxtitulo);
        } else if (notaFiltradaxcontenido.length > 0) {
            listarNotas(notaFiltradaxcontenido);
        }

    } else {
        listarNotas(nota);
    }
}

function cargarFormMod(id) {
    let nota = JSON.parse(localStorage.getItem('nota'));
    let item = nota.find(n => n.id == id);
    document.getElementById('id-modal').value = item.id
    document.getElementById('titulo-modal').value = item.titulo
    document.getElementById('contenido-modal').value = item.contenido
}

function modificar() {
    var act = new Date();
    var hora = act.getHours() + ':' + act.getMinutes();
    var fecha = act.getDate() + '-' + (act.getMonth() + 1) + '-' + act.getFullYear();



    let id = document.getElementById('id-modal').value;
    let Newtitulo = document.getElementById('titulo-modal').value;
    let newContenido = document.getElementById('contenido-modal').value;

    let nota = JSON.parse(localStorage.getItem('nota'));

    let index = nota.findIndex(n => n.id == id);
    nota[index].titulo = Newtitulo;
    nota[index].contenido = newContenido;
    nota[index].fecha = fecha;
    nota[index].hora = hora;
    localStorage.setItem('nota', JSON.stringify(nota));
    alert('Nota actualizada');
    $('#editarNotaModal').modal('toggle');
    buscar();


}