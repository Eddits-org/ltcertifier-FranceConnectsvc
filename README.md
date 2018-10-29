### API Express for FC connect token 

#CONFIG file : 

```
config = {
    FC_URL : process.env.FC_URL || 'https://fcp.integ01.dev-franceconnect.fr',
    urlServer : process.env.URL_SERVER || 'http://localhost:3000',
    client_id : process.env.CLIENT_ID || '',
    client_secret : process.env.CLIENT_SECRET || '',
    FRONT_URL_REDIRECT : process.env.FRONT || 'https://EDDITS.io',
    private_key_ECDSA_back : process.env.PRIVATE_KEY || '',
    public_key_ECDSA_back : process.env.PUBLIC_KEY || ''
}
```

FC_URL = URL of france connect used for the calls, development URL by default

urlServer = The url on which the API is running

client_id = client_id of the service provider of France Connect

client_secret = client_secret of the service provider of France Connect

FRONT_URL_REDIRECT = the FRONT URL on which the token and the signed token will be redirected

private_key_ECDSA_back = the ECDSA private key that will be used to sign the FC token before sending it to the FRONT_URL

public_key_ECDSA_back = the ECDSA public key that will be used to sign the FC token before sending it to the FRONT_URL
