$("#postTextArea, #replyTextArea").keyup(event => {
    var textbox = $(event.target);
    var value = textbox.val().trim();

    var isModal = textbox.parents(".modal").length ==1;
    
    var submitButton =isModal? $("#submitReplyButton"): $("#submitPostButton");

    if(submitButton.length == 0){
        return alert("no submit button");
    } 

    if(value==""){
        submitButton.prop("disabled",true);
        return;

    }
    submitButton.prop("disabled",false);

})

$("#submitPostButton,#submitReplyButton").click(()=>{
    var button = $(event.target);

    var isModal = button.parents(".modal").length ==1;

    var textBox = isModal? $("#replyTextArea"): $("#postTextArea");

    var data={
        content:textBox.val()

    }

    if(isModal){
        var id = button.data().id;
        if(id == null)return alert("button is null");
        data.replyTo = id;
    }


    $.post("/api/posts",data,(postData)=>{

        if(postData.replyTo){
            location.reload()
        }else{

            var html = createPostHTML(postData);
            $(".postContainer").prepend(html)
            textBox.val("")
            button.prop("disabled",true)
        }

       
    })
})

$(document).on("click",".likeButton",(event)=>{
    var button = $(event.target);
   var postID= getPostIDFromElement(button);
   
   if(postID === undefined) return;

   $.ajax({
       url:`/api/posts/${postID}/like`,
       type:"PUT",
       success:(postData)=>{

            button.find("span").text(postData.likes.length || "");

            if(postData.likes.includes(userLogedIn._id)){
                button.addClass("active");
            }
            else{
                button.removeClass("active");
            }
       }
   })
   
})


$(document).on("click",".shareButton",(event)=>{
    var button = $(event.target);
   var postID= getPostIDFromElement(button);
   
   if(postID === undefined) return;

   $.ajax({
       url:`/api/posts/${postID}/share`,
       type:"POST",
       success:(postData)=>{
            button.find("span").text(postData.shareUsers.length || "");

            if(postData.shareUsers.includes(userLogedIn._id)){
                button.addClass("active");
            }
            else{
                button.removeClass("active");
            }

       }
   })
   
})

$(document).on("click",".post",(event)=>{
    var element = $(event.target);
    var postId= getPostIDFromElement(element);

    if(postId !== undefined && !element.is("button")){
        window.location.href ='/posts/'+postId;
    }


})

$("#replyModal").on("show.bs.modal",(event)=>{
    var button = $(event.relatedTarget);
    var postId= getPostIDFromElement(button);
    
    $("#submitReplyButton").data("id",postId)


    $.get("/api/posts/ " + postId, results=>{
        outputPosts(results.postData,$("#originalPostContainer"));
        
    })

})


$("#replyModal").on("hidden.bs.modal",(event)=>{
    $("#originalPostContainer").html()

})

$("#deletePostModal").on("show.bs.modal",(event)=>{
    var button = $(event.relatedTarget);
    var postId= getPostIDFromElement(button);
    $("#deletePost").data("id",postId);    

})

$(document).on("click",".followButton",(event)=>{
    var button = $(event.target);
    var userId = button.data().user;
    
    $.ajax({
        url:`/api/users/${userId}/follow`,
        type:"PUT",
        success:(data,status,xhr)=>{
             if(xhr.status == 404){
                 return;
             }

             var difference= 1;

             if(data.following && data.following.includes(userId)){
                button.addClass("following");
                button.text("Following");
            }
            else{
                button.removeClass("following");
                button.text("Follow");
                difference = -1;
            }
            
            var followersLable = $("#followersValue");

            if (followersLable.length != 0){
                var followersText = followersLable.text();
                followersText = parseInt(followersText)
                followersLable.text(followersText+difference);

            }
 
        }
    })
});

$("#deletePost").click(()=>{
     var postID =$(event.target).data("id");

     $.ajax({
        url:`/api/posts/${postID}`,
        type:"DELETE",
        success:()=>{
            location.reload();
        }
    })
     
})

