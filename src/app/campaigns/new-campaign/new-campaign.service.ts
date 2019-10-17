import { Injectable } from '@angular/core';

@Injectable()
export class NewCampaignService {

  allModules: any[] = [];
  newCampaign = {
    name: "",
    email: "",
    pages: [""],
    profile: "",
    domain: "",
    server: "",
    list: "",
    port: 443,
    ssl: true,
    payloadUrl: "",
    redirectUrl: "",
    startDate: null,
    batchNumber: null,
    batchInterval: null,
  };


  constructor( ){

  }
  

  initNewCampaign(){
    for (var key in this.newCampaign) {
        if (key == 'port') {
          this.newCampaign[key] = 443;
        } else if (key == 'pages') {
          this.newCampaign[key] = [""];
        } else if (key == 'ssl') {
          this.newCampaign[key] = true;
        } else {
          this.newCampaign[key] = "";
        }
    }
  }

}