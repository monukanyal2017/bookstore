const express = require('express');
const router = express.Router();
var request = require('request'),
    consumer_key = "nqmZqR1A11a2NRxSIlXKks1FKgObAgzi",
    consumer_secret = "v5InjE47xUSWUdBI",
    shortcode = "174379",
    passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
var oauth_token;
var reg_response;
var b2c_response;
var nanoid = require('nanoid');
var moment = require('moment');
var UserPayment = require('../Models/User_payment.js'); //including model
var User = require('../Models/user.js'); //including model
var prettyjson = require('prettyjson');
var async = require('async');
// console.log(moment().format('YYYYMMDDHHmmss'));
//console.log(new Buffer(shortcode+passkey+moment().format('YYYYMMDDHHmmss')).toString("base64"));

/***********
 * C2B API *
 ***********/
async function get_accesstoken(consumer_key, consumer_secret) {
    var url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
    var auth = "Basic " + new Buffer(consumer_key + ":" + consumer_secret).toString("base64");
    return new Promise((resolve, reject) => {
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
                    //return oauth_token;
                    resolve(oauth_token);
                }
                else {
                    // return '';
                    reject('');
                }
            });
    });
}

async function registerurl(req, oauth_token) {
    var host;
    if (req.secure == true) {
        host = 'https://' + req.headers.host;
    }
    else {
        host = 'http://' + req.headers.host;
    }
    console.log('host:' + host);
    return new Promise((resolve, reject) => {
        request(
            {
                method: 'POST',
                url: "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl",
                headers: {
                    "Authorization": "Bearer " + oauth_token
                },
                json: {
                    "ShortCode": "602980",
                    "ResponseType": "Cancelled",
                    "ConfirmationURL": host + "/api/pay/confirmation?token=esferaagoodcompany@",
                    "ValidationURL": host + "/api/pay/validation_url?token=esferaagoodcompany@"
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
                    console.log({ error: false, result: body });
                    resolve({ error: false, result: body });
                }
                else {
                    console.log({ error: true, result: body });
                    reject({ error: true, result: body });

                }
            });

    });
}

