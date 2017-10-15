# React-Redux-Flask-Web-Crawler #

Based on React-Redux-Flask by 

* Python 2.7+ or 3.x
* Pytest
* Heroku
* Flask
* React
* Redux
* React-Router 2.0
* React-Router-Redux
* Babel 6
* SCSS processing
* Webpack


### Create DB

$ export DATABASE_URL="sqlite:///your.db"
```
(More about connection strings in this [flask config guide](http://flask-sqlalchemy.pocoo.org/2.1/config/).)
```
$ python manage.py create_db
```


### Install Front-End Requirements
```sh
$ cd static
$ npm install
```

### Run Back-End

```sh
$ python manage.py runserver
```

### Test Back-End

```sh
$ python test.py --cov-report=term --cov-report=html --cov=application/ tests/
```

### Build Front-End

```sh
$ npm run build:production
```


### Run Front-End

```sh
$ cd static
$ npm start
```


```
$ sudo pip install flask flask_script flask_migrate flask_bcrypt 
```
4. Run Back-End

```
$ python manage.py runserver
```

If all goes well, you should see ```* Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)``` followed by a few more lines in the terminal.

5. open a new tab to the same directory and run the front end

```
$ cd static
$ npm install
$ npm start
```

6. open your browser to http://localhost:3000/home 




