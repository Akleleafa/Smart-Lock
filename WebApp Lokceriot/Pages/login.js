
import {home} from './home.js'

$(document).ready(function () {

    const formLogin = `
                       <div class="col" style="text-align: center;">
                        <img style="padding-top:50px;width: 60%;" src="img/logo.png">
                         <div style="padding-top:50px;width:80%;margin:auto">
                           <div style="text-align:left;padding-bottom:5px;font-family:verdana;font-weight: bold;">User</div>
                           <div id="taipp_user"></div>
                         </div>
                         <div style="padding-top:40px;width:80%;margin:auto">
                           <div style="text-align:left;padding-bottom:5px;font-family:verdana;font-weight: bold;">Password</div>
                           <div id="taipp_password"></div>
                         </div>

                         
                         <div style="padding-top:60px;width:80%;margin:auto;height:130px">
                           <div id="taipp_btnlogin"></div>
                         </div>
                       </div>


                     </div>
`

                // div.insertAdjacentHTML( 'beforeend', str );

    const homePage = document.getElementById("home")
    //homePage.append(formLogin)
    homePage.insertAdjacentHTML( 'beforeend', formLogin );


    $('#taipp_user').dxTextBox({
        placeholder: DevExpress.localization.formatMessage('Email or user id'),
        onEnterKey: function () {

        }
      })
      $('#taipp_password').dxTextBox({
        mode: 'password',
        placeholder: DevExpress.localization.formatMessage('Enter password'),
        onEnterKey: function () {

        }
      })
      $('#taipp_btnlogin').dxButton({
        text: 'sign in',
        width: '100%',
        height: '40px',
        elementAttr: {
          style: "background-color: rgb(47,144,228);color:white;width:100%;height:40px;"
        },
        async onClick(){
          try{
            //fetch(`https://pirh6b4ag8.execute-api.us-west-2.amazonaws.com/users`, {method: 'GET',})
            console.log($('#taipp_user').dxTextBox('instance').option('value'))
              
            const httpHeaders = new Headers()
            httpHeaders.append('Content-Type', 'application/json')
            httpHeaders.append('accept', 'application/json')
          
            var userLogged = $('#taipp_user').dxTextBox('instance').option('value')

            const httpBody = JSON.stringify({
              userName: $('#taipp_user').dxTextBox('instance').option('value'),
              userPassword: $('#taipp_password').dxTextBox('instance').option('value')
            })

            const options = {
              method: 'POST',
              //mode: 'no-cors', // manage cross-origin in case of separated api and ui.
              headers: httpHeaders,
              body: httpBody,
            }

            const response = await fetch('https://pirh6b4ag8.execute-api.us-west-2.amazonaws.com/users/login', options)
              console.log(await response)
              console.log(await response.json())
              home(userLogged)
          }catch(ex){
            console.log('im in exeption')
            DevExpress.ui.notify("Credentials incorrect", "error", 3000);
          }

        }

      })  

})