async function simulate_c2b(req, oauth_token) {
    var price = req.body.price;
    var mobilenum = req.body.mobilenum;
    var user_id = req.body.user_id;
    var productlist = req.body.productlist;
    return new Promise((resolve, reject) => {
        request(
            {
                method: 'POST',
                url: "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate",
                headers: {
                    "Authorization": "Bearer " + oauth_token
                },
                json: {
                    "ShortCode": "602980",
                    "CommandID": "CustomerBuyGoodsOnline",
                    "Amount": parseInt(price),
                    "Msisdn": mobilenum,
                    "BillRefNumber": nanoid()
                }
            },
            (error, response, body) => {
                console.log(price);
                console.log(parseInt(price));
                console.log(body);
                if (response.statusCode == 200) {

                    setTimeout(() => {
                        console.log({ error: false, result: body, text: 'payment done' });
                        resolve({ error: false, result: body, text: 'payment done' });
                    }, 2000);

                }
                else {
                    console.log({ error: true, result: body, text: 'Something is wrong,try again later!!' });
                    reject({ error: true, result: body, text: 'Something is wrong,try again later!!' });
                }
            });
    });
}
router.post('/c2b_pay', async (req, res) => {
    oauth_token = await get_accesstoken(consumer_key, consumer_secret);
    if (oauth_token != '') {
        console.log('oauth_token:' + oauth_token);
        reg_response = await registerurl(req, oauth_token);
        if (reg_response.error == false) {
            var simulate_c2b_res = await simulate_c2b(req, oauth_token);
            res.json(simulate_c2b_res);
        }
        else {
            res.json(reg_response);
        }
    }
    else {
        res.json({ error: true, result: 'authorization failed' });
    }
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

/*************************************************************
 * B2C API START*
 *************************************************************/
async function b2c_payment(req, oauth_token) {
    var host;
    if (req.secure == true) {
        host = 'https://' + req.headers.host;
    }
    else {
        host = 'http://' + req.headers.host;
    }
    return new Promise((resolve, reject) => {
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
                    "Remarks": "Your reimbursement",
                    "QueueTimeOutURL": host + "/api/pay/b2c/timeout",
                    "ResultURL": host + "/api/pay/b2c/result",
                    "Occasion": "NA"
                }
            }, function (error2, response2, body2) {
                console.log('b2c payment response');
                console.log(body2);
                if (response2.statusCode == 200) {
                    setTimeout(() => {
                        resolve(body2);
                    }, 8000);
                }
                else {
                    reject(body2);
                }
            });
    });
}
router.get('/b2c', async (req, res) => {

    oauth_token = await get_accesstoken(consumer_key, consumer_secret);
    if (oauth_token != '') {
        console.log('oauth_token:' + oauth_token);
        b2c_response = await b2c_payment(req, oauth_token);
        res.json(b2c_response);
    }
    else {
        res.json({ error: true, result: 'authorization failed' });
    }
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

/*************************************************************
 * B2C API END*
 *************************************************************/

async function process_request(req, shortcode, passkey, oauth_token) {
    var host;
    if (req.secure == true) {
        host = 'https://' + req.headers.host;
    }
    else {
        host = 'http://' + req.headers.host;
    }
    return new Promise((resolve, reject) => {
        request(
            {
                method: 'POST',
                url: "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
                headers: {
                    "Authorization": "Bearer " + oauth_token
                },
                json: {
                    "BusinessShortCode": shortcode,
                    "Password": new Buffer(shortcode + passkey + moment().format('YYYYMMDDHHmmss')).toString("base64"),
                    "Timestamp": moment().format('YYYYMMDDHHmmss'),
                    "TransactionType": "CustomerPayBillOnline",
                    "Amount": parseInt(req.body.price),
                    "PartyA": req.body.mobilenum,
                    "PartyB": shortcode,
                    "PhoneNumber": req.body.mobilenum,
                    "CallBackURL": host + "/api/pay/process_callback",
                    "AccountReference": "ref test",
                    "TransactionDesc": "product purchase"
                }
            },
            function (error, response, body) {
                // TODO: Use the body object to extract the response
                if (response.statusCode == 200) {
                    resolve({ error: false, result: body, text: `${body.ResponseDescription}. Please check your phone ${req.body.mobilenum} and enter your M-PESA PIN to finish the process!` });
                }
                else {
                    reject({ error: true, result: body, text: body.ResponseDescription });
                }
            });

    });
}
router.post('/customer_pay', async (req, res) => {
    oauth_token = await get_accesstoken(consumer_key, consumer_secret);
    if (oauth_token != '') {
        console.log('oauth_token:' + oauth_token);
        pcs_response = await process_request(req, shortcode, passkey, oauth_token);
        if (pcs_response.error == false) {

            var orderpayment = new UserPayment();
            orderpayment.Transaction_id = pcs_response.result.CheckoutRequestID;
            orderpayment.paymentstatus = 'pending';
            orderpayment.Amount = req.body.price;
            orderpayment.Msisdn = req.body.Msisdn;
            orderpayment.order_detail = req.body.productlist;
            orderpayment.shipping_detail = req.body.shipping_details;
            orderpayment.save().then((results) => {
                console.log('doc info');
                console.log(results);
                User.update({ _id: req.body.user_id }, { $push: { UserPayment: results } }, (err) => {
                    console.log('update user tbl' + err);
                    res.json(pcs_response);
                });
            }).catch((err) => {
                console.log(err.message);
                res.json({ error: true, result: err, text: err.message });
            });
            // UserPayment.findOneAndUpdate({ Transaction_id: pcs_response.result.CheckoutRequestID }, { 'paymentstatus': 'pending', 'ReceivedAmount': req.body.price, 'Receiver_msisdn': req.body.mobilenum, order_detail: req.body.productlist }, { upsert: true }, function (err, doc) {
            //     if (err) {
            //         console.log(err.message);
            //         res.json({ error: true, result: err, text: err.message });
            //     } else {
            //         console.log('doc info');
            //         console.log(doc);
            //         User.update({ mob: req.body.mobilenum }, { $push: { UserPayment: doc } }, (err) => {
            //             console.log('update user tbl' + err);
            //             res.json(pcs_response);
            //         });
            //     }
            // });
            //checkoutresponse id store them
        }
        else {
            res.json(pcs_response);
        }
    }
    else {
        res.json({ error: true, result: 'authorization failed' });
    }
});

router.post('/process_callback', async (req, res) => {
    console.log('process request callback');
    console.log(req.body);
    if (req.body.Body.stkCallback.ResultCode != 0) {
        console.log(req.body.Body.stkCallback.ResultDesc);
        UserPayment.findOneAndUpdate({ Transaction_id: pcs_response.result.CheckoutRequestID }, { 'paymentstatus': 'failed' }, { upsert: true }, function (err, doc) {
            if (err) {
                console.log(err.message);

            } else {
                console.log('record updated err');
            }
        });
    }
    else {
        console.log('done payment received');
        //sending mail for order confirmation
        console.log(req.body);
        UserPayment.findOneAndUpdate({ Transaction_id: pcs_response.result.CheckoutRequestID }, { 'paymentstatus': 'success' }, { upsert: true }, function (err, doc) {
            if (err) {
                console.log(err.message);

            } else {
                console.log('record updated success');
            }
        });
    }
});

module.exports = router;
