 var Rect = { 
        obj: null,        //当前正在画的矩形对象 
        container: null,    //画布 
        init: function(containerId){ 
            Rect.container = document.getElementById(containerId); 
            if(Rect.container){ 
                Rect.container.onmousedown = Rect.start; 
            } 
            else{ 
                alert('该图片不能修改。'); 
            } 
        }, 
        start: function(e){ 
            var o = Rect.obj = document.createElement('div'); 
            o.style.position = "absolute"; 
            o.style.left = o.mouseBeginX = Rect.getEvent(e).x; 
            o.style.top = o.mouseBeginY = Rect.getEvent(e).y; 
            o.style.height = 0; 
            o.style.width = 0; 
            o.style.border = "5px solid #d9534f"; 
            //向o添加一个叉叉，点击叉叉可以删除这个矩形 
            var deleteLink = document.createElement('a'); 
            deleteLink.onclick = function(){ 
                Rect.container.removeChild(this.parentNode); 
                this.parentNode.style.display = "none"; 
                //alert(this.tagName); 
            } 
            deleteLink.innerText = "x"; 
            o.appendChild(deleteLink); 
            //把当前画出的对象加入到画布中 
            Rect.container.appendChild(o); 
            Rect.container.onmousemove = Rect.move; 
            Rect.container.onmouseup = Rect.end; 
        }, 
        move: function(e){ 
            var o = Rect.obj; 
            //dx，dy是鼠标移动的距离 
            var dx = Rect.getEvent(e).x - o.mouseBeginX; 
            var dy = Rect.getEvent(e).y - o.mouseBeginY; 
            //如果dx，dy <0,说明鼠标朝左上角移动，需要做特别的处理 
            if(dx<0){ 
                o.style.left = Rect.getEvent(e).x; 
            } 
            if(dy<0){ 
                o.style.top = Rect.getEvent(e).y; 
            } 
            o.style.height = Math.abs(dy); 
            o.style.width = Math.abs(dx); 
        }, 
        end: function(e){ 
                //onmouseup时释放onmousemove，onmouseup事件句柄 
                Rect.container.onmousemove = null; 
                Rect.container.onmouseup = null; 
                Rect.obj = null; 
            }, 
        //辅助方法，处理IE和FF不同的事件模型 
        getEvent: function(e){ 
            if (typeof e == 'undefined'){ 
                e = window.event; 
            } 
            //alert(e.x?e.x : e.layerX); 
            if(typeof e.x == 'undefined'){ 
                e.x = e.layerX; 
            } 
            if(typeof e.y == 'undefined'){ 
                e.y = e.layerY; 
            } 
            return e; 
        } 
    }; 



