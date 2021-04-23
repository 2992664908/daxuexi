function submitall() {
    try {
        var pic = document.getElementById('picture');
        imgsrc = pic.src;
    } catch (err) {
        alert("请选择截图！" + err)
        return;
    }
    var pic = document.getElementById('picture');
    canvas = ImageToCanvas(pic);
    canvasToImage(canvas);
    alert("提交！");
}

function getName() {
    key = document.getElementById("username").value;
    username = info[key];
    nameinfo = document.getElementById("name");
    nameinfo.innerText = '姓名:' + username;

}

function select() {
    var uploadFile = document.getElementById("upload_file_id");
    if (uploadFile.value == "") {
        uploadTip.innerText = "请选择一个文件";
    }
}

function canvasToImage(canvas) {
    image = document.getElementById("picture");
    image.src = canvas.toDataURL("image/png");
    //在此处也可以使用js的appendChild()方法将此img加入html页面

    //return image;
}

function ImageToCanvas(image) {
    var canvas = document.getElementById("mycanvas");
    canvas.width = image.width;
    canvas.height = image.height;
    // canvas.getContext("2d").drawImage(image, 0, 0); //0, 0参数画布上的坐标点，图片将会拷贝到这个地方
    ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    // 再将图片填充到画布
    let pattern = ctx.createPattern(image, 'no-repeat')
    ctx.fillStyle = pattern;

    ctx.moveTo(0, 0);  
    ctx.fillStyle = "black";         //设置填充颜色为紫色
      
    ctx.font = '40px "微软雅黑"';       //设置字体
      
    ctx.textBaseline = "bottom";       //设置字体底线对齐绘制基线
      
    ctx.textAlign = "left";          //设置字体对齐的方式
    if (username == null) {
        alert('学号未填写或者不正确');
        return;
    }
    ctx.fillText(username, 50, 100);
    return canvas;
}

function handleFiles(files) {
    var preview = document.getElementById('preview');
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var imageType = /^image\//;

        if (!imageType.test(file.type)) {
            continue;
        }

        var img = document.createElement("img");
        img.classList.add("obj");
        img.id = ('picture')
        img.file = file;
        // 假设 "preview" 是将要展示图片的 div
        preview.appendChild(img);
        var reader = new FileReader();
        reader.onload = (function(aImg) {
            return function(e) {
                aImg.src = e.target.result;
            };
        })(img);
        reader.readAsDataURL(file);

    }

    function ImageToCanvas(image) {
        var canvas = document.getElementById("mycanvas");
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext("2d").drawImage(image, 0, 0); //0, 0参数画布上的坐标点，图片将会拷贝到这个地方
        return canvas;
    }
}
var info = {
    "11": "李华"
};
var username = null;