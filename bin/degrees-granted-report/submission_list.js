var datefns = require('date-fns');

class SubmissionList {
    constructor(db_result)
    {
        
        // let embargo_rows=db_results[2]["rows"];
        // let committee_member_json=this.build_committee_json(db_results[1]["rows"]);
        this.header=["UIN","First Name","Last Name","Middle Name","Degree Level",
            "Degree Name","Degree Department","Department Code","Program","Program Code",
            "Major Name","Embargo Option","Title","Deposit Date","Degree Month","Degree Year",
            "Chair1","DirectorResearch1","CommitteeMbr1","CommitteeMbr2","Chair2","Chair3",
            "Chair4","Chair5","Advisor1","Advisor2","Advisor3","Advisor4","DirectorResearch2",
            "DirectorResearch3","DirectorResearch4","CommitteeMbr3","CommitteeMbr4","CommitteeMbr5",
            "CommitteeMbr6","CommitteeMbr7","CommitteeMbr8","CommitteeMbr9","CommitteeMbr10"];

        this.embargo_map = {
        "Open Access": "Open",
        "U of I Access": "Campus",
        "Closed Access": "Close"
        }

        this.organization_map =
        {  
            2: "Dissertation", 
            3: "Thesis"
        }
        this.row_limits={
            "Chair":5,
            "DirectorResearch":4,
            "CommitteeMbr":10,
            "Advisor":4
        }
        

        this.rows=[];
        this.submission_metadata_map={}

        for (const r of db_result.rows){
            
            let predicate=r.row["field_predicate"]["value"];
            let field_value=r.row["field_value"]["value"];
            let submission_id=r.row["submission"]["id"];
    
            this.submission_metadata_map[submission_id]??={};
            this.submission_metadata_map[submission_id]["submission_date"]??=r.row["submission"]["approve_application_date"];
            this.submission_metadata_map[submission_id][predicate]??=[];
            this.submission_metadata_map[submission_id][predicate].push(field_value);
            this.submission_metadata_map[submission_id]["documenttype"]??=r.row["field_predicate"]["document_type_predicate"];
            this.submission_metadata_map[submission_id]["organization_id"]??=r.row["submission"]["organization_id"];



        
        }
        this.build_rows();
    }

    build_rows(){
        for (const submission_id in this.submission_metadata_map){
            let sub_info={};
            let metadata=this.submission_metadata_map[submission_id];
            sub_info["UIN"] = metadata["institutional_id"]??"";
            sub_info["First Name"] = metadata["first_name"]??"";
            sub_info["Last Name"] = metadata["last_name"]??"";
            sub_info["Middle Name"] = metadata["middle_name"]??"";
            sub_info["Degree Level"] = this.get_degree_level(metadata);
            sub_info["Degree Name"] = metadata["thesis.degree.name"]??"";
            sub_info["Degree Department"] = metadata["thesis.degree.department"]??"";
            sub_info["Department Code"] = metadata["department_code"]??"";
            sub_info["Program"] = metadata["thesis.degree.program"]??"";
            sub_info["Program Code"] = metadata["degree_code"]??"";
            sub_info["Major Name"] = metadata["thesis.degree.major"]??"";
            sub_info["Embargo Options"] = this.get_embargo_options(metadata);
            sub_info["Title"] = metadata["dc.title"]??"";
            sub_info["Deposit Date"] = metadata["submission_date"]??"";
            sub_info["Degree Month"] = this.get_degree_month(metadata);
            sub_info["Degree Year"] = this.get_degree_year(metadata);
            sub_info  = this.build_committee_info(sub_info, metadata);
            
        

           
            for (const [key, value] of Object.entries(sub_info)) {
              if (Array.isArray(value)) {
                const cleaned = value.map(v => v === "(null)" ? "" : v);
                sub_info[key] = cleaned.length === 0 ? "" : cleaned.join("||");
              } else if (value === "(null)") {
                sub_info[key] = "";
              }
            }
            
            this.rows.push(sub_info);


        }
    }
    get_degree_level(metadata)
    {
        if (metadata["organization_id"]){
            return this.organization_map[metadata["organization_id"]];
        } else {
        return "";
        }
    }
    get_embargo_options(metadata)
    {
       if (metadata["default_embargos"]){
        return this.embargo_map[metadata["default_embargos"]];
        
        } else { 
            return this.embargo_map[metadata["Open Access"]];
       }
    }
    
    get_degree_month(metadata)
    {

        if (metadata["dc.date.issued"]){
            return metadata["dc.date.issued"][0].split(" ")[0];

        } else {
            return "";
        }  
    }    
    get_degree_year(metadata)
    {

        if (metadata["dc.date.issued"]){
            return metadata["dc.date.issued"][0].split(" ")[1];

        } else {
            return "";
        }
    } 
    build_committee_info(sub_info, metadata){
        let dor_arr=[];
        let chair_arr=[];
        let mem_arr=[];
        let advisor_arr=[];
        console.log(metadata["organization_id"]);

        if (metadata["organization_id"]===2){
            console.log(metadata["dc.contributor.advisor"]);
            dor_arr=this.ensure_array(metadata["dc.contributor.advisor"]);
            if (metadata["co-director_of_research"]){
                dor_arr.push(...metadata["co-director_of_research"]);
            }
            chair_arr=this.ensure_array(metadata["dc.contributor.committeeChair"]);
            mem_arr=this.ensure_array(metadata["dc.contributor.committeeMember"]);
            
            
        } else if (metadata["organization_id"]===3){    

            advisor_arr=this.ensure_array(metadata["dc.contributor.advisor"]);            
            mem_arr=this.ensure_array(metadata["dc.contributor.committeeMember"]);  
        }
        this.add_committee_info(sub_info, dor_arr, "DirectorResearch");
        this.add_committee_info(sub_info, chair_arr, "Chair");
        this.add_committee_info(sub_info, mem_arr, "CommitteeMbr"); 
        this.add_committee_info(sub_info, advisor_arr, "Advisor");
        return sub_info;
    }
   
    add_committee_info(sub_info, committee_arr, prefix){
        let limit = this.row_limits[prefix];
        console.log("################# got here #################");
        console.log(limit);
        if (Array.isArray(committee_arr)){
            while (committee_arr.length<limit){
                committee_arr.push(""); 
            }
            console.log(committee_arr);
            committee_arr.forEach((member, i) => {
                    sub_info[prefix+(i+1)]=member;
            });
        }
        
        return sub_info;
    } 
    ensure_array(v){
        return Array.isArray(v) ? v : (v == null ? [] : [v]);
    } 

}

module.exports=SubmissionList;