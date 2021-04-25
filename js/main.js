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

function zip() {
    let arr = [];
    for (let i = 0; i < sub_userid.length; i++) {
        arr.push("https://daxuexi-1302938886.cos.ap-nanjing.myqcloud.com/" + sub_userid[i] + ".jpg ")
    }
    var zip = new JSZip();
    // 创建images文件夹
    var imgFolder = zip.folder("images");

    // let arr = ["http://p154oss.oss-cn-szfinance.aliyuncs.com/SCAN/CARCLAIM/INSURANCE/C015105282018805619/0d49d586ad8544efa16ea119d2665b86.jpg?OSSAccessKeyId=LTAIjkNGjBjw2aKn&Expires=1537019034&Signature=WxermpQon3%2F4iliho321e%2F7uuG4%3D",
    //     "http://p154oss.oss-cn-szfinance.aliyuncs.com/SCAN/CARCLAIM/INSURANCE/C015105282018805619/694cd778800446809f55204ae7320475.jpg?OSSAccessKeyId=LTAIjkNGjBjw2aKn&Expires=1537019034&Signature=K7%2BkVa3LEvsQAQtLLDL7QG0yemE%3D",
    //     "http://pic.58pic.com/58pic/15/63/07/42Q58PIC42U_1024.jpg",
    //     "http://pic.58pic.com/58pic/14/14/07/97b58PICEn4_1024.jpg"
    // ];
    let flag = 0 //  判断加载了几张图片的标识
    for (let i = 0; i < arr.length; i++) {
        getBase64(arr[i]).then(function(base64) {
            base64 = base64.split('base64,')[1]
            imgFolder.file(i + '.png', base64, { base64: true })
            if (flag === arr.length - 1) {
                zip.generateAsync({ type: "blob" }).then((blob) => {
                    saveAs(blob, "src.zip")
                })
            }
            flag++
        }, function(err) {
            console.log(err); //打印异常信息
        });
    }

    function getBase64(img) {
        function getBase64Image(img, width, height) { //width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
            var canvas = document.createElement("canvas");
            canvas.width = width ? width : img.width;
            canvas.height = height ? height : img.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            var dataURL = canvas.toDataURL();
            return dataURL;
        }
        var image = new Image();
        image.crossOrigin = '*';
        image.src = img;
        var deferred = $.Deferred();
        if (img) {
            image.onload = function() {
                deferred.resolve(getBase64Image(image)); //将base64传给done上传处理
            }
            return deferred.promise(); //问题要让onload完成后再return sessionStorage['imgTest']
        }
    }

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
    ctx.fillStyle = "white";         //设置填充颜色为紫色
      
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
    sub_userid = [];
    not_sub_suerid = [];
    var dataContent = {};
    nameText = "";
    var cos = getcos();
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
            not_sub_suerid.push(all_id[j]);
        }
        for (j = 0; j < not_sub_suerid.length; j++) {
            nameText = nameText + info[not_sub_suerid[j]] + "，";
        }
        var modal_body = document.getElementById("modal-body-text");
        modal_body.innerHTML = not_sub_suerid.length + "人未上交截图" + "<br>" + nameText;
    });





}
var info = {'01': '王佳宁', '02': '于倩', '03': '胡冉', '04': '李青', '05': '闫芝', '06': '李昀蔚', '07': '夏方城', '08': '连钰', '09': '吴萌芸', '10': '孟泓志', '11': '傅豪', '12': '谢良友', '13': '徐昂', '14': '傅麒宇', '15': '瞿凌宇', '16': '陈磊', '17': '王柯洋', '18': '凌震', '19': '李盼辉', '20': '任丙政', '21': '王靖涵', '22': '杨钊', '23': '张旭杰', '24': '屈文轩', '25': '殷卢杰', '26': '邹杰', '27': '李杰', '28': '王阳'}
var username = null;
var all_id = []
var sub_userid = [];
var not_sub_suerid = [];
var config = {
    "region": "ap-nanjing",
    "bucket": "daxuexi-1305730527",
    "SecretId": 'AKIDvcdPvE5izgDZhZIXbR1Sqysa1IMB6ZCx',
    "SecretKey": 'h8IG66WjhS8YmfLlwylSt9F9JKPzSlrh'
}
for (let key in info) {
    all_id.push(key)
}
