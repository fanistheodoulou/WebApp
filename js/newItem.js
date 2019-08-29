$(document).ready(function() {

    var categoriesCollection = jQuery.parseJSON( $("#categoriesField").val() );

    $("#subcategory").css('visibility','hidden');
    $("#subcategory2").css('visibility','hidden');

    $("#category").prop("selectedIndex", -1);

    $("#category").change(function() {

        var el = $(this);

        var id;
        categoriesCollection.forEach(category => {
            if(category.name == el.val())
                id = category._id;
        });

        $("#subcategory").css('visibility','hidden');
        $("#subcategory").empty();
        $("#subcategory2").css('visibility','hidden');
        $("#subcategory2").empty();

        categoriesCollection.forEach(category => {
            if(category.parent.id == id){
                $("#subcategory").css('visibility','visible');
            }
        });

        $("#subcategory").empty();
        categoriesCollection.forEach(category => {
            if(category.parent.id == id)
                $("#subcategory").append("<option value="+category.name+">"+category.displayName+"</option>");
        });
        $("#subcategory").prop("selectedIndex", -1);
    });

    $("#subcategory").change(function() {
        var el = $(this);

        var id;
        categoriesCollection.forEach(category => {
            if(category.name == el.val())
                id = category._id;
        });

        categoriesCollection.forEach(category => {
            if(category.parent.id == id){
                $("#subcategory2").css('visibility','visible');
            }
        });

        $("#subcategory2").empty();
        categoriesCollection.forEach(category => {
            if(category.parent.id == id)
                $("#subcategory2").append("<option value="+category.name+">"+category.displayName+"</option>");
        });
        $("#subcategory2").prop("selectedIndex", -1);
    });

});