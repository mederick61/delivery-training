# Delivery Training

Training project to build API backend services

## Gitlab

First create a new git repository

Go to https://gitlab.com/dashboard/projects and clic on "New Project". Then name your project, select visibility and clic on "Create Project".

Open a console and clone your repository

    git clone git@gitlab:USER/REPO_NAME.git
    cd REPO_NAME

Now you have an empty repository ... we will feed it.

## Node.js

We will create a node.js project & code in ES6+ (aka ES2017) for our training.
If you're not accurate with it some usefull link :
* [nodejs](https://nodejs.org/en/) : JavaScript runtime
* [npm](https://www.npmjs.com/) : Package manager
* [ES2017](https://tc39.github.io/ecma262/) : Language specification
* [JavaScript Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

You should have nvm (node version manager) installed on university computers. If you use your own install  [nvm](https://github.com/creationix/nvm) <br/>
We will fix the version of node to 6.9.4, the last LTS version.
``` sh
    nvm which node
    # if different of 6.9.4
    nvm ls
    # if you don't see 6.9.4 in the list
    nvm install 6.9.4
    # set node version to LTS
    nvm use 6.9.4
    # check your version
    node --version
```

First we will initialize a new node.js project with npm clic
``` sh
    npm init
```

Now open the folder with your favorite IDE or use [atom.io](atom.io)

You can see a "package.json" file. It describes your project, scripts & dependencies.

To be original we will start by building a Hello World API
We need to install [expressjs](http://expressjs.com/)

``` sh
    npm i express --save
```

`npm i` is the command to install a dependency
`--save` will save the dependency in package.json
You can see now a "node_modules" folder. All third party dependencies will be save in.

We don't want to commit dependencies so we will exclude this folder from our git repository. We will also exclude log files and create our first file.
``` sh
    echo "node_modules" >> .gitignore
    echo "*.log" >> .gitignore
    mkdir src
    touch src/index.js
```
Now we will edit our index.js file
``` js
    import express from 'express';

    //initialize express http server
    const app = express();
    //say 'hello world' when receive a GET request on website root
    app.get('/', (req, res) => {
      return res.status(200).send({
        success : true,
        msg : 'Hello World'
      });
    });
    //refuse all other requests
    app.all('*', (req, res) => {
      return res.status(404).send({
        success : false,
        msg : 'Ressouce does not exist'
      });
    });


    //start http server
    console.log('before starting server in code');
    const port = process.env.PORT || 5000 ;
    const server = app.listen(port, (err) => {
      if (err){
        console.log(err);
        return;
      }
      console.log(` 🌎  API is listening on port ${ server.address().port } `);
    });
    console.log('after starting server in code');

```

What you must know about it :
* `import X from 'x';` is the way to import content of a module in ES6. A module could be a variable, a function or a class. In this exemple we only use third party module, you will find it in "node_modules" directory.
* In ES6, a variable is no more declare with `var`. You now have 2 kind of variables :
  * `let` for loop variables

``` js
  let i = 0;
  while (i<100){
    i++; //will be OK
  }
  i = 'hello'; //will also be OK
```

  * `const` for variable instanciate only once. Be carefull, `const` is a pointer constant, not a constant variable.

``` js
   const toto = 42;
   toto = 50; // will throw an Error
   toto = 'hello'; // will throw an Error
   const titi = {id : 42}; //create an Object with an id property
   titi.id = 50 ; // wil be OK
   titi.name = 'john' ; // will also be OK
   titi = {id : 50, name: 'john'}; // will throw an Error cause it instanciate a new object
```

  Always use `const` by default to limit inconsistency
* `(params) => {...}` is the way to declare an anonymous function in ES6. To declare named function you must use ` function maFunction(params) { ... } `
* express routes are evaluated from the top to the bottom
* node.js is an asynchronous runtime which mean that an expression don't wait the end of the previous. Take a look at logs when we will start our server.

OK we write some code in ES6 but node.js doesn't implement all the specification. For exemple, `import` is not yet supported.
We'll use [babel](https://babeljs.io/) to polyfill ES6.

``` sh
  npm i babel-cli babel-core babel-preset-latest --save
```

Then edit "package.json"

``` json
...
"scripts": {
  "start": "babel-node ./src --trace-sync-io --presets latest"
},
...
```

Congratulation, you can start your server for the first time

``` sh
    npm start
```

Take a look at logs in your console : remember node.js is asynchronous.

Test it

``` sh
    curl http://localhost:5000/
    curl http://localhost:5000/shouldReturn404
```

Time to commit and push

``` sh
    git add .
    git commit -m ':tada: my first node API'
    git push origin master
```

## Heroku
* Goto your [Heroku Dashboard](https://dashboard.heroku.com/apps)
* Clic on "new" > "create an app"
* Add a new git remote

``` sh
    git add remote heroku https://git.heroku.com/my-app-name-1234.git
```

* Heroku will detect that our app run with node.js but we will tell it the engine to use in package.json

``` json
    ...
    "scripts": {
      "start": "babel-node ./src --trace-sync-io --presets latest"
    },
    "engines": {
      "node": "~6.9.4",
      "npm": "~3.10.10"
    },
    ...
```

* Deploy your first heroku app

``` sh
    git push heroku master
```

* Test it

``` sh
    curl http://my-app-name-1234.herokuapp.com/
```

Notice that you don't explicit port. Heroku set an environment variable each time it start and map it on  port 80 through his reverse proxy. We retreived it in our code with `process.env.PORT`

## Gitlab-CI
At this moment, we must manually with a git push
We will improve our pipeline like this : each time we push code on our remote Gitlab repository master branch, we will publish it on heroku.

Browse to the "variable" menu of your project in Gitlab (click on the right gear then on the varibale link).
Add a new variable HEROKU_API_KEY with the value of your [heroku API key](https://dashboard.heroku.com/account).

create a ".gitlab-ci.yml" file in the root folder of your project

``` yml
stages:
  - deploy

staging:
  image: ruby:2.3
  stage: deploy
  script:
    - gem install dpl
    - dpl --provider=heroku --app=yumii-core-staging --api-key=$HEROKU_API_KEY --strategy=git
  only:
    - master

```

``` sh
    git add .gitlab-ci.yml
    git commit -m ':construction_worker: add CI feature'
    git push origin master
```

You can follow the deployment in your CI pipeline in Gitlab.
Now you have all you need to use Gitlab, Gitlab-ci & Heroku for your project.

## Node.js improvment (optional)

We used babel-node which transpil code on runtime. It's not a good practice for production.
First create a new file ".babelrc" which conatains babel target env.

``` json
    {
      "presets": [
        "env", {
          "targets": {
            "node": "current"
          }
      }]
    }
```

Then define 3 new scripts in package.json :

``` json
    ...
    "scripts": {
      "dev": "babel-node ./src --trace-sync-io --presets latest",
      "build": "babel src -d build",
      "postinstall" : "npm run build",
      "start": "node ./build"
    },
    ...
```

* `npm run dev` start our app with babel-node
* `npm run build` build our app in build directory
* `npm start` start our builded application
* postinstall will run after each npm install. It's use to launch a build after each Heroku deployment.

We just have to exclude build from our repository & commit :

``` sh
    echo "build" >> .gitignore
    git add .
    git commit -m ':zap: add build for production'
    git push origin master
```
