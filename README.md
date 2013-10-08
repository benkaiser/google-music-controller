Google Music Controller
=======================

This is the open source code for a google play music administration server (for controlling of music from other devices and through a generic api).

* Step 1 - Run the server with `node server.js`.
* Step 2 - Install the chrome plugin.
* Step 3 - Reload google play music in chrome and point it to the server.
* Step 4 - Control your music from your couch, or anywhere!

This can be setup on a local network for when the two devices are on the same network. Or run from a web-server to control your music remotely.

How to Control
--------------

(the following examples are run on a localhost server port 3000, i.e http://localhost:3000/)

Option 1 - through a web interface

```
http://localhost:3000/yourgmail@gmail.com/controls
```

Option 2 - by hitting url's

```
http://localhost:3000/yourgmail@gmail.com/<command>
```
where <command> is either 'prev', 'play' or 'next'. (currently only supporting play/pause under the one button);