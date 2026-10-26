## Installation

```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## Run


```
$rootFile = ".hundi_root"
$dir = Get-Item (Get-Location)
while ($dir -and -not (Test-Path (Join-Path $dir.FullName $rootFile))) {
    $dir = $dir.Parent
}
if (-not $dir) {
    throw "Could not find $rootFile"
}
$root = $dir.FullName
```

Backend
```
$env:ENV = "dev"
cd $root/backend
venv\Scripts\activate
Python manage.py runserver 8004
```

frontend
```
cd $root/frontend
npm run dev -- --mode dev
```


---
migrate
```
$env:ENV = "dev"
cd $root/backend
venv\Scripts\activate
Python manage.py migrate
```
## Deploy

> [!NOTE]
> Backend Deployment works from last committed version


Backend
```
cd $root
git archive HEAD backend -o backend.zip
scp backend.zip hundi:/home/kanikkavanji/
ssh hundi "cd /home/kanikkavanji && unzip -o backend.zip && rm backend.zip"
ssh hundi "source /home/kanikkavanji/virtualenv/backend/3.13/bin/activate && cd /home/kanikkavanji/backend && python manage.py migrate"
```

Frontend
```
cd $root/frontend
npm run build -- --mode prod
ssh hundi "rm -rf ~/public_html/assets"
scp -r .\dist\* hundi:/home/kanikkavanji/public_html/
scp .\dist\.htaccess hundi:/home/kanikkavanji/public_html/
ssh hundi "chmod -R 755 ~/public_html/assets && chmod 755 ~/public_html/v1"
```