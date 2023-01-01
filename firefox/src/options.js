let FILTERED_URLS = 'filtered_urls'
let EXEMPTION_CONFIG = 'exemption_config'
let SAVED_PROMPTS = 'saved_prompts'
let FROM = 'FROM'
let TO = 'TO'

function onError(error) {
    console.log(error)
}

function saveUrl() {
    browser.storage.sync.get(FILTERED_URLS).then(function(items) {
        console.log('Existing URLS in watch list ' + JSON.stringify(items))
        newUrl = document.getElementById("new_url").value;
        if (newUrl != '') {
            console.log('Adding URL to watch list ' + newUrl);
            if (items.hasOwnProperty(FILTERED_URLS)) {
                items[FILTERED_URLS].push(newUrl)
            } else {
                items[FILTERED_URLS] = [ newUrl]
            }
            urlConfig = {}
            urlConfig[FILTERED_URLS] = items[FILTERED_URLS]
            console.log('Updated urls ' + JSON.stringify(urlConfig))
            browser.storage.sync.set(urlConfig).then(restoreFilteredUrls, onError);
        }
        document.getElementById('new_url').value = ''
    }, onError);
}

function removeUrl(url) {
    console.log('Remvoing URL from watch list ' + url)
    browser.storage.sync.get(FILTERED_URLS).then(function(items) {
        console.log('Existing URLS in watch list ' + JSON.stringify(items))
        updateUrls = [];
        if (items.hasOwnProperty(FILTERED_URLS)) {
            items[FILTERED_URLS].forEach(element => {
                if (element != url) {
                    updateUrls.push(element)
                }
            });
            urlConfig = {}
            urlConfig[FILTERED_URLS] = updateUrls
            console.log('Updated urls ' + JSON.stringify(urlConfig))
            browser.storage.sync.set(urlConfig).then(restoreFilteredUrls, onError);
        }
    }, onError);
}

function restoreFilteredUrls() {
    browser.storage.sync.get(FILTERED_URLS).then(function(items) {
        console.log('Existing URLS ' + JSON.stringify(items))
        
        //clear
        document.querySelector('#urls').innerHTML=""
        
        //Add li for adding new url
        let li = document.createElement('li')
        li.innerHTML = '<span><button id="new_url_button">+</button>&nbsp;&nbsp;<input type="text" id="new_url"></input></span>'
        document.querySelector('#urls').appendChild(li)
        console.log('Adding event listener for adding new url')
        document.querySelector('#new_url_button').addEventListener('click', function(){
            saveUrl()
        });

        if (items.hasOwnProperty(FILTERED_URLS)) {
            //Add li for each existing url
            items[FILTERED_URLS].forEach(element => {
                let li = document.createElement('li')
                li.innerHTML = '<span><button value="' + element + '">-</button>&nbsp;' + element + '</span>'
                li.addEventListener('click', function() {
                    removeUrl(element)
                })
                document.querySelector('#urls').appendChild(li)
            });
        }

    }, onError);

}

function saveExemption() {
    browser.storage.sync.get(EXEMPTION_CONFIG).then(function(items) {
        console.log('Existing config ' + JSON.stringify(items))
        fromTime = document.getElementById('from_time').value;
        toTime = document.getElementById('to_time').value;
        exemptionConfig = {}
        exemptionConfig[EXEMPTION_CONFIG] = {}
        exemptionConfig[EXEMPTION_CONFIG][FROM] = fromTime
        exemptionConfig[EXEMPTION_CONFIG][TO] = toTime
        console.log('Updated config ' + JSON.stringify(exemptionConfig))
        browser.storage.sync.set(exemptionConfig).then(restoreExemptionTime, onError);
    }, onError);
}

