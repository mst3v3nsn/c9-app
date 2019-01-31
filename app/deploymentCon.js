require('dotenv').config();

module.exports = function (labelName, uidNum, gidNum, homeName, mntPath, mountServer, mountSource) {
    if(mountSource != '') {
        // manifest for ReplicationController object for homeDir nfs export
        var manifestDeployment = {
            kind: "Deployment",
            metadata: {
                name: `${labelName}`
            },
            spec: {
                replicas: 1,
                selector: {
                    matchLabels: {
                        app: `${labelName}`
                    }
                },
                template: {
                    metadata: {
                        labels: {
                            app: `${labelName}`
                        }
                    },
                    spec: {
                        securityContext: {
                            runAsUser: uidNum,
                            runAsGroup: gidNum,
                            supplementalGroups: [gidNum],
                            fsGroup: gidNum
                        },
                        containers: [{
                            name: `${labelName}`,
                            image: process.env.CONT_IMG,
                            ports: [{
                                containerPort: process.env.CONT_PORT,
                                protocol: "TCP"
                            }],
                            volumeMounts: [{
                                name: `${homeName}`,
                                mountPath: `${mntPath}`,
                            }],
                            imagePullPolicy: "IfNotPresent",
                            resources: {
                                limits: {
                                    memory: "1Gi"
                                },
                                requests: {
                                    memory: "512Mi"
                                }
                            },
                            securityContext: {
                                capabilities: {/*
                                drop: [
                                    "all"
                                ],*/
                                add: [ "NET_BIND_SERVICE" ]
                                },
                                runAsNonRoot: true
                            }
                        }],
                        restartPolicy: "Always",
                        volumes: [{
                            name: `${homeName}`,
                            nfs: {
                                server: `${mountServer}`,
                                path: `${mountSource}`
                            }
                        }]
                    }
                }
            }
        }
    }
    else {
        // manifest for ReplicationController object for no homeDir nfs export
        var manifestDeployment = {
            kind: "Deployment",
            metadata: {
                name: `${labelName}`
            },
            spec: {
                replicas: 1,
                selector: {
                    matchLabels: {
                        app: `${labelName}`
                    }
                },
                template: {
                    metadata: {
                        labels: {
                            app: `${labelName}`
                        }
                    },
                    spec: {
                        securityContext: {
                            runAsUser: uidNum,
                            runAsGroup: gidNum,
                            supplementalGroups: [gidNum],
                            fsGroup: gidNum
                        },
                        containers: [{
                            name: `${labelName}`,
                            image: process.env.CONT_IMG,
                            ports: [{
                                containerPort: process.env.CONT_PORT,
                                protocol: "TCP"
                            }],
                            imagePullPolicy: "IfNotPresent",
                            resources: {
                                limits: {
                                    memory: "1Gi"
                                },
                                requests: {
                                    memory: "512Mi"
                                }
                            },
                            securityContext: {
                                capabilities: {/*
                                    drop: [
                                        "all"
                                    ],*/
                                    add: [ "NET_BIND_SERVICE" ]
                                },
                                runAsNonRoot: true
                            }
                        }],
                        restartPolicy: "Always"
                    }
                }
            }
        }
    }
    return manifestDeployment;
}
