import { showResults } from "./results";

function search()
{
    $('#form').submit(function(e) {
        e.preventDefault();
        const title = $("#title").val();
        const author = $("#author").val();
        const titleWithPlusAndQuotes = '"'+title.replace(/\s/gi, "+")+ '"';
        const authorWithPlusAndQuotes = '"'+author.replace(/\s/gi, "+")+ '"';
        const url = 'https://www.googleapis.com/books/v1/volumes?q='+titleWithPlusAndQuotes+'+'+authorWithPlusAndQuotes +'+intitle:'+ titleWithPlusAndQuotes +'+inauthor:'+ authorWithPlusAndQuotes +'&langRestrict=fr&printType=books&projection=lite';

        $.ajax({
            type: "GET",
            url: url,
            dataType: 'json',
            success: function(data) {
                showResults(data);
            },
            error: function(errorMessage) {
                console.log("damnn");
            }
        });
    });
}

export {search};