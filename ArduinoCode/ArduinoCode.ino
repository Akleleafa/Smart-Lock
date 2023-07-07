#include <ArduinoBLE.h>
#include <Stepper.h>

const int steps = 510;  // our motor has 2038 steps per revolution, so a 90 degrees turn roughly equals 510 steps

const int buzzer = 7; // buzzer on pin 7

const int led = 6; // LED on pin 6

int f = 0;

// initialize the stepper library on pins 8 through 11(by default):
Stepper myStepper(steps, 8, 9, 10, 11);

BLEService lockService("180F");  // BLE LED Service

// BLE LED Switch Characteristic - custom 128-bit UUID, read and writable by central
BLEByteCharacteristic switchCharacteristic("2A57", BLERead | BLEWrite);
BLEByteCharacteristic lockDoor("2A58", BLERead | BLEWrite);

void setup() {
  //Serial.begin(9600);
  //while (1);

  // set the speed at 1 rotation per second:
  myStepper.setSpeed(60);

  // set buzzer's pin as output
  pinMode(buzzer, OUTPUT);

  // set LED's pin to output mode
  pinMode(LEDR, OUTPUT);
  pinMode(LEDG, OUTPUT);
  pinMode(LEDB, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(led, OUTPUT);

  digitalWrite(LED_BUILTIN, LOW);  // when the central disconnects, turn off the LED
  digitalWrite(LEDR, HIGH);        // will turn the LED off
  digitalWrite(LEDG, HIGH);        // will turn the LED off
  digitalWrite(LEDB, HIGH);        // will turn the LED off

  // begin initialization
  if (!BLE.begin()) {
    //Serial.println("starting Bluetooth® Low Energy failed!");

    while (1)
      ;
  }

  // set advertised local name and service UUID:
  BLE.setLocalName("Lokceriot");
  BLE.setAdvertisedService(lockService);

  // add the characteristic to the service
  lockService.addCharacteristic(switchCharacteristic);
  lockService.addCharacteristic(lockDoor);

  // add service
  BLE.addService(lockService);

  // set the initial value for the characteristic:
  switchCharacteristic.writeValue(0);
  lockDoor.writeValue(0);  //set for door locked initial

  // start advertising
  BLE.advertise();

  //Serial.println("BLE LED Peripheral");
}

void loop() {
  // listen for BLE peripherals to connect:
  BLEDevice central = BLE.central();
  // if a central is connected to peripheral:
  digitalWrite(LEDB, LOW);
  digitalWrite(led, HIGH);
  delay(1000);
  digitalWrite(LEDB, HIGH);
  digitalWrite(led, LOW);
  delay(1000);  // blinking blue while it searches for a bluetooth pair
  if (central) {
    //Serial.print("Connected to central: ");
    // print the central's MAC address:
    //Serial.println(central.address());
    digitalWrite(LED_BUILTIN, HIGH);  // turn on the LED to indicate the connection

    // while the central is still connected to peripheral:
    while (central.connected()) {

      digitalWrite(LEDB, HIGH);
      digitalWrite(led, LOW);
      if(f == 0){
      digitalWrite(LEDR, LOW);}  // static red to indicate connection only if the door is locked

      if (lockDoor.written()) {
        //Serial.println(lockDoor.value());
        switch (lockDoor.value()) {  // any value other than 0
          case 01:
            f = 0;
            //Serial.println("Door unlocked");
            digitalWrite(LEDR, LOW);  // will turn the LED on
            digitalWrite(LEDG, HIGH);  // will turn the LED off
            digitalWrite(LEDB, HIGH);  // will turn the LED off
            tone(buzzer, 1000); // 1KHz sound signaling the door unlocking
            digitalWrite(led, HIGH);
            myStepper.step(steps*4);     //unlocks the door
            myStepper.step(steps*4);
            noTone(buzzer);
            digitalWrite(led, LOW);
            delay(1000);       
            break;  
          default:
            f = 1;
            //Serial.println(F("Door locked"));
            digitalWrite(LEDR, HIGH);  // will turn the LED off
            digitalWrite(LEDG, LOW);   // will turn the LED on
            digitalWrite(LEDB, HIGH);  // will turn the LED off
            tone(buzzer, 1000); // 1KHz sound signaling the door locking
            digitalWrite(led, HIGH);
            myStepper.step(-steps*4);    //locks the door
            myStepper.step(-steps*4);
            noTone(buzzer);
            digitalWrite(led, LOW);
            delay(1000);  
            break;
        }
      }
    }

    // when the central disconnects, print it out:
    //Serial.print(F("Disconnected from central: "));
    //Serial.println(central.address());
    digitalWrite(LED_BUILTIN, LOW);  // when the central disconnects, turn off the LED
    digitalWrite(LEDR, HIGH);        // will turn the LED off
    digitalWrite(LEDG, HIGH);        // will turn the LED off
    digitalWrite(LEDB, HIGH);        // will turn the LED off
  }
}
