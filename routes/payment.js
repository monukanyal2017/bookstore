const express = require('express');
const router = express.Router();
var request = require('request'),
    consumer_key = "jKti1AG6g1uM1Wv416FrDyaLcjhYPwAX",
    consumer_secret = "tWjGkyYzJaZKr50y";
var oauth_token;
var nanoid = require('nanoid');
var UserPayment = require('../Models/User_payment.js'); //including model
var prettyjson = require('prettyjson');
//for api

/***********
 * C2B API *
 ***********/
router.post('/c2b_pay', function (req, res) {
    var host;
    if (req.secure == true) {
        host = 'https://' + req.headers.host;
    }
    else {
        host = 'http://' + req.headers.host;
    }
    console.log('host:'+host);
    var price = req.body.price;
    var mobilenum = req.body.mobilenum;
    var user_id = req.body.user_id;
    var productlist = req.body.productlist;
    var url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
    var auth = "Basic " + new Buffer(consumer_key + ":" + consumer_secret).toString("base64");

    request(
        {
            url: url,
            headers: {
                "Authorization": auth
            }
        },
        function (error, response, body) {
            if (response.statusCode == 200) {
                var result = JSON.parse(body);
                console.log('auth error:', error); // Print the error if one occurred
                console.log('auth statusCode:', response && response.statusCode); // Print the response status code if a response was received
                console.log('auth body:', result); // Print the HTML for the Google homepage
                oauth_token = result.access_token;
                request(
                    {
                        method: 'POST',
                        url: "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl",
                        headers: {
                            "Authorization": "Bearer " + oauth_token
                        },
                        json: {
                            "ShortCode": "600000",
                            "ResponseType": "Cancelled",
                            "ConfirmationURL": host + "/api/mpesa/confirmation?token=esferaagoodcompany@",
                            "ValidationURL": host + "/api/mpesa/validation_url?token=esferaagoodcompany@"
                        }
                    },
                    (error, response, body) => {
                        console.log('register error:', error); // Print the error if one occurred
                        console.log('register statusCode:', response && response.statusCode); // Print the response status code if a response was received
                        console.log('register body:', body); // Print the HTML for the Google homepage
                        if (response.statusCode == 200) {
                            /* 
                                {"ConversationID":"","OriginatorCoversationID":"","ResponseDescription":"success"}
                            */
                            request(
                                {
                                    method: 'POST',
                                    url: "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate",
                                    headers: {
                                        "Authorization": "Bearer " + oauth_token
                                    },
                                    json: {
                                        "ShortCode": "600000",
                                        "CommandID": "CustomerBuyGoodsOnline",
                                        "Amount": parseInt(price),
                                        "Msisdn": mobilenum,
                                        "BillRefNumber": nanoid()
                                    }
                                },
                                (error, response, body) => {
                                    console.log(price);
                                    console.log(parseInt(price));
                                    // TODO: Use the body object to extract the response
                                    console.log(body);
                                    if (response.statusCode == 200) {

                                        setTimeout(() => {
                                            res.json({ error: false, result: body, text: 'payment done' });
                                        }, 3000);

                                    }
                                    else {
                                        res.json({ error: true, result: body, text: 'Something is wrong,try again later!!' });
                                    }
                                }
                            )
                        }
                        else {
                            res.json({ error: true, result: body });
                        }
                    }
                )
            }
        }
    );


});
router.post('/validation_url', function (req, res) {
    console.log('-----------C2B VALIDATION REQUEST-----------');
    console.log(prettyjson.render(req.body, options));
    console.log('-----------------------');

    console.log(req.query);
    if (req.query.token) {
        res.json({ "ResultCode": 0, "ResultDesc": "Success", "ThirdPartyTransID": 0 });
    }
    else {
        res.json({ "ResultCode": 1, "ResultDesc": "Failed", "ThirdPartyTransID": 0 });
    }
});