function getPostIDFromElement(element){
    var isRoot= element.hasClass("post");
    var rootElement = isRoot ? element:element.closest(".post");
    var postId = rootElement.data().id

    if(postId===undefined) return alert("post id undefined");

    return postId;
}


function createPostHTML(postData, largeFont=false){

    if(postData==null){
        alert("post object is null");
    }

    var isShare = postData.shareData != undefined;

    var sharedBy = isShare?postData.postedBy.username:null;

    postData = isShare?postData.shareData:postData;

   
    
    var postedBy = postData.postedBy;

    if(postedBy._id===undefined){
       return console.log("no user populated");
    }

    var displayName = postedBy.firstName+" "+postedBy.lastName;
    var timeStamp = timeDifference(new Date(),new Date(postData.createdAt))

    var likeButtonActiveClass = postData.likes.includes(userLogedIn._id) ? "active":"";
    var shareButtonActiveClass = postData.shareUsers.includes(userLogedIn._id) ? "active":"";
    var mainPostLargeFont = largeFont ? "largeFont" :""

    var shareText = "";

    if(isShare){
        shareText = `<span> <a href='/profile/${sharedBy}'>@${sharedBy} shared this post</a></span>`
    }

    var replyFlag = "";

    if(postData.replyTo && postData.replyTo._id){

        if(!postData.replyTo._id){
            return alert("reply to is not populated");
        }

        var replyToUsername = postData.replyTo.postedBy.username;
        replyFlag = `<div class ='replyFlag'>
                        Replied to <a href='/profile/${replyToUsername}'>@${replyToUsername}</a>
                    </div>`
    }

    var buttons = "";
    if(postData.postedBy._id==userLogedIn._id){
        buttons = `<button data-id="${postData._id}" data-toggle="modal" data-target="#deletePostModal"><i class='fas fa-times'></i></button>`
    }

    return `<div class='post ${mainPostLargeFont}' data-id='${postData._id}'>
            <div class="shareContainer">
                ${shareText}
            </div>

                <div class='mainContentContainer'>
                <div class='userImageContainer'>
                    <img src='${postedBy.profilePic}'>
                </div>
                <div class='postContentContainer'>
                    <div class='header'>
                        <a class='displayName' href='/profile/${postedBy.username}'>${displayName}</a>
                        <span class='username'>@${postedBy.username}</span>
                        ${replyFlag}
                        <span class='date'>${timeStamp}</span>
                        ${buttons}
                        
                       
                    </div>
                    
                    <div class='postedBody'>
                        <span>${postData.content}</span>
                    </div>
                    <div class='postedFooter'>
                        <div class="postButtonContainer">
                            <button data-toggle='modal' data-target='#replyModal'>
                                <i class="far fa-comment-dots"> reply</i>
                            </button>
                        </div>
                        <div class="postButtonContainer green">
                            <button class="shareButton ${shareButtonActiveClass}">
                                <i class="fas fa-share"> share</i></i>
                                <span>${postData.shareUsers.length || ""}</span>
                            </button>
                        </div>
                        <div class="postButtonContainer orange">
                            <button class='likeButton ${likeButtonActiveClass}'>
                                <i class="fab fa-hotjar"> like</i><span>${postData.likes.length || ""}</span>
                            </button>
                        </div>
                        
                    </div>
               </div>
                </div>
            </div>`
}


function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}


function outputPosts(results,container){
    container.html("")

    if(!Array.isArray(results)){
        results = [results]
    }

    results.forEach(result=>{
        var html = createPostHTML(result)
        container.append(html)
    })

    if(results.length==0){
        container.append("<span class='no results'>Nothing to show</span>")
    }
}


function outputPostsWithReplies(results,container){
    container.html("")

    if(results.replyTo !== undefined && results.replyTo._id !==undefined){
        var html = createPostHTML(results.replyTo)
        container.append(html)
    }

    var mainPosthtml = createPostHTML(results.postData,true)
        container.append(mainPosthtml)

    results.replies.forEach(result=>{
        var html = createPostHTML(result)
        container.append(html)
    })

    
}