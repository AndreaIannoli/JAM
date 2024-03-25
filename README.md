# JAM
<p align="center">
  <img src="https://firebasestorage.googleapis.com/v0/b/andreaiannoli-82eeb.appspot.com/o/logohorizontal_2.webp?alt=media&token=026c9169-b0f9-4d81-b7a0-fc044e30020b" alt="The JAM logo" width=300 align="center"/>
</p>
A smart parking application leveraging the IoT protocol MQTT, specifically focusing on a spatially aware variant known as LA-MQTT. Throughout the development process, the protocol underwent numerous modifications to enhance its scalability by enabling multi-broker support. This project served as the focal point of my bachelor's thesis.
<p align="center">
<img src="https://andreaiannoli.com/static/media/jammockup2.10d709406763ea189986.png" alt="An application image"/>
</p>

## The Protocol (LA-MQTT)
The protocol used, as said before, is a variant of MQTT known as LA-MQTT that adds the location awareness to the MQTT protocol. Furthermore, I added to LA-MQTT the possibility to be used with multiple brokers that interchanges messagges between them without any loop, even if they are mesh linked.

These are some simple diagrams of an LA-MQTT Multibroker context:
#### Bridging brokers
<img 
src="https://firebasestorage.googleapis.com/v0/b/andreaiannoli-82eeb.appspot.com/o/bridging.png?alt=media&token=47c637a7-6c90-4817-a5e1-cf199167e315" alt="Bridging brokers"/>
#### Topics management
<img 
src="https://firebasestorage.googleapis.com/v0/b/andreaiannoli-82eeb.appspot.com/o/scenario3.png?alt=media&token=8f808ff0-453c-425a-bc1e-bc331bdf6240" alt="Topics management"/>

You can find my thesis on [AMS Laurea](https://amslaurea.unibo.it) for a detailed explanation on how the protocol works.

## An App overview
<p align="center">
  <img 
src="https://firebasestorage.googleapis.com/v0/b/andreaiannoli-82eeb.appspot.com/o/onboard1.png?alt=media&token=ccc50429-1420-42ce-9e01-b1424d479f5e" alt="Onboard 1" width=200/>
<img 
src="https://firebasestorage.googleapis.com/v0/b/andreaiannoli-82eeb.appspot.com/o/onboard2.png?alt=media&token=d55cf594-eb33-4de9-9487-6e2ae4e1ccb4" alt="Onboard 2" width=200/>
<img 
src="https://firebasestorage.googleapis.com/v0/b/andreaiannoli-82eeb.appspot.com/o/onboard3.png?alt=media&token=83d01a14-75fe-4c3d-9547-9c06899e7fe8" alt="Onboard 3" width=200/>
<br/>
  <img 
src="https://firebasestorage.googleapis.com/v0/b/andreaiannoli-82eeb.appspot.com/o/feed1.png?alt=media&token=31932dbf-4f1c-4cd3-8fce-3710a4e7484f" alt="Feed tab" width=200/>
<img 
src="https://firebasestorage.googleapis.com/v0/b/andreaiannoli-82eeb.appspot.com/o/home-2.png?alt=media&token=7e863eb9-4177-455b-9068-aaf1d3a897b0" alt="Home tab" width=200/>
<img 
src="https://firebasestorage.googleapis.com/v0/b/andreaiannoli-82eeb.appspot.com/o/favs.png?alt=media&token=cbf83819-e81e-4389-a3c2-af88bb441be4" alt="Favs tab" width=200/>
</p>


**Alert:** If you find any trace of an API key in the code it's disabled so please use yours.

