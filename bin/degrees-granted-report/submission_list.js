var datefns = require('date-fns');

class SubmissionList {
    constructor(db_results)
    {
        this.month_names=["January","February","March","April","May","June","July",
            "August","September","October","November","December"];
        let sub_rows=db_results[0]["rows"];
        let embargo_rows=db_results[2]["rows"];
        let committee_member_json=this.build_committee_json(db_results[1]["rows"]);
        this.rows=[];
        for (let row of sub_rows){
            let sub_info={};
            sub_info["UIN"] = row["uin"]||"";
            sub_info["First Name"] = row["studentfirstname"]||"";
            sub_info["Last Name"] = row["studentlastname"]||"";
            sub_info["Middle Name"] = row["studentmiddlename"]||"";

            //what was degree level in vireo 1 is now document type

            sub_info["Degree Level"] = row["documenttype"]||"";
            sub_info["Degree Name"] = row["degree"]||"";
            sub_info["Degree Department"] = row["department"]||"";
            sub_info["Department Code"] = row["departmentcode"]||"";
            sub_info["Program"] = row["program"]||"";
            sub_info["Program Code"] = row["programcode"]||"";
            sub_info["Major Name"] = row["major"]||"";
            sub_info["Embargo Option"] = this.resolve_embargo_type(row["embargotype_id"], embargo_rows);
            sub_info["Title"] = row["documenttitle"]||"";
            sub_info["Deposit Date"] = this.resolve_date(row["approvaldate"]);
            sub_info["Degree Month"] = this.month_names[row["graduationmonth"]]||"";
            sub_info["Degree Year"] = row["graduationyear"]||"";


            this.add_committee_info(sub_info, committee_member_json, row.id);
            this.add_empty_rows(sub_info);


            this.rows.push(sub_info);
        }
    }

    get first_names() {
        let first_name_array=[];

        for (let row of this.rows){
            first_name_array.push(row.first_name);
        }
        return first_name_array;
    }
    get first_submission() {
        return this.rows[0];
    }

    build_committee_json(committee_rows){
        let committee_member_json = {};

        for (let row of committee_rows){
            if (committee_member_json[row['submission_id']]===undefined){
                committee_member_json[row['submission_id']]=[];
            }
            committee_member_json[row['submission_id']].push(row);
        }
        return committee_member_json;
    }
    add_committee_info(sub_info, committee_member_json, sub_id){
        let adviser_counter=1;
        let committee_member_counter=1;
        let chair_counter=1;
        let dor_counter=1;

        for (let row of committee_member_json[sub_id]){
            if (row["roles"]===null){
                sub_info["CommitteeMbr"+committee_member_counter]=this.format_committee_name(row);
                committee_member_counter++;
            } else if (row["roles"]==='Director of Research'){
                sub_info["DirectorResearch"+dor_counter]=this.format_committee_name(row);
                dor_counter++;
            } else if (row["roles"]==='Chair' || row["roles"]==="Committee Chair"){
                sub_info["Chair"+chair_counter]=this.format_committee_name(row);
                chair_counter++;
            } else if (row["roles"]==='Advisor' || row["roles"]==="Adviser"){
                sub_info["Advisor"+adviser_counter]=this.format_committee_name(row);
                adviser_counter++;
            } else {
                throw "unexpected committee value: "+row.toString()
            }
        }

    }

    add_empty_rows(sub_info){
        let committee_role_quantity = {'Chair': 5, 'Advisor': 4, 'DirectorResearch': 4, 'CommitteeMbr': 10};
        for (let committee_role in committee_role_quantity){
            for(let i=1; i<=committee_role_quantity[committee_role]; i++){
                if (!Object.keys(sub_info).includes(committee_role+i) ){
                    sub_info[committee_role+i]="";
                }
            }
        }
    }

    format_committee_name(row){
        let lastname = row.lastname || "";
        let firstname = row.firstname || "";
        let middlename = row.middlename || "";
        return lastname+", "+firstname+" "+middlename;
    }

    resolve_embargo_type(db_embargo_id, db_embago_rows) {

        let embargo_type_map=new Map();
        for (let row of db_embago_rows){
            embargo_type_map.set(row.id, row.name)
        }
        if (db_embargo_id===undefined || db_embargo_id==="" || embargo_type_map.get(db_embargo_id)==="Open Access"){
            return "Open";
        } else if (embargo_type_map.get(db_embargo_id)==="U of I Access"){
            return "Campus";
        } else if (embargo_type_map.get(db_embargo_id)==="Closed Access"){
            return "Close";
        } else{
            throw "Unexpected embargo info: "+db_embargo_id
        }

    }
    resolve_date(db_date){
        return datefns.formatISO(db_date, { representation: 'date' });
    }
}

module.exports=SubmissionList;