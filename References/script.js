
// call api initialy
window.onload = callTeamData()

let currentSelectedTeamIndex = 0
let currentSelectedTeamData = {}
let teamsdata = []
let prevSelectedTeamIndex = 0
let preSelectedTeamLogo = -1

async function callTeamData(){
    let url = 'https://new-azfn-draftsy.azurewebsites.net/api/NCAAcolors?code=Eto4jJQkBLIbJV0fVO8Z6RFOwIr83z7fKkhfImXuVaQmwrg7jbLLgA=='
    // let url = 'https://reqres.in/api/users'
    // let url = 'http://localhost:7071/api/NCAAcolors'

    // fetch(url, {
    //     method: 'POST',
    //     body : {},
    // }).then( response => response.json() )
    // .then( data => console.log(data) )

    

    await axios.get(
        url,
        {},
        {
            headers: { 
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*', 
                // 'Access-Control-Allow-Origin': 'http://localhost:7071/api/NCAAcolors',
                'Access-Control-Allow-Credentials' : true 
            },
        }
    )
    .then(response => {
        teamsdata = response.data.Output
        const teams = response.data.Output;
        console.log(`GET teams`, teams);
        const ul = document.createElement('ul');

        renderTeamsName(teams)

        // const teamNameContainer = document.getElementById('team-name-container')
        // console.log(teamNameContainer)
        // console.log(ul)
        // teamNameContainer.appendChild('ul')
        // const node = document.createElement("li");
        // const textnode = document.createTextNode("Water");
        // node.appendChild(textnode);
        // document.getElementById("root").appendChild(node);
    })
    .catch(error => console.error(error));
}

function renderTeamsName (teams){
    console.log('teamsdata',teamsdata)
    const ul = document.createElement('ul');
    const teamNameContainer = document.getElementById('team-name-container')

    // mpa over each list
    teams.map((obj,index)=>{
        // Create <li> tag
        const li = document.createElement('li')
        li.setAttribute('class','team-list-name')
        li.setAttribute('data-index','team-'+index)
        const img = document.createElement('img')
        img.setAttribute('src',obj.teamImageLink)
        img.setAttribute('class','sidebar-team-logo-preview')
        const a = document.createElement('a')
        a.textContent = obj.teamName
        li.appendChild(img)
        li.appendChild(a)

        // Add text to <li>
        // li.textContent = obj.teamName;
        // Append <li> to <ul>
        ul.appendChild(li);

        li.addEventListener('click',function(element){
            let currentSelectedLiTag = document.querySelector(`li[data-index="${'team-'+prevSelectedTeamIndex}"]`)
            currentSelectedLiTag.classList.remove('current-selected-team')
            setCurrentSelectedTeamData(index)
            preSelectedTeamLogo = -1
        })
    })
    
    teamNameContainer.appendChild(ul)

    setCurrentSelectedTeamData(0)

}

function setCurrentSelectedTeamData(selectedindex){
    const teamLogoContainer = document.getElementById('team-logo-container')

    while (teamLogoContainer.lastElementChild) {
        teamLogoContainer.removeChild(teamLogoContainer.lastElementChild);
      }

    currentSelectedTeamData={}
    currentSelectedTeamIndex = selectedindex
    currentSelectedTeamData = teamsdata[selectedindex]
    prevSelectedTeamIndex = selectedindex

    console.log(currentSelectedTeamData)

    let currentSelectedLiTag = document.querySelector(`li[data-index="${'team-'+selectedindex}"]`)
    currentSelectedLiTag.classList.add('current-selected-team')

    
    currentSelectedTeamData.teamColorCodes.map((color,colorindex)=>{

        const CardElementMain = document.createElement('div')
        try{
            if( currentSelectedTeamData.selectedcolor == color){
                CardElementMain.classList.add('selected-team-logo')
                preSelectedTeamLogo = colorindex
            }
        }
        catch{

        }

        console.log(color)
        CardElementMain.setAttribute('data-image-logo-index',colorindex)
        CardElementMain.classList.add('team-logo-card')
        CardElementMain.classList.add('card-element-main')
        
        const CardElement = document.createElement('div')
        CardElement.style.backgroundColor = `#${color}`
        const img = document.createElement('img')
        img.setAttribute('src',currentSelectedTeamData.teamImageLink)

        CardElement.appendChild(img)

        CardElementMain.appendChild(CardElement)

        teamLogoContainer.appendChild(CardElementMain)

        CardElementMain.addEventListener('click',function(){

            try{
                let prevSelectedLiTag = document.querySelector(`div[data-image-logo-index="${preSelectedTeamLogo}"]`)
                prevSelectedLiTag.classList.remove('selected-team-logo')
            }
            catch{}

            let currentSelectedLiTag = document.querySelector(`div[data-image-logo-index="${colorindex}"]`)
            currentSelectedLiTag.classList.add('selected-team-logo')

            preSelectedTeamLogo = colorindex

            let url = 'https://new-azfn-draftsy.azurewebsites.net/api/NCAAColorApproved?code=Eto4jJQkBLIbJV0fVO8Z6RFOwIr83z7fKkhfImXuVaQmwrg7jbLLgA=='
            // https://new-azfn-draftsy.azurewebsites.net/api/NCAAColorApproved?code=Eto4jJQkBLIbJV0fVO8Z6RFOwIr83z7fKkhfImXuVaQmwrg7jbLLgA==
            let reqData = currentSelectedTeamData
            reqData.teamCOlorCode = color
            delete reqData.teamDetailsLink
            delete reqData.teamColorCodes

           updateData(url,reqData,color)

            // selected-team-logo
        })

    })
}

async function updateData(url,reqData){
    console.log(reqData)
    fetch(url, {
        method: 'POST',
        mode :'no-cors',
        body : JSON.stringify(reqData),
    }).then( response => {
        response.json();
        teamsdata[currentSelectedTeamIndex].selectedcolor = reqData.teamCOlorCode
    } )
    .then( data => console.log(data) )
}


// await axios.get(
//     url,
//     {},
//     {
//         headers: { 
//             "Content-Type": "application/json",
//             'Access-Control-Allow-Origin': '*', 
//             // 'Access-Control-Allow-Origin': 'http://localhost:7071/api/NCAAcolors',
//             'Access-Control-Allow-Credentials' : true 
//         },
//     }
// )
// .then(response => {
// })
// .catch(error => console.error(error));

