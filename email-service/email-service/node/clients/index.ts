import { IOClients } from "@vtex/api";
import { Session } from "./session";
import VtexId from "./vtexid";
import Message from "./message";
import OrganizationGraphQL from "./organizationGraphQL";

export class Clients extends IOClients {
  public get customSession() {
    return this.getOrSet("customSession", Session);
  }

  public get vtexid() {
    return this.getOrSet("vtexid", VtexId);
  }

  public get message() {
    return this.getOrSet("message", Message);
  }

  public get organizationGraphQL() {
    return this.getOrSet('organizationGraphQL', OrganizationGraphQL)
  }
}
