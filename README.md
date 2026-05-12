# KKK (Kapuso, Kapamilya, Kapatid)

## Project Setup
Clone the repo

```bash
git clone git@github.com:Melonz-IT-Solutions/KKK.git
```
or via HTTPS
```bash
git clone https://github.com/Melonz-IT-Solutions/KKK.git
```

Once cloned install the node modules

```bash
npm install
```
Create local dot env (mac users)
```bash
cp .env.example .env
```
For non-mac users just simply create .env file in the root folder and 
ask for DATABASE_URL on other devs

If you want to use local DB set this on your .env file
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kkk_db"
```

Then run it locally via docker
```bash
make build
```
By default it will run in port 3000.
Simply open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure (WIP)
