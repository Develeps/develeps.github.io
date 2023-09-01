document.addEventListener("DOMContentLoaded", function(){
    document.getElementById('projects').innerHTML = projects();
});

data = [
    {
        "img" : "https://funart.pro/uploads/posts/2022-08/1660302516_2-funart-pro-p-programmist-arti-krasivo-2.jpg",
        "name" : "project 1",
        "decription" : "asdasdasdasdasdasdasd",
        "url" : "#"
    }
    ,
    {
        "img" : "https://funart.pro/uploads/posts/2022-08/1660302605_26-funart-pro-p-programmist-arti-krasivo-28.jpg",
        "name" : "project 12",
        "decription" : "asdasdasdasdasdasdasd",
        "url" : "#"
    }
    
]


function projects(){
    var res = "";

    for(var i in data){
        res += `
            <div class="project-card">
                <div style="background-image: url('${data[i]["img"]}')" class="project-card-header">
                    <h3>${data[i]["name"]} </h3>
                </div>
                <div class="project-card-body">
                    <p>
                        ${data[i]["decription"]}
                    </p>
                </div>
                <div class="project-card-footer">
                    <a class="btn-more" href="${data[i]["url"]} ">Подробнее</a>
                </div>
            </div>              
        `; 
    }


    return res;
}