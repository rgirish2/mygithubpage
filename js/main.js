$(document).ready(function() {
    function removeGif() {
        $("#loadingGif").hide();
    };
        
    function showGif() {
        $("#loadingGif").show();
    };

    $("#loadingGif").click(function() {
        $("#loadingGif").slideUp(300).delay(500).fadeOut(300);
        removeGif();
        $("#loadingGif").slideDown(300).delay(500).fadeIn(300); 
        showGif();
    });
});
