module.exports.config = {
    FC_URL : process.env.FC_URL || 'https://fcp.integ01.dev-franceconnect.fr',
    urlServer : process.env.URL_SERVER || 'http://localhost:3000',
    client_id : process.env.CLIENT_ID || '',
    client_secret : process.env.CLIENT_SECRET || '',
    FRONT_URL_REDIRECT : process.env.FRONT || 'https://EDDITS.io',
    private_key_ECDSA_back : process.env.PRIVATE_KEY || '', // HEXADECIMAL
    public_key_ECDSA_back : process.env.PUBLIC_KEY || ''// HEXADECIMAL
}