import {addBookInMyList} from "./book";
import {getDescription, getImage} from "./book";

function showResults(data)
{
    $("#results").remove();
    const resultBlock = '<div id="results"><h2>Résultats de recherche</h2><div id="results-books"></div></div>';
    $('hr').after(resultBlock);
    if(data.totalItems > 0) {
        $.each(data.items, function (index, value) {
            const block = '<div class="book" id="'+ value.id+ '">' +
                '<div class="book-top">' +
                '<div class="book-top-left">' +
                '<h3>Titre: '+ value.volumeInfo.title +'</h3>' +
                '<p class="id">Id: '+ value.id +'</p>' +
                '<p>Auteur: '+ value.volumeInfo.authors[0] +'</p>' +
                '</div>' +
                '<div class="book-top-right">' +
                '<i class="fas fa-bookmark"></i>' +
                '</div>' +
                '</div>' +
                '<div class="book-bottom">' +
                '<p>Description: '+ getDescription(value.volumeInfo.description) +'</p>' +
                '<p class="center"><img src="'+ getImage(value.volumeInfo.imageLinks)+'" alt="'+ value.volumeInfo.title+'"></p>' +
                '</div>' +
                '</div>';
            $("#results-books").append(block);
        });
        addBookInMyList();
    }
    else {
        $("#results-books").append('<p class="center">Aucun livre trouvé</p>');
    }
}

export {showResults};