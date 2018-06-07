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

function check_news(url) {
    $.get('/news/check?url='+url, function (result) {
        return result;
    });
}

function fetch_top_news(page) {
    $.get('/news/top?page='+page, function(data) {
        // For each item in our JSON, add a table row and cells to the content string
        waitingDialog.show('Fetching News...');
        // Empty content string
        var events = [];
        var dataList = [];
        $.each(data, function(index) {
            var title = this.title;
            var url = this.url;
            var desc = this.desc;
            var img = this.thumbnail;
            var index = index+1;
            events.push(
                $.get('/news/check?url='+url, function (result) {
                    var publish_status = result.status == 200 ? 'publish' : 'no'
                    var publish_content = '<td class="center"><p>';
                    publish_content += '<button class="read_btn btn btn-primary" data-toggle="modal" data-target="#myModal" data-status="'+publish_status+'" data-title="'+title+'" data-url="'+url+'" data-img="'+img+'" data-desc="'+desc+'">Read</button>'
                    publish_content += result.status == 200 ?
                    '' :
                    '<button class="approve_btn btn btn-success" type="button" data-title="'+title+'" data-url="'+url+'">Approve</button>'
                    publish_content += '</p></td>';
                    var tableContent = '';
    
                    tableContent += '<tr>';
                    tableContent += '<td class="center">' + index + '</td>';
                    tableContent += '<td>' + title + '</td>';
                    // tableContent += '<td>' + this.desc + '</td>';
                    // tableContent += '<td>' + this.author + '</td>';
                    tableContent += publish_content;
                    tableContent += '</tr>';
                    
                    dataList.push({
                        index: index,
                        data: tableContent
                    });
                })
            );
        });
        $.when.apply($, events).then(function() {
            dataList = dataList.sort(function (a, b) {
                return a.index - b.index;
            });
            $('#newstable tbody').html('');
            $.each(dataList, function() {
                $('#newstable tbody').append(this.data);
            });
            waitingDialog.hide();
            $('.approve_btn').on('click', function() {
                var btn = $(this);
                var title = btn.data('title');
                var url = btn.data('url');
                btn.data('loading-text', '<i class="fa fa-spinner fa-spin"></i> Approving');
                btn.button('loading');
                console.log('button click title ' + title);
    
                $.post('/news/create', 
                    {
                        url: url
                    },
                    function (result) {
                        if (result.status == 200) {
                            $.post('/wp/create',
                                {
                                    title: title,
                                    url: url
                                },
                                function(response) {
                                    btn.button('reset');
                                    btn.css('display', 'none');
                                }
                            );
                        } else {
                            btn.button('reset');
                        }
                    }
                );
            });
            $('.read_btn').on('click', function() {
                var title = $(this).data('title');
                var url = $(this).data('url');
                var img = $(this).data('img');
                var desc = $(this).data('desc');
                var status = $(this).data('status');

                var content = `
                    <div class="center">
                        <img src="${img}" />
                    </div>
                    <p>${desc}</p>
                `;

                $('#myModal .modal-title').html(title);
                $('#myModal .modal-body').html(content);
                $('#myModal .modal-footer').html('<button type="button" data-dismiss="modal" class="btn btn-default">Close</button>');
                if (status !== 'publish') {
                    $('#myModal .modal-footer').append('<button type="button" class="btn btn-success modal-approve">Approve</button>');
                    $('#myModal .modal-footer .modal-approve').on('click', function() {
                        var btn = $(this);
                        btn.data('loading-text', '<i class="fa fa-spinner fa-spin"></i> Approving');
                        btn.button('loading');
                        console.log('button click title ' + title);
            
                        $.post('/news/create', 
                            {
                                url: url
                            },
                            function (result) {
                                if (result.status == 200) {
                                    $.post('/wp/create',
                                        {
                                            title: title,
                                            url: url
                                        },
                                        function(response) {
                                            btn.button('reset');
                                            btn.css('display', 'none');
                                            $('.approve_btn[data-url="'+url+'"]').css('display', 'none');
                                            $('.read_btn[data-url="'+url+'"]').data('status', 'publish');
                                        }
                                    );
                                } else {
                                    btn.button('reset');
                                }
                            }
                        );
                    });
                }
            })
        });
    });
}