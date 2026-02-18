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
    console.log(submissionRows.rows);
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
// let sub_query_promise = client.query('select * from submission where approvaldate between current_date-30 and current_date');
// let committee_memb_promise=client.query('select * from committee_member left outer join committee_member_roles on committee_member.id=committee_member_roles.jpacommitteememberimpl_id');
// let embargo_type_promise=client.query('select id, name from embargo_type');

/* sub_query_promise.then(result => {
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
}).catch(err => {handle_db_err(err)}); */

let test_promise = client.query(`
    SELECT json_build_object(
  'submission', to_jsonb(s),
  'field_value', json_build_object(
      'id', fv.id,
      'value', fv.value,
      'identifier', fv.identifier,
      'definition', fv.definition,
      'field_predicate_id', fv.field_predicate_id
  ),
  'field_predicate', json_build_object(
      'id', fp.id,
      'value', fp.value,
      'document_type_predicate', fp.document_type_predicate
  ),
  'submission_field_values', json_build_object(
      'submission_id', sfv.submission_id,
      'field_values_id', sfv.field_values_id
  )
) AS row
FROM submission               AS s
JOIN submission_field_values  AS sfv ON s.id = sfv.submission_id
JOIN field_value              AS fv  ON fv.id = sfv.field_values_id
JOIN field_predicate          AS fp  ON fp.id = fv.field_predicate_id
WHERE s.approve_application_date BETWEEN current_date - INTERVAL '30 days' AND current_date;
`);

test_promise.then(result => { console.log(result);
    // handle_db_results([result]);
console.log("############### Contents are ###############")


    client.end();
    handle_db_results(result);
}).catch(err => {handle_db_err(err)});
