import { Injectable } from '@angular/core';

@Injectable()
export class NewCampaignService {

  allModules: any[] = [];
  serverFiles: any[] = [];

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
    payloadFile: "",
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

  cloneCampaign(campaign) {
    this.newCampaign.name = campaign.name;

    // if module is NULL (deleted) set to blank
    if (campaign.email) { this.newCampaign.email = campaign.email.id; } else { this.newCampaign.email = "" }
    if (campaign.profile) { this.newCampaign.profile = campaign.profile.id; } else { this.newCampaign.profile = "" }
    if (campaign.domain) { this.newCampaign.domain = campaign.domain.id; } else { this.newCampaign.domain = "" }
    if (campaign.server) { this.newCampaign.server = campaign.server.id; } else { this.newCampaign.server = "" }
    //this.newCampaign.list = campaign.list.name;
    this.newCampaign.port = campaign.port;
    this.newCampaign.ssl = campaign.ssl;
    this.newCampaign.payloadUrl = campaign.payloadUrl;
    this.newCampaign.payloadFile = campaign.payloadFile;
    this.newCampaign.redirectUrl = campaign.redirectUrl;

    campaign.pages.forEach(element => {
      if (element) { this.newCampaign.pages[element.index] = element.page.id; } else { this.newCampaign.pages[element.index] = "" }
    });
    //console.log(this.newCampaign)
  }

}