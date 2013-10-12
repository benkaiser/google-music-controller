Google Music Controller
=======================

This is the open source code for a google play music administration server (for controlling of music from other devices and through a generic api).

* Step 1 - Clone this repository and navigate to the cloned directory with a terminal. Type `npm install` to install the needed dependencies.
* Step 2 - Run the server with `node server.js`.
* Step 3 - Install the chrome plugin (by typing `chrome://extensions` in the chrome url bar and selecting 'Load unpacked extension...' and then the chrome-app folder in this repo.
* Step 4 - Reload google play music in chrome, it will then give you a localhost control url. To access this url form your internal network just replace localhost with the internal ip address of the computer with the player running.
* Step 5 - Control your music from your couch, bed, or anywhere!

This can be setup on a local network for when the two devices are on the same network. Or run from a web-server to control your music remotely. If setting up on something other than localhost, you will need to change the code in the chrome-app to point to your server.

How to Control
--------------

(the following examples are run on a localhost server port 3001 using ssl, i.e http://localhost:3001/)

Option 1 - through a web interface

```
http://localhost:3001/yourgmail@gmail.com/controls
```

Option 2 - by hitting url's

```
http://localhost:3001/yourgmail@gmail.com/<command>
```
where `<command>` is either 'prev', 'play' or 'next'. (currently only supporting play/pause under the one button);
