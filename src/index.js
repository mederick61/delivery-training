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
