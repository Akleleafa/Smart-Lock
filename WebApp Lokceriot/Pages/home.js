//import { connectionStatus } from '/src/main.js';
import {htable} from './htable.js'


export async function home(userLogged) {

  
  //-ms-transform: translate(-50%, -50%);
  //transform: translate(-50%, -50%);
    const formLogin = `
                        <style>
                          .content{
                            width: 100vw;
                            height: 100vh;
                          }

                          .lock_box{
                            width: 100%;
                            height: 90%;
                          }

                          .tool_bar{
                            width: 100%;
                            height: 10%;
                            display: inline-flex;
                            border: 1px solid #FFFFFF;
                            
                          }

                          .lock{
                            width: 100%;
                            height:100%;
                            color:white;
                            background-color: #E4A14C;
                            font-size : 40px;
                            border:none;
                          }

                          .button{
                            color:white;
                            background-color: #0A94A9;
                            font-size : 25px;
                            flex-grow: 1;
                            border:none;
                            border-right: 1px solid #FFFFFF;
                            height:100%;

                          }

                          
                        </style>
                          <div class="content">
                            <div class="lock_box">
                                <button id="lock" class="lock" type="button">Unlock</button>
                            </div>
                            <div class="tool_bar">
                                <button id="table" class="button" type="button">Table</button>
                                <button id="homet" class="button" type="button">Home</button>
                                <button id="connect" class="button" type="button">Connection</button>
                            </div>
                          </div>
                        
`   

                // div.insertAdjacentHTML( 'beforeend', str );

    //const homePage = document.getElementById("home")
    //homePage.append(formLogin)
    //homePage.innerHTML = formLogin 

    const homePage = document.getElementById("home")
    //homePage.append(formLogin)
    homePage.innerHTML = formLogin;


   

    $('#lock').dxButton({
      //width: '100%',
      //height: '40px',
      //elementAttr: {
      //  style: "background-color: rgb(47,144,228);color:white;width:100%;height:100%;"
      //},
      async onClick(){
        console.log("you are trying to connect")

        try{
                
           const httpHeaders = new Headers()
           httpHeaders.append('Content-Type', 'application/json')
           httpHeaders.append('accept', 'application/json')
         
           const httpBody = JSON.stringify({
             userName: userLogged
           })

           const options = {
             method: 'POST',
             //mode: 'no-cors', // manage cross-origin in case of separated api and ui.
             headers: httpHeaders,
             body: httpBody,
           }
           const response = await fetch('https://pirh6b4ag8.execute-api.us-west-2.amazonaws.com/lockeriot/historical', options)
           console.log(await response)
           console.log(await response.json())


        }catch(ex){
          console.log('it was not able to post the user credentials')
        }

      }

    })


    $('#table').dxButton({
      async onClick(){
        console.log("you are trying to go to the table")
       htable(userLogged)
      }

    })

    $('#homet').dxButton({
      async onClick(){
        console.log("you are trying to go to home")
        home(userLogged);
      }

    })
    let connectButton = document.getElementById('connect');

    $('#connect').dxButton({
      async onClick(){
        say.cond();
        /*if(say.connectionStatus == 0)
        connectButton.textContent = 'Connect'
        else
         connectButton.textContent = 'Disconnect'*/
      }

    })

      let say = await import('/src/main.js');
      
    

      
    

//
}