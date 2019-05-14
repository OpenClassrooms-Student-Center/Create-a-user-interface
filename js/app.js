import { getInSessionStorage } from './sessionStorage';
import { addBookBlock } from './templates';
import { removeBookInMyList } from "./book";

$( document ).ready(function()
{
    addBookBlock();
    getInSessionStorage();
    removeBookInMyList();
});