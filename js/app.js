$( document ).ready(function() {
    function getImage(image)
    {
        if(image == undefined) {
            image = 'images/unavailable.png';
            return image;
        } else {
            return image.smallThumbnail;
        }
    }

    function getDescription(description) {
        if(description == undefined) {
            return 'Information manquante';
        } else {
            return description.slice(0, 200) +'...';
        }
    }

    function search()
    {
        $('#form').submit(function(e) {
            e.preventDefault();
            var title = $("#title").val();
            var author = $("#author").val();
            var titleWithPlusAndQuotes = '"'+title.replace(/\s/gi, "+")+ '"';
            var authorWithPlusAndQuotes = '"'+author.replace(/\s/gi, "+")+ '"';
            var url = 'https://www.googleapis.com/books/v1/volumes?q='+titleWithPlusAndQuotes+'+'+authorWithPlusAndQuotes +'+intitle:'+ titleWithPlusAndQuotes +'+inauthor:'+ authorWithPlusAndQuotes +'&langRestrict=fr&printType=books&projection=lite';

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
    //search();
    function deleteBook()
    {
        $(".fa-trash-alt").click(function(){
            var confirmation = confirm("Êtes-vous certain de vouloir supprimer ce livre ?");
            if(confirmation) {
                var book = $(this).parent();
                book.fadeOut(800, function() {
                    book.remove();
                });
            }
        });
    }
    function addBookBlock(){
        var block = '<div id="addBookBlock">' +
            '<button id="addBook" class="btn">Ajouter un livre</button>' +
            '</div>';
        $('.h2NewBook').after(block);
        addBook();

    }

    function addCancelButton()
	{
		var cancel = '<button id="cancel" class="btn">Annuler</button>';
		return cancel;
	}

	function addSearchBlock()
	{
		var cancel = addCancelButton();
		var block = '<div id="searchBlock">' +
			'<form id="form">' +
            '<label>Titre du livre</label><br>' +
            '<input type="text" name="title" id="title" class="input" required><br>' +
            '<label>Auteur</label><br>' +
            '<input type="text" name="author" id="author" class="author" required><br>' +
            '<button class="btn">Rechercher</button>' +
            '</form>' +
            cancel +
        '</div>';
		//console.log(block);
		$('#addBookBlock').remove();
		$('.h2NewBook').after(block);
		removeSearchBlock();
		search();
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

    function addBook()
	{
		$('#addBook').click(function () {
			addSearchBlock();
        })
	}
    addBookBlock();
    function showResults(data)
    {
        $("#results").remove();
        var resultBlock = '<div id="results"><h2>Résultats de la recherche</h2></div>';
        $('hr').after(resultBlock);
        if(data.totalItems > 0) {
            $.each(data.items, function (index, value) {
                var block = '<div class="book" id="'+ value.id+ '">' +
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
                $("#results").append(block);
            });
            addBookInMyList();
        }
        else {
            $("#results").append('<p class="center">Aucun livre trouvé</p>');
        }
    }
    function addBookInMyList() {
        $('.fa-bookmark').click(function(){
            var id = $(this).closest('.book').attr('id');
            var parent = $(this).closest('.book').html();
            $('#content').append('<div class="my-book">'+ parent + '</div>');
            replaceBookMark();
            removeBookInMyList();
            addInSessionStorage(id, parent);
        });
    }
    function replaceBookMark(){
        $('.my-book .fa-bookmark').replaceWith('<i class="fas fa-trash-alt"></i>');
    }
    function removeBookInMyList() {
        $('.fa-trash-alt').click(function(){
            var element = $(this).parent()
            $(element).fadeOut(800, function () {
                $(element).remove();
            });
        });

        //sessionStorage.removeItem();
    }
    function addInSessionStorage(id, content) {
        /*
        //Vider la session
        sessionStorage.clear();
        //Récupérer les éléments
        var children = $('#content').children();
        //Enregistrer ceux-ci dans la session
        $.each(children, function (index, value) {
            sessionStorage.setItem(index, $(value).html());
        });
        //sessionStorage.setItem('key', 'value');
         */

        //Récupérer identifiant et contenu
        sessionStorage.setItem(id, content);
        console.log(sessionStorage);
    }
    function getInSessionStorage() {

        console.log(sessionStorage.length);
        for (var i = 0; i < sessionStorage.length; i++) {
            var id = sessionStorage.key(i);
            var value = sessionStorage.getItem(id);
            $("#content").append('<div class="my-book" id="'+ id +'">'+ value + '</div>');
        }
        replaceBookMark();
        /*
        $.each(sessionStorage, function(key, value){

            // key magic
            // value magic
            console.log(key);
            console.log(value);
            $("#content").append('<div class="my-book" id="'+ key +'">'+ value + '</div>');

        });

         */

        /*
        console.log(sessionStorage.getItem(0));
        console.log(sessionStorage.length);
        for(var i = 0; i < sessionStorage.length; i++) {
            $("#content").append('<div class="my-book">'+ sessionStorage[i] + '</div>');
        }

         */
    }
    getInSessionStorage();
    removeBookInMyList();
    //Supprimer le livre de la session pour ne pas qu'il s'affiche au rechargement de la page
});