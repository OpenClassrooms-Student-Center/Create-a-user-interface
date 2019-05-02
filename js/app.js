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
            var search = $("#search").val();
            console.log(search);
            var url = "https://www.googleapis.com/books/v1/volumes?q=1984+intitle:1984+inauthor:Orwell&filter=partial&langRestrict=fr&printType=books&projection=lite";
            console.log(url);
            $.ajax({
                type: "GET",
                url: url,
                dataType: 'json',
                success: function(data) {
                    console.log(data);
                },
                error: function(errorMessage) {
                    console.log("damnn");
                }
            });
        });
    }
    search();
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
            '<input type="text" name="search" id="search"><br>' +
            '<button class="btn">Rechercher</button>' +
			cancel +
            '</form>' +
            '</div>';
		console.log(block);
		$('#addBookBlock').remove();
		$('h1').after(block);
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
	addBook();
});