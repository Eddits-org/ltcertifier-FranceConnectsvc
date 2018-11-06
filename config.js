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