# React-Redux-Flask-Web-Crawler #

Based on [React-Redux-Flask by dternyak](https://github.com/dternyak/React-Redux-Flask)

* Python 3
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


### Create environment
```
virtualenv .env -p python3
source .env/bin/activate
```

### Install Back-End Requirements 
```
$ sudo pip install -r requirements.txt
```


### Create DB
```
$ export DATABASE_URL="sqlite:///your.db"
```

Select a db file path, preferably in the project folder. For example, I use: 
```
$ export DATABASE_URL=sqlite:////Users/khenp/React-Redux-Flask-Web-Crawler/crawl.db
```

```
$ python manage.py create_db
```

### Run Back-End

Let's allow multithreading, and run the flask server.

```
$ export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES
$ python manage.py runserver
```

If all goes well, you should see ```* Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)``` followed by a few more lines in the terminal.


### Open another terminal window, and install Front-End Requirements. This can take a minute as node installs a few modules.
```
$ cd static
$ npm install
```


### Run Front-End

```
$ npm start
```


Open your browser to http://localhost:3000/home 


### Run a crawler

Use the 'hamburger' menu on the top left side to start a new crawler.
Input a url (including scheme) such as www.example.com



![ScreenShot](https://raw.github.com/kdog1425/React-Redux-Flask-Web-Crawler/master/web-crawler-screenshot.png)

