var faker = require("faker");
//MongoDB
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/thedailyjants');
var appRouter = function(app) {



    app.get("/", function(req, res) {
        res.status(200).send({ message: 'Welcome to our restful API' });
    });

    app.get("/dailyjant", function(req, res) {

        var thejant = db.get('jants');

        thejant.findOne({ sent: 0 }, function(e, docs) {


            //res.json(docs);
            if (e) {
                throw e;
            } else {
                'use strict';
                const nodemailer = require('nodemailer');

                // Generate test SMTP service account from ethereal.email
                // Only needed if you don't have a real mail account for testing
                nodemailer.createTestAccount((err, account) => {
                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                        host: 'smtp.ethereal.email',
                        port: 587,
                        secure: false, // true for 465, false for other ports
                        auth: {
                            user: account.user, // generated ethereal user
                            pass: account.pass // generated ethereal password
                        }
                    });

                    // setup email data with unicode symbols
                    let mailOptions = {
                        from: '"Oswaldo Otero" <oswaldo@trinityopensolutions.com>', // sender address
                        to: 'oswaldo@trinityopensolutions.com', // list of receivers
                        subject: 'The Wednesday Jant: #' + docs.id + '', // Subject line
                        text: 'Josh Cordes said: -->>' + docs.jant + '<<--', // plain text body
                        html: 'Josh Cordes said: <b>' + docs.jant + '</b>' // html body
                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message sent: %s', info.messageId);
                        // Preview only available when sending through an Ethereal account
                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                    });
                });


                res.json(docs);
            }


        });

    });

    app.get("/dailyjant/:num", function(req, res) {
        var users = [];
        var num = req.params.num;

        if (isFinite(num) && num > 0) {
            for (i = 0; i <= num - 1; i++) {
                users.push({
                    JantId: faker.random.number(),
                    Jant: faker.company.catchPhrase()
                });
            }

            res.status(200).send(users);

        } else {
            res.status(400).send({ message: 'invalid number supplied' });
        }

    });



}



module.exports = appRouter;