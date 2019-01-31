require('dotenv').config();

module.exports = function(labelName) {
    // manifest for Service object
    var manifestService = {
        apiVersion: "v1",
        kind: "Service",
        metadata: {
            name: `${labelName}-service`, // deployments with the same label as service breaks pods in kubernetes for some reason
            labels: {
                app: `${labelName}-service` //deployments with the same label as service breaks pods in kubernetes for some reason
            }
        },
        spec: {
            type: "ClusterIP",
            ports: [{
                port: process.env.SVC_PORT,
                name: "http"
            }],
            selector: {
                app: `${labelName}`
            }
        }
    }
    return manifestService
}
