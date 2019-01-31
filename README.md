# C9-App

Application to authenticate users against Active Directory and create a cloud9 container for them while mounting a user's home directory and handling user mapping to retain user permission outside the container for NFS shares.

## Installation

Clone this repository.

```
git clone https://github.com/mst3v3nsn/c9-app.git
cd c9-app
```
Edit files in manifests/ specific to your environment. I used mine with Gitlab-CI which is why most of the YAML files are templated.
## Usage

```
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
