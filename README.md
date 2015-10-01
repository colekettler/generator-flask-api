# Flask REST API Generator

[![Build Status](https://secure.travis-ci.org/ColeKettler/generator-flask-api.png?branch=master)](https://travis-ci.org/ColeKettler/generator-flask-api) [![Coverage Status](https://coveralls.io/repos/ColeKettler/generator-flask-api/badge.svg?branch=master&service=github)](https://coveralls.io/github/ColeKettler/generator-flask-api?branch=master)

> [Yeoman](http://yeoman.io) generator for RESTful [Flask](http://flask.pocoo.org/) APIs, with the goodness of [Marshmallow](http://marshmallow.readthedocs.org) and [SQLAlchemy](http://www.sqlalchemy.org)!

## Contents

* [Getting Started](#getting-started)
* [Usage](#usage)
* [Generators](#generators)
* [Options](#options)
* [Notes](#notes)
* [Contributing](#contributing)
* [License](#license)

## Getting Started

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

![](http://i.imgur.com/JHaAlBJ.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```
npm install -g yo
```

### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a Backbone application or even a Chrome extension.

To install generator-flask-api from npm, run:

```
npm install -g generator-flask-api
```

Finally, initiate the generator:

```
yo flask-api
```

### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).

## Usage

Create and activate a Python virtual environment if you haven't already:

```
virtualenv venv
. venv/bin/activate
```

(Technically you don't **HAVE** to, but it's a super good idea.)

Make a new directory, and `cd` into it:

```
mkdir my-cool-api && cd $_
```

Run `yo flask-api` with your API's name:

```
yo flask-api my-cool-api
```

(It defaults to `app`, if you're feeling uncreative.)

Set some cool environment variables, like your config and database URI:

```
export MY_COOL_API_CONFIG=development
export MY_COOL_API_DEVELOPMENT_DATABASE_URI=postgres://localhost/mydb
```

(Prefixed with your app's name, for your convenience.)

If you're using SQLAlchemy, start up a Python shell and initialize your database:

```
echo 'db.create_all()' | ./manage.py shell
```

Start up Flask's local development server:

```
./manage.py runserver
```

Enjoy! But hurry up and add some tasty [resources](#resource) to consume:

```
yo flask-api:resource myresource
```

...and follow the instructions when it's done.

## Generators

Available generators:

* [flask-api](#app)
* [flask-api:resource](#resource)
* [flask-api:endpoint](#endpoint)
* [flask-api:model](#model)
* [flask-api:schema](#schema)
* [flask-api:version](#version)

### App

Your starting point. You can pass the application name as an argument, if you want to mix things up.

You'll make exciting choices, like your database flavor, versioning scheme, and URL structure. It'll even install your Python dependencies with Pip - swanky.

```
yo flask-api pretty-fly-for-an-api
```

### Resource

A handy way to create an associated [endpoint](#endpoint), [model](#model), and [schema](#schema) all at once.

```
yo flask-api:resource myresource
```

### Endpoint

Creates a URL endpoint, containing the routes for a resource. You get to specify what HTTP methods it supports. You should import it into your API blueprint.

```
yo flask-api:endpoint myendpoint
```

Endpoint URLs are automatically pluralized. Or close to it, at any rate. Sorry in advance, wild goose web services.

### Model

Creates a SQLAlchemy model, containing the data about a resource. You should import it into any associated endpoints or schemas.

```
yo flask-api:model mymodel
```

### Schema

Creates a Marshmallow serialization schema, containing validators and object structure for a model. You should import it into any associated endpoints.

```
yo flask-api:schema myschema
```

By default, the schema is generated directly from its corresponding SQLAlchemy model, via [marshmallow-sqlalchemy](http://marshmallow-sqlalchemy.readthedocs.org). You can also define it manually, if you want / need to.

### Version

Bumps your API's version, creating a new package and blueprint for it. If you're on a major versioning scheme, it'll bump your major version. If you're on a minor versioning scheme, you'll need to specify which version to bump. If you're not using a versioning scheme, you might be confused.

```
yo flask-api:version
```

## Options

* `--help` View documentation from the comfort of your terminal.
* `--skip-install` Skips installing dependencies via `pip` and creating requirements file.

## Notes

### Manager Script

[Flask-Script](https://flask-script.readthedocs.org/en/latest/) is used to create an executable Python script to handle common tasks. Out of the box, you can:

* Start up Flask's development server with `./manage.py runserver`.
* Start a Python shell with a predefined context with `./manage.py shell`. Your created `app` instance will be made available, along with your `db` instance if you're using SQLAlchemy (run `db.create_all()` to initialize your database).

Check out the docs for more info and how to add more commands.

### Python Support

The boilerplate is pretty simple, and all of the default dependencies support Python 2 and 3. It should Just Work™.

### MySQL Support

If you decide to go with MySQL, there's a few extra things you should keep in mind.

First off, the official [MySQL Connector/Python](http://dev.mysql.com/doc/connector-python/en/) driver is used. It's actively developed and maintained by Oracle. The commonly used [MySQLdb](https://github.com/farcepest/MySQLdb1) driver does not support Python 3 and does not appear to be actively maintained at this time. There's a fork of MySQLdb called [mysqlclient](https://github.com/PyMySQL/mysqlclient-python) that is actively maintained and supports Python 3; feel free to swap it in.

Second off, if you're using SQLAlchemy, you'll need to specify the driver in the connection string. The syntax is specified [here](http://docs.sqlalchemy.org/en/latest/dialects/mysql.html#module-sqlalchemy.dialects.mysql.mysqlconnector).

Finally, if you're working with MariaDB: the default driver *should* work, but there are no real guarantees against strangeness.

### Working With Another / No Database

I dunno, maybe you're using your own #BigData flavor-of-the-week database, or maybe you're just hardcoding some JSON. Either way, you can easily select `None / Other` as a database option, then import / install everything (or nothing) manually. However, if there's an option you really want supported out of the box, [bug me about it](https://github.com/ColeKettler/generator-flask-api/issues).

### Working With Another / No ORM

You don't **have** to use SQLAlchemy, or any ORM at all. Select `None / Other` as your ORM, and you're good to go. Models will still be generated, will inherit from `object` with an `id` field, and won't assume much else. I'm assuming you want to roll your own abstraction, so I'll do my best to keep out of your way. :P

### Reverting Versions

If you mess up and accidentally bump a version, don't worry, it's easy to fix:

* Delete the files that the `flask-api:version` subgenerator created.
* Open up `.yo-rc.json` at your project's root directory.
* Revert the value of `"currentVersion"` to the previous version and save. Be sure to keep the `v`!

Everything will be back to normal, no problem.

## Contributing

* `grunt` to test and lint, or run `grunt jshint` and `grunt test` (or `grunt test:<generator>`) separately.
* `grunt cover` to keep that sweet, sweet coverage up.
* `grunt watch` and `grunt watch:<generator>` is also available.

Open an issue or a PR, test your changes, squash your commits, and we'll talk it out. :)

## License

MIT © 2015 by Cole Kettler
