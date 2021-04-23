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
    put();
}

function getcos() {
    var cos = new COS({
        SecretId: config.SecretId,
        SecretKey: config.SecretKey,
    });
    return cos;
}

function put() {
    var cos = getcos();
    var canvas = document.getElementById("mycanvas");
    var dataurl = canvas.toDataURL('image/png');
    var blob = dataURLtoBlob(dataurl);

    var key = document.getElementById("username").value;
    cos.putObject({
        Bucket: config.bucket,
        /* 必须 */
        Region: config.region,
        /* 存储桶所在地域，必须字段 */
        Key: key + ".jpg",
        /* 必须 */
        StorageClass: 'STANDARD',
        Body: blob, // 上传文件对象
        onProgress: function(progressData) {
            console.log(JSON.stringify(progressData));
        }
    }, function(err, data) {
        console.log(err || data);
        // alert(typeof(err));
        if (err != null && data == null) {
            alert("服务器挂了，提交失败！！！");
        } else if (err == null && data != null) {
            alert("提交成功！");
        }
        // location.reload();
    });
    // alert("提交成功!")

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

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

function getSubInfo() {
    var cos = getcos();
    var dataContent = {};
    nameText = "";
    cos.getBucket({
        Bucket: config.bucket,
        /* 必须 */
        Region: config.region,
        /* 存储桶所在地域，必须字段 */
        // Prefix: '/',
        /* 非必须 */
    }, function(err, data) {
        console.log(err || data.Contents);
        dataContent = data.Contents;

        for (j = 0; j < dataContent.length; j++) {
            console.log(dataContent[j]);
            var id1 = dataContent[j].Key.slice(0, 2);
            sub_userid.push(id1);
            // if (all_id.includes(id1)) {
            //     sub_userid.push(id1);
            // } else {
            //     not_sub_suerid.push(id1);
            // }
        }
        for (j = 0; j < all_id.length; j++) {
            if (sub_userid.includes(all_id[j])) {
                continue;
            }
            not_sub_suerid.push(sub_userid[j]);
        }
        for (j = 0; j < not_sub_suerid.length; j++) {
            nameText = nameText + info[not_sub_suerid[j]] + "，";
        }
        var modal_body = document.getElementById("modal-body-text");
        modal_body.innerHTML = not_sub_suerid.length + "人未上交截图" + "<br>" + nameText;
    });





}
var info = { '34': '付天怡', '39': '汪家伟', '38': '李健', '52': '王梦凡', '37': '何佳荣', '40': '万达', '36': '张得申', '35': '孙博', '44': '吉鹏', '42': '陈冠齐', '43': '覃博文', '51': '向关海', '32': '徐钰馨', '30': '张雨', '53': '王尚杰', '41': '杨龙胥', '54': '纪允涵', '45': '柴国毅', '46': '曲迪一', '49': '齐奥成', '47': '周亢伉', '31': '吴文敏', '55': '应松延', '50': '杨佳峰', '33': '刘露瑶', '56': '姚文哲', '29': '贾茸嵘', '48': '韦俊全' };
var username = null;
var all_id = []
var sub_userid = [];
var not_sub_suerid = [];
var config = {
    "region": "ap-nanjing",
    "bucket": "daxuexi-1302938886",
    "SecretId": 'AKID0mLehWGWd0B7mC5UGlRvA8LNCl9L37rI',
    "SecretKey": 'QdMqc9yTyFI9nCON9sOo14uPzOYVDdmj'
}
for (let key in info) {
    all_id.push(key)
}