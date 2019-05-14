$( document ).ready(function() {
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

    function addBookBlock()
    {
        const block = '<div id="addBookBlock">' +
            '<button id="addBook" class="btn">Ajouter un livre</button>' +
            '</div>';
        $('.h2NewBook').after(block);
        addBook();

    }

    function addCancelButton()
	{
		const cancel = '<button id="cancel" class="btn">Annuler</button>';
		return cancel;
	}

	function addSearchBlock()
	{
		const cancel = addCancelButton();
        const block = '<div id="searchBlock">' +
			'<form id="form">' +
            '<label>Titre du livre</label><br>' +
            '<input type="text" name="title" id="title" class="input" required><br>' +
            '<label>Auteur</label><br>' +
            '<input type="text" name="author" id="author" class="author" required><br>' +
            '<button class="btn">Rechercher</button>' +
            '</form>' +
            cancel +
        '</div>';
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

    function addBookInMyList() {
        $('.fa-bookmark').click(function(){
            const id = $(this).closest('.book').attr('id');
            const myBookId = $('.my-book').attr('id');
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

    function replaceBookMark()
    {
        $('.my-book .fa-bookmark').replaceWith('<i class="fas fa-trash-alt"></i>');
    }

    function removeBookInMyList()
    {
        $('.fa-trash-alt').click(function(){
            const element = $(this).closest('.my-book');
            const id = $(this).closest('.my-book').attr('id');
            $(element).fadeOut(800, function () {
                $(element).remove();
            });
            sessionStorage.removeItem(id);
        });
    }

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

    addBookBlock();
    getInSessionStorage();
    removeBookInMyList();
});