migrateSettings();
chrome.storage.sync.get("youshouldknowbetter",checkforblocks);

function checkforblocks(response) {
    // we store the different issues in a var to pass to the overlay formatter
    var issues = {};
    var issuefound = false;
    // check for blocked urls
    blockedurls = response.youshouldknowbetter.urls;
    for (var i=0; i<blockedurls.length; i++){
        // migration for older data format
        var pattern;
        if (blockedurls[i].url){
            pattern = RegExp(blockedurls[i].url,"i");
        }
        else{
            pattern = RegExp(blockedurls[i],"i");
        }
        if(pattern.test(window.location.href)){
            /* check if the referrer is from this domain. 
             * if not show the overlay */
            var ref = document.referrer;
            if(!pattern.test(ref)){
                issues.url = blockedurls[i];
                issuefound = true;
            }
        }
    }
    // check for author
    blockedauthors = response.youshouldknowbetter.authors;
    page_authors = find_authors();
    tmpauthors = [];
    var authorfound = false;
    for (var i = 0, blocks = blockedauthors.length; i < blocks; i++) {
        for (var j = 0, pauthors = page_authors.length; j < pauthors; j++) {
            if(page_authors[j].search(blockedauthors[i].name)>-1){
                author=blockedauthors[i];
                author.foundas=page_authors[j];
                tmpauthors.push(author);
                authorfound = true;
                issuefound = true;
            }
        }
    }
    if (authorfound) {
        issues.authors=tmpauthors;
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
    // use jquery. Which seems to be the end all solution to every javascript issue
    textnodes = $("[itemprop|='author']");
    for (var i = 0, nodes = textnodes.length; i < nodes; i++) {
        text = $(textnodes[i]).text().replace(/\\n/g,"").trim();
        if(text.length<40){
            authors.push(text);
        }
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
    
    var overlay = document.createElement("div");
    overlay.setAttribute("class","yskboverlay");
    overlay.setAttribute("id","youshouldknowbetteroverlay");
    overlay.innerHTML = '<div class="yskboverlayheader">'+chrome.i18n.getMessage("overlayHeading")+"</div>";
    overlay.innerHTML += '<div class="yskboverlayquestion">'+chrome.i18n.getMessage("overlayQuestion")+"</div>";

    var displayurlname = false;
    var displayurlcomment = false;
    // See if its about a blocked url
    if (issues.url){
        displayurlname=issues.url.url;
        // if the url has a pretty name show that one
        if(issues.url.name){
            displayurlname=issues.url.name;
        }
    }
    // if the url has an associated comment show that one
    if(displayurlname && issues.url.comment){
        displayurlcomment=issues.url.comment;
    }

    var displayauthor = '';
    var displayauthorcomment = '';
    var noofcomments = 0;

    // now check for author issues
    if(issues.authors){
        for (var i = 0, numauthors = issues.authors.length; i < numauthors; i++) {
            // for more than one author connect each with "and"
            if(i>0){
                displayauthor += " "+chrome.i18n.getMessage("and")+" ";
            }
            displayauthor += issues.authors[i].name + " ("+chrome.i18n.getMessage("foundas")+" \""+issues.authors[i].foundas+"\")";
            if(issues.authors[i].comment){
                if(noofcomments>0){
                    displayauthorcomment += " "+chrome.i18n.getMessage("and")+" ";
                }
                displayauthorcomment += issues.authors[i].comment;
                noofcomments++;
            }
        }
    }
    // if url issue
    if(issues.url){
        overlay.innerHTML += getIssueBox(
                chrome.i18n.getMessage("overlayIssueURLQuestion",displayurlname),
                chrome.i18n.getMessage("overlayIssueURLCommentHeading"),
                displayurlcomment
                    );
    }

    if(issues.authors){
        overlay.innerHTML += getIssueBox(
                chrome.i18n.getMessage("overlayIssueAuthorQuestion",displayauthor),
                chrome.i18n.getMessage("overlayIssueAuthorCommentHeading"),
                displayauthorcomment
                    );
    
    }

    overlay.innerHTML += '<div class="yskboverlaycommentPostQuestion">'+chrome.i18n.getMessage("overlayCommentPostQuestion")+'</div>';
    

    // add the button to close the area
    overlay.innerHTML += "<button onclick=\"javascript:document.getElementById('youshouldknowbetteroverlay').parentNode.removeChild(document.getElementById('youshouldknowbetteroverlay'));\">"+chrome.i18n.getMessage("overlayConfirmationButton")+"</button>";
    document.body.appendChild(overlay);

}

function getIssueBox(question,commentheading,comment){
    templatehead = '<div class="yskboverlayissuesbox"> \
    <div class="yskboverlayquestion">$question</div>';
    templatebody = '\
    <div class="yskboverlaycommentHeader">$commentheading</div> \
    <div class="yskboverlaycommentText">$comment</div>';
    templateend = '</div>';

    var str = templatehead.replace("$question",question);
    if(comment){
        str += templatebody.replace("$commentheading",commentheading);
        str = str.replace("$comment",comment);
    }
    str += templateend;
    return str; 
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

