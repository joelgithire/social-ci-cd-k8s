$(document).ready(()=>{
    $.get("/api/posts", {followingOnly:true },result=>{
        outputPosts(result,$(".postContainer"));
        
    })
})

