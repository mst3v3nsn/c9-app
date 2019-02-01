# C9-App

Application to authenticate users against Active Directory and create a cloud9 container for them while mounting a user's home directory and handling user mapping to retain user permission outside the container for NFS shares.

## Technologies
Project is created with:
* NodeJS 10 Javascript Engine
* Express Framework
* Passport Middleware

|[![NodeJS](https://nodsjs.com/)](readme/nodejs.jpg) | [![Express](https://expressjs.com/)](readme/express.jpg) | [![Passport](readme/passport.jpg)](http://www.passportjs.org/) | [![Mongoose](readme/mongoose.jpg)](https://mongoosejs.com/) |

Main NPM Module that interacts with Kubernetes:

* kubernetes-client

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
