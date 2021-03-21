$("#postTextArea").keyup(event => {
    var textbox = $(event.target);
    var value = textbox.val().trim();
    
    var submitButton = $("#submitPostButton");

    if(submitButton.length == 0){
        return alert("no submit button");
    } 

    if(value==""){
        submitButton.prop("disabled",true);
        return;

    }
    submitButton.prop("disabled",false);

})

$("#submitPostButton").click(()=>{
    var button = $(event.target);
    var textBox = $("#postTextArea");

    var data={
        content:textBox.val()

    }
    $.post("/api/posts",data,(postData)=>{

        var html = createPostHTML(postData);
        $(".postContainer").prepend(html)
        textBox.val("")
        button.prop("disabled",true)
    })
})

function createPostHTML(postData){
    return `<div class='post'>
                <div class='mainContainer'>
                <div class='userImageContainer'>
                    <img src=''>
                </div>
                </div>
            </div>`
}

