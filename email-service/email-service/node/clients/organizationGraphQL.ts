import type { InstanceOptions, IOContext } from "@vtex/api";
import { ExternalClient } from "@vtex/api";

export default class OrganizationGraphQL extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`http://${context.workspace}--${context.account}.myvtex.com`, context, {
      ...options,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  public async getOrganizationByEmail(email: string, authToken: string) {
    const query = `
      query GET_ORGANIZATION_BY_EMAIL($email: String) {
        getOrganizationsByEmail(email: $email) @context(provider: "vtex.b2b-organizations-graphql@0.65.1") {
          id
          organizationName
        }
      }
    `;

    return this.http.post("/_v/private/graphql/v1", {
        query: query,
        variables: {
          email: email
        },
      }, {
      headers: {
        "Content-Type": "application/json",
        VtexIdclientAutCookie: authToken,
      },
    });
  }
}
