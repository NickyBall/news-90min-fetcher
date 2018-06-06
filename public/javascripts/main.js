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
            tableContent += '<td class="center">' + (index+1) + '</td>';
            tableContent += '<td><a href="#">' + this.title + '</a></td>';
            // tableContent += '<td>' + this.desc + '</td>';
            // tableContent += '<td>' + this.author + '</td>';
            tableContent += '<td class="center"><button class="approve_btn btn btn-success" type="button" data-title="'+this.title+'" data-url="'+this.url+'">Approve</button></td>';
            tableContent += '</tr>';
        });
        $('#newstable tbody').html(tableContent);
        $('.approve_btn').on('click', function() {
            var btn = $(this);
            var title = btn.data('title');
            var url = btn.data('url');
            var parent = btn.parent();
            btn.data('loading-text', '<i class="fa fa-spinner fa-spin"></i> Approving');
            btn.button('loading');
            console.log('button click title ' + title);
            $.post('/wp/create',
                {
                    title: title,
                    url: url
                },
                function(result) {
                    btn.button('reset');
                    btn.css('display', 'none');
                    parent.append('Approved');
                    parent.addClass('approve_col');
                }
            )
            //     setTimeout(function() {
            //         btn.button('reset');
            //         btn.css('display', 'none');
            //         parent.append('Approved');
            //         parent.addClass('approve_col');
            // }, 3000);
        });
    });
}