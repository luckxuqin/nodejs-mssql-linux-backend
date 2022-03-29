var express = require("express")
var app = express()
//var db = require("./database.js")
var md5 = require("md5")
var writeFile = require("write-file")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/api/users", (req, res, next) => {
    var sql = "select * from user"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});


app.get("/api/user/:id", (req, res, next) => {
    var sql = "select * from user where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

app.post("/api/saveconfig", (req, res, next) => {
    //console.log("-------")
    //console.log(req.body)
    
    var tfvars = "vcenter_server = \"" + req.body.vcenterIp + "\"\n" +
        "vcenter_user = \"" + req.body.vcenterUsername + "\"\n" +
        "vcenter_password = \"" + req.body.vcenterPwd + "\"\n" +
        "vcenter_insecure_ssl = " + req.body.insecureSSL + "\n" +
        "vsphere_datacenter = \"" + req.body.dcenterName + "\"\n" +
        "vsphere_compute_cluster = \"" + req.body.clusterName + "\"\n" +
        "vsphere_folder_vm = \"" + req.body.fdName + "\"\n" +
        "vsphere_resource_pool = \"" + req.body.rpName + "\"\n" +
        "vsphere_distributed_switch = \"" + req.body.dswitchName + "\"\n" +
        "vsphere_network_1_portgroup = \"" + req.body.portGroupName + "\"\n" +
        "vsphere_network_1_ipv4_subnet_cidr = \"" + req.body.subnetCIDR + "\"\n" +
        "vsphere_network_1_ipv4_ips = [" + req.body.subnetIps.split(/[ ,]+/).map(s => `"${s}"`).join(',') + "]\n" +
        "vsphere_network_1_ipv4_gateway = \"" + req.body.subnetGateway + "\"\n" +
        "vsphere_datastore = \"" + req.body.dstoreName + "\"\n" +
        "network_domain_name = \"" + req.body.domainName + "\"\n" +
        "network_dns_suffix = [" + req.body.dnsSuffix.split(/[ ,]+/).map(s => `"${s}"`).join(',') + "]\n" +
        "network_ipv4_dns_servers = [" + req.body.dnsName.split(/[ ,]+/).map(s => `"${s}"`).join(',') + "]\n" +
        "vm_mssql_prefix = \"" + req.body.sqlVMPrefix + "\"\n" +
        "vm_mssql_count = " + req.body.sqlVMCount + "\n" +
        "vm_mssql = { \n" +
        "    cpu = " + req.body.sqlVMCPU + "\n" +
        "    memory_gb = " + req.body.sqlVMMemory + "\n" +
        "    os_disk_gb = " + req.body.sqlVMOSDisk + "\n" +
        "    data_disk_gb = " + req.body.sqlVMDataDisk + "\n" +
        "    log_disk_gb = " + req.body.sqlVMLogDisk + "\n" +
        "}"

    var sqlvars = 
        "all:\n" +
        "  vars:\n" + 
        "    mssql_pid: '" + req.body.sqlPID + "'\n" +
        "    mssql_accept_eula: " + req.body.mssqlAcceptEULA + "\n" +
        "    mssql_pcs_cluster_vip_cidr: \'" + req.body.pcsVIPCIDR + "\'\n" +
        "    system_upgrade_all_packages: " + req.body.upgradeAllPkg + "\n" +
        "    system_hosts_file_create: " + req.body.hostsFileCreate + "\n" +
        "    system_hosts_file_disable_entries: [" + req.body.hostsFileDisableEntries.split(/[ ,]+/).map(s => `'${s}'`).join(',') + "]\n" +
        "    system_firewall_disable: " + req.body.firewallDisable + "\n" +
        "    system_selinux_disable: " + req.body.selinuxDisable + "\n" +
        "    system_extend_os_lvm: " + req.body.extendOsLvm + "\n" +
        "    system_mount_data_disks: " + req.body.mountDatadisk + "\n" +
        "    system_mount_data_disks_filesystem: " + req.body.dataDiskFilesystem + "\n" +
        "    system_mount_data_disk_mount_paths: [" + req.body.dataDiskMountPath.split(/[ ,]+/).map(s => `'${s}'`).join(',') + "]\n" +
        "    system_create_account: " + req.body.systemCreateAccount + "\n" +   
        "    system_create_account_username: " + req.body.systemCreateAccountUsername + "\n" +
        "    system_create_account_password: " + req.body.systemCreateAccountPassword + "\n" +    
        "    system_create_account_key_file: " + req.body.systemCreateAccountKeyFile + "\n" +
        "    mssql_sa_password: " + req.body.mssqlSaPassword + "\n" +    
        "    mssql_install_user_username: " + req.body.mssqlInstallUsername + "\n" +
        "    mssql_install_user_password: " + req.body.mssqlInstallPassword + "\n" +    
        "    mssql_hacluster_password: " + req.body.mssqlHaclusterPassword + "\n" +
        "    mssql_pacemaker_username: " + req.body.mssqlPacemakerUsername + "\n" +    
        "    mssql_pacemaker_password: " + req.body.mssqlPacemakerPassword + "\n" +
        "    mssql_install_agent: " + req.body.mssqlInstallAgent + "\n" +
        "    mssql_install_ha: " + req.body.mssqlInstallHA + "\n" +    
        "    mssql_install_fulltext: " + req.body.mssqlInstallFullText + "\n" +
        "    mssql_install_intg_svc: " + req.body.mssqlInstallIvtgSvc + "\n" +    
        "    mssql_port: " + req.body.mssqlPort + "\n" +
        "    mssql_trace_flags: [" + req.body.mssqlTraceFlags.split(/[ ,]+/).map(s => `'${s}'`).join(',') + "]\n" +       
        "    mssql_telemetry_customer_feedback: " + req.body.mssqlCustomerFeedback + "\n" +
        "    mssql_install_agent_enable: " + req.body.mssqlAgent + "\n" +    
        "    mssql_agent_logging_level: " + req.body.mssqlAgentLoggingLevel + "\n" +
        "    mssql_coredump_type: " + req.body.mssqlCoreDumpType + "\n" +    
        "    mssql_directory_data: " + req.body.mssqlDataDir + "\n" +
        "    mssql_directory_log: " + req.body.mssqlLogDir + "\n" +
        "    mssql_directory_backup: " + req.body.mssqlBackupDir + "\n" +    
        "    mssql_directory_dump: " + req.body.mssqlDumpDir + "\n" +
        "    mssql_directory_audit: " + req.body.mssqlAuditDir + "\n" +    
        "    mssql_directory_errorlogs: " + req.body.mssqlErrorLogDir + "\n" +
        "    mssql_directory_cert: " + req.body.mssqlCertDir + "\n" +
        "    mssql_error_log_filename: " + req.body.mssqlErrorLogFilename + "\n" +    
        "    mssql_install_agent_error_log_file: " + req.body.mssqlAgentErrorDir + "\n"

    const errors = [];
    let onflightCalls = 2;
    const responseFunc = function() {
        if (!onflightCalls) {
            if (errors.length) {
                res.status(400).json(errors);
            } else {
                res.status(200).json({status: "success"});
            }
        }
    };
    
    writeFile('/opt/automation/automation-mssql-linux/config/terraform-mssql.tfvars', tfvars, function (err) {
    //writeFile('terraform-mssql.tfvars', tfvars, function (err) {
        onflightCalls--;
        if (err) errors.push(err);
        responseFunc();
    })

    writeFile('/opt/automation/automation-mssql-linux/config/settings-mssql.yml', sqlvars, function (err) {
    //writeFile('settings-mssql.yml', sqlvars, function (err) {
        onflightCalls--;
        if (err) errors.push(err);
        responseFunc();
    })
})

app.get("/api/validateconfig", (req, res, next) => {
    console.log("valiate config file");

    var { exec } = require('child_process');
    
    exec('./validate.sh', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error}`);
            res.status(200).json({"error": error.message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')});
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            res.status(200).json({"stderr": stderr.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')});
            return;
        }
        console.log(`stdout: ${stdout}`);
        res.status(200).json({"stdout": stdout.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')});
    });
})

app.get("/api/startdeployment", (req, res, next) => {
    console.log("Start Deployment");

    var { exec } = require('child_process');
    
    exec('./deploy.sh', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error}`);
            res.status(200).json({"error": stdout.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')});
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            res.status(200).json({"stderr": stdout.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')});
            return;
        }
        console.log(`stdout: ${stdout}`);
        res.status(200).json({"stdout": stdout.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')});
    });
})

app.get("/api/destroyvms", (req, res, next) => {
    console.log("Destroying VMs");

    var { exec } = require('child_process');
    
    exec('./destroy.sh', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error}`);
            res.status(200).json({"error": error.message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')});
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            res.status(200).json({"stderr": stderr.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')});
            return;
        }
        console.log(`stdout: ${stdout}`);
        res.status(200).json({"stdout": stdout.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')});
    });
})

app.post("/api/user/", (req, res, next) => {
    var errors=[]
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        name: req.body.name,
        email: req.body.email,
        password : md5(req.body.password)
    }
    var sql ='INSERT INTO user (name, email, password) VALUES (?,?,?)'
    var params =[data.name, data.email, data.password]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})



app.patch("/api/user/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
        email: req.body.email,
        password : req.body.password ? md5(req.body.password) : undefined
    }
    db.run(
        `UPDATE user set 
           name = coalesce(?,name), 
           email = COALESCE(?,email), 
           password = coalesce(?,password) 
           WHERE id = ?`,
        [data.name, data.email, data.password, req.params.id],
        (err, result) => {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data
            })
    });
})


app.delete("/api/user/:id", (req, res, next) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", rows: this.changes})
    });
})

app.use(express.static("automation-mssql-linux"));
// Root path
app.get(["/"], (req, res, next) => {
    res.sendFile(__dirname + '/automation-mssql-linux/index.html');
});


