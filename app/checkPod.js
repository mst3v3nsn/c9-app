'use strict';
require('dotenv').config();

exports.check = async function(request) {

    const Client = require('kubernetes-client').Client;
    const config = require('kubernetes-client').config;
    var labelName = request.user.user.username.replace(/_/g, '-')+'-c9';

    try {
        const k8s = new Client({config: config.fromKubeconfig(), version: process.env.KUBE_VER});

        // get pod associated with deployment
        const manifest = await k8s.apis.apps.v1beta1.namespaces(process.env.KUBE_NS).deployments(labelName).get();
        const matchLabels = manifest.body.spec.selector.matchLabels;
        const matchQuery = Object.keys(matchLabels)
            .map(label => `${ label }=${ matchLabels[label] }`)
            .join(',');
        const pods = await k8s.api.v1.namespaces(process.env.KUBE_NS).pods.get({qs: {labelSelector: matchQuery}});
        const podName = pods.body.items.map(podManifest => podManifest.metadata.name);
        const podStatus = pods.body.items.map(podStatus => podStatus.status.phase);

        console.log('Pod:', podName[0]);

        // check status of pod
        if (podStatus[0] === 'Running') {
            console.log('Status:', podStatus[0]);
            return true;
        }
        if (podStatus[0] === 'Pending') {
            console.log('Status:', podStatus[0]);
            return false;
        }
        else {
            console.log('Status:', podStatus[0]);
            return false;
        }
    }
    catch (err) {
        //console.error('Error:',  err);
        return false;
    }
}
