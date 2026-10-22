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
Python manage.py runserver 8002
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
scp backend.zip leads:/home/newleadsprograme/
ssh leads "cd /home/newleadsprograme && unzip -o backend.zip && rm backend.zip"
ssh leads "source /home/newleadsprograme/virtualenv/backend/3.13/bin/activate && cd /home/newleadsprograme/backend && python manage.py migrate"
```

Frontend
```
cd $root/frontend
npm run build -- --mode prod
ssh leads "rm -rf ~/public_html/assets"
scp -r .\dist\* leads:/home/newleadsprograme/public_html/
scp .\dist\.htaccess leads:/home/newleadsprograme/public_html/
ssh leads "chmod -R 755 ~/public_html/assets && chmod 755 ~/public_html/v1"
```