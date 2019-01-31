require('dotenv').config();

exports.dockerexec = function(request) {
    console.log(request.user.user);

    var User = require('./models/user.js');

    // Object Controllers
    var createService = require('./serviceCon.js');
    var createIngress = require('./ingressCon');
    var createDeployment = require('./deploymentCon.js');
    var createNfsMount = require('./sortNfs.js');

    // Kubernetes controllers
    const Client = require('kubernetes-client').Client
    const config = require('kubernetes-client').config;

    // User mapping
    var labelName = request.user.user.username.replace(/_/g, '-')+'-c9';
    var userHost = labelName + process.env.ROOT_DOMAIN;
    var homeName = request.user.user.username + '-home';
    var mntPath  = '/workspace/'+request.user.user.username;
    var nfsObject = createNfsMount(request.user.user.homeDir); // Returns server and path

    // Build template JSON Objects
    var c9uid = parseInt(request.user.user.uidNum, 10);
    var c9gid = parseInt(request.user.user.gidNum, 10);
    var deploymentJson = createDeployment(labelName, c9uid, c9gid, homeName, mntPath, nfsObject[0], nfsObject[1])
    var ingressJson = createIngress(labelName, userHost);
    var serviceJson = createService(labelName);

    // Post Deploy Objects to Kubernetes API
    async function deploy() {
        try {
            const k8s = new Client({ config: config.fromKubeconfig(), version: process.env.KUBE_VER });

            const createIngress = await k8s.apis.extensions.v1beta1.ns(process.env.KUBE_NS).ing.post({ body: ingressJson });
            console.log('Create Ingress: ', createIngress);

            const createService = await k8s.api.v1.ns(process.env.KUBE_NS).svc.post({ body: serviceJson });
            console.log('Create Service: ', createService);

            const createDeployment = await k8s.apis.apps.v1beta1.namespaces(process.env.KUBE_NS).deploy.post({ body: deploymentJson });
            console.log('Create Deployment: ', createDeployment);

            // get pod associated with Deployment
            const manifest = await k8s.apis.apps.v1beta1.ns(process.env.KUBE_NS).deploy(labelName).get();
            const matchLabels = manifest.body.spec.selector.matchLabels;
            const matchQuery = Object.keys(matchLabels)
                .map(label => `${ label }=${ matchLabels[label] }`)
                .join(',');
            const pods = await k8s.api.v1.ns(process.env.KUBE_NS).po.get({ qs: { labelSelector: matchQuery }});
            const podName = pods.body.items.map(podManifest => podManifest.metadata.name);

            console.log(podName[0]);
            User.findOneAndUpdate({ 'user.username': request.user.user.username }, {$set: { 'user.pod': podName[0] }}, function(err) {});
            console.log(request.user.user.pod);
        }
        catch(err) {
            console.error('Error: ', err);
        }
    }
    deploy();
}