function restoreExemptionTime() {
    browser.storage.sync.get(EXEMPTION_CONFIG).then(function(items) {
        //clear
        document.querySelector('#exemption').innerHTML=""
        let selectFrom = document.createElement('select')
        selectFrom.setAttribute('id', 'from_time')

        let selectTo = document.createElement('select')
        selectTo.setAttribute('id', 'to_time')

        let optionFromDefaultElement = document.createElement('option')
        optionFromDefaultElement.setAttribute('value', '-')
        optionFromDefaultElement.innerHTML = '-'

        let optionToDefaultEement = document.createElement('option')
        optionToDefaultEement.setAttribute('value', '-')
        optionToDefaultEement.innerHTML = '-'

        selectFrom.appendChild(optionFromDefaultElement)
        selectTo.appendChild(optionToDefaultEement)

        for (i = 0,  j = 0; i < 24; i++, j=j+1) {
            hour = (i < 13 ? i : i - 12)
            let optionFromElement = document.createElement('option')
            optionFromElement.setAttribute('value', i)
            optionFromElement.innerHTML=(hour < 10 ? '&nbsp;' + hour : hour) + ' ' + (i < 12 ? 'AM' : 'PM')
            
            let optionToElement = document.createElement('option')
            optionToElement.setAttribute('value', i)
            optionToElement.innerHTML=(hour < 10 ? '&nbsp;' + hour : hour) + ' ' + (i < 12 ? 'AM' : 'PM')

            selectFrom.appendChild(optionFromElement)
            selectTo.appendChild(optionToElement)
        }

        let labelFrom = document.createElement('label')
        labelFrom.setAttribute('for', 'from_time')
        labelFrom.innerText = 'Stop monitoring from '

        let labelTo = document.createElement('label')
        labelTo.setAttribute('for', 'to_time')
        labelTo.innerHTML = '&nbsp; to &nbsp;'


        document.querySelector('#exemption').appendChild(labelFrom)
        document.querySelector('#exemption').appendChild(selectFrom)

        document.querySelector('#exemption').appendChild(labelTo)
        document.querySelector('#exemption').appendChild(selectTo)

        if (items.hasOwnProperty(EXEMPTION_CONFIG)) {
            selectFrom.value = items[EXEMPTION_CONFIG][FROM]
            selectTo.value = items[EXEMPTION_CONFIG][TO]
        }

        selectFrom.addEventListener('change', function(){
            saveExemption()
        });

        selectTo.addEventListener('change', function(){
            saveExemption()
        })
    })
}

function savePrompt() {
    browser.storage.sync.get(SAVED_PROMPTS).then(function(items) {
        console.log('Existing prompts ' + JSON.stringify(items))
        newPrompt = document.getElementById('new_prompt').value;
        if (newPrompt != '') {
            console.log('Adding prompt ' + newPrompt);
            if (items.hasOwnProperty(SAVED_PROMPTS)) {
                items[SAVED_PROMPTS].push(newPrompt)
            } else {
                items[SAVED_PROMPTS] = [ newPrompt]
            }
            
            promptConfig = {}
            promptConfig[SAVED_PROMPTS] = items[SAVED_PROMPTS]
            console.log('Updated prompts ' + JSON.stringify(promptConfig))

            browser.storage.sync.set(promptConfig).then(restorePrompt, onError);
        }
        document.getElementById('new_prompt').value = ''
    }, onError);
}

function removePrompt(prompt) {
    console.log('Remvoing prompt ' + prompt)
    browser.storage.sync.get(SAVED_PROMPTS).then(function(items) {
        console.log('Existing prompts ' + JSON.stringify(items))
        updatedPrompts = [];
        if (items.hasOwnProperty(SAVED_PROMPTS) && items[SAVED_PROMPTS].length > 1) {
            items[SAVED_PROMPTS].forEach(element => {
                if (element != prompt) {
                    updatedPrompts.push(element)
                }
            });
            promptConfig = {}
            promptConfig[SAVED_PROMPTS] = updatedPrompts
            console.log('Updated prompts ' + JSON.stringify(promptConfig))
            browser.storage.sync.set(promptConfig).then(restorePrompt, onError);
        }
    }, onError);
}

function restorePrompt() {
    browser.storage.sync.get(SAVED_PROMPTS).then(function(items) {
        console.log('Existing prompts ' + JSON.stringify(items))
        
        //clear
        document.querySelector('#prompts').innerHTML=""
        
        //Add li for adding new url
        let li = document.createElement('li')
        li.innerHTML = '<span><button id="new_prompt_button">+</button>&nbsp;&nbsp;<input type="text" id="new_prompt"></input></span>'
        document.querySelector('#prompts').appendChild(li)
        console.log('Adding event listener for adding new prompt')
        document.querySelector('#new_prompt_button').addEventListener('click', function(){
            savePrompt()
        });

        if (items.hasOwnProperty(SAVED_PROMPTS) && items[SAVED_PROMPTS].length > 0) {
            //Add li for each existing url
            items[SAVED_PROMPTS].forEach(element => {
                let li = document.createElement('li')
                li.innerHTML = '<span><button value="' + element + '">-</button>&nbsp;' + element + '</span>'
                li.addEventListener('click', function() {
                    removePrompt(element)
                })
                document.querySelector('#prompts').appendChild(li)
            });
        } else {
            console.log('Adding default prompts')
            promptConfig = {}
            promptConfig[SAVED_PROMPTS] = ['Take a walk outside, to refresh yourself.', 'Visit hacker news, to read something interesting.']
            console.log('Updated prompts ' + JSON.stringify(promptConfig))

            browser.storage.sync.set(promptConfig).then(restorePrompt, onError);
            
        }

    }, onError);

}

document.addEventListener('DOMContentLoaded', restoreFilteredUrls);
document.addEventListener('DOMContentLoaded', restoreExemptionTime);
document.addEventListener('DOMContentLoaded', restorePrompt);