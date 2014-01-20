chrome.storage.sync.get("youshouldknowbetter",checkforblocks);

function checkforblocks(response) {
    blockedurls = response['youshouldknowbetter'];
    for (var i=0; i<blockedurls.length; i++){
        var pattern = RegExp(blockedurls[i],"i");
        if(pattern.test(window.location.href)){
        /*    chrome.extension.sendRequest({}, function(response) {}); */
            show_overlay(blockedurls[i]);
        }
    }
}

function destroy_overlay(){
    overlay = document.getElementById("youshouldknowbetteroverlay");
    overlay.parentNode.removeChild(overlay);
}

function show_overlay(url) {
   var overlay = document.createElement("div");
   overlay.setAttribute("class","overlay");
   overlay.setAttribute("id","youshouldknowbetteroverlay");
   overlay.innerHTML = "Do you really want to read content from<br>"+url+"?<br>";
   overlay.innerHTML += "<b><a href=\"javascript:document.getElementById('youshouldknowbetteroverlay').parentNode.removeChild(document.getElementById('youshouldknowbetteroverlay'));\">Yes</a></b>";
   document.body.appendChild(overlay);
}
