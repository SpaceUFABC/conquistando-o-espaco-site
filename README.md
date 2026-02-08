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
npm install
npm run dev --host
```