function onload(){
    var input = document.getElementById("file_input");
    //获取index.html +54 行  文件内容的dom获取
    var result,rectangle="";
    var dataArr = [];
    //用来存储转base64以后的空数组
    var fd;
    //FormData() 的容器声明
    var oAdd = document.getElementById("add");
    //获取index.html +53 行  上传文件的button按钮获取
    var oSubmit = document.getElementById("send");
    //获取index.html +57 行  提交图片至服务器端的button按钮获取
    var oInput = document.getElementById("file_input");
    //获取index.html +54 行  文件内容的dom获取

    //浏览器兼容判断 FileReader为H5的事件模型
    if(typeof FileReader==='undefined'){
        alert("抱歉，你的浏览器不支持 FileReader");
        input.setAttribute('disabled','disabled');
    }else{
        //onchange 事件：该事件在表单元素的内容改变时触发( <input>, <keygen>, <select>, 和 <textarea>)
        //也就是说选择完图片以后 input dom 改变了  要执行 readFile操作
        input.addEventListener('change',readFile,false);
    }
    function readFile(){
        //FormData主要把表单数据 采取键值对的形式存储
        fd = new FormData();
        var iLen = this.files.length;
        var index = 0;
        for(var i=0;i<iLen;i++){
            //图片格式检测
            if (!input['value'].match(/.jpg|.gif|.png|.jpeg|.bmp/i)){
                return alert("上传的图片格式不正确，请重新选择");
            }
            var reader = new FileReader();
            //存储 i为键   this.files[i]为值的键值对
            fd.append(i,this.files[i]);
            //转base64
            reader.readAsDataURL(this.files[i]);
            reader.fileName = this.files[i].name;
            //读取文件时触发事件
            reader.onload = function(e){
                //建一个 base64 对象的对象 存储
                var imgMsg = {
                    imgname : this.fileName,
                    base64 :  this.result
                }

                dataArr.push(imgMsg);

                //给该图片处理  从此行至132 就是上传图片后 图片底部的那一行灰白色
                result = '<div class="item col-md-12 col-xs-12"><div id="'+this.fileName+'" style="cursor: default;" class="img_show"><img src="'+this.result+'"/></div><div class="img_title">'+this.fileName+'</div><div id="button-group'+index+'" class="btns"></div></div>';

                //result = '<div class="result"><img src="'+this.result+'" alt=""/></div>';
                var div = document.createElement('div');
                div.innerHTML = result;
                div['className'] = 'float';
                div['index'] = index;

                //添加dom树
                document.getElementById('show').appendChild(div);

                var img = div.getElementsByTagName('img')[0];
                img.onload = function(){
                    this.parentNode.style.display = 'block';
                    var oParent = this.parentNode;
                }
                index++;
            }
        }
    }

    //文件图片点击后 触发
    oAdd.onclick=function(){
        oInput.value = "";
        //清空原来input的图片
        $('.float').remove();
        //移除底部那一行的灰白色
        dataArr = [];
        //清空base64数组
        index = 0;
        oInput.click();
    }
    //识别瑕疵 点击后的响应事件
    oSubmit.onclick=function(){
        //base64 数组打印
        console.log(dataArr)
        //判断是否为空图
        if (dataArr.length==0) {
            alert("识别的图片不能为空哦")
        }
        //遍历循环
        for (var i = 0; i <dataArr.length ; i++) {

            var o = document.getElementById(dataArr[i].imgname);
            var h = o.offsetHeight;  //高度
            var w = o.offsetWidth;   //宽度
            var coordinate;
            var xmin,ymin,xmax,ymax,type;
            var top,left,height,width,img_top,img_left;
            //console.log('height:'+h+'   width:'+w);

            //生成时间戳，进行加密
            var timestamp = Date.parse(new Date());
            var sign = timestamp/1000;
            var secretsign = $.md5(sign);
            var characterSet="0123456789QWERTYUIOPASDFGHJKLZXCVBNMqwertyuioplkjhgfdsazxcvbnm";
            secretsign += characterSet.charAt(Math.ceil(Math.random()*10000)%characterSet.length)+characterSet.charAt(Math.ceil(Math.random()*10000)%characterSet.length)+characterSet.charAt(Math.ceil(Math.random()*10000)%characterSet.length);

            //ajax 请求服务器
            $.ajax({
                url: '/recognize',
                type: 'post',
                dataType:"text",
                async:false,
                data: {
                    name:dataArr[i].imgname,
                    secretsign:secretsign,
                    base64:dataArr[i].base64
                },
                success:function(data){
                    //console.log(data);
                    coordinate = JSON.parse(data);
                    if(typeof coordinate != 'object' && !obj ){
                        alert("响应数据不是JSON格式")
                    }
                    //console.log(coordinate);
                    for (var i=0;i<coordinate.result.flaw.length;i++){
                        //console.log(coordinate.result.flaw[i]);
                        for(var key in coordinate.result.flaw[i]){
                            type = key;
                            //console.log(coordinate.result.flaw[i][key]);
                            xmin = coordinate.result.flaw[i][key][0];
                            ymin = coordinate.result.flaw[i][key][1];
                            xmax = coordinate.result.flaw[i][key][2];
                            ymax = coordinate.result.flaw[i][key][3];
                            height = h*(ymax-ymin)/1200;
                            width = w*(xmax-xmin)/2448;
                            top = h*ymin/1200;
                            left = 15+w*xmin/2448;
                            img_top = top+Math.random()*50;
                            img_left = left+width+Math.random()*50;
                        }
                        rectangle += '<div class="rectangle'+i+'" style="width: '+width+'px;height: '+height+'px;top: '+top+'px;left: '+left+'px;"></div><div class="img_tag'+i+'" style="top: '+img_top+'px;left: '+img_left+'px;">'+type+'</div>';
                    }
                },
                error:function(){
                    alert("服务器端响应错误")
                }
            })


            var imgid = dataArr[i].imgname
            var img = '<img src="'+dataArr[i].base64+'"/>';
            result = img+rectangle;
            var idname = "button-group"+i;
            var idname1 = "upload"+i;
            var idname2 = "edit"+i;
            document.getElementById(imgid).innerHTML=result;
            document.getElementById(idname).innerHTML= '<button type="button" class="btn btn-success btn-lg" id="'+idname1+'"><span class="glyphicon glyphicon-cloud-upload"></span> 上传</button><button type="button" class="btn btn-danger btn-lg" id="'+idname2+'"><span class="glyphicon glyphicon-edit"></span> 修正</button>'
            rectangle="";
            result = "";

            $("#edit"+i).click(function () {                
                rectangle += '<div class="img_tag'+i+'" style="top: '+img_top+'px;left: '+img_left+'px;"><input id="type" style="background-color: transparent;height:30px;width: 180px" placeholder="'+type+'"></div>'
                result = img+rectangle;
                console.log(result);
                document.getElementById(imgid).innerHTML=result;
                Rect.init(imgid); 
            })
            $("#upload"+i).click(function () {
                alert("数据上传成功啦！小布会努力提高自己的。")
            })
            rectangle="";
        }   //for
    }
    
    
}