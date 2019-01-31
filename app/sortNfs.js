module.exports = function(homeDir) {
    // sorts nfs mapping for each user
    var contains = require("string-contains");
    var replace = require("str-replace");

    require('dotenv').config();

    if(homeDir.includes(process.env.UGRAD) === true ) {
        mountServer = process.env.UGRAD_NFS;
        mountSource = replace(process.env.UGRAD_STR).from(homeDir).with(process.env.UGRAD_RPL);
    }
    if(homeDir.includes(process.env.STAFF) === true ) {
        mountServer = '';
        mountSource = '';
    }
    if(homeDir.includes(process.env.GRAD) === true ) {
        mountServer = process.env.GRAD_NFS;
        mountSource = replace(process.env.GRAD_STR).from(homeDir).with(process.env.GRAD_RPL);
    }
    if(homeDir.includes(process.env.FAC) === true ) {
        mountServer = process.env.FAC_NFS;
        mountSource = replace(process.env.FAC_STR).from(homeDir).with(process.env.FAC_RPL);
    }
    if(homeDir == '') {
        mountServer = '';
        mountSource = '';
    }

    return [mountServer, mountSource];
}
