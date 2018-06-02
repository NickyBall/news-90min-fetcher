$(document).ready(function() {
    console.log('ready');
    $.get('/news/fetch', function(data) {
        // For each item in our JSON, add a table row and cells to the content string
        
        // Empty content string
        var tableContent = '';
        $.each(data, function(index) {
            tableContent += '<tr>';
            tableContent += '<td>' + (index+1) + '</td>';
            tableContent += '<td><a href="' + this.link + '">' + this.title + '</a></td>';
            tableContent += '<td>' + this.description + '</td>';
            tableContent += '<td>' + this.author + '</td>';
            tableContent += '<td>' + this.pubDate + '</td>';
            tableContent += '</tr>';
        });
        $('#newstable tbody').html(tableContent);
    })
})