let SAVED_PROMPTS = 'saved_prompts'

function modifyContent(prompts) {
    document.body.textContent = ""

    let bodyDiv = document.createElement('div')
    bodyDiv.setAttribute("class", "watchdog_body")
    
    let headerSection = document.createElement('section')
    headerSection.setAttribute("class", "watchdog_header_section")
    
    let headerPara_1 = document.createElement('p')
    headerPara_1.setAttribute("class", "watchdog_para")
    headerPara_1.textContent = 'A slight change in your daily habits can guide your life to a very different destination.'
    
    let headerPara_2 = document.createElement('p')
    headerPara_2.setAttribute("class", "watchdog_para")
    headerPara_2.textContent = '- James Clear'
    
    headerSection.appendChild(headerPara_1)
    headerSection.appendChild(headerPara_2)
    
    let introSection = document.createElement('section')
    introSection.setAttribute("class", "watchdog_intro_section")

    let introPara_0 = document.createElement('p')
    introPara_0.setAttribute("class", "watchdog_para")
    introPara_0.innerHTML = 'Excerpt from the book <em> "Atomic Habits" </em> by James Clear.'

    let introPara_1 = document.createElement('p')
    introPara_1.setAttribute("class", "watchdog_para")
    introPara_1.textContent = 'Imagine you are flying from Los Angeles to New York City. If a pilot leaving from LAX adjusts the heading just 3.5 degrees south, you will land in Washington, D.C., instead of New York. Such a small change is barely noticeable at takeoff - the nose of the airplane moves just a few feet - but when magnified across the entire United States, you end up hundereds of miles apart.'
    
    let introPara_2 = document.createElement('p')
    introPara_2.setAttribute("class", "watchdog_para")
    introPara_2.innerHTML = 'Similarly, a slight change in your daily habits can guide your life to a very different destination. Making a choice that is one percent better or one percent worse seems insignificant in the momemnt, <em> but over the span of moments that make up a lifetime, the choices you make determine the difference between who you are and who you could be. <em>'
    
    let introPara_3 = document.createElement('p')
    introPara_3.setAttribute("class", "Watchdog_para")
    introPara_3.innerHTML = "<u>Success is the product of daily habits - not once-in-a-lifetime transformations. It doesn't matter how successful or unsuccessful you are right now. What matters is whether your current habits are putting you on the path toward success. </u>"

    introSection.appendChild(introPara_0)
    introSection.appendChild(introPara_1)
    introSection.appendChild(introPara_2)
    introSection.appendChild(introPara_3)
    
    let endSection = document.createElement('section')
    endSection.setAttribute("class", "watchdog_conclusion_section")
    
    
    let endPara_1 = document.createElement('p')
    endPara_1.setAttribute("class", "watchdog_para")
    endPara_1.innerHTML = "Instead of visiting <em>" +  getHostname() + "</em>, you can:"

    let endUl = document.createElement('ul')
    endUl.setAttribute("class", "watchdog_ul")
    
    prompts.forEach(element => {
        
        let endLi_1 = document.createElement('li')
        endLi_1.innerHTML = '<em>' + element + '</em>'
        endUl.appendChild(endLi_1)
    });
    
    endSection.appendChild(endPara_1)
    endSection.appendChild(endUl)
    
    bodyDiv.appendChild(headerSection)
    bodyDiv.appendChild(introSection)
    bodyDiv.appendChild(endSection)
    document.body.appendChild(bodyDiv);
}


function getHostname() {
    return new URL(window.location.href).hostname
}

console.log('Fetching prompts')
chrome.storage.sync.get(SAVED_PROMPTS).then(function(items) {
    modifyContent(items[SAVED_PROMPTS])
})