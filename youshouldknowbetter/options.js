// load strings
var strings =["optionsHeading","optionsPagesHeading","optionsURLexplanation","optionsButtonSave","tableHeadingURL","tableHeadingName","tableHeadingComment"];
loadStrings(strings);

// Saves options to localStorage.
function save_options() {
    var tbl = document.getElementById("urlsTable");
    var blockedurls = [];
    // we skip the heading row
    for (var i=1, row; row=tbl.rows[i]; i++) {
        var entry={"url":"","name":"","comment":""};
        entry["url"]=row.cells[0].childNodes[0].value;
        entry["name"]=row.cells[1].childNodes[0].value;
        entry["comment"]=row.cells[2].childNodes[0].value;
        blockedurls.push(entry);
    }

    chrome.storage.sync.set({"youshouldknowbetter":blockedurls});

    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.innerHTML = chrome.i18n.getMessage("optionsSaved");
    setTimeout(function() {
        status.innerHTML = "";
    }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    chrome.storage.sync.get("youshouldknowbetter",fill_table);
}

function fill_table(contents) {
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

// appends all urls to something textareay
function fill_textarea(urls){
    var textarea = document.getElementById("urls");
    blockedurls = urls['youshouldknowbetter']
        for (var i=0; i < blockedurls.length; i++){
            textarea.value += blockedurls[i]+"\n";
        }
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#optionsButtonSave').addEventListener('click', save_options);
