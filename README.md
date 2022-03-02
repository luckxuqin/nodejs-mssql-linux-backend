# node-express-rest-api-example

This is the web console implemented by Angular + Nodejs for Automation MSSQL Linux framework tool

Automation MSSQL Linux framework tool: https://github.com/cleeistaken/automation-mssql-linux

# Usage

CentOS 9

* Make sure node.js is installed - sudo yum install nodejs

* Open tcp port 8000 on the testbench guest vm

    [root@testbench ~]# firewall-cmd --zone=public --add-port=8000/tcp --permanent

    success

    [root@testbench ~]# firewall-cmd --reload

    success

* Download the code to /opt/automation folder and run the following code to start the web console
    [root@testbench nodejs-mssql-linux-backend]# node server.js

* Open browser and point to the following URL: `http://<testbench IP Address>:8000`
