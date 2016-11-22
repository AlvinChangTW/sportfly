App.questions = App.cable.subscriptions.create({ channel: "QuestionsChannel"}, {
    connected: function() {
        console.log("連上囉!")
    },
    disconnected: function() {
        console.log("斷線了!")
    },
    received: function(data) {
        console.log("收到資料: ");
        console.log("------");
        console.log(data);
        console.log("------");
        $.getScript("/ccc/js/progress-ring.js", function() {
            if (data["type"] === "submit_comment") {
                var userImg = data["user"]["fb_image"];
                var userId = data["user"]["id"];
                var userCount = data["question"]["users_count"];
                // var like_count = data["question"]["likes_count"]
                var questionId = data["question"]["id"];


                var content = data["question"]["subject"];
                // var askingId = data["asking"]["id"];
                // var c = data["question"]["id"];
                var userName = data["user"]["fb_name"]
                var container = $("#table");
                var elm = "<tr data-questionid='" + questionId + "'>";
                //elm += "<td id='count_question_" + questionId + "'>"+userCount+"</td>";
                elm += "<td id='count_question_" + questionId + "' class='user_count_td'><div class='progress-ring' data-percent='" + userCount + "'></div></td>";
                console.log(elm);
                elm += "<td class='live_talk_r'>";
                elm += "<img class='imggg2' src='" + userImg + "'>";
                elm += "<span>" + userName + ":" +"</span><br>";
                elm += "<p>"+ content + "</p>";
                elm += "</td>";
                elm += "<td class='like_btn_box'";
                elm += " data-questionid='" + questionId + "'";
                elm += " data-userid='" + userId + "'";
                elm += " id='td_like_" + questionId + "'";
                elm += " ><p id='like_" + questionId + "' class='glyphicon glyphicon-plus'></p></td>";
                //elm += "<script src='/ccc/js/progress-ring.js'></script>";
                elm += "<script> $('.progress-ring').loadingRing(); </script>";
                elm += "</tr>";

                $("#live_talk_table").append(elm);

                // $("#like_" + questionId).click(function(e) {
                //     e.preventDefault();
                //     var questionIds = questionId;
                //     var userId = userId;
                //     var live_showId = live_show_id;
                //     var userCounts = userCount;
                //     setLike(questionIds, userId, live_showId, userCounts);

                // });
                //submit comment action
            } else if (data["type"] === "add_like") {
                var questionId = data["question"]["id"] //1770
                var count = data["question"]["users_count"];
                updateLikeCount(questionId, count);
                sorting('des');
                // $("#count_question_" + jqueryDomId).html("<div class='progress-ring' data-percent='" + count + "'></div><script> $('.progress-ring').loadingRing(); </script>");
            }

            // $("#unlike_" + questionId).click(function(e) {
            //     e.preventDefault();
            //     var questionIds = questionId;
            //     var userId = userId;
            //     var live_showId = live_show_id;
            //     var askingIds = askingId;
            //     console.log('askingIds=',askingIds);
            //     //var like_counts = like_count;
            //     setunLike(questionIds, userId, live_showId, askingIds);
            // });
        });

    }

});

function setLike(questionId, userId) {
    console.log('i_set_like', questionId, userId)
    $.ajax({
        // /live_shows/:live_show_id/questions/:question_id/askings
        url: "/live_shows/" + window.live_show_id + "/questions/" + questionId + "/askings",
        data: { user: { id: userId } },
        method: "post",
        dataType: "JSON",
        success: function(data) {
            $("#td_like_" + questionId).html("");
            console.log('set_Like success!!', data);
            console.log('set_Like success!!', questionId);
            var count = data["question"]["users_count"]
            updateLikeCount(questionId, count);
            sorting('des');
        },
        error: function(message) {
            console.log('set_Like error!!', message);
        }
    })
}

function updateLikeCount(questionId, count){
    $("#count_question_" + questionId).html("<div class='progress-ring' data-percent='" + count + "'></div><script> $('.progress-ring').loadingRing(); </script>");
}

function sorting(orderIndex){
    orderIndex = orderIndex || "asc"; // ascend, descend
    console.log('sort', orderIndex);
    var viewList = [];
    $("table#live_talk_table tr").each(function(i,e){
        var p = $(this).find(".user_count_td .progress-ring").data("percent");
        viewList.push({
            count: $(this).find(".user_count_td .progress-ring").data("percent"),
            id: $(e).data('questionid'),
            view: $(e)
        });
    });
    if(orderIndex == "asc"){
        viewList.sort(function(a, b){ return a.count - b.count;});
    }else if(orderIndex=="des"){
        viewList.sort(function(a, b){ return b.count - a.count;});
    }
    viewList.forEach(function(e){
        $("table#live_talk_table").append(e.view);
    });
}