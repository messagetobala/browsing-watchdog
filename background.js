let FILTERED_URLS = 'filtered_urls'
let EXEMPTION_CONFIG = 'exemption_config'
let SAVED_PROMPTS = 'saved_prompts'
let FROM = 'FROM'
let TO = 'TO'
let fromExemption = ''
let toExemption = ''
let prompts = []

function getHostname(url) {
  let a = document.createElement("a");
  a.href = url;
  return a.hostname
}

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

function messageTab(tabs) {
  browser.storage.sync.get(FILTERED_URLS).then(function(items) {
    url = getHostname(tabs[0].url)
    console.log('Active URL' + url)
    console.log('Exemption Info From:' + fromExemption + ' To:' + toExemption)
    console.log('Prompts:' + JSON.stringify(prompts))
    if(items.hasOwnProperty(FILTERED_URLS) && 
       items[FILTERED_URLS].includes(url) && 
       !isExempted()) {
        browser.tabs.sendMessage(tabs[0].id, {
          replacement: url,
          prompts: prompts
        })
    }
  })
}

function onExecuted(result) {
    let querying = browser.tabs.query({
        active: true,
        currentWindow: true
    });
    querying.then(messageTab);
}

function addContentScript(requestDetails) {
    console.log(`Loading content script into : ${requestDetails.url}`);
    let executing = browser.tabs.executeScript({
      file: "content-script.js"
    });
    browser.tabs.insertCSS({file: "content-style.css"});
    executing.then(onExecuted);
}

function addListener(items) {
  browser.webNavigation.onCompleted.removeListener(addContentScript)
  browser.webNavigation.onHistoryStateUpdated.removeListener(addContentScript)

  filterdUrls = []

  if (items.hasOwnProperty(FILTERED_URLS)) {
    items[FILTERED_URLS].forEach(element => {
      url = { 'hostEquals': element}
      filterdUrls.push(url)
    })
  }

  if (filterdUrls.length > 0)
  {
    console.log('Adding listener for urls ' + JSON.stringify(filterdUrls))
    filter = {url : filterdUrls}

    browser.webNavigation.onCompleted.addListener(
      addContentScript,
      filter
    )

    browser.webNavigation.onHistoryStateUpdated.addListener(
      addContentScript,
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
  fromExemption = items[EXEMPTION_CONFIG][FROM]
  toExemption = items[EXEMPTION_CONFIG][TO]
})

browser.storage.sync.get(SAVED_PROMPTS).then(function(items) {
  prompts = items[SAVED_PROMPTS]
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





