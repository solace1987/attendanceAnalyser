import PouchDB from 'pouchdb'


export default class DB{
   constructor(name){
       
    this.db= new PouchDB(name)
   }
   async getallGppDocs(doc){
      let allNotes= await this.db.get(doc)
        return allNotes;
   }

   async UpdateallGppDocs(doc){
  await this.db.get('gppstaff');
  await this.db.put(doc);
    } 

    
    async UpdateAttendance(doc){
           await this.db.put(doc);
        } 

      async getGppattend(){

        let record=await this.db.allDocs({
          include_docs: true,
          descending:true

        })

        return record;
      }
} 




 
 