Ionic App for Serving files through CMS Server.

The CMS server runs on http://localhost:3000

To start this application:
    1. Go to demoCMSProject > server-admin 
    2. Give 'gulp' as command over there, this will start the CMS server.
    3. Open this app's directory and give 'ionic serve' command.

There are 3 items declared as constants in this project
    1. Timer-value
       This value is assigned to the modals. When there is no touch-activity on the modal the modal is closed based on the timer-value.
    2. Server URL
       This is the url from where is content is fetched.
    3. DemoID
       This is the Id of the demo for which the content is to be fetched.

If there are any changes to be made, it can be made in the following file:
    www > js > app.constant.js