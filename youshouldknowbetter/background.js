// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when a message is passed.  We assume that the content script
// wants to show the page action.
function onRequest(request, sender, sendResponse) {
    console.log(request);
    if (request['load']) {
        chrome.storage.sync.get("youshouldknowbetter",
                function(result){
                    console.log(result);
                    sendResponse("urls":result['youshouldknowbetter'])
                });
    }
    else{
        sendResponse({});
    }
};



// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);

