import { replaceBookMark } from './templates';

function addInSessionStorage(id, content)
{
    //Récupérer identifiant et contenu
    sessionStorage.setItem(id, content);
}

function getInSessionStorage()
{
    for (let i = 0; i < sessionStorage.length; i++) {
        let id = sessionStorage.key(i);
        let value = sessionStorage.getItem(id);
        $("#content").append('<div class="my-book" id="'+ id +'">'+ value + '</div>');
    }
    replaceBookMark();
}

function removeInSessionStorage(id)
{
    sessionStorage.removeItem(id);
}

export {addInSessionStorage, getInSessionStorage, removeInSessionStorage};