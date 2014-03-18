migrateSettings();
chrome.storage.sync.get("youshouldknowbetter",checkforblocks);

function checkforblocks(response) {
    // we store the different issues in a var to pass to the overlay formatter
    var issues = {};
    var issuefound = false;
    // check for blocked urls
    blockedurls = response['youshouldknowbetter']["urls"];
    for (var i=0; i<blockedurls.length; i++){
        // migration for older data format
        if (blockedurls[i].url){
            var pattern = RegExp(blockedurls[i].url,"i");
        }
        else{
            var pattern = RegExp(blockedurls[i],"i");
        }
        if(pattern.test(window.location.href)){
            /* check if the referrer is from this domain. 
             * if not show the overlay */
            var ref = document.referrer;
            if(!pattern.test(ref)){
                issues["url"] = blockedurls[i];
                issuefound = true;
            }
        }
    }
    // check for author
    blockedauthors = response["youshouldknowbetter"]["authors"];
    page_authors = find_authors();
    tmpauthors = [];
    var authorfound = false;
    for (var i = 0, blocks = blockedauthors.length; i < blocks; i++) {
        for (var j = 0, pauthors = page_authors.length; j < pauthors; j++) {
            if(page_authors[j].search(blockedauthors[i]['name'])>-1){
                author=blockedauthors[i];
                author["foundas"]=page_authors[j];
                tmpauthors.push(author);
                authorfound = true;
                issuefound = true;
            }
        }
    }
    if (authorfound) {
        issues["authors"]=tmpauthors;
    }
    if (issuefound){
        show_overlay(issues);
    }
}

/* 
 * Try to detect the authors name
 * There are a few ways to do this
 *   * <meta name="author">
 *   * finding a html entity with the id "author"
 *   * maybe a few more
 * returns the author names or an empty array if none found
 */
function find_authors(){
    // look for schema.org metainfo
    authors = [];
    iterator = document.evaluate( '//*[@itemprop]', document, null, XPathResult.ANY_TYPE, null );
    node = iterator.iterateNext();
    while(node){
        if(node.getAttribute("itemprop")=="author")
        {
            text = node.innerHTML;
            // strip tags from the string (some outfits put hrefs in there) 
            text = text.replace( /<.*?>/g, '' );
            // strip linebreaks (yeah those happen)
            text = text.replace( /\\n/g,'');
            // strip whitespace from the beginning and end
            text = text.trim();
            authors.push(text);
        }
        node=iterator.iterateNext();
    }
    // look for meta tag <meta name="author" ...>
    metatags = document.getElementsByTagName("meta");
    for(i=0;i<metatags.length;i++){
        if(metatags[i].getAttribute("name")=="author"){
            authors.push(metatags[i].getAttribute("content"));
        }
    }
    return authors;
}

/* 
 * Remove the overlay 
 * */
function destroy_overlay(){
    overlay = document.getElementById("youshouldknowbetteroverlay");
    overlay.parentNode.removeChild(overlay);
}

/*
 * Show the overlay
 * #TODO Needs serious cleanup
 */
function show_overlay(issues) {
    console.log(issues);
    var overlay = document.createElement("div");
    overlay.setAttribute("class","yskboverlay");
    overlay.setAttribute("id","youshouldknowbetteroverlay");
    overlay.innerHTML = '<div class="yskboverlayheader">'+chrome.i18n.getMessage("overlayHeading")+"</div>";
    
    var displayname = false;
    var displaycomment = false;
    // See if its about a blocked url
    if (issues.url){
        displayname=issues.url.url;
        // if the url has a pretty name show that one
        if(issues.url.name){
            displayname=issues.url.name;
        }
    }
    // if the url has an associated comment show that one
    if(displayname && issues.url.comment){
        displaycomment=issues.url.comment;
    } 

    // now check for author issues
    if(displayname && issues.authors){
        displayname += " "+chrome.i18n.getMessage("and")+" ";
        displayname += issues.authors[0].name;
    }

    if(!displayname && issues.authors){
        displayname = issues.authors[0].name + " (found as:"+issues.authors[0].foundas+")";
        if(issues.authors[0].comment){
            displaycomment=issues.authors[0].comment;
        }
    }
    
    overlay.innerHTML += '<div class="yskboverlayquestion">'+chrome.i18n.getMessage("overlayQuestion",displayname)+"</div>";
    if(displaycomment){
        overlay.innerHTML += '<div class="yskboverlaycommentHeader">'+chrome.i18n.getMessage("overlayCommentHeader")+':</div>'+'<div class="yskboverlaycommentText">'+displaycomment+'</div><div class="yskboverlaycommentPostQuestion">'+chrome.i18n.getMessage("overlayCommentPostQuestion")+'</div>';
    }
    overlay.innerHTML += "<button onclick=\"javascript:document.getElementById('youshouldknowbetteroverlay').parentNode.removeChild(document.getElementById('youshouldknowbetteroverlay'));\">"+chrome.i18n.getMessage("overlayConfirmationButton")+"</button>";
    document.body.appendChild(overlay);
}

// hotkey handler
function keypress_handler(e) {
    // keyCode 27 is ESC
    if (e.keyCode == 27){
        destroy_overlay(); 
    }
}
// register the handler 
document.addEventListener('keyup', keypress_handler, false);

