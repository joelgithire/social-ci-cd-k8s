$(document).ready(()=>{
    $.get("/api/posts",result=>{
        outputPosts(result,$(".postContainer"));
        
    })
})

