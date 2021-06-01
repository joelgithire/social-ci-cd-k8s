$(document).ready(()=>{
    if (selectedTab === "replies"){
        loadReplies()

    }else{
        loadPosts();
    }
    
})

function loadPosts(){
    $.get("/api/posts",{ postedBy: profileUserId, isReply:false },result=>{
        outputPosts(result,$(".postContainer"));
        
    })

}

function loadReplies(){
    $.get("/api/posts",{ postedBy: profileUserId, isReply:true },result=>{
        outputPosts(result,$(".postContainer"));
        
    })

}