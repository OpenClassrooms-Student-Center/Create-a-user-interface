import {addBook} from "./book";
import {search} from "./search";

function addBookBlock()
{
    const block = `  
        <div id="addBookBlock">
            <button id="addBook" class="btn">Ajouter un livre</button>
        </div>`;
    $('.h2NewBook').after(block);
    addBook();

}

function addCancelButton()
{
    return `<button id="cancel" class="btn">Annuler</button>`;
}

function addSearchBlock()
{
    const cancel = addCancelButton();
    const block = `<div id="searchBlock">
        <form id="form">
        <label>Titre du livre</label><br>
        <input type="text" name="title" id="title" class="input" required><br>
        <label>Auteur</label><br>
        <input type="text" name="author" id="author" class="author" required><br>
        <button class="btn">Rechercher</button>
        </form>
        ${cancel}
        </div>`;
    $('#addBookBlock').remove();
    $('.h2NewBook').after(block);
    removeSearchBlock();
    search();
}

function replaceBookMark()
{
    $('.my-book .fa-bookmark').replaceWith('<i class="fas fa-trash-alt"></i>');
}

function removeSearchBlock()
{
    $('#cancel').click(function () {
        $('#searchBlock').remove();
        $("#results").fadeOut(800, function () {
            $("#results").remove();
        });
        addBookBlock();
    })
}

export {addBookBlock, addCancelButton, addSearchBlock, replaceBookMark};