let FILTERED_URLS = 'filtered_urls'
let EXEMPTION_CONFIG = 'exemption_config'
let SAVED_PROMPTS = 'saved_prompts'
let FROM = 'FROM'
let TO = 'TO'
let fromExemption = ''
let toExemption = ''
let prompts = []
let filteredUrls = []

function isExempted() {
    currentHour =  new Date().getHours()
    result = false;
    if (fromExemption < toExemption && fromExemption <= currentHour && currentHour < toExemption) {
      result = true;
    }
    else if (fromExemption > toExemption && currentHour > toExemption && currentHour <= fromExemption) {
      result = true;
    }
    console.log('Is Exempted:' + result)
    return result;
}

function addContentScript(tabs) {
    console.log('filter urls ' + JSON.stringify(filteredUrls))
    currentUrl = new URL(tabs[0].url)
    console.log('Current tab url ' + currentUrl.hostname)
    if (filteredUrls.includes(currentUrl.hostname) && !isExempted()) {
        console.log(`Loading content script into : ${currentUrl.hostname}`);
        browser.tabs.sendMessage(tabs[0].id, {
            replacement: currentUrl.hostname,
            prompts: prompts
        })
    } else {
        console.log('Current tab url not matched')
    }
}

function getCurrentTabAndAddContentScript(requestDetails) {
    let querying = browser.tabs.query({
        active: true,
        currentWindow: true
    });
    querying.then(addContentScript);

}

function addListener(items) {
    browser.webNavigation.onCompleted.removeListener(getCurrentTabAndAddContentScript)
    browser.webNavigation.onHistoryStateUpdated.removeListener(getCurrentTabAndAddContentScript)
    
    urlFilters=[]
    if (items.hasOwnProperty(FILTERED_URLS)) {
      filteredUrls=items[FILTERED_URLS]
      items[FILTERED_URLS].forEach(element => {
        url = { 'hostEquals': element}
        urlFilters.push(url)
      })
    }
  
    if (urlFilters.length > 0)
    {
      console.log('Adding listener for urls ' + JSON.stringify(urlFilters))
      filter = {url : urlFilters}
  
      browser.webNavigation.onCompleted.addListener(
        getCurrentTabAndAddContentScript,
        filter
      )
    
      browser.webNavigation.onHistoryStateUpdated.addListener(
        getCurrentTabAndAddContentScript,
        filter
      )
    }
}

/**
 * When loaded get the urls from configuration and
 * add a listener to add content script to those URL's.
 */
browser.storage.sync.get(FILTERED_URLS).then(function(items) {
    console.log('Current filtered urls' + JSON.stringify(items))
    addListener(items)
})
  
browser.storage.sync.get(EXEMPTION_CONFIG).then(function(items) {
    if (items.hasOwnProperty(EXEMPTION_CONFIG)) {
        fromExemption = items[EXEMPTION_CONFIG][FROM]
        toExemption = items[EXEMPTION_CONFIG][TO]
    }
})
  
browser.storage.sync.get(SAVED_PROMPTS).then(function(items) {
    if (items.hasOwnProperty(SAVED_PROMPTS)) {
        prompts = items[SAVED_PROMPTS]
    }
})
  
function logStorageChange(changes, area) {
    console.log(`Change in storage area: ${area}`);

    const changedItems = Object.keys(changes);

    for (const item of changedItems) {
        if (item == FILTERED_URLS) {
            browser.storage.sync.get(FILTERED_URLS).then(function(items) {
                addListener(items)
            })
        } else if (item == EXEMPTION_CONFIG) {
            browser.storage.sync.get(EXEMPTION_CONFIG).then(function(items) {
                fromExemption = items[EXEMPTION_CONFIG][FROM]
                toExemption = items[EXEMPTION_CONFIG][TO]
            })
        } else if (item == SAVED_PROMPTS) {
            browser.storage.sync.get(SAVED_PROMPTS).then(function(items) {
                prompts = items[SAVED_PROMPTS]
            })
        }
    }
}
  
browser.storage.onChanged.addListener(logStorageChange);
