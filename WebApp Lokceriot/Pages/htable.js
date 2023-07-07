import { home } from "./home.js"
//import { connectionStatus } from "/src/main.js"

export async function htable(userLogged) {


    //-ms-transform: translate(-50%, -50%);
    //transform: translate(-50%, -50%);
      const formLogin = `

                            <style>
                            .content{
                              width: 100vw;
                              height: 100vh;
                            }

                            .tableh{
                              width: 100%;
                              height: 90%;
                            }

                            .tool_bar{
                              width: 100%;
                              height: 10%;
                              display: inline-flex;
                              
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
                              <div class="tableh">
                                  <div id="dataGrid" style="width: 100%">
                                  </div>
                              </div>
                              <div class="tool_bar">
                                <button id="table" class="button" type="button">Table</button>
                                <button id="homet" class="button" type="button">Home</button>
                                <button id="connect" class="button" type="button">Connection</button>
                            </div>
                            </div>



                          
  `   
  
                  // div.insertAdjacentHTML( 'beforeend', str );
  
      const homePage = document.getElementById("home")
      //homePage.append(formLogin)
      homePage.innerHTML = formLogin  
    

        /*fetch('https://pirh6b4ag8.execute-api.us-west-2.amazonaws.com/lockeriot/historical')
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
              }
              return response.json();
            })
            .then((json) => initialize(json))
            .catch((err) => console.error(`Fetch problem: ${err.message}`));

            var historic = response.*/

      const response = await fetch('https://pirh6b4ag8.execute-api.us-west-2.amazonaws.com/lockeriot/historical');
      const data = await response.json();

      data.map(item => {
        item.date = new Date(parseInt(item.timestamp))
        item .date = item.date.getFullYear()+ "/"+(item.date.getMonth()+1)+ "/"+ item.date.getDate()+" "+ item.date.getHours()+ ":"+ item.date.getMinutes()+
        ":"+item.date.getSeconds()
        console.log(item)
        return item
      })

      console.log(data)
     
      $("#dataGrid").dxDataGrid({
        dataSource: data, 
        height: '100%',
        columns: [{
            dataField: "user"
        }, {
            
            dataField: "date",
            dataType: "date",
            format: "dd/MM/yyyy HH:mm:ss",
            visible: true,
            sortOrder: 'desc'
            //editorOptions: {
             // timestamp : Date(timestamp)
            //}
            }
      ],
        allowColumnReordering: true,

    });

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

    $('#connect').dxButton({
      async onClick(){
        say.cond();
      }

    })

    let say = await import('/src/main.js');
       
  //
  }