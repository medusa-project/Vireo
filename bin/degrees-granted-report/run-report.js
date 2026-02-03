const { Pool, Client } = require('pg');
let config = require('./config');
let fs = require('fs');
let async = require('async');
let stringify = require('csv-stringify');
let SubmissionList=require('./submission_list.js');
let client = new Client({
    user: config.pg.user,
    host: config.pg.host,
    database: config.pg.database,
    password: config.pg.password,
    port: config.pg.port,
});

let handle_db_err=function(err){
    console.log(err);
    client.end()
};

let handle_db_results=function(results){
    let submissionRows = new SubmissionList(results);
    console.log(submissionRows);
    stringify(submissionRows.rows, {
        header: true,
        quote: "~",
        quoted_empty: true,
        quoted: true

    }, function (err, output) {
        //TODO move file location to config
        fs.writeFile(config.outFile, output, function (err,data) {
            if (err) {
                return console.log(err);
            }
            console.log(data);
        })
    });

};

client.connect();

let results=[];
//TODO make date range flexible
let sub_query_promise = client.query('select * from submission where approvaldate between current_date-30 and current_date');
let committee_memb_promise=client.query('select * from committee_member left outer join committee_member_roles on committee_member.id=committee_member_roles.jpacommitteememberimpl_id');
let embargo_type_promise=client.query('select id, name from embargo_type');

sub_query_promise.then(result => {
    results[0]=result;
    console.log(result);
    committee_memb_promise.then(result => {
        results[1]=result;
        embargo_type_promise.then(result =>{
            results[2]=result;
            handle_db_results(results);
            client.end();
        }).catch(err => {handle_db_err(err)});
    }).catch(err => {handle_db_err(err)})
}).catch(err => {handle_db_err(err)});

