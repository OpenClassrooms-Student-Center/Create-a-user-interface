$( document ).ready(function() {
    //$("#addBook").hide();
    $("#searchBlock").hide();
    function handleResponse(response) {
        console.log(response);
        for (var i = 0; i < response.items.length; i++) {
            var item = response.items[i];
            var title = item.volumeInfo.title;
            var image = getImage(item.volumeInfo.imageLinks);
            title = "<h2>"+ title +"</h2>";
            image = '<img src="'+ image +'" alt="title">';
            var remove = '<i class="fas fa-trash-alt"></i>';
            var br = '<br><br><br>';
            var div = '<div class="book">' + title + image + br + remove +'</div>';
            $('#content').append(div);
            $('.book').hide();
        }
        showBooks();
        deleteBook();
    }

    function getImage(image)
    {
        console.log(image);
        if(image == undefined) {
            console.log('test');
            image = 'images/unavailable.png';
            return image;
        } else {
            return image.smallThumbnail;
        }
    }

    function showBooks()
    {
        $('.book').each(function(index) {
            $(this).delay(1000*index).fadeIn(800);
        });
    }

    function search()
    {
        $('#form').submit(function(e) {
            e.preventDefault();
            console.log('formulaire soumis');
            //Récupérer les champs saisis dans le formulaire
            var title = $("#title").val();
            console.log(title);
            var author = $("#author").val();
            console.log(author);
            var search = $("#search").val();
            console.log(search);

            var titleWithPlusAndQuotes = '"'+title.replace(/\s/gi, "+")+ '"';
            console.log(titleWithPlusAndQuotes);

            var authorWithPlusAndQuotes = '"'+author.replace(/\s/gi, "+")+ '"';
            console.log(authorWithPlusAndQuotes);

            //var url = "https://www.googleapis.com/books/v1/volumes?q=1984+intitle:1984+inauthor:Orwell&filter=partial&langRestrict=fr&printType=books&projection=lite";
            //var url = 'https://www.googleapis.com/books/v1/volumes?q="'+ titleWithPlus +'"+intitle:'+ titleWithPlus +'+inauthor:Orwell&filter=partial&langRestrict=fr&printType=books&projection=lite';
            //var url2 = 'https://www.googleapis.com/books/v1/volumes?q="la+ferme+des+animaux"+intitle:"la+ferme+des+animaux"+inauthor:Orwell'
            //https://www.googleapis.com/books/v1/volumes?q=%22la+ferme+des+animaux%22+intitle:%22la+ferme+des+animaux%22+inauthor:Orwell&filter=full&langRestrict=fr&printType=books&projection=lite
            var url = 'https://www.googleapis.com/books/v1/volumes?q='+titleWithPlusAndQuotes+'+'+authorWithPlusAndQuotes +'+intitle:'+ titleWithPlusAndQuotes +'+inauthor:'+ authorWithPlusAndQuotes +'&langRestrict=fr&printType=books&projection=lite';

            console.log(url);
            $.ajax({
                type: "GET",
                url: url,
                dataType: 'json',
                success: function(data) {
                    console.log(data);
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
			console.log('clicked');
			//Create Search Block
			addSearchBlock();
			//Remove addBook block
        })
	}
    addBookBlock();
    function showResults(data)
    {
        $("#results").remove();
        var resultBlock = '<div id="results"><h2>Résultats de la recherche</h2></div>';
        $('#searchBlock').after(resultBlock);
        $.each(data.items, function (index, value) {
            console.log(value);
            var block = '<div class="book" id="'+ value.id +'">' +
                '<h3>Titre: '+ value.volumeInfo.title +'</h3>' +
                '<p>Auteur: '+ value.volumeInfo.authors[0] +'</p>' +
                '<i class="fas fa-bookmark"></i>' +
                '<img src="'+ getImage(value.volumeInfo.imageLinks)+'" alt="'+ value.volumeInfo.title+'">' +
            '</div><hr>';
            $("#results").append(block);
        });
        addBookInMyList();
    }
    function addBookInMyList() {
        $('.fa-bookmark').click(function(){
            var parent = $(this).parent().html();
            $('#content').append('<div class="my-book">'+ parent + '</div>');
            replaceBookMark();
            console.log(parent);
            removeBookInMyList();
            addInSessionStorage();
        });
    }
    function replaceBookMark(){
        $('.my-book .fa-bookmark').replaceWith('<i class="fas fa-trash-alt"></i>');
    }
    function removeBookInMyList() {
        $('.fa-trash-alt').click(function(){
            console.log($(this).parent());
            var element = $(this).parent()
            $(element).fadeOut(800, function () {
                $(element).remove();
            });
        });

        //sessionStorage.removeItem();
    }
    function addInSessionStorage() {
        //Vider la session
        sessionStorage.clear();
        console.log(sessionStorage);
        //Récupérer les éléments
        var children = $('#content').children();
        console.log(children);
        //Enregistrer ceux-ci dans la session
        $.each(children, function (index, value) {
            console.log(index);
            console.log(value);
            sessionStorage.setItem(index, $(value).html());
            console.log(sessionStorage);
        });
        //sessionStorage.setItem('key', 'value');
    }
    function getInSessionStorage() {
        console.log(sessionStorage.getItem(0));
        console.log(sessionStorage.length);
        for(var i = 0; i < sessionStorage.length; i++) {
            console.log(sessionStorage[i]);
            $("#content").append('<div class="my-book">'+ sessionStorage[i] + '</div>');
        }
    }
    getInSessionStorage();
    removeBookInMyList();
    //Supprimer le livre de la session pour ne pas qu'il s'affiche au rechargement de la page
});