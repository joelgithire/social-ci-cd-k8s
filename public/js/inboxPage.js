$(document).ready(()=>{
    $.get("/api/chat",(data, status,xhr)=>{
        if(xhr.status==400){
            alert("could not get chat list");
        }else{
            outputChatList(data,$(".resultsContainer"));
        }
    })
})

function outputChatList(chatList,container){
    console.log(chatList);
}