// Get references to UI elements
let terminalContainer = document.getElementById('terminal');
//let sendForm = document.getElementById('send-form');
let lockButton = document.getElementById('lock');
//let inputField = document.getElementById('input');
let connectButton = document.getElementById('connect');

export {connectionStatus};
export {lockState};

lockButton.addEventListener('click', function() {
  lock();
});


// Handle form submit event
/*sendForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form sending
  send(inputField.value); // Send text field contents
  inputField.value = '';  // Zero text field
  inputField.focus();     // Focus on text field
});*/

let connectionStatus = 0;

export function cond()
{
  console.log(connectionStatus);
  if (connectionStatus == 0)
  {
    connect();
  }
  else
  {
  disconnect();
  }
 
}

// Selected device object cache
let deviceCache = null;
let lockState = 0;

// Launch Bluetooth device chooser and connect to the selected
export function connect() {
    return (deviceCache ? Promise.resolve(deviceCache) :
        requestBluetoothDevice()).
        then(device => connectDeviceAndCacheCharacteristic(device)).
        //then(characteristic => startNotifications(characteristic)).
        catch(error => console.log(error));
}

function requestBluetoothDevice() {

    console.log('Requesting bluetooth device...');

    return navigator.bluetooth.requestDevice({
      filters: [{services: [0x180F]}],
    }).
        then(device => {
          console.log('"' + device.name + '" bluetooth device selected');
          deviceCache = device;

          deviceCache.addEventListener('gattserverdisconnected',
            handleDisconnection);
  
          return deviceCache;
        });
}

function handleDisconnection(event) {
  let device = event.target;

  console.log('"' + device.name +
      '" bluetooth device disconnected, trying to reconnect...');

  connectDeviceAndCacheCharacteristic(device).
      then(characteristic => startNotifications(characteristic)).
      catch(error => console.log(error));
}

// Characteristic object cache
let characteristicCache = null;
let characteristicCache2 = null;

// Connect to the device specified, get service and characteristic
function connectDeviceAndCacheCharacteristic(device) {
  if (device.gatt.connected && characteristicCache) {
    return Promise.resolve(characteristicCache);
  }

  console.log('Connecting to GATT server...');

  return device.gatt.connect().
      then(server => {
        console.log('GATT server connected, getting service...');

        return server.getPrimaryService(0x180F);
      }).
      then(service => {
        console.log('Service found, getting characteristic...');

         service.getCharacteristic(0x2A57).then(characteristic => {
          console.log ('Characteristic1 found');
          characteristicCache = characteristic;
        
        });

        service.getCharacteristic(0x2A58).then(characteristic => {
          console.log ('Characteristic2 found');
          characteristicCache2 = characteristic;
        });

        connectionStatus = 1;
        //connectButton.textContent = 'Disconnect';
       
      })

      //then(characteristic => {
        //log('Characteristic found');
        //characteristicCache = characteristic;

         /* characteristic.readValue().then(value => {
          log(`Led state is ${value.getUint8(0)}`);
        })*/
        

       // return characteristicCache;
      //});
}

// Enable the characteristic changes notification
function startNotifications(characteristic) {
  console.log('Starting notifications...');

  return characteristic.startNotifications().
      then(() => {
        console.log('Notifications started');

        characteristic.addEventListener('characteristicvaluechanged',
            handleCharacteristicValueChanged);

      });
}


// Output to terminal
//function log(data, type = '') {
//    terminalContainer.insertAdjacentHTML('beforeend',
//        '<div' + (type ? ' class="' + type + '"' : '') + '>' + data + '</div>');
//  }


// Disconnect from the connected device
export function disconnect() {
  if (deviceCache) {
    console.log('Disconnecting from "' + deviceCache.name + '" bluetooth device...');
    deviceCache.removeEventListener('gattserverdisconnected',
        handleDisconnection);

    if (deviceCache.gatt.connected) {
      deviceCache.gatt.disconnect();
      console.log('"' + deviceCache.name + '" bluetooth device disconnected');
    }
    else {
      console.log('"' + deviceCache.name +
          '" bluetooth device is already disconnected');
    }
    
  }

   // Added condition
   if (characteristicCache) {
    characteristicCache.removeEventListener('characteristicvaluechanged',
        handleCharacteristicValueChanged);
    characteristicCache = null;
  }

  connectionStatus = 0;
  //connectButton.textContent = 'Connect';

  deviceCache = null;
  
}

// Data receiving
function handleCharacteristicValueChanged(event) {
  let value = new TextDecoder().decode(event.target.value);
  console.log(value, 'in');
}

/*function send(data) {

  if (!data || !characteristicCache) {
    return;
  }

  writeToCharacteristic(characteristicCache, data);
  log(data, 'out');
}*/

function lock(data) {

  if(lockState == 0){
    characteristicCache2.writeValue(Uint8Array.of(1));
    lockState = 1;
    lockButton.textContent = 'Lock';
  }
  else{
    characteristicCache2.writeValue(Uint8Array.of(0));
    lockState = 0;
    lockButton.textContent = 'Unlock';
  }
}

function writeToCharacteristic(characteristic, data) {
  //characteristic.writeValue(new TextEncoder().encode(data));
  characteristic.writeValue(Uint8Array.of(data));
}

