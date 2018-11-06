# API Express for FC connect token 

### CONFIG : 

```
module.exports.config = {
    fcURL : process.env.FC_URL || 'https://fcp.integ01.dev-franceconnect.fr',
    urlServer : process.env.URL_SERVER || 'http://localhost:3000',
    client_id : process.env.CLIENT_ID || '',
    client_secret : process.env.CLIENT_SECRET || '',
    frontUrlRedirect : process.env.FRONT || 'https://eddits.io/identity/manage',
    private_key_ECDSA_back : process.env.PRIVATE_KEY || '', 
    corsAllowedOrigins: (process.env.ORIGINS ? process.env.ORIGINS.split(',') : []),
    overrideRedirect: (process.env.OVERRIDE_REDIRECT === 'true' || false)
}
```

Config can be overrided by environment variables:

* `FC_URL`: URL of france connect used for the calls, development URL by default
* `URL_SERVER`: The url on which the API is running
* `CLIENT_ID`: client_id of the service provider of France Connect
* `CLIENT_SECRET`: client_secret of the service provider of France Connect
* `FRONT`: the FRONT URL on which the token and the signed token will be redirected
* `PRIVATE_KEY`: the ECDSA private key that will be used to sign the FC token before sending it to the FRONT_URL (hex encoded)
* `ORIGINS`: Coma-separated list of allowed origins for cross-domain requestes
* `OVERRIDE_REDIRECT`: `true` if clients are allowed to override the `FRONT` URL by providing a `redirectUrl` query parameter