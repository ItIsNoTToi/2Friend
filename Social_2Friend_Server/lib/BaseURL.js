exports.getBaseURL = async (req) => {
    if(req) {
        var fullUrl = await req.protocol + '://' + req.get('host')
        return fullUrl.toString();
    }
    return '';
}