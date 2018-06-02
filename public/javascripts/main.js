$(document).ready(function() {
    console.log('ready');
    // $.get('/news/fetch', function(data) {
    //     // For each item in our JSON, add a table row and cells to the content string
        
    //     // Empty content string
    //     var tableContent = '';
    //     $.each(data, function(index) {
    //         tableContent += '<tr>';
    //         tableContent += '<td>' + (index+1) + '</td>';
    //         tableContent += '<td><a href="' + this.link + '">' + this.title + '</a></td>';
    //         tableContent += '<td>' + this.description + '</td>';
    //         tableContent += '<td>' + this.author + '</td>';
    //         tableContent += '<td>' + this.pubDate + '</td>';
    //         tableContent += '</tr>';
    //     });
    //     $('#newstable tbody').html(tableContent);
    // });
    fetch_top_news(1);
    $('#search-form').on('submit', function(e) {
        e.preventDefault();
        fetch_top_news($('#page-input').val());
    });
    
});

function fetch_top_news(page) {
    $.get('/news/top?page='+page, function(data) {
        // For each item in our JSON, add a table row and cells to the content string
        
        // Empty content string
        var tableContent = '';
        $.each(data, function(index) {
            tableContent += '<tr>';
            tableContent += '<td>' + (index+1) + '</td>';
            tableContent += '<td><a href="#">' + this.title + '</a></td>';
            tableContent += '<td>' + this.desc + '</td>';
            tableContent += '<td>' + this.author + '</td>';
            tableContent += '<td><button type="button" class="btn btn-success">Approve</button></td>';
            tableContent += '</tr>';
        });
        $('#newstable tbody').html(tableContent);
    });
}