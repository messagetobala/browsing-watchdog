function eatPageReceiver(request, sender, sendResponse) {
    document.body.textContent = "";

    let bodyDiv = document.createElement('div');
    bodyDiv.setAttribute("id", "body");
    
    let headerSection = document.createElement('section')
    headerSection.setAttribute("id", "header");
    
    let headerPara_1 = document.createElement('p')
    headerPara_1.textContent = 'A slight change in your daily habits can guide your life to a very different destination.'
    
    let headerPara_2 = document.createElement('p')
    headerPara_2.textContent = '- James Clear'
    
    headerSection.appendChild(headerPara_1)
    headerSection.appendChild(headerPara_2)
    
    let introSection = document.createElement('section')
    introSection.setAttribute("id", "intro");

    let introPara_0 = document.createElement('p')
    introPara_0.innerHTML = 'Excerpt from the book <em> "Atomic Habits" </em> by James Clear.'

    let introPara_1 = document.createElement('p')
    introPara_1.textContent = 'Imagine you are flying from Los Angeles to New York City. If a pilot leaving from LAX adjusts the heading just 3.5 degrees south, you will land in Washington, D.C., instead of New York. Such a small change is barely noticeable at takeoff - the nose of the airplane moves just a few feet - but when magnified across the entire United States, you end up hundereds of miles apart.'
    
    let introPara_2 = document.createElement('p')
    introPara_2.innerHTML = 'Similarly, a slight change in your daily habits can guide your life to a very different destination. Making a choice that is one percent better or one percent worse seems insignificant in the momemnt, <em> but over the span of moments that make up a lifetime, the choices you make determine the difference between who you are and who you could be. <em>'
    
    let introPara_3 = document.createElement('p')
    introPara_3.innerHTML = "<u>Success is the product of daily habits - not once-in-a-lifetime transformations. It doesn't matter how successful or unsuccessful you are right now. What matters is whether your current habits are putting you on the path toward success. </u>"

    introSection.appendChild(introPara_0)
    introSection.appendChild(introPara_1)
    introSection.appendChild(introPara_2)
    introSection.appendChild(introPara_3)
    
    let endSection = document.createElement('section')
    endSection.setAttribute("id", "conclusion");
    
    
    let endPara_1 = document.createElement('p')
    endPara_1.innerHTML = "Instead of visiting <em>" +  request.replacement + "</em>, you can:"

    console.log(request)
    console.log(JSON.stringify(request))

    let endUl = document.createElement('ul')
    
    
    request.prompts.forEach(element => {
        
        let endLi_1 = document.createElement('li')
        endLi_1.innerHTML = '<em>' + element + '</em>'
        endUl.appendChild(endLi_1)
    });
    


    /*
    let endUl = document.createElement('ul')
    
    let endLi_1 = document.createElement('li')
    endLi_1.innerHTML = 'Take a walk outside - <em>To refresh yourself. </em>'
    
    let endLi_2 = document.createElement('li')
    endLi_2.innerHTML = 'Drink a cup of water - <em>For your better health. </em>'
    
    let endLi_3 = document.createElement('li')
    endLi_3.innerHTML = 'Do stretching exercises - <em>For your neck and back issues. </em>'
    
    let endLi_4 = document.createElement('li')
    endLi_4.innerHTML = 'Visit hacker news - <em>To learn something interesting.</em>'
    
    endUl.appendChild(endLi_1)
    endUl.appendChild(endLi_2)
    endUl.appendChild(endLi_3)
    endUl.appendChild(endLi_4)
    */
    endSection.appendChild(endPara_1)
    endSection.appendChild(endUl)
    
    bodyDiv.appendChild(headerSection)
    bodyDiv.appendChild(introSection)
    bodyDiv.appendChild(endSection)
    document.body.appendChild(bodyDiv);
}
  
browser.runtime.onMessage.addListener(eatPageReceiver);

