import {addSearchBlock, replaceBookMark} from "./templates";
import {addInSessionStorage, removeInSessionStorage} from "./sessionStorage";

function addBook()
{
    $('#addBook').click(function () {
        addSearchBlock();
    })
}

function getImage(image)
{
    if(image == undefined) {
        image = 'images/unavailable.png';
        return image;
    }
    return image.smallThumbnail;
}

function getDescription(description)
{
    if(description == undefined) {
        return 'Information manquante';
    }
    return description.slice(0, 200) +'...';
}

function addBookInMyList() {
    $('.fa-bookmark').click(function(){
        const id = $(this).closest('.book').attr('id');
        let value = 0;
        $('.my-book').each(function () {
            if(id === $(this).attr('id')) {
                alert('Ce livre a déjà été ajouté à votre liste');
                value = 1;
                return false;
            }
        });
        if(value == 0) {
            const parent = $(this).closest('.book').html();
            $('#content').append('<div class="my-book" id="'+ id +'">'+ parent + '</div>');
            replaceBookMark();
            removeBookInMyList();
            addInSessionStorage(id, parent);
        }
    });
}

function removeBookInMyList()
{
    $('.fa-trash-alt').click(function(){
        const element = $(this).closest('.my-book');
        const id = $(this).closest('.my-book').attr('id');
        $(element).fadeOut(800, function () {
            $(element).remove();
        });
        removeInSessionStorage(id);
    });
}

export {addBook, getImage, getDescription, addBookInMyList, removeBookInMyList};