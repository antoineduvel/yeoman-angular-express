yeoman-angular-express
======================

angular express sandbox generated with yeoman (express-angular generator)

# Client side :
launch grunt services (see Gruntfile.js for more details) : grunt server
- Compass/Coffee/... watch
- Karma test
- Livereload
- ...


# Server side :
launch jasmine tests (/spec) : jasmine-node test/spec

# Mongo DB :
install mongodb with brew :
- brew update
- brew install mongodb

start mongodb : ./mongod

stop mongod : use console admin : mongo
- use admin
- db.shutdownServer()

admin collections : use console admin : mongo
- show collections
- db.sites.find()
- db.sites.remove({"lien" : "leLienASupprimer"})
- db.sites.drop()

# Heroku - using an external mongolab account
Here are some usefull commands :
- heroku login
- heroku create
- heroku keys:clear
- ssh-keygen -t rsa
- heroku keys:add "id_rsa.pub"
- heroku config:set NODE_ENV=development DB_URL=\<mongolab_url:mongolab_port\> DB_USER=\<mongolab_user\> DB_PASSWD=\<mongolab_passwd\>
- git push heroku master
- heroku help logs --tail

