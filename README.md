# C9-App

Application to authenticate users against Active Directory and create a cloud9 container for them while mounting a user's home directory and handling user mapping to retain user permission outside the container for NFS shares.

## Technologies
Project is created with:
* NodeJS: 8

NPM Modules:

* bcrypt-nodejs@0.0.3
* body-parser@1.18.2
* connect@3.6.6
* connect-flash@0.1.1
* connect-mongo@2.0.1
* cookie-parser@1.4.3
* ejs@2.5.7
* express@4.16.2
* express-session@1.15.6
* fs@0.0.1-security
* http@0.0.0
* joi@13.1.2
* kubernetes-client@4.0.0
* mongoose@5.0.7
* passport@0.4.0
* passport-ldapauth@2.0.0
* path@0.12.7
* socket.io@2.0.4
* str-replace@0.0.5
* string-contains@0.1.0
* sync@0.2.5

## Installation

Clone this repository.

```
git clone https://github.com/mst3v3nsn/c9-app.git
cd c9-app
```
Edit files in manifests/ specific to your environment. I used mine with Gitlab-CI which is why most of the YAML files are templated.

Make sure you are using [Traefik](https://docs.traefik.io/configuration/backends/kubernetes/) as your proxy service and have your certs saved as secrets within Kubernetes. I highly recommend Traefik.

## Usage

```
cd manifests
kubectl create -f c9-app.yaml
kubectl create -f c9-service.yaml
kubectl create -f c9-ingress.yaml
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
