// load strings
var strings =["optionsHeading","optionsPagesHeading","optionsURLexplanation","optionsButtonSave","ButtonUrlsAddRow","urlsTableHeadingURL","urlsTableHeadingName","urlsTableHeadingComment"];
loadStrings(strings);

// Saves options to localStorage.
function save_options() {
    var tbl = document.getElementById("urlsTable");
    var blockedurls = [];
    var rowcount = tbl.rows.length;
    // we skip the heading row
    for (var i=1, row; row=tbl.rows[i]; i++) {
        var entry={"url":"","name":"","comment":""};
        entry["url"]=row.cells[0].childNodes[0].value;
        entry["name"]=row.cells[1].childNodes[0].value;
        entry["comment"]=row.cells[2].childNodes[0].value;
        if(entry['url']){
            blockedurls.push(entry);
        }
        else{
            tbl.deleteRow(i);
            rowcount--;
            i--;
        }
    }

    chrome.storage.sync.set({"youshouldknowbetter":blockedurls});
    
    var tbl = document.getElementById("authorsTable");
    var blockedauthors = [];
    var rowcount = tbl.rows.length;
    // we skip the heading row
    for (var i=1, row; row=tbl.rows[i]; i++) {
        var entry={"name":"","comment":""};
        entry["name"]=row.cells[1].childNodes[0].value;
        entry["comment"]=row.cells[2].childNodes[0].value;
        if(entry['name']){
            blockedauthors.push(entry);
        }
        else{
            tbl.deleteRow(i);
            rowcount--;
            i--;
        }
    }
    chrome.storage.sync.set({"youshouldknowbetterauthors":blockedauthors});


    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.innerHTML = chrome.i18n.getMessage("optionsSaved");
    setTimeout(function() {
        status.innerHTML = "";
    }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    chrome.storage.sync.get("youshouldknowbetter",fill_urls_table);
    chrome.storage.sync.get("youshouldknowbetterauthors",fill_authors_table);
}

function fill_urls_table(contents) {
    var urls = contents['youshouldknowbetter'];
    for (var i=0; i < urls.length; i++) {
        // migration path for old url style
        if (typeof(urls[i])=="string"){
            urls[i]={"url":urls[i],"name":"","comment":""};
        }
        // create entry
        var tbl = document.getElementById("urlsTable");
        var newrow = tbl.insertRow(tbl.rows.length);
        if (i%2==1){
            newrow.className ="colored";
        }
        var newUrlCell = newrow.insertCell(0);
        newUrlCell.innerHTML = '<input type="text" size="40" value="'+urls[i].url+'">';
        var newNameCell = newrow.insertCell(1);
        newNameCell.innerHTML = '<input type="text" size="40" value="'+urls[i].name+'">';
        var newCommentCell = newrow.insertCell(2);
        newCommentCell.innerHTML = '<input type="text" size="40" value="'+urls[i].comment+'">';
    }
}

function fill_authors_table(content) {

}

// add empty row to end of table of urls
function add_urls_row(){
    var tbl = document.getElementById("urlsTable");
    var newrow = tbl.insertRow(tbl.rows.length);
    if (tbl.rows.length%2==1){
        newrow.className ="colored";
    }
    var newUrlCell = newrow.insertCell(0);
    newUrlCell.innerHTML = '<input type="text" size="40">';
    var newNameCell = newrow.insertCell(1);
    newNameCell.innerHTML = '<input type="text" size="40">';
    var newCommentCell = newrow.insertCell(2);
    newCommentCell.innerHTML = '<input type="text" size="40">';
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#optionsButtonSave').addEventListener('click', save_options);
document.querySelector('#ButtonUrlsAddRow').addEventListener('click', add_urls_row);