router.post('/confirmation', function (req, res) {
    console.log('Confirmation response');
    console.log('-----------C2B CONFIRMATION REQUEST------------');
    console.log(prettyjson.render(req.body, options));
    console.log('-----------------------');
    
    var message = {
        "ResultCode": 0,
        "ResultDesc": "Success"
    };
    //or

   /* var message = {
        "ResultCode": 1,
        "ResultDesc": "Rejected"
    };
    */

    res.json(message);
});

/***********
 * B2C API *
 ***********/

router.get('/b2c', function (req, res) {
    var host;
    if (req.secure == true) {
        host = 'https://' + req.headers.host;
    }
    else {
        host = 'http://' + req.headers.host;
    }
    var url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
    var auth = "Basic " + new Buffer(consumer_key + ":" + consumer_secret).toString("base64");
    request({ url: url, headers: { "Authorization": auth } }, (error, response, body) => {
        if (response.statusCode == 200) {
            var result = JSON.parse(body);
            console.log('auth error:', error); // Print the error if one occurred
            console.log('auth statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('auth body:', result); // Print the HTML for the Google homepage
            oauth_token = result.access_token;

            //creating b2c transaction
            request(
                {
                    method: "POST",
                    url: "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest",
                    headers: {
                        "Authorization": "Bearer " + oauth_token
                    },
                    json: {
                        "InitiatorName": "apiop56",
                        "SecurityCredential": "Kepob5AfIncmsjDvmtNDZpfswbpc1SvX7r4SE/bR1DFncOWaGQF89TZwNIlr3ubvgIxUWqzQuHK6UE1G5+ta6f1oUhupLnPJuSmrqYHNppcS46K/CQ+Fmw3YjX8fm7fq4Dei+SmdVYpJcvS59g386nVfhPJIpopCe2iDCibnmAHncKpYUISB5JmMfJx9KLRNsZ4pCNxSHaq6aWQxjZ/1GOmA2iSSfiBphgEptt/pUMh7dwrhtUu5dfsaUMqpXgvzCdEi6o7nvIi8sm8nrJoCnXQe3lTpFz+xZkvVvdMR9n53coAL2G6Hz4iiFrXLRQitoDoXQggALoU2IibrdtQUtQ==",
                        "CommandID": "BusinessPayment",
                        "Amount": "20",
                        "PartyA": "602980",
                        "PartyB": "254708374149",
                        "Remarks": "Your bonus",
                        "QueueTimeOutURL": host + "/api/mpesa/b2c/timeout",
                        "ResultURL": host + "/api/mpesa/b2c/result",
                        "Occasion": "NA"
                    }
                }, function (error2, response2, body2) {
                    console.log('b2c payment response');
                    console.log(body2);
                    setTimeout(() => {
                        res.send(body2);
                    }, 8000);


                });
        }
    });
});

router.post('/b2c/timeout', function (req, res) {
    console.log('-----------B2C TIMEOUT------------');
    console.log(prettyjson.render(req.body, options));
    console.log('-----------------------');
    var message = {
        "ResponseCode": "00000000",
        "ResponseDesc": "success"
    };

    res.json(message);

});


router.post('/b2c/result', function (req, res) {

    console.log('-----------B2C CALLBACK------------');
    console.log(prettyjson.render(req.body, options));
    console.log('-----------------------');
    console.log(req.body.Result);

    var str = req.body.Result.ResultParameters.ResultParameter[4].Value;
    var Msisdn = (str.substring(0, str.indexOf("-"))).trim();
    UserPayment.findOneAndUpdate({ Transaction_id: req.body.Result.TransactionID }, { 'ReceivedAmount': req.body.Result.ResultParameters.ResultParameter[0].Value, 'Receiver_msisdn': Msisdn }, { upsert: true }, function (err, doc) {
        if (err) {
            console.log(err.message);
        } else {
            console.log("succesfully inserted");
            var message = {
                "ResponseCode": "00000000",
                "ResponseDesc": "success"
            };

            res.json(message);
        }
    });
});
module.exports = router;
