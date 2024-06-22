#include <WiFiManager.h> // https://github.com/tzapu/WiFiManager
#include <WebSocketClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>

char path[] = "/";
char host[] = " 192.168.1.25"; // change ip to the server ////
const int inputPin = 15; // push button

int temp;// to record push button state

WebSocketClient webSocketClient;
WiFiClient client;




void setup() {
    // WiFi.mode(WIFI_STA); // explicitly set mode, esp defaults to STA+AP
    // it is a good practice to make sure your code sets wifi mode how you want it.

    // put your setup code here, to run once:
    Serial.begin(115200);
    wifiSetup();
    pinMode(inputPin, INPUT);
   }

void loop() {
 wifiLoop();
}

void wifiSetup(){ //WiFiManager, Local intialization. Once its business is done, there is no need to keep it around
    WiFiManager wm;
  // reset settings - wipe stored credentials for testing
    // these are stored by the esp library
   //wm.resetSettings();

    // Automatically connect using saved credentials,
    // if connection fails, it starts an access point with the specified name ( "AutoConnectAP"),
    // if empty will auto generate SSID, if password is blank it will be anonymous AP (wm.autoConnect())
    // then goes into a blocking loop awaiting configuration and will return success result

    bool res;
    // res = wm.autoConnect(); // auto generated AP name from chipid
    // res = wm.autoConnect("AutoConnectAP"); // anonymous ap
    res = wm.autoConnect("AutoConnectAPIsuranga","password"); // password protected ap

    if(!res) {
        Serial.println("Failed to connect");
        // ESP.restart();
    } 
    else {
        //if you get here you have connected to the WiFi    
        Serial.println("connected...yeey :)"); // display the ssid and connected status
    }



  // Connect to the websocket server
  if (client.connect("192.168.1.25", 443)) {  // change ip to the server
    Serial.println("Connected");
  } else {
    Serial.println("Connection failed.");
    while(1) {
      // Hang on failure
    }
  }

  // Handshake with the server
  webSocketClient.path = path;
  webSocketClient.host = host;
  if (webSocketClient.handshake(client)) {
    Serial.println("Handshake successful");
  } else {
    Serial.println("Handshake failed.");
    while(1) {
      // Hang on failure
    }  
  }
}
void wifiLoop(){

 String data;

  if (client.connected()) {
    
    webSocketClient.getData(data);
    if (data.length() > 0) {
      Serial.print("Received data to Isuranga: ");
      Serial.println(data);
    }
   
    StaticJsonDocument<200> doc1;
    doc1["consoleidin"] = 500;
    doc1["department"] = 14;
    doc1["call1"] = "";
    doc1["call2"] = "";
    doc1["call3"] = "White";
    doc1["oldcall"] = "";

    StaticJsonDocument<200> doc2;
    doc2["stat1"] = "55";
    doc2["stat2"] = "14";
    doc2["stat3"] = "434";

    int inputValue = digitalRead(inputPin); // read the pushbutton state

    // Send the JSON object
    //if (inputValue!=temp){

    Serial.print("Digital Read from Pin 15: ");
   if (inputValue==1) {
      doc1["consoleidin"] = 502;
      doc2["stat1"] = "70";
      Serial.print("Digital Read from Pin 15: ");
      Serial.println(inputValue);
  } else {
      doc1["consoleidin"] = 100;
      doc2["stat1"] = "4550";
      Serial.print("Digital Read from Pin 15: ");
      Serial.println(inputValue);
  } 
      // Serialize JSON to string
    String jsonString1;
    serializeJson(doc1, jsonString1);
    webSocketClient.sendData(jsonString1);
    
    
    //String jsonString2;
   // serializeJson(doc2, jsonString2);
    //webSocketClient.sendData(jsonString2);

    Serial.print("sent data to backend: ");
    

  } else {
    Serial.println("Client disconnected.");
    while (1) {
      // Hang on disconnect.
    }
  }
  
  // wait to fully let the client disconnect
  delay(3000);



}
