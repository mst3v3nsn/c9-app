const Client = require('kubernetes-client').Client
const config = require('kubernetes-client').config;

require('dotenv').config();

exports.stopCont = function (request) {

    var labelName = request.user.user.username.replace(/_/g, '-')+"-c9";
    var serviceLabel = labelName+"-service"; //deployments with the same label breaks pods in kubernetes for some reason
    var ingressLabel = labelName+"-ingress";

    async function cleanup() {
        try {
            const k8s = new Client({ config: config.fromKubeconfig(), version: process.env.KUBE_VER });

            // delete ingress
            const deleteIngress = await k8s.apis.extensions.v1beta1.namespaces(process.env.KUBE_NS).ing(ingressLabel).delete();
            console.log('Delete Ingress: ', deleteIngress);

            // delete service
            const deleteService = await k8s.api.v1.namespaces(process.env.KUBE_NS).svc(serviceLabel).delete();
            console.log('Delete Service: ', deleteService);

            // get pod associated with deployment
            const manifestPod = await k8s.apis.apps.v1beta1.namespaces(process.env.KUBE_NS).deployments(labelName).get();
            const matchLabelsPod = manifestPod.body.spec.selector.matchLabels;
            const matchQueryPod = Object.keys(matchLabelsPod)
                .map(label => `${ label }=${ matchLabelsPod[label] }`)
                .join(',');
            const pods = await k8s.api.v1.namespaces(process.env.KUBE_NS).pods.get({ qs: { labelSelector: matchQueryPod }});
            const podName = pods.body.items.map(podManifest => podManifest.metadata.name);

            //console.log('Found Pod:', podName[0]);

            //get replicaSet associated with deployment
            const manifestRs = await k8s.apis.apps.v1beta1.namespaces(process.env.KUBE_NS).deployments(labelName).get();
            const matchLabelsRs = manifestRs.body.spec.selector.matchLabels;
            const matchQueryRs = Object.keys(matchLabelsRs)
                .map(label => `${ label }=${ matchLabelsRs[label] }`)
                .join(',');
            const replicas = await k8s.apis.apps.v1beta2.namespaces(process.env.KUBE_NS).replicasets.get({ qs: { labelSelector: matchQueryRs }});
            const replicaName = replicas.body.items.map(rsManifest => rsManifest.metadata.name);

            //console.log('Found ReplicaSet:', replicaName[0]);

            // delete deployment
            const deleteDeployment = await k8s.apis.apps.v1beta1.namespaces(process.env.KUBE_NS).deployments(labelName).delete();
            console.log('Delete Deployment: ', deleteDeployment);

            //delete replicaSet
            const deleteRs = await k8s.apis.apps.v1beta2.namespaces(process.env.KUBE_NS).replicasets(replicaName[0]).delete()
            console.log('Delete ReplicaSet: ', deleteRs);

            //delete pod
            const deletePod = await k8s.api.v1.namespaces(process.env.KUBE_NS).pods(podName[0]).delete()
            console.log('Delete Pod: ', deletePod)
        }
        catch(err) {
            console.error('Error:', err);
        }
    }
    cleanup();
}
