let rp = require('request-promise');
let requestHost = 'http://127.0.0.1:3000';

let rpUtil = {
    get: (url, header, req, res, callback) => {
        (async () => {
            try{
                let rpRes = await rp(url);
                if(typeof rpRes == 'string') {
                    let resErr = false;
                    try{
                        JSON.parse(rpRes);
                    }catch(err) {
                        resErr = true;
                        console.log(err)
                        console.log(resStr);
                        res.json({status: 500, messge: '服务器返回错误'});
                    }
                    if(!resErr) {
                        callback(JSON.parse(rpRes));
                    }
                }else if(typeof rpRes == 'object') {
                    callback(rpRes);
                }
            }catch(error) {
                console.log(`statusCode: ${error.statusCode}`)
                console.log(`error: ${error.error}`);
                console.log(`message: ${error.message}`);
                res.json({status: 500, messge: '请求服务器错误'})
            }
        })();
    }
}
module.exports = {
    search: (req, res) => {
        let args = req.query;
        rpUtil.get(`${requestHost}/search?keywords=${encodeURIComponent(args.keywords)}`, null, req, res, (body) => {
            res.json(body);
        });
    }
};