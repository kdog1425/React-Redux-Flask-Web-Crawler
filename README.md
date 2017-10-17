# React-Redux-Flask-Web-Crawler #

Based on [React-Redux-Flask by dternyak](https://github.com/dternyak/React-Redux-Flask)

* Python 2.7
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


### Install Back-End Requirements 
```
$ sudo pip install -r requirements.txt
```


### Create DB
```
$ export DATABASE_URL="sqlite:///your.db"
```

For example, I use: 
```
$ export DATABASE_URL=sqlite:////Users/khenp/React-Redux-Flask-Web-Crawler/crawl.db
```

```
$ python manage.py create_db
```

### Run Back-End

```
$ python manage.py runserver
```

If all goes well, you should see ```* Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)``` followed by a few more lines in the terminal.


### Open another terminal window, and install Front-End Requirements
```
$ cd static
$ npm install
```


### Run Front-End

```
$ cd static
$ npm start
```


Open your browser to http://localhost:3000/home 




![ScreenShot](https://raw.github.com/kdog1425/React-Redux-Flask-Web-Crawler/master/web-crawler-screenshot.png)

