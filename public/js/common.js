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
    $.post("/api/posts",data,(postData,status,xhr)=>{
        alert(postData);
    })
})

