require('dotenv').config();

module.exports = function(labelName, userHost) {
    // manifest for Ingress object
    var manifestIngress = {
        apiVersion: "extensions/v1beta1",
        kind: "Ingress",
        metadata: {
            name: `${labelName}-ingress`,
            annotations: {
                "kubernetes.io/ingress.class": "traefik",
                "traefik.frontend.entryPoints": "https"
            }
        },
        spec: {
            tls: [{
                secretName: process.env.ING_CERT_NAME
            }],
            rules: [{
                host: `${userHost}`,
                http: {
                    paths: [{
                        path: "/",
                        backend: {
                            serviceName: `${labelName}-service`,
                            servicePort: process.env.ING_PORT
                        }
                    }]
                }
            }]
        }
    }
    return manifestIngress
}
