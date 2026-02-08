## How to Run

### Linux/Unix Systems

To run this repository in linux machines just perform the following commands:
```
git clone https://github.com/SpaceUFABC/conquistando-o-espaco-site.git
cd conquistando-o-espaco-site
npm install
sudo apt update
sudo apt install openssl
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
npm run dev --host
```

In case `npm run dev --host` returns something like `Error: Cannot find module @rollup/rollup-linux-x64-gnu`, run the following command:

```
rm -r node_modules
rm -r package-lock.json
npm install
```

This is a bug from npm and the commands above remove the corrupted modules and reinstalls them.